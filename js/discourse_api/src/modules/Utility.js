var keypair = require('keypair');
var $ = require('jquery');
require('jsencrypt');

/**
 * Utility Class
 */
module.exports = function (pk_name, puk_name, uak_name, expire_days) {
  this.jsenc = new JSEncrypt();
  // Private key cookie's name
  this.pk_cookie_name = pk_name; // 'docs-italia_pk'
  this.puk_cookie_name = puk_name;
  // User API Key cookie's name
  this.uak_cookie_name = uak_name; // 'docs-italia_uak';
  // Expires days (for now: 10 days)
  this.expires_cookie = expire_days; // 10;

  /**
   * Create an event
   * @param name
   * @param detail
   * @returns {CustomEvent<any>}
   */
  this.eventCreate = function (name, detail) {
    var e = new CustomEvent(name, {
      detail: detail,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(e);
    return e;
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
    var that = this;
    return new Promise(function (resolve) {
      resolve(keypair())
    }).then(function (rsaKey) {
      that.rsaKey = rsaKey;
      // Set public and private keys
      that.jsenc.setPublicKey(that.rsaKey.public);
      that.jsenc.setPrivateKey(that.rsaKey.private);
      // Seve private kay to a cookie
      that._cookie_create(that.pk_cookie_name, encodeURI(that.rsaKey.private), 1, true);
      that._cookie_create(that.puk_cookie_name, encodeURI(that.rsaKey.public), 1, true);
    })
  };
  // Get search parameters
  this.searchParameters = function (search) {
    if (this.searchParams === null || typeof this.searchParams === "undefined")
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
};
