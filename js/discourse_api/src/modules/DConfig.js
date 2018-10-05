function DConfig (restUrl, headers) {
  this.restUrl = restUrl;
  this.headers = headers;
  return this;
}

DConfig.prototype.setHeader = function (name, value) {
  var headerValue = {};
  headerValue[name] = value;

  this.headers[name] = headerValue;
  return this;
};

DConfig.prototype.getHeaderObject = function (name) {
  return this.headers[name];
};

DConfig.prototype.getHeaderValue = function (name) {
  return this.headers[name][name];
};

DConfig.prototype.getHeaders = function (names) {
  var headers = {};
  var that = this;
  names.forEach(function (name) {
    headers[name] = that.getHeaderValue(name);
  });
  return headers;
};
/**
 * Exports
 * @type {function(*, *): DConfig}
 */
module.exports = DConfig;