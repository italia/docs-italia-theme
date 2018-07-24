// Sticky sidebar
module.exports = themeSearchboxCollapse = (function ($) {

  return {
    init: function(callback) {
      var $searchbox = $('#rtd-search-form'),
        $searchboxDesktopContainer = $searchbox.parent(),
        $searchboxMobileContainer = $('.doc-header'),
        wrapper = $('<div class="row row py-2 px-4 px-lg-5"><div class="col">');

      $('#di-show-searchbox').on('click', function(event) {
        $(this).toggleClass('active');
        if($(this).hasClass('active')) {
          $searchbox.detach();
          $('.doc-header').append($searchbox.wrap(wrapper));
        }
        else {
          $searchboxContainer.append($searchbox);
        }
      });
    }
  }
})(jQuery);
