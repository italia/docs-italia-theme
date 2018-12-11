// Sticky sidebar
module.exports = themeStickySidebar = (function ($) {

  return {
    init: function(callback) {
      new StickySidebar('.docs-menu', {
        containerSelector: '#main',
        innerWrapperSelector: '#desktop-menu',
        topSpacing: 68,
        bottomSpacing: 150
      }),

      $('#desktop-menu .collapse').on('shown.bs.collapse', function() {
        stickySidebar.updateSticky();
        $(window).scroll(); //non sono certo che serva a qualcosa
      }).on('hidden.bs.collapse', function() {
        stickySidebar.updateSticky();
        $(window).scroll();
      });
    }
  }
})(jQuery);
