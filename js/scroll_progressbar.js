// Admonition toggle
module.exports = themeScrollProgressBar = (function ($) {

  return {
    init: function(callback) {
      that = this.$;

      // When the user scrolls the page, execute myFunction
      $(window).scroll(function() {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (winScroll / height) * 100;
        document.getElementById("scrollprogressBar").style.width = scrolled + "%";
      });
    }
  };

})(jQuery);
