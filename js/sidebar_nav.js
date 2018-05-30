// Sidebar nav
module.exports = themeSidebarNav = (function ($) {
  var that;

  return {

    $: {
      $openToggle: $('.navbar-toggler--open'),
      $backToggle: $('.navbar-toggler--back'),
      $tab: $('.sidebar-tabs'),
      $nav: $('.docs-italia-offcanvas-menu'),
      $navItem: $('.sidebar-list--wrapper a'),
      $currentItem: {}
    },

    init: function(callback) {
      that = this.$;
      themeSidebarNav.displayNav();
      themeSidebarNav.addHandler();
      themeSidebarNav.selectNavItemOnLoad();
      themeSidebarNav.selectAccordion();
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
    },

    addHandler: function() {
      that.$navItem.on('click', function(){
        that.$navItem.not($(this)).removeClass('current_item');
        $(this).addClass('current_item');
      });
    },

    selectNavItemOnLoad: function() {
      var location = window.location.href,
          hashtagIndex = location.indexOf("#"),
          hash = location.substring(hashtagIndex,location.length);

      that.$currentItem =
        that.$navItem.filter(
          function(index) {
            var item = $(this),
                thisHashIndex = item.attr('href').indexOf("#"),
                thisHash = item.attr('href').substring(thisHashIndex,thisHashIndex.length);
            return thisHash == hash;
          });

      that.$currentItem.addClass('current_item');
    },

    selectAccordion: function() {
      var $activeList = that.$currentItem.closest('.sidebar-list--wrapper'), // CLASSE PIU SPECIFICA DESKTOP TO DO
          $activeListMobile = that.$currentItem.closest('.tab-pane'),
          id = $activeList.attr('id'),
          idMobile = $activeListMobile.attr('id'),
          $listBtn = $('.sidebar-btn').filter(function(){
            return $(this).attr('data-target') == '#' + id
          }),
          $listBtnMobile = $('.sidebar-btn--mobile').filter(function(){
            return $(this).attr('href') == '#' + idMobile
          });

      if ( $( window ).width() > 768 ) {
        if( $listBtn.hasClass('collapsed') ) $listBtn.trigger('click');
      } else {
        $listBtnMobile.trigger('click');
      }
    }
  }

})(jQuery);
