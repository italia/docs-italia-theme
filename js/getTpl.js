/**
 * This is the modified library version of the github user romuleald.
 * https://github.com/romuleald/getTpl/blob/master/gettpl.js
 *
 * Modified because of we use ES5 and `let` keyword isn't.
 */
var getTpl = (function () {
  "use strict";
  var cache = {};
  var getCache = function (templateId) {
    return cache[templateId];
  };
  var setCache = function (templateId, html) {
    cache[templateId] = html;
  };
  
  /**
   *
   * @param {Object} data formed object that match in template {foo:'bar'} will replace {{foo}} with bar
   * @param {String} templateId HTML attribute id
   * @returns {string} HTMl template transformed
   */
  return function gettpl(data, templateId, debug) {
    var templateHTML = getCache(templateId);
    if (getCache(templateId)) {
      templateHTML = getCache(templateId);
    }
    else {
      var tpl = document.getElementById(templateId);
      templateHTML = tpl.innerHTML;
      setCache(templateId, templateHTML);
    }
    return templateHTML.replace(/{{ ?([^}]*) ?}}/g, function (search, result) {
      result = result.trim();
      if (result.indexOf('.') > 0) {
        var obj_prop = result.split('.');
        debug && console.info(result, data[obj_prop[0]][obj_prop[1]]);
        return data[obj_prop[0]][obj_prop[1]];
      }
      debug && console.info(result, data[result]);
      return data[result] || '';
    });
  };
  
})();
module.exports = getTpl;
