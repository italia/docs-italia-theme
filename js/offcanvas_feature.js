// Offcanvas feature
module.exports = themeOffcanvasFeature = (function ($) {

  return {
    init: function(callback) {
      $('*[data-activate-element]').on('click', function(e) {
        e.preventDefault();
        var genid = $(this).data('activeid');
        var $targetelement = $('*[data-activatedby="'+genid+'"]');
        $targetelement.toggleClass('js-active');
        $('body').toggleClass('show-menu').toggleClass('stopScrolling--vertical');
      });
    }
  };

})(jQuery);
