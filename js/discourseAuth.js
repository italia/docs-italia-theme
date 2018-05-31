var Api = require('./discourseApi.js');

module.exports = discourseAuth = {
  init: function () {
    var Discourse = new Api();
    var payload = Discourse.searchParameters('payload');
    var pay_cookie = Discourse.getApiKey();

    if (pay_cookie) {
      console.log('Already exists payload cookie: ' + pay_cookie);
      // Discourse.createPost()
    } else {
      if (payload !== false) {
        Discourse.decryptPayload(payload);
        console.log(Discourse.payload);
      } else {
        // Then generate api key
        $('#redirect-login').html('<a href="' + Discourse.userAuthKeyUrl() + '">Login</a>');
        window.location.href=Discourse.userAuthKeyUrl();
      }
    }
  }
}
