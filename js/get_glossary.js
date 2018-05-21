// Get glossary terms
module.exports = themeGlossary = (function ($) {
  var that;

  return {

    $: {
      $url: '_static/data/glossary.json',
      $glossay: {},
      callback: {}
    },

    init: function(callback) {
      that = this.$;
      that.callback = callback;

      $.ajax({
        dataType: 'json',
        url: that.$url,
        success: themeGlossary.success,
        error: themeGlossary.error,
        cache: false
      });
    },

    success: function(data) {
      that.$glossay = data;
      that.callback();
    },

    error: function(data) {
      that.callback();
    },

    getGlossay: function() {
      return that.$glossay
    }
  }

})(jQuery);
