var axios = require('axios');
var keypair = require('keypair');
var cache = require('./cache');
require('jsencrypt');


/**
 * Api Class to handle/generate Discourse User-Api-Key
 */
var Api = function () {
  var obj = this;
  var cacheManager = cache.getInstance();
  var axiosCached = cacheManager.axiosInterface;

  // Private key cookie's name
  this.pk_cookie_name = 'docs-italia_pk';
  // User API Key cookie's name
  this.uak_cookie_name = 'docs-italia_uak';
  // Expires days (for now: 10 days)
  this.expires_cookie = 10;

  this.base_url = 'http://ec2-52-212-9-50.eu-west-1.compute.amazonaws.com';
  this.user = null;
  this.session = {
    csrf: null,
  };
  this.rsaKey = null;
  this.searchParams = null;
  this.jsenc = new JSEncrypt();
  this.payload = null;
  this.popup = null;
  // It will contains all fetched data
  this.request = {
    posts: [],
    usersFields: []
  };

  // Create cookie
  this._cookie_create = function (key, value, days, overwrite) {
    if ((this._cookie_read(key) == null || this._cookie_read(key) === 'false') || overwrite) {
      var expires = new Date();
      // Set expires in {days} days
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      // Write the cookie
      document.cookie = key + '=' + value + ';' + 'expires=' + expires.toUTCString() + ';';
    }
  };
  // Read cookie
  this._cookie_read = function (key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
  };
  // Delete cookie
  this._cookie_delete = function (key)  {
    if (this._cookie_read(key) !== null)
      document.cookie = key + '=;' + 'Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };
  // Serialize parameters
  this._serializeParams = function (obj) {
    return Object.keys(obj)
                 .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent([obj[k]]) })
                 .join('&');
  };
  // Generate N random bytes
  this.randomBytes = function (length) {
	  return Array(length+1).join('x').replace(/x/g, function(c) {
	    return Math.floor(Math.random()*16).toString(16);
  	});
  };
  // Create private/public RSA keys
  this.genRSAKey = function () {
    this.rsaKey = keypair();
    // Set public and private keys
    this.jsenc.setPublicKey(this.rsaKey.public);
    this.jsenc.setPrivateKey(this.rsaKey.private);
    // Seve private kay to a cookie
    this._cookie_create(this.pk_cookie_name, encodeURI(this.rsaKey.private), 1, true);
  };
  // Get search parameters
  this.searchParameters = function (search) {
    if (this.searchParams === null)
      this.searchParams = new URLSearchParams(window.location.search);
    if (this.searchParams.has(search))
      return this.searchParams.get(search);
    else
      return false;
  };
  // Decrypts payload
  this.decryptPayload = function (payload) {
    this.jsenc.setPrivateKey(decodeURI(this._cookie_read(this.pk_cookie_name)));
    this.payload = this.jsenc.decrypt(payload);
    // Check if decryption is correct
    if (this.payload !== null) {
      // then delete previously created private key cookie
      this._cookie_delete(this.pk_cookie_name);
      // Create cookie for the user key.
      this._cookie_create(this.uak_cookie_name, this.payload, this.expires_cookie);
    }
  };

  this.userAuthKeyUrl = function () {
    // Generate public/private RSA keys
    this.genRSAKey();
    var authRedirect = location.protocol + '//' + location.hostname + (location.port !== "" ? ':' + location.port : '');

    var data = {
      application_name: 'docs-italia',
      public_key: obj.rsaKey.public,
      nonce: obj.randomBytes(16),
      client_id: obj.randomBytes(32),
      auth_redirect: authRedirect,
      scopes: 'write'
    };
    console.log(data);

    return this.base_url + '/user-api-key/new?' + this._serializeParams(data);
  };

  this.getApiKey = function () {
    var key = this._cookie_read(this.uak_cookie_name);
    if (key !== null && key !== 'false') {
      return JSON.parse(key).key;
    }
    return false;
  };

  this.getCSRF = function () {
    if (typeof obj.request.csrf !== "undefined") {
      return new Promise(function (resolve, reject) {
        resolve(obj.request.csrf);
      });
    } else {
      return axios({
        url: this.base_url + '/session/csrf.json',
      }, function (error, response, body ) {
        if (error === null) {
          obj.request.csrf = JSON.parse(body).csrf;
        } else {
          obj.request.csrf = false;
        }
      });
    }
  };

  this.userIsLoggedIn = function () {
    return obj.getApiKey() != false;
  };

  this.createPost = function (tid, body) {
    return axios({
      method: 'POST',
      url: obj.base_url + '/posts.json',
      data: {
        title: "Post created from docs-italia",
        topic_id: tid,
        raw: body,
      },
      headers: {
        'User-Api-Key': obj.getApiKey(),
      }
    });
  };

  this.getCurrentUser = function () {
    if (!obj.userIsLoggedIn()) {
      return new Promise(function (resolve) {
        resolve(false);
      })
    }
    var endpoint = obj.base_url + '/session/current.json';

    // Set user object
    return axiosCached({
      url: endpoint,
      headers: { 'User-Api-Key': obj.getApiKey(), }
    }).then(function (results) {
      if (results !== null) {
        obj.request.currentUser = results.data.current_user;
      }
      return results;
    });
  };

  this.getUserCustomFieldValue = function (username) {
    if (!obj.userIsLoggedIn()) {
      return new Promise(function (resolve) {
        resolve(false);
      })
    }
    var endpoint = obj.base_url + '/u/' + username + '.json';

    return axiosCached({ url: endpoint }).then(function (data) {
      if (data !== null) {
        obj.request.usersFields[username] = data.data.user.user_fields[1];
        return data.data.user.user_fields[1];
      } else {
        return data;
      }
    });
  };

  // Get all topic's posts
  this.getTopicPosts = function(tid, cached = true) {
    if (cached) {
      return axiosCached({
        method: 'get',
        url: obj.base_url + '/t/' + tid + '/posts.json',
        responseType: 'json'
      });
    } else {
      return axios({
        method: 'get',
        url: obj.base_url + '/t/' + tid + '/posts.json',
        responseType: 'json'
      });
    }
  };

  this.fetchData = function (tid, notLogged = false) {
    /**
     * Current User's data
     */
    return this.getCurrentUser().then(function (dataUser) {
      if (dataUser !== false) {
        var user = obj.request.currentUser = dataUser.data.current_user;
      } else {
        var user = { username: null };
      }
      /**
       * Get current user's custom field
       */
      return obj.getUserCustomFieldValue(user.username)
        .then(function (dataField) {
          /**
           * Get Topic's Posts
           */
          return obj.getTopicPosts(tid).then(function (dataPosts) {
            var userFieldRequests = [];
            var userField = [];
            var posts = dataPosts.data.post_stream.posts;

            posts.forEach(function (post) {
              if (typeof userField[post.username] === "undefined") {
                userField[post.username] = true;
                userFieldRequests.push(axiosCached({ url: obj.base_url + '/u/' + post.username + '.json' }));
              }
            });
            return axios.all(userFieldRequests).then(function(data) {
              data.forEach(function (d) {
                obj.request.usersFields[d.data.user.username] = d.data.user.user_fields[1];
              });
              posts.forEach(function (post) {
                // Save post in request object
                obj.request.posts.push(post);
              })
            });
          });
        })
      })
  };
};

/**
 * Implements singleton design pattern
 * @type {{getInstance}}
 */
module.exports = (function () {
  var instance;

  function createInstance() {
    return new Api();
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  }
})();
