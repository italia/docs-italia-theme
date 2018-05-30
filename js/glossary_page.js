// Get glossary terms
module.exports = themeGlossaryPage = (function ($) {
  var that;

  return {

    $: {
      $letterBnt: $('#glossario .glossary.docutils dt')
    },

    init: function(callback) {
      that = this.$;
      themeGlossaryPage.buildAccordion();
    },

    buildAccordion: function() {
      that.$letterBnt.each(function(index){
        var btn = $(this);
      });
    }
  }

})(jQuery);
