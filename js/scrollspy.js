// Sidebar nav
module.exports = themeScrollspy = (function ($) {
  var that;

  return {

    $: {
      // Getting all menu items referring to current page's anchors
      $navItem: $('.sidebar-list--wrapper a[href^="#"]')
    },

    init: function(callback) {
      that = this.$;

      that.$spied_anchors = that.$navItem.toArray().map(function(v) {
        return $(v).attr('href').slice(1);
      });

      that.$spied_items = that.$spied_anchors.reduce(function(t,v) {
        !v.length ? t.push($('body')[0]) : t.push($('#' + v)[0]);
        return t;
      }, []);

      themeScrollspy.selectNavItem(themeScrollspy.getPos());

      $(window).scroll(function($event) {

        themeScrollspy.selectNavItem(themeScrollspy.getPos());

      });

      // 1) save what anchors to listen to
      // 2) when their scrollTop position becomes 0 + 4rem for sticky header
      //    change what is the active index. In case it is son of another
      //    tab/nav, change it as well.
    },

    getPos: function() {

      var pos = that.$spied_items.length ? 0 : -1;

      while(that.$spied_items[pos].offsetTop < window.scrollY && pos < that.$spied_items.length / 2) pos++;

      return pos-1 < 0 ? 0: pos-1;
    },

    selectNavItem: function(pos) {

      that.$navItem.removeClass('current_item');
      var $item = that.$navItem.filter(function() {
        return $(this).attr('href') == '#' + $(that.$navItem[pos]).attr('href').slice(1);
      });
      $item.addClass('current_item');
    }
  }

})(jQuery);
