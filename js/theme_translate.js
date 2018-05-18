module.exports = themeTranslate = (function ($) {

  return {

    getShareMsg: function() {
      return $('.t_translate--share_msg').attr('data-translation');
    },

    getCompareVersions: function() {
      return $('.t_translate--compare_versions').attr('data-translation');
    },

    getCopyLink: function() {
      return $('.t_translate--copy_link').attr('data-translation');
    },

    getSeeAction: function() {
      return $('.t_translate--see_actions').attr('data-translation');
    },

    getOtherActions: function() {
      return $('.t_translate--other_actions').attr('data-translation');
    },

    getComment: function() {
      return $('.t_translate--comments').attr('data-translation');
    },

    backToText: function() {
      return $('.t_translate--back_to_text').attr('data-translation');
    }
  }

})(jQuery);
