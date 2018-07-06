var axios = require('axios');
var keypair = require('keypair');
require('jsencrypt');


/**
 * Api Class to handle/generate Discourse User-Api-Key
 */
module.exports = function () {
  var obj = this;
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
  // Static variable that will contains username => custom_field pairs to avoid multiples requests
  // and avoid "429 Too Many Requests" discourse's error
  this.usersFields = {};

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
    var portLength = location.port.length;
    var authRedirect = location.protocol + '//' + location.hostname + (portLength > 0 ? ':' + location.port : '' );

    var data = {
      application_name: 'docs-italia',
      public_key: obj.rsaKey.public,
      nonce: obj.randomBytes(16),
      client_id: obj.randomBytes(32),
      auth_redirect: authRedirect,
      scopes: 'write'
    };

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
    return axios({
      url: this.base_url + '/session/csrf.json',
    }, function (error, response, body ) {
      if (error === null) {
        obj.session.csrf = JSON.parse(body).csrf;
      } else {
        obj.session.csrf = false;
      }
    });
  };

  this.userIsLoggedIn = function () {
    return this.getApiKey() != false;
  };

  this.createPost = function (tid, body) {
    return axios({
      method: 'POST',
      url: obj.base_url + '/posts',
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
    var endpoint = obj.base_url + '/session/current.json';

    // Set user object
    return axios({
      url: endpoint,
      headers: { 'User-Api-Key': obj.getApiKey(), }
    }).then(function (results) {
      obj.user = results.data.current_user;
      return results;
    });
  };

  this.getUserCustomFieldValue = function (username) {
    var endpoint = obj.base_url + '/u/' + username + '.json';

    return axios({
      url: endpoint,
    }).then(function (data) {
      return data.data.user.user_fields[1];
    });
  };

  // Get all topic's posts
  this.getTopicPosts = function(tid) {
    return axios({
      method: 'get',
      url: obj.base_url + '/t/' + tid + '/posts.json',
      responseType: 'json'
    });
  };

};
