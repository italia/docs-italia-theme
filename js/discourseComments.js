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

// Create the comment markup with given topic id and post
function _createMedia (tid, post, nPId) {
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
  // Return markup
  return "" +
  "<div class='media topic-comment comment-" + post.id + (isNew ? ' is-new' : '') + "' id='"+commentHTMLId+"' data-topic='"+tid+"' data-comment="+post.id+">" +
    "<div id='reply-to-"+post.post_number+"'></div>" +
    "<img class='mr-3' src='"+avatarUrl+"'/>" +
    "<div class='media-body media-body-comment-"+post.id+"'>" +
      "<div id='reply-link-"+post.id+"'></div>" +
      "<h5 class='mt-0 topic-comment--title'> "+post.username+" </h5>" + "<small>(#"+ post.post_number +")</small>" +
      "<div class='topic-comment--date'>"+ date +" </div>" +
      "<div class='topic-comment--body'> "+post.cooked+" </div>" +
    "</div>" +
  "</div>";
}

module.exports = discourseComments = (function ($) {
  return {
    init: function (newPostId) {
      // Obtains all comments boxes
      var $commentBox = $('div[id^="docs-comments-box-"]');

      // Check if user is logged in
      if (!Discourse.userIsLoggedIn())
      // Before flush set fixed height, to avoid blink
      $commentBox.css('min-height', $commentBox.height() + 'px');
      // Flush commentBox
      $commentBox.html('');
      // Set required characters
      $('form[id^="new-comment-"] .required-chars').text('-20');

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
            // Append markup with comment to the comments box
            $commentBox.append($(_createMedia(topicId, e, newPostId)));
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
                module.exports.init(results.id);
              }, 1500)
              // Error
              .catch(function (error) {
                console.log(error.response.data.errors);
                var errorsString = error.response.data.errors.join('<br>');
                $form.removeClass('sending');
                $errorsBox.append(errorsString);
                console.log(reason, 'error');
              });
          })
        }

      });
      // Handles min. characters nedeed to post
      $('textarea.new-comment__body').bind('input', function (evt) {
        $req = $(this).parent().find('.required-chars');
        var currentLength = -20 + $(this).val().replace(/ /g,'').length;
        if (currentLength < 0) {
          $req.text(currentLength);
          $(this).parent().find('input[type="submit"]').attr('disabled', true);
        } else {
          $req.text('0');
          $(this).parent().find('input[type="submit"]').attr('disabled', false);
        }
      });
    }
  }
})(jQuery);
