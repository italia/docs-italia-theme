// Module dependencies
var StickySidebar = require('sticky-sidebar');

// Sticky sidebar
module.exports = themeStickySidebar = (function ($) {

  return {
    init: function(callback) {

      $(document).ready(function () {

        var sidebar = document.getElementsByClassName('docs-italia-menu')[0],
          stickySidebar = new StickySidebar(sidebar, {
           containerSelector: '#main',
           innerWrapperSelector: '#desktop-menu',
           topSpacing: 85,
           bottomSpacing: 20
         }),
         sidebar__inner = document.getElementById('desktop-menu');

        // sidebar.addEventListener('affix.container-bottom.stickySidebar', function() {
        //   console.log('"affix.container-bottom.stickySidebar" triggered');
        //
        // });
        // sidebar.addEventListener('affixed.container-bottom.stickySidebar', function() {
        //
        //   console.log('2 translate js=', sidebar__inner.style.transform);
        //
        //   var heights_array = sidebar__inner.style.transform.slice(sidebar__inner.style.transform.indexOf('('), sidebar__inner.style.transform.indexOf(')')).split(','),
        //     new_height = 1135-;
        //   sidebar__inner.style.transform = "translate3d(0px, 1135px, 0px)");
        //   // var translate = $(sidebar).get().css('translate3d');
        //   // console.log('translate jq=', translate);
        //   // $(sidebar).css('translate3d', '(0px,1050px,0px)');
        //   // sidebar.style.translate3d =  '(0px,1050px,0px)';
        //
        //
        //   console.log('"affixed.container-bottom.stickySidebar" triggered');
        // // }).on('affixed.container-bottom.stickySidebar', function() {
        // //   console.log('"affixed.container-bottom.stickySidebar" triggered');
        // });

        $('#desktop-menu .collapse').on('shown.bs.collapse', function() {
          // console.log('triggered collapse stuff');
          stickySidebar.updateSticky();
          $(window).scroll();
        }).on('hidden.bs.collapse', function() {
          stickySidebar.updateSticky();
          $(window).scroll();
          // console.log('triggered collapse stuff');
        });

      });



    }
  }

})(jQuery);
