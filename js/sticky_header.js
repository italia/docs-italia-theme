// Sticky header
module.exports = themeStickyHeader = (function ($) {

  return {
    init: function(callback) {
      // Get the header
      var header = $('header'),
          doc_header = $('#doc-header');

      // Get the offset position of the navbar
      var offset = doc_header.offset().top;

      // Do we need to debounce here?
      $(window).scroll(function () {

        // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
        if (window.pageYOffset >= offset) {
          header.addClass("sticky");
        } else {
          header.removeClass("sticky");
        }

      });
    }
  }

})(jQuery);
