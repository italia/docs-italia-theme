var axios = require('axios');
var cache = require('axios-extensions');

// enhance the original axios adapter with throttle and cache enhancer
var http = axios.create({
  baseURL: '/',
  headers: { 'Cache-Control': 'no-cache' },
  adapter: cache.throttleAdapterEnhancer(cache.cacheAdapterEnhancer(axios.defaults.adapter, { threshold: 5 * 1000 }))
});

/**
 * DActions - embeds discourse action call
 * @param endpoint
 * @constructor
 */
function DCall(baseUrl, name, endpoint, token, body, headers, cache) {
  if (endpoint.indexOf('$') >= 0) {
    var count = 0;
    var avoidJSONExt = false;
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
  
  // Check for ! to avoid '.json' suffix
  if (endpoint.indexOf('!') >= 0) {
    avoidJSONExt = true;
    endpoint = endpoint.replace('!', '');
  }
  
  endpoint = baseUrl + endpoint + (!avoidJSONExt ? '.json' : '');
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

  return http.get(this.endpoint, {
    data: this.body,
    cache: this.cache,
    headers: this.headers
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
