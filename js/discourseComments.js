var Api = require('./discourseApi.js');
var Discourse = new Api();

// Execute init
// _commentReinit()

// Remaps topic's posts object
function _remapPosts(posts) {
  var remappedObject = [];
  posts.forEach(function (e) {
    remappedObject[e.post_number] = e;
  });
  return remappedObject;
};

// Create the correct avatarUrl
function _createAvatarUrl (template, size) {
  return Discourse.base_url + '/' + template.replace('{size}', size);
}

// Presets Discourse'base url to matched value.
function _parseUserRefsReplacer (match) {
  return Discourse.base_url + match;
}

// Parse user refers into cooked comment's body
function _parseUserRefs (text) {
  return text.replace(/(\/u\/\w+)/gm, _parseUserRefsReplacer);
}

// Create the comment markup with given topic id and post
function _createMarkup (tid, post, nPId) {
  // Id attribute for comment div
  var commentHTMLId = 'docs-comment-' + tid + '-' + post.id;
  // Replace the avatar's size from template url
  var avatarUrl = _createAvatarUrl(post.avatar_template, 45)
  // Create a javascript Date object starts from post.updated_at date value
  var date = new Date(post.updated_at);
  // And formats as dd/mm/YYYY hh:ii
  date = date.getDate()  + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
  // Check if current rendering comment is a new one
  var isNew = false;
  if (typeof nPId !== "undefined") {
    isNew = post.id == nPId;
  }

  // Change user link to points correctly to discourse site user's profile
  post.cooked = _parseUserRefs(post.cooked);

  // Get user role and then return html for comment
  return Discourse.getUserCustomFieldValue(post.username).then(function(customField) {
    // Return markup
    return "" +
      "<li id='"+ commentHTMLId + "' class='row mb-5 block-comments__item comment-"+ post.id + (isNew ? ' is-new' : '') + "' data-topic='"+ tid +"' data-comment="+post.id+">" +
        "<div id='reply-to-"+post.post_number+"'></div>" +
        "<figure class='col-auto mb-0'><img class='block-comments__img rounded-circle' src='"+ avatarUrl +"'></figure>" +
        "<div class='col'>" +
          "<div class='row align-items-center justify-content-between' id='comment-heading-1'>" +
            "<div class='col-auto'>" +
              "<span class='block-comments__name text-capitalize mb-0'>" + post.username + "</span>" +
              "<div id='reply-link-"+post.id+"'></div>" +
            "</div>" +
            "<div class='col-auto'>" +
              "<p class='d-inline-block mr-2 block-comments__date mb-0'>" + date + "</p>" +
              "<button class='block-comments__item-btn collapsed' data-toggle='collapse' data-target='#collapse-"+ post.id +"'><span class='it-icon-collapse'></span><span class='it-icon-expand'></span></button>" +
            "</div>" +
          "</div>" +
          "<p class='text-uppercase block-comments__role'>" + (customField !== null ? customField : 'utente')+ "</p>" +
          "<div id='collapse-"+ post.id +"' class='block-comments__paragraph pl-3 border-left collapse show' aria-labelledby='comment-heading-1'>" + post.cooked + "</div>" +
        "</div>" +
      "</li>";
  });
}

module.exports = discourseComments = (function ($) {
  return {
    init: function (newPostId, postObject) {
      // Obtains all comments boxes
      var $commentBox = $('ul.block-comments__list.items');
      var topicId = $commentBox.data('topic');

      // Check if user is logged in
      if (!Discourse.userIsLoggedIn())
      // Before flush set fixed height, to avoid blink
      $commentBox.css('min-height', $commentBox.height() + 'px');
      // Flush commentBox
      $commentBox.html('');
      // Set required characters
      $('form[id^="new-comment-"] .required-chars').text('-20');

      // Set comment-write-box user picture
      if (Discourse.userIsLoggedIn()) {
        Discourse.getCurrentUser().then(function () {
          $('form[id^="new-comment-"] .new-comment__figure').attr('src', _createAvatarUrl(Discourse.user.avatar_template, 45));
        });
      }

      // Foreach get comments from discourse
      $commentBox.each(function (idx, cB) {
        var topicId = $(cB).data('topic');
        var topicPosts = {};

        // Get all posts for given topic id
        Discourse.getTopicPosts(topicId).then(function (results) {
          // Get data from axios' response.
          results = results.data;

          topicPosts = _remapPosts(results.post_stream.posts);
          // Loop through posts
          topicPosts.forEach(function (e, idx) {
            //if (typeof Discourse.usersFields[e.username] !== "undefined")
            // Append markup with comment to the comments box
            _createMarkup(topicId, e, newPostId).then(function (html) {
              $commentBox.append(html);
            });
            // Check if current comment is a reply to another
            if (e.reply_to_post_number !== null) {
              // Get the reply's target
              var replyDest = topicPosts[e.reply_to_post_number];
              // Create link to reply's target
              $('#reply-link-' + e.id).append($(
                "<div>" +
                  "<a class='reply-to-post' href='#reply-to-" + e.reply_to_post_number + "'>" +
                    "In risposta a " + replyDest.username + "<small>(#"+ e.reply_to_post_number +")</small>" +
                  "</a>" +
                "</div>"
              ));
            }
          })
        });
      });

      // Reset min-height to auto
      $commentBox.css('min-height', 'auto');

      // If user isn't logged don't show new-comment form
      if (!Discourse.userIsLoggedIn()) {
        var sUrlCookieName = 'docs-italia_surl';
        var authRedirect = location.protocol + '//' + location.hostname + (location.port !== "" ? ':' + location.port : '');
        var sourceUrl = authRedirect + location.pathname;

        // Create a cookie for stores sourceUrl
        Discourse._cookie_create(sUrlCookieName, sourceUrl, 10, true);

        // Create popup window
        window.ppWin = function () {
          var params = 'width=400,height=400';
          var win = window.open(Discourse.userAuthKeyUrl(), 'Discourse Authentication', params);
          $(win).on('load', function () {
            // Set target
            var t = win.document;
            var form = $(t).find('form');
            $(form).on('submit', function (evt) {
              // Avoid submit
              evt.preventDefault();
              // Get page csrf-token, used during ajax form submit
              var csrfToken = $(win.document.head).find('meta[name="csrf-token"]').attr('content');
              // Execute an ajax request directily from opened window
              var xhr = new win.XMLHttpRequest();
              xhr.open('POST', win.location.protocol + '//' + win.location.hostname + $(form).attr('action'));
              // Set request's header
              xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              xhr.setRequestHeader('X-CSRF-Token', csrfToken);

              xhr.onload = function () {
                if (xhr.status === 200) {
                  // Close popup
                  win.close();
                  console.log('win closed: ', win.closed);
                  // Execute redirect
                  var responseURL = xhr.responseURL;
                  window.location.href = responseURL;
                } else {
                  console.log(xhr.status);
                  console.log(xhr.statusText);
                }
              };
              xhr.send($(form).serialize());
            });
          });
          return win;
        };

        var message = 'Clicca sul bottone "login" per effettuare l\'accesso a forum-italia e commenta' +
                      // '<div> <a href="' + Discourse.userAuthKeyUrl() + '" class="btn btn-success">Login</a>';
                      '<div><a href="#" onclick="ppWin()" class="btn btn-success">Login</a></div>';
        $('form[id^="new-comment-"]').html('<div class="new-comment__login">' + message + '</div>');
      }

      // Manage new comment posting
      $('form[id^="new-comment-"]').bind('submit', function (evt) {
        evt.preventDefault();
        var $form = $(this);
        var $body = $form.find('.new-comment__body');
        var $errorsBox = $form.find('.new-comment__errors-box');
        var topic_id = $form.data('topic');
        var body_value = $body.val();

        if (typeof body_value === 'undefined') {
          return false;
        } else {
          $form.addClass('sending');
          setTimeout(function () {
            Discourse.createPost(topic_id, body_value)
              // Success
              .then(function (results) {
                $form.removeClass('sending');
                $body.val('');
                // Re-init current modules, to update comments list
                module.exports.init(results.data.id, results);
              }, 1500)
              // Error
              .catch(function (error) {
                var errorsString = error.response.data.errors.join('<br>');
                $form.removeClass('sending');
                $errorsBox.append(errorsString);
              });
          })
        }

      });
      // Handles min. characters nedeed to post
      $('textarea.new-comment__body').bind('input', function () {
        $parent = $(this).parents('form');
        $req = $parent.find('.required-chars');
        var currentLength = -20 + $(this).val().replace(/ /g,'').length;
        if (currentLength < 0) {
          $req.text(currentLength);
          $parent.find('input[type="submit"]').attr('disabled', true);
        } else {
          $req.text('0');
          $parent.find('input[type="submit"]').attr('disabled', false);
        }
      });
      // Show form elements on focus and hide on blur
      $('textarea.new-comment__body')
        .bind('focus', function () {
          $parent = $(this).parents('form');

          $parent.find('.new-comment__buttons').removeClass('d-none');
          $parent.find('.new-comment__legend').removeClass('d-none');
          $parent.find('.new-comment__required').removeClass('d-none');
        })
        .bind('blur', function () {
          if ($(this).val() === '') {
            $parent = $(this).parents('form');

            $parent.find('.new-comment__buttons').addClass('d-none');
            $parent.find('.new-comment__legend').addClass('d-none');
            $parent.find('.new-comment__required').addClass('d-none');
          }
        })
    }
  }
})(jQuery);
