var Discourse = require('./discourse_api');
var config = require('./discourse_api/config.json');

module.exports = discourseAuth = {
  init: function (topicId) {
    return new Promise(function (resolve) {
      Discourse.restUrl = config.rest_url;
      Discourse.init('docs');
      Discourse.posts.topicId = topicId;
      resolve(Discourse.posts.get(topicId));
    });
  }
};
