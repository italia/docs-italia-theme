var Api = require('./discourseApi.js');

module.exports = discourseAuth = {
  init: function () {
    var Discourse = new Api();
    var payload = Discourse.searchParameters('payload');
    var pay_cookie = Discourse.getApiKey();
    if (pay_cookie) {
      // console.log('Already exists payload cookie: ' + pay_cookie);
    } else {
      if (payload !== false) {
        Discourse.decryptPayload(payload);
        // Get sourceUrl from cookie
        var surl_cookie_name = 'docs-italia_surl';
        var sourceUrl = Discourse._cookie_read(surl_cookie_name);
        Discourse._cookie_delete(surl_cookie_name);

        if (typeof sourceUrl !== 'undefined') {
          window.opener.document.location.href = sourceUrl;
          window.close();
        } else {
          // Remove ?payload get parameter from url
          window.history.replaceState({}, document.title, location.protocol + '//' + location.host + location.pathname);
        }
      }
    }
  }
}
