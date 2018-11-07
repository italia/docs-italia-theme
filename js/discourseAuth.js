var Discourse = require('./discourse_api');

module.exports = discourseAuth = {
  init: function (topicId) {
    return new Promise(function (resolve) {
      Discourse.restUrl = 'http://ec2-52-212-9-50.eu-west-1.compute.amazonaws.com';
      Discourse.init('docs');
      resolve(Discourse.posts.get(topicId));
    });
  }
};
