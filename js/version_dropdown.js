// Admonition toggle
module.exports = themeVersionDropdown = (function ($) {

  return {
    init: function(callback) {
      that = this.$;

      $('#version-list .dropdown-item').on('click', function () {
        console.log('header dropdown clicked');
        var $btn = $(this),
            $url = $btn.attr('di-value');
            // $target = $(something);
            // $admonition = $btn.closest('.admonition-deepening');

      });

      // $('#version-list.dropdown').dropdown();
    }
  }

})(jQuery);
