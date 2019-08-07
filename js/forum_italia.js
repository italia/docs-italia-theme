// Forum Italia integration
var appName = 'Docs Italia';
var apiBaseUrl = 'https://forum.italia.it';
var Discourse = require('discourse-client').default;
var tpl = require('./getTpl');
var t = {
  liked: 'Hai messo mi piace.',
  user: 'utente'
};

module.exports = forumItalia = (function ($) {
  var that;

  return {
    $: {
      $forumItaliaComments: $('.forum-italia-comments'),
      topicCommentsSelector: '.block-comments__list',
      commentBoxesSelector: '.box-comment.can-post',
      commentBoxesTopicClosedSelector: '.box-comment:not(.can-post)',
      forumLoginMarkup: tpl({}, 'forum__login'),
      forumCommentMarkup: tpl({}, 'forum__comment'),
      suggestionsMarkup: tpl({}, 'forum-italia__markup__tooltip'),
      logoutModal: tpl({}, 'forum__logout--modal'),
      userAvatarClass: '.box-comment__figure',
      publicUserFieldIndex: '2',
      client: null
    },

    init: function() {
      that = this.$;

      if (!that.$forumItaliaComments.length) {
        return;
      }

      that.client = new Discourse({
        appName: appName,
        apiBaseUrl: apiBaseUrl,
        scopes: ['write']
      });

      that.client.init().then(function() {
        var forumItaliaComments = that.$forumItaliaComments.toArray().map(function(forumItaliaComment) {
          var $forumItaliaComment = $(forumItaliaComment);
          var topicId = $forumItaliaComment.data('topic');
          var scope = $forumItaliaComment.data('scope');

          return that.client.getTopic(topicId, true).then(function(topic) {
            var posts = topic.post_stream.posts;

            $forumItaliaComment.attr('id', 'forum-italia-comments-' + topicId);
            $forumItaliaComment.html(tpl({
              topicId: topicId,
              commentsCount: topic.posts_count,
              canPost: (!topic.archived && !topic.closed) ? 'can-post' : ''
            }, 'forum-italia-comments'))

            forumItalia.commentsMarkup($forumItaliaComment.find(that.topicCommentsSelector), posts);
            
            return {
              $element: $forumItaliaComment,
              topic: topic,
              scope: scope,
            }
          });
        });

        Promise.all(forumItaliaComments).then(function(forumItaliaCommentsTopics) {
          forumItaliaCommentsTopics.map(function(forumItaliaCommentsTopic) {
            if ('section' === forumItaliaCommentsTopic.scope) {
              forumItalia.headingMarkup(forumItaliaCommentsTopic.$element.closest('.section'), forumItaliaCommentsTopic.topic.id, forumItaliaCommentsTopic.topic.posts_count);
            }
          });
          that.client.isLoggedIn().then(function(isLoggedIn) {
            if (isLoggedIn) {
              forumItalia.setLoggedInMarkup();
            } else {
              forumItalia.setLoggedOutMarkup();
            }
            forumItalia.setClosedTopicsMarkup();
          });
        }).catch(function(error) {
          forumItalia.reportError('topic not found or not public');
        });
      });
    },

    headingMarkup: function($section, topicId, postsCount) {
      $section.find('.chapter-nav__list--visible').prepend(tpl({
        postsCount: postsCount,
        topicId: topicId
      }, 'section_navigation__comments'));
    },

    login: function() {
      that.client.login().then(function() {
        forumItalia.setLoggedInMarkup();
      }).catch(function(error) {
        forumItalia.reportError(error);
      });
    },

    logout: function() {
      that.client.logout().then(function() {
        forumItalia.setLoggedOutMarkup();
      });
    },

    setLoggedInMarkup: function() {
      // Comment box
      $(that.commentBoxesSelector)
        .html(that.forumCommentMarkup)
        .find(that.userAvatarClass)
        .attr('src', that.client.getCurrentUserAvatarUrl())
        .attr('alt', that.client.getCurrentUserDisplayName());

      // Suggestions button click
      $('.new-comment__suggestions').popover({
        template: that.suggestionsMarkup,
        html: true,
        placement: 'bottom',
        container: 'body',
        offset: '175px, 40px',
        trigger: 'focus'
      });

      // Logout modal
      $('body').append(that.logoutModal);
      $('#logout-modal__submit').click(forumItalia.logout);

      if (that.client.isCurrentUserSilenced()) {
        return forumItalia.setSilencedMarkup();
      }

      // Minimum characters
      $('textarea.box-comment__body').on('input', function() {
        var $boxComment = $(this).parents('div.box-comment');
        var $requiredChars = $boxComment.find('.required-chars');
        var $requiredMessage = $boxComment.find('.box-comment__required');
        var $sendButton = $boxComment.find('.box-comment__submit');

        // Discourse comments length must be at least 20 chars
        var neededChars = 20 - $(this).val().replace(/ /g,'').length;
        if (neededChars > 0) {
          $requiredMessage.show();
          $requiredChars.text(neededChars);
          $sendButton.prop('disabled', true);
        } else {
          $requiredMessage.hide();
          $sendButton.prop('disabled', false);
        }
      });

      // Send message button
      $('button.box-comment__submit').on('click', function() {
        var $boxComment = $(this).parents('.box-comment');
        var $messageTextArea = $boxComment.find('.box-comment__body')
        var $sendButton = $boxComment.find('.box-comment__submit');
        var messageBody = $messageTextArea.val().trim();
        var $errors = $boxComment.find('.box-comment__errors-box');
        var topicId = $boxComment.data('topic');
        var $commentList = $boxComment.parents('.block-comments__body').find('.block-comments__list');

        if (messageBody === '') {
          return false;
        } else {
          $boxComment.addClass('sending');
          // Disable textarea & submit button
          $messageTextArea.prop('disabled', true);
          $sendButton.prop('disabled', true);
          that.client.postMessage(topicId, messageBody)
            .then(function(response) {
              $messageTextArea.val('');
              $errors.removeClass('text-danger').html('');
              forumItalia.refreshCommentsMarkup(topicId, $commentList, response.id);
            })
            .catch(function(error) {
              $errors.addClass('text-danger').html(error.join('<br>'));
            }).finally(function() {
              $boxComment.removeClass('sending');
              // Enable textarea & submit button
              $messageTextArea.prop('disabled', false);
              $sendButton.prop('disabled', false);
            });
        }
      });

      forumItalia.refrestAllCommentsMarkup();
    },

    setLoggedOutMarkup: function() {
      $(that.commentBoxesSelector).each(function() {
        $(this).html(that.forumLoginMarkup).find('.login-button').click(forumItalia.login);
      });

      forumItalia.refrestAllCommentsMarkup();
    },
    
    setSilencedMarkup: function() {
      $('textarea.box-comment__body').prop('disabled', true);
      $('button.box-comment__submit').prop('disabled', true);
      $('.box-comment__errors-box').html(tpl({
        notificationsUrl: that.client.getCurrentUserNotificationsUrl(),
        }, 'forum-italia__silenced')
      );
    },
    
    setClosedTopicsMarkup: function() {
      $(that.commentBoxesTopicClosedSelector).html(tpl({}, 'forum-italia__closedTopic'));
    },

    // Create the comment markup with given $topicCommentsElement and post
    commentsMarkup: function($topicCommentsElement, posts, newPostId) {
      var topicCommentsPromises = posts.map(function(post) {
        var replyDest = posts[post.reply_to_post_number];
        var isNew = (post.id === newPostId);
        return forumItalia.commentMarkup(post, replyDest, isNew);
      });
      
      Promise.all(topicCommentsPromises).then(function(topicComments) {
        $topicCommentsElement.html('');
        topicComments.sort(function(a, b) { return b.commentId - a.commentId; });
        topicComments.map(function(topicComment) {
          $topicCommentsElement.append(topicComment.renderedCommment);
          forumItalia.likeButton(topicComment);
          forumItalia.undoLikeButton(topicComment);
        });
      });
    },

    likeButton: function(topicComment) {
      $('button#do-like-' + topicComment.commentId).click(function() {
        that.client.likePost(topicComment.commentId).then(function(post) {
          forumItalia.commentMarkup(post, topicComment.replyDest).then(function(likedComment) {
            $('#comment-' + likedComment.commentId).replaceWith(likedComment.renderedCommment);
            forumItalia.undoLikeButton(topicComment);
          })
        });
      });
    },

    undoLikeButton: function(topicComment) {
      $('button#undo-like-' + topicComment.commentId).click(function() {
        that.client.undoLikePost(topicComment.commentId).then(function(post) {
          forumItalia.commentMarkup(post, topicComment.replyDest).then(function(undoLikedComment) {
            $('#comment-' + undoLikedComment.commentId).replaceWith(undoLikedComment.renderedCommment);
            forumItalia.likeButton(topicComment);
          })
        });
      });
    },

    commentMarkup: function(post, replyDest, isNew) {
      return that.client.getPublicUserField(post.username, that.publicUserFieldIndex).then(function(publicUserField) {
        var replyLink = post.reply_to_post_number
          ? tpl({
            replyDest: replyDest
          }, 'forum-italia__reply-link')
          : null;
        var likeAction = post.actions_summary.find(function(action) { return action.id == 2 });
        var showLike = likeAction
          ? likeAction['can_act'] || likeAction['can_undo']
          : that.client.getCurrentUserId() && (post.user_id != that.client.getCurrentUserId());
        var likeTemplate = showLike ? 'forum-italia__like-button' : 'forum-italia__like-info'
        var postActions = likeAction && tpl({
          post: post,
          buttonAction: likeAction['can_undo'] ? 'undo' : 'do',
          likeCount: likeAction['count'],
          likeDone: likeAction['acted'] && t.liked
        }, likeTemplate);
        return {
          renderedCommment: tpl({
            displayName: post.name || post.username,
            post: post,
            isNew: isNew ? 'is-new' : '',
            hidden: post.hidden && 'hidden',
            avatarUrl: that.client.getApiBaseUrl() + post.avatar_template.replace('{size}', 110),
            date: new Date(post.created_at).toLocaleString('it-IT', { day:'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric'}),
            publicUserField: publicUserField || t.user,
            replyLink: replyLink,
            postActions: postActions,
          }, 'forum-italia__comment'),
          commentId: post.id,
          replyDest: replyDest
        }
      });
    },
    
    refreshCommentsMarkup: function(topicId, $commentList, newPostId) {
      that.client.getPostsInTopic(topicId, true, true).then(function(posts) {
        forumItalia.commentsMarkup($commentList, posts, newPostId);
      });
    },

    refrestAllCommentsMarkup: function() {
      var forumItaliaComments = that.$forumItaliaComments.toArray().map(function(forumItaliaComment) {
        var $forumItaliaComment = $(forumItaliaComment);
        var topicId = $forumItaliaComment.data('topic');

        return that.client.getTopic(topicId, true, true).then(function(topic) {
          var posts = topic.post_stream.posts;

          forumItalia.commentsMarkup($forumItaliaComment.find(that.topicCommentsSelector), posts);
        }).catch(function(error) {
          forumItalia.reportError('topic not found or not public');
        });
      });
    },

    reportError: function(errorMessage) {
      console.error('Forum Italia integration error: ' + errorMessage);
    }
  }
})(jQuery);
