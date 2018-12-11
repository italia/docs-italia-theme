// Sidebar nav
module.exports = themeSidebarNav = (function ($) {
  var that;

  return {

    $: {
      $openToggle: $('.navbar-toggler--open'),
      $backToggle: $('.navbar-toggler--back'),
      $tab: $('.sidebar-tabs'),
      $nav: $('.docs-offcanvas-menu'),
      $navItem: $('.sidebar-list--wrapper a'),
      $currentItem: {} // last menù item selected
    },

    init: function(callback) {
      that = this.$;
      themeSidebarNav.displayNav();
      themeSidebarNav.addHandler();
      themeSidebarNav.selectNavItemOnLoad();
      themeSidebarNav.selectAccordion();
    },

    // Offcanvas nav
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

    // Select current inten on click ( nav in same page).
    addHandler: function() {
      that.$navItem.on('click', function(){
        that.$navItem.not($(this)).removeClass('current_item');
        $(this).addClass('current_item');

        // Close offcanvas on click
        if ( $( window ).width() <= 767 ) {
          that.$backToggle.trigger('click');
        }
      });
    },

    // Force select menu item, used in js/glossary_page.js.
    selectCustomItem: function(id) {
      var $item = that.$navItem.filter(function(){
        return $(this).attr('href') == '#' + id
      })

      that.$navItem.not($(this)).removeClass('current_item');
      $item.addClass('current_item');
    },

    // Select the right current item on page load.
    selectNavItemOnLoad: function() {
      var location = window.location.href,
          hashtagIndex = location.indexOf("#"),
          hash = location.substring(hashtagIndex,location.length);

      that.$currentItem = that.$navItem.filter(function(index) {
        var item = $(this),
            thisHashIndex = item.attr('href').indexOf("#"),
            thisHash = item.attr('href').substring(thisHashIndex,thisHashIndex.length);

        return thisHash == hash;
      });

      // Check if item doesn't have hash on url, select the item with href = "#" ( <li class="toctree-l1 current"> )
      if(that.$currentItem.length == 0) {
        that.$currentItem = that.$navItem.filter(function(index){
          return $(this).attr('href') == '#'
        })
      }
      that.$currentItem.addClass('current_item');
    },

    // Open the right accordion on page loaded, depends on the current item.
    selectAccordion: function() {
          // Detect desktop accordion.
      var $activeList = that.$currentItem.closest('.sidebar-accordion-content'),

          // Detect mobile tab.
          $activeListMobile = that.$currentItem.closest('.tab-pane'),
          idMobile = $activeListMobile.attr('id'),
          $listBtnMobile = $('.sidebar-btn--mobile').filter(function(){
            return $(this).attr('href') == '#' + idMobile
          });


      if ( $( window ).width() > 768 ) {
        $activeList.collapse('show');
      } else {
        $listBtnMobile.tab('show');
      }
    },

    // Force opening glossary accordion, used in js/glossary_page.js.
    openGlossaryAccordion: function() {
      if ( $( window ).width() > 768 ) {
        $('#glossary-index').collapse('show');
      } else {
        $('#glossary-index-mobile-tab').tab('show');
      }
    }
  }

})(jQuery);
