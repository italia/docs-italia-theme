var Discourse = require('./discourse_api');

module.exports = discourseAuth = {
  init: function () {
    return new Promise(function (resolve) {
      var $commentBox = $('ul.block-comments__list.items');
      var topicId = $commentBox.first().data('topic');

      Discourse.restUrl = 'http://ec2-52-212-9-50.eu-west-1.compute.amazonaws.com';
      Discourse.init('docs');

      resolve(Discourse.posts.get(topicId));
    });
  }
};
