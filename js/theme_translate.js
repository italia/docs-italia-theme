module.exports = themeTranslate = (function ($) {
  var that;

  return {

    $: {
      $element: $('.t_translate'),
      obj: {}
    },

    init: function() {
      that = this.$;
      that.$element.each(function(index) {
        var $element = $(this),
            name = $element.attr('data-name');
        that.obj[name] = $element.attr('data-translation');
      });
    },

    getTranslation: function() {
      return that.obj;
    }
  }

})(jQuery);
