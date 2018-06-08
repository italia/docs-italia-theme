// Admonition toggle
module.exports = themeStickyHeader = (function ($) {

  return {
    init: function(callback) {
      that = this.$;

      // Get the header
      var header = $('header'),
      sticky_content = $('#top-commands');

      // Get the offset position of the navbar
      var offset = sticky_content.offset().top;

      $(window).scroll(function () {

        // Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
        if (window.pageYOffset >= offset) {
          header.addClass("di-sticky");
        } else {
          header.removeClass("di-sticky");
        }

      });

    }
  }

})(jQuery);
