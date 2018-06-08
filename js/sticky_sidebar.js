// Module dependencies
var StickySidebar = require('sticky-sidebar');

// Sticky sidebar
module.exports = themeStickySidebar = (function ($) {

  return {
    init: function(callback) {

      $(document).ready(function () {

        var sidebar = new StickySidebar('#desktop-menu', {
           containerSelector: '#main',
           innerWrapperSelector: '.sidebar-nav__inner',
           topSpacing: 85,
           bottomSpacing: 20
         });

      });
    }
  }

})(jQuery);
