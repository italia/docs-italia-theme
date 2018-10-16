var Utility = require('./src/modules/Utility');
var DConfig = require('./src/modules/DConfig');
var DCallsManager = require('./src/modules/DCallsManager');

function DiscourseApi() {
  var that = this;

  // Set config values
  this.name = null;
  this.headers = {};
  this.restUrl = null;

  // Discourse's Calls Manager
  this.cm = new DCallsManager(this);
  this.utility = new Utility('docs-italia_pk', 'docs-italia_puk', 'docs-italia_uak', 10);

  /**
   * Api object
   */
  this.init = function (appName) {
    that.name = appName;
    var payload = that.utility.searchParameters('payload');
    var pay_cookie = that.key.get();

    if (!pay_cookie && payload) {
      that.utility.decryptPayload(payload);
      var sourceUrl = that.utility._cookie_read(that.name + '_source_url');
      if (typeof sourceUrl !== 'undefined') {
        // Get current user
        that.user.current();
        that.user.state('logged', true);
        if (/Mobi|Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)) {
          window.document.location.href = sourceUrl;
        } else {
          window.opener.document.location.href = sourceUrl;
          window.close();
        }
      } else {
        // Remove ?payload get parameter from url
        window.history.replaceState({}, document.title, location.protocol + '//' + location.host + location.pathname);
      }
    } else if (!that.user.logged()) {
      // Create key
      that.key.create();
      // Set user state as not logged
      that.user.state('logged', false);
    } else {
      // Get current user
      that.user.current();
      // Get csrf token
      that.user.csrf();
    }
  };

  this.authLink = function () {
    var authRedirect = location.protocol + '//' + location.hostname + (location.port !== "" ? ':' + location.port : '');
    var data = {
      application_name: that.name,
      public_key: that.utility.rsaKey.public,
      nonce: that.utility.randomBytes(16),
      client_id: that.utility.randomBytes(32),
      auth_redirect: authRedirect,
      scopes: 'write'
    };
    return  that.restUrl + '/user-api-key/new?' + that.utility._serializeParams(data);
  };

  this.key = {
    get: function () {
      var key = that.utility._cookie_read(that.utility.uak_cookie_name);
      if (key !== null && key !== 'false') {
        var parsedKey = JSON.parse(key).key;
        that.setHeader('User-Api-Key', parsedKey);
        return parsedKey;
      } else {
        return false;
      }
    },
    create: function () {
      if (that.utility._cookie_read(that.utility.pk_cookie_name)) {
        // Fix: if already exists pk_cookie_name it's needed to load public/private kays into jsenc objecet
        // Set public and private keys
        var pub_key = decodeURI(that.utility._cookie_read(that.utility.puk_cookie_name));
        var prv_key = decodeURI(that.utility._cookie_read(that.utility.pk_cookie_name));
        // Here is the fix
        that.utility.rsaKey = { public : pub_key, private: prv_key };
        
        setTimeout(function () {
          that.utility.eventCreate('keyCreated', {});
        }, 1000);
        return;
      }

      return that.utility.genRSAKey().then(function () {
        setTimeout(function () {
          that.utility.eventCreate('keyCreated', {});
        }, 1000);
      });
    },
  };

  /**
   * User
   * @type {{object: {}, states: {}, get: (function(*): *), current:
   *     DiscourseApi.user.current, state: DiscourseApi.user.state, logged:
   *     (function(): (*|*|boolean)), logout: DiscourseApi.user.logout}}
   */
  this.user = {
    object: {},
    states: {},
    fields: {},
    // Get user by username
    get: function (username) {
      var callName = 'userGet_' + username;
      that.cm.call(callName, '/u/$', [username], null, null);
      that.cm.queue('user', callName);
    },

    // Get current user's session
    current: function () {
      return that.cm.call('userCurrent', '/session/current', null, null, that.getHeaderObject('User-Api-Key')).get().then(function (response) {
        that.user.object = response.data.current_user;
        return that.user.object;
      });
    },

    // Set/get user's state value
    state: function (stateName, stateValue) {
      if (typeof stateValue === "undefined") {
        return that.user.states[stateName]
      } else {
        if (typeof value === "object") {
          that.user.states[stateName] = stateValue;
        }
      }
    },

    // Return true if user is logged in
    logged: function () {
      return that.key.get();
    },

    // Log out current user
    logout: function () {
      var userId = that.user.object.id;

      var headers = that.getHeaders(['X-CSRF-Token', 'User-Api-Key']);
      that.cm.call('userLogout', '/admin/users/$/log_out!', [userId], null, headers).post().then(function (response) {
        that.user.state('logged', false);
        that.utility._cookie_delete('docs-italia_uak');
        window.location.href = location.href;
      });
    },

    // Get CSRF Token
    csrf: function () {
      return that.cm.call('csrf', '/session/csrf', null, null, null).get().then (function (response) {
        that.setHeader('X-CSRF-Token', response);
        return response;
      })
    },
  };

  this.posts = {
    postStream: null,
    topicId: 0,
    queue: [],

    get: function (topicId, cache) {
      if (typeof cache === "undefined") {
        cache = true;
      }

      return that.cm.call('topicPosts', '/t/$/posts', [topicId], null, null, cache).get().then(function (response) {
        that.posts.postStream = response.data.post_stream.posts;
        that.posts.topicId = topicId;
        // Fetch users' custom fields
        that.posts.postStream.forEach(function (post) {
          if (typeof that.user.fields[post.username] === "undefined") {
            that.user.fields[post.username] = null;
            that.user.get(post.username)
          }
        });

        // Execute created users' fields queue
        return that.cm.executeQueue('user').then(function (responseQueue) {
          responseQueue.forEach(function (field) {
            that.user.fields[field.data.user.username] = field.data.user.user_fields[1];
          })
        })
      })
    },
    post: function (raw) {
      var body = {
        raw: raw,
        topic_id: that.posts.topicId,
        title: 'Post created from docs-italia'
      };

      return that.cm.call('createPost', '/posts', null, body, that.getHeaderObject('User-Api-Key')).post().then(function (response) {
        return response;
      })
    }
  };
};

DiscourseApi.prototype = new DConfig;

module.exports = new DiscourseApi();

