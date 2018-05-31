var Api = require('./discourseApi.js');

module.exports = discourseComments = (function ($) {
  return {
    init: function () {
      var Discourse = new Api();

      // Obtains all comments boxes
      var $commentBox = $('div[id^="docs-comments-box-"]');
      // Foreach get comments from discourse
      $commentBox.each(function (idx, cB) {
        var topicId = $(cB).data('topic');
        var topicPosts = {};

        Discourse.getTopicPosts(topicId).then(function (results) {
          topicPosts = results.post_stream.posts;
          topicPosts.forEach(function (e, i) {
            var commentHTMLId = 'docs-comment-' + topicId + '-' + e.id;
            var avatarUrl = Discourse.base_url + '/' + e.avatar_template.replace('{size}', 45);

            $commentBox.append($(
              "<div class='topic-comment comment-"+i+"' id='"+commentHTMLId+"' data-topic='"+topicId+"' data-comment="+e.id+">" +
                "<div class='topic-comment--avatar'>" +
                  "<img src='"+avatarUrl+"' />" +
                "</div>" +
                "<div class='topic-comment--title'> "+e.username+" </div>" +
                "<div class='topic-comment--body'> "+e.cooked+" </div>" +
                "<div class='topic-comment--actions'>" +
                  "<span class='Icon it-icon-link'></span><button type='button' class='chapter-link'>copia link</button>" +
                  "<span class='Icon it-icon-share'></span><button type='button' class='chapter-link'>condividi</button>" +
                  "<span class='Icon it-icon-comment'></span><button type='button' class='chapter-link'>rispondi</button>" +
                "</div>" +
              "</div>"
            ));
          })
        });
      })
    }
  }
})(jQuery);
