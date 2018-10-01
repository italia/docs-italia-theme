var axios = require('axios');

module.exports = (function () {
  var instance;

  function createInstance() {
    var cache = function () {
      // This instance
      var i = this;

      this.cacheTables = {};
      this.set = function (k, v) {
        i.cacheTables[k] = v;
        return i;
      };
      this.get = function (k) {
        return new Promise(function (resolve, reject) {
          resolve(i.cacheTables[k]);
        });
      };
      this.hasKey = function (k) {
        return typeof i.cacheTables[k] !== "undefined";
      };
      this.isProcessing = function (k) {
        return i.cacheTables[k] === null;
      };
      this.setProcessing = function (k) {
        i.cacheTables[k] = null;
      };
      // Interface for axios' cached requests
      this.axiosInterface = function (request, callback) {
        // Check if method is set. If not, default is GET
        var m = typeof request.method !== "undefined" ? request.method.toUpperCase() : 'GET';
        // Create key
        var k = m + '|' + request.url;

        if (i.hasKey(k) || i.isProcessing(k)) {
          return i.get(k);
        } else {
          i.setProcessing(k);
          return axios(request).then(function (data) {
            i.set(k, data);
            // Check if callback is setted
            if (callback !== null && typeof callback !== "undefined" && callback !== false) {
              callback(data);
            }
            return data;
          });
        }
      }
    };
    return new cache();
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  }
})();
