var Discourse = require('./discourse_api');
var $tpl = require('./getTpl');

// Remaps topic's posts object
function _remapPosts(posts) {
  var remappedObject = [];

  posts.forEach(function (e) {
    remappedObject[e.post_number] = e;
  });

  return remappedObject.reverse();
};

// Create the correct avatarUrl
function _createAvatarUrl (template, size) {
  return Discourse.restUrl + '/' + template.replace('{size}', size);
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
function _createMarkup (target, tid, post, nPId) {
  // Create a javascript Date object starts from post.updated_at date value
  var d = new Date(post.updated_at);
  post.cooked = _parseUserRefs(post.cooked);

  var rendered = $tpl({
    post: post,
    tid: tid,
    // Get user role and then return html for comment
    customField: typeof Discourse.user.fields[post.username] === "undefined" ? 'utente' : Discourse.user.fields[post.username],
    // Id attribute for comment div
    commentHTMLId: 'docs-comment-' + tid + '-' + post.id,
    // Replace the avatar's size from template url
    avatarUrl: _createAvatarUrl(post.avatar_template, 110),
    // And formats as dd/mm/YYYY hh:ii
    date: d.getDate()  + ' ' + (d.toLocaleString("it-IT", { month: "short" })) + ' ' + d.getFullYear() + ", " + d.getHours() + ":" + d.getMinutes(),
    // Check if current rendering comment is a new one
    isNew: typeof nPId !== 'undefined' ? (post.id == nPId ? 'is-new' : '') : '',
  }, 'discourse__comment');

  target.append(rendered)
}

module.exports = discourseComments = (function ($) {
  return {
    init: function (newPostId, postObject) {
      // Obtains all comments boxes
      var $commentBox = $('ul.block-comments__list.items');

      // Before flush set fixed height, to avoid blink
      $commentBox.css('min-height', $commentBox.height() + 'px');
      // Flush commentBox
      $commentBox.html('');

      // Set required characters
      $('form[id^="new-comment-"] .required-chars').text('20');

      // Set comment-write-box user picture
      if (Discourse.user.logged()) {
        if (Object.keys(Discourse.user.object).length !== 0) {
          $('.box-comment__figure').attr('src', _createAvatarUrl(Discourse.user.object.avatar_template, 110));
        } else {
          Discourse.user.current().then(function (currentUser) {
            $('.box-comment__figure').attr('src', _createAvatarUrl(currentUser.avatar_template, 110));
          });
        }
      }

      // Foreach get comments from discourse
      $commentBox.each(function (idx, cB) {
        var topicId = $(cB).data('topic');
        var topicPosts = _remapPosts(Discourse.posts[topicId].postStream);

        // Get all posts for given topic id
        topicPosts.forEach(function (e) {
          if (!e.hidden) {
            _createMarkup($(cB), topicId, e, newPostId);
            if (e.reply_to_post_number !== null) {
              // Get the reply's target
              var replyDest = topicPosts[e.reply_to_post_number];
              // Create link to reply's target
              var rendered = $tpl({
                post: e,
                replyDest: replyDest
              }, 'discourse__reply-link');
              // Append markup
              $('#reply-link-' + e.id).append(rendered);
            }
          }
          // Append markup with comment to the comments box
        })
      });

      // Reset min-height to auto
      $commentBox.css('min-height', 'auto');

      // If user isn't logged don't show new-comment form
      if (!Discourse.user.logged()) {
        var sUrlCookieName = Discourse.name + '_source_url';
        var authRedirect = location.protocol + '//' + location.hostname + (location.port !== "" ? ':' + location.port : '');
        var sourceUrl = authRedirect + location.pathname;

        // Create a cookie for stores sourceUrl
        Discourse.utility._cookie_create(sUrlCookieName, sourceUrl, 10, true);

        // Create popup window
        window.ppWin = function () {
          var userAgent = typeof navigator.userAgent !== 'undefined' ? navigator.userAgent : '',
              mobile = function() {
                return /\b(iPhone|iP[ao]d)/.test(userAgent) ||
                  /\b(iP[ao]d)/.test(userAgent) ||
                  /Android/i.test(userAgent) ||
                  /Mobile/i.test(userAgent);
              },
              screenX = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft,
              screenY = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop,
              outerWidth = typeof window.outerWidth != 'undefined' ? window.outerWidth : document.documentElement.clientWidth,
              outerHeight = typeof window.outerHeight != 'undefined' ? window.outerHeight : document.documentElement.clientHeight - 22,
              targetWidth = mobile() ? null : 600,
              targetHeight = mobile() ? null : 500,
              V = screenX < 0 ? window.screen.width + screenX : screenX,
              left = parseInt(V + (outerWidth - targetWidth) / 2, 10),
              right = parseInt(screenY + (outerHeight - targetHeight) / 2.5, 10),
              features = [];
          if (targetWidth !== null) {
            features.push('width=' + targetWidth);
          }
          if (targetHeight !== null) {
            features.push('height=' + targetHeight);
          }
          features.push('left=' + left);
          features.push('top=' + right);
          features.push('menubar=no');
          features.push('location=no');
          
          var win = window.open(Discourse.authLink(), 'Discourse Authentication', features);
          return win;
        };

        var loginMarkup = $tpl({}, 'discourse__login');
        $('div.box-comment').html(loginMarkup);
      }

      // Handle login-button click
      $('.login-button').bind('click', function () {
        ppWin();
      });

      // Manage new comment posting
      $('button.box-comment__submit').bind('click', function (evt) {
        var that = this;
        evt.preventDefault();
        var $parent = $(that).parents('.box-comment');
        var $body = $parent.find('.box-comment__body');
        var $submit = $parent.find('.box-comment__submit');
        var $errorsBox = $parent.find('.box-comment__errors-box');
        var topic_id = $parent.data('topic');
        var body_value = $body.val();

        if (typeof body_value === 'undefined') {
          return false;
        } else {
          $parent.addClass('sending');
          // Disable textarea & submit button
          $body.attr('disabled', true);
          $submit.attr('disabled', true);
          Discourse.posts.post(body_value, topic_id)
            // Success
            .then(function (results) {
              $parent.removeClass('sending');
              $body.val('');
              $body.attr('disabled', false);
              Discourse.posts.get([ topic_id ], false).then(function (data) {
                // Re-init current modules, to update comments list
                module.exports.init(results.data.id, results);
              });
              // Ubinds binded click events to avoid duplicates
              $('button.box-comment__submit').unbind('click');
            })
            // Error
            .catch(function (error) {
              var errorsString = error.response.data.errors.join('<br>');
              $parent.removeClass('sending');
              $body.attr('disabled', false);
              $errorsBox.text(errorsString);
            });
        }
      });

      // Handles min. characters nedeed to post
      $('textarea.box-comment__body').bind('input', function () {
        $parent = $(this).parents('div.box-comment');
        $req = $parent.find('.required-chars');
        var $span = $($parent.find('span')[1]);

        var currentLength = 20 - $(this).val().replace(/ /g,'').length;
        $span.data('required-chars', currentLength);
        if (currentLength > 0) {
          $span.show();
          $req.text(currentLength);
          $parent.find('button[type="submit"]').attr('disabled', true);
        } else {
          $req.text('0');
          $span.hide();
          $parent.find('button[type="submit"]').attr('disabled', false);
        }
      });

      // Show form elements on focus and hide on blur
      $('textarea.box-comment__body').bind('focus', function () {
        $parent = $(this).parents('form');
      });

      // Suggestions button click
      $('.new-comment__suggestions').popover({
        template: $tpl({}, 'discourse__markup__tooltip'),
        container: 'body',
        offset:'175px , 40px',
        trigger: 'focus',
      });

      // Logout icon click
      $('#logout-modal__submit').bind('click', function (evt) {
        evt.preventDefault();
        Discourse.user.logout();
      });

      // Handle keyCreated event to enable login button.
      $(window).bind('keyCreated', function () {
        $('.btn.login-button').removeClass('disabled');
      });
    }
  }
})(jQuery);
