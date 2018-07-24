// Sticky sidebar
module.exports = themeSearchboxCollapse = (function ($) {

  return {
    init: function(callback) {
      var $searchbox = $('#rtd-search-form'),
        $searchboxDesktopContainer = $searchbox.parent(),
        $searchboxMobileContainer = $('.doc-header'),
        wrapper = '<div class="row p-2 pr-3"><div class="col"></div></div>';

      $('#di-show-searchbox').on('click', function(event) {
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
