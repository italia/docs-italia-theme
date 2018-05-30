var request = require('request')
var keypair = require('./keypair.js')
require('./jsencrypt.min.js')

/**
 * Api Class to handle/generate Discourse User-Api-Key
 */
function Api() {
  var obj = this
  // Private key cookie's name
  this.pk_cookie_name = 'docs-italia_pk';
  // User API Key cookie's name
  this.uak_cookie_name = 'docs-italia_uak';
  // Expires days (for now: 10 days)
  this.expires_cookie = 10;

  this.base_url = 'http://ec2-52-212-9-50.eu-west-1.compute.amazonaws.com';
  this.user = {
    id: -1,
    key: null,
    username: '',
  };
  this.session = {
    csrf: null,
  };
  this.rsaKey = null;
  this.searchParams = null;
  this.jsenc = new JSEncrypt();
  this.payload = null;
  this.popup = null;

  // Create cookie
  this._cookie_create = function (key, value, days, overwrite = false) {
    if (this._cookie_read(key) == null || overwrite) {
      var expires = new Date();
      // Set expires in {days} days
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      // Write the cookie
      document.cookie = `${key}=${value};expires=${expires.toUTCString()}`;
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
      document.cookie = `${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };
  // Serialize parameters
  this._serializeParams = function (obj) {
    return Object.keys(obj)
                 .map(k => `${encodeURIComponent(k)}=${encodeURIComponent([obj[k]])}`)
                 .join('&');
  };
  // Generate N random bytes
  this.randomBytes = function (length) {
	  return Array(length+1).join('x').replace(/x/g, c => {
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

    let data = {
      application_name: 'docs-italia',
      public_key: obj.rsaKey.public,
      nonce: obj.randomBytes(16),
      client_id: obj.randomBytes(32),
      auth_redirect: 'http://localhost:1919',
      scopes: 'write'
    };

    return `${this.base_url}/user-api-key/new?${this._serializeParams(data)}`;
  }

  this.getApiKey = function () {
    let key = this._cookie_read(this.uak_cookie_name);
    if (key !== null) {
      return JSON.parse(key).key;
    }
    return false;
  }

  this.getCSRF = function () {
    request({
      url: `${this.base_url}/session/csrf.json`,
    }, function (error, response, body ) {
      if (error === null) {
        obj.session.csrf = JSON.parse(body).csrf;
      } else {
        obj.session.csrf = false;
      }
    });
  };

  this.createPost = function () {
    request({
      method: 'POST',
      url: `${obj.base_url}/posts`,
      body: {
        title: "Test Title",
        topic_id: 2,
        raw: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
      json: true,
      headers: {
        'User-Api-Key': this.getApiKey(),
      }
    }, function (e, r, b) {
      if (e === null) {
        return b;
      } else {
        return e;
      }
    });
  }
}

var Discourse = new Api()

module.exports = discourseAuth = {
  init: function () {
    let payload = Discourse.searchParameters('payload');
    let pay_cookie = Discourse.getApiKey();

    if (pay_cookie) {
      console.log(`Already exists payload cookie: ${pay_cookie}`);
      // Discourse.createPost()
    } else {
      if (payload !== false) {
        Discourse.decryptPayload(payload);
        console.log(Discourse.payload);
      } else {
        // Then generate api key
        $('#redirect-login').html(`<a href="${Discourse.userAuthKeyUrl()}">Login</a>`);
        window.location.href=Discourse.userAuthKeyUrl();
      }
    }
  }
}
