// Sticky header
var stickybits = require('stickybits');

module.exports = themeStickyHeader = (function () {

  return {
    init: function() {
      stickybits('.doc-header');
    }
  }

})();
