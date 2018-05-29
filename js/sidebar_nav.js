// Sidebar nav
module.exports = themeSidebarNav = (function ($) {
  var that;

  return {

    $: {
      $toggle: $('.navbar-toggler'),
      $categorymenu: $('.sidebar-btn--wrap-mobile'),
      $nav: $('.navbar-collapse')
    },

    init: function(callback) {
      that = this.$;
      themeSidebarNav.displaynavCategory();
    },

    displaynavCategory: function() {
      // There is no event to know when offanvas is open or close 'shown.bs.collapse' not work.
      // The buttons at the top is outside offCanvas becouse they are in fixed position and offCanvas is in fixed position too

      that.$toggle.on('click', function () {
        if(that.$nav.hasClass('open')) {
          that.$categorymenu.addClass('active');
        } else {
          that.$categorymenu.removeClass('active');
        }
      });
    }
  }

})(jQuery);
