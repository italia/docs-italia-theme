// Sidebar nav
module.exports = themeSidebarNav = (function ($) {
  var that;

  return {

    $: {
      $openToggle: $('.navbar-toggler--open'),
      $backToggle: $('.navbar-toggler--back'),
      $tab: $('.sidebar-tabs'),
      $nav: $('.docs-italia-offcanvas-menu')
    },

    init: function(callback) {
      that = this.$;
      themeSidebarNav.displayNav();
    },

    displayNav: function() {

      that.$openToggle.on('click', function () {
        that.$tab.addClass('active');
        that.$nav.addClass('active');
      });

      that.$backToggle.on('click', function() {
        that.$tab.removeClass('active');
        that.$nav.removeClass('active');
      });

    }
  }

})(jQuery);
