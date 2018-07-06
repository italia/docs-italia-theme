// Sidebar nav

// Module dependencies
var themeSidebarNav = require('./sidebar_nav.js');

module.exports = themeScrollspy = (function ($) {
  var that;

  return {

    $: {
      // offcanvas
      $openToggle: $('.navbar-toggler--open'),
      $backToggle: $('.navbar-toggler--back'),
      $tab: $('.sidebar-tabs'),
      $nav: $('.docs-italia-offcanvas-menu'),

      // singole voci di menu di tab o accordion, sia mobile che desktop
      $navItem: $('.sidebar-list--wrapper a'),
      $currentItem: {} // last menù item selected
    },

    init: function(callback) {
      that = this.$;
      // get menu item representing current page
      var page_link_l1 = $('.sidebar-list--wrapper a[href="#"]'),
        // nav_links = page_link_l1.closest('.toctree-l1').find('a:not([href="#"])'),
        nav_links = page_link_l1.closest('.toctree-l1').find('a'),
        spied_anchors = nav_links.toArray().map(function(v) {
          // if($(v).attr('href').slice(1).length === 0)
          //   return $('#doc-content > .section').attr('id');
          return $(v).attr('href').slice(1);
        }),
        spied_items = spied_anchors.reduce(function(t,v) {
          if(!v.length)
            t.push($('body'));
          else
            t.push($('#' + v));
          return t;
        }, []);

      console.log('nav_links', nav_links);
      console.log('spied_anchors', window.location.hash, spied_anchors);
      console.log('spied_items', spied_items);

      function getPos() {
        var pos = spied_items.length ? 0 : -1;
        console.log('=========');
        console.log('spied_items[pos].offset().top < window.scrollY && pos < spied_items.length / 2. ', spied_items[pos].offset().top < window.scrollY && pos < spied_items.length / 2);
        console.log('pos', pos,  spied_items.length / 2);
        console.log(spied_items[pos].offset().top, window.scrollY);

        while(spied_items[pos].offset().top < window.scrollY && pos < spied_items.length / 2){//;
          // console.log('returning', pos-1);
          console.log(spied_items[pos].offset().top, window.scrollY);
          pos++;
        }
        return pos-1 < 0 ? 0: pos-1;
      }

      var pos = getPos();

      // nav_links.removeClass('active');
      // $('.sidebar-list--wrapper a[href="#' + spied_anchors[pos] + '"]').addClass('active');

      // var old_scroll_pos = $(window).scrollTop();
      // location.hash = '#' + spied_anchors[pos] ? spied_anchors[pos] : '';
      // $(window).scrollTop(old_scroll_pos);

      // var anchors_position;
      $(window).scroll(function($event) {

        pos = getPos();
        // nav_links.removeClass('active');
        // $('.sidebar-list--wrapper a[href="#' + spied_anchors[pos] + '"]').addClass('active');

        var old_scroll_pos = $(window).scrollTop();
        location.hash = '#' + (spied_anchors[pos] || '');
        $(window).scrollTop(old_scroll_pos);

        themeSidebarNav.selectCustomItem(spied_anchors[pos]);

        // themeSidebarNav.selectNavItemOnLoad();
        // console.log(
        //   // spied_anchors,
        //   pos,
        //   // pos > -1 ? spied_anchors[pos] : '',
        //   // $('.sidebar-list--wrapper a[href="#' + spied_anchors[pos] + '"]'),
        //   // $('#titolo-paragrafo-lorem-ipsum-sit').scrollTop(),
        //   // $('#main').offset().top - document.body.scrollTop,
        //   window.scrollY
        //   // ,
        //   // pos
        //   // spied_items.map(function(v) {
        //   //   return $(v).scrollTop();
        //   // })
        // );

      });

      // 1) save what anchors to listen to
      // 2) when their scrollTop position becomes 0 + 4rem for sticky header
      //    change what is the active index. In case it is son of another
      //    tab/nav, change it as well.
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
