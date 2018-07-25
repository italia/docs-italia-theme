// Sticky header
module.exports = themeStickyHeader = (function ($, stickybits) {

  return {
    init: function() {
      stickybits('.doc-header');
    }
  }

})(jQuery, stickybits);
