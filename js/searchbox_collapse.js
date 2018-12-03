var $tpl = require('./getTpl');

// Sticky sidebar
module.exports = themeSearchboxCollapse = (function ($) {

  return {
    init: function(callback) {
      var $searchbox = $('#rtd-search-form'),
        $searchboxDesktopContainer = $searchbox.parent(),
        $searchboxMobileContainer = $('.doc-header'),
        wrapper = $tpl({}, 'searchbox-collapse');

      $('#searchbox-toggle').on('click', function(event) {
        $(this).toggleClass('active');
        if($(this).hasClass('active')) {
          $searchbox.detach();
          $searchboxMobileContainer.append($searchbox);
          $searchbox.wrap(wrapper).fadeIn();
        }
        else {
          $searchbox.unwrap().unwrap().fadeOut();
          $searchbox.detach();
          $searchboxDesktopContainer.append($searchbox);
        }
      });
    }
  }
})(jQuery);
