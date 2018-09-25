// Admonition toggle
module.exports = themeVersionDropdown = (function ($) {

  return {
    init: function(callback) {
      that = this.$;

      $('#version-list .dropdown-item').on('click', function () {
        var $btn = $(this),
            $url = $btn.attr('di-value');
            location.pathname = $url;
      });

      // $('#version-list.dropdown').dropdown();
    }
  }

})(jQuery);
