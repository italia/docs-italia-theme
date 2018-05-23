// Admonition toggle
module.exports = themeAdmonitionToggle = (function ($) {

  return {
    init: function(callback) {
      that = this.$;

      $('.admonition__toggle-btn').on('click',function(){
        var $btn = $(this),
            $paragraph = $btn.closest('.admonition__toggle-wrap').siblings('.admonition__hidden-paragraph'),
            $admonition = $btn.closest('.admonition-deepening');

        if( $paragraph.hasClass('active')) {
          $("html, body").animate({ scrollTop: $admonition.offset().top - 10 }, 300, function(){
            $paragraph.removeClass('active').slideUp();
            $btn.removeClass('active');
          });
        } else {
          $paragraph.addClass('active').slideDown();
          $btn.addClass('active');
        }

        $btn.blur();
      });
    }
  }

})(jQuery);
