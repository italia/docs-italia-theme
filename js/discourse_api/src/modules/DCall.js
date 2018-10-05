var axios = require('axios');

/**
 * DActions - embeds discourse action call
 * @param endpoint
 * @constructor
 */
function DCall(baseUrl, name, endpoint, token, body, headers, cache) {
  if (endpoint.indexOf('$') >= 0) {
    var count = 0;
    var temp = endpoint.split('/').map(function (e, i) {
      if (e === '$') {
        var position = count;
        count++;
        return token[position];
      } else {
        return e;
      }
    });
    endpoint = temp.join('/');
  }
  endpoint = baseUrl + endpoint + '.json';
  this.set(name, endpoint, body, headers, cache);
  return this;
}

DCall.prototype.set = function (name, endpoint, body, headers, cache) {
  this.name = name;
  this.body = body;
  this.endpoint = endpoint;
  this.headers = headers;
  this.cache = cache;
};

// Execute axios get call
DCall.prototype.get = function () {
  if (typeof this.cache === "undefined")
    this.cache = true;

  return axios.get(this.endpoint, {
    data: this.body,
    headers: this.headers,
  }).then(function (response) {
    return response;
  });
};
// Execute axios post call
DCall.prototype.post = function () {
  return axios({
    method: 'POST',
    url: this.endpoint,
    data: this.body,
    headers: this.headers
  });
};

/**
 * Static method executeQueue
 * @param queue
 * @returns {*}
 */
DCall.executeQueue = function (queue) {
  return axios.all(queue);
};

DCall.prototype.getResponse = function () {
  return this.response;
};

/**
 * Exports
 * @type {function(*=, *=, *, *=, *=): DCall}
 */
module.exports = DCall;