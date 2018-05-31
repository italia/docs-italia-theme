var Api = require('./discourseApi.js');
var Discourse = new Api();

function _createMedia (tid, post) {
  var commentHTMLId = 'docs-comment-' + tid + '-' + post.id;
  var avatarUrl = Discourse.base_url + '/' + post.avatar_template.replace('{size}', 45);
  var date = new Date(post.updated_at);
  date = date.getDate()  + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
  return "" +
  "<div class='media topic-comment comment-"+post.id+"' id='"+commentHTMLId+"' data-topic='"+tid+"' data-comment="+post.id+">" +
    "<img class='mr-3' src='"+avatarUrl+"'/>" +
    "<div class='media-body media-body-comment-"+post.id+"'>" +
      "<h5 class='mt-0 topic-comment--title'> "+post.username+" </h5>" +
      "<div class='topic-comment--date'>"+ date +"</div>" +
      "<div class='topic-comment--body'> "+post.cooked+" </div>" +
      "<div id='replies-to-"+post.post_number+"'></div>" +
    "</div>" +
  "</div>";
}

module.exports = discourseComments = (function ($) {
  return {
    init: function () {
      // Obtains all comments boxes
      var $commentBox = $('div[id^="docs-comments-box-"]');
      // Foreach get comments from discourse
      $commentBox.each(function (idx, cB) {
        var topicId = $(cB).data('topic');
        var topicPosts = {};

        Discourse.getTopicPosts(topicId).then(function (results) {
          topicPosts = results.post_stream.posts;
          topicPosts.forEach(function (e) {
            console.log(e);
            if (e.reply_to_post_number !== null) {
              $('#replies-to-' + e.reply_to_post_number).append($(_createMedia(topicId, e)));
            } else {
              $commentBox.append($(_createMedia(topicId, e)));
            }
          })
        });
      })
    }
  }
})(jQuery);
