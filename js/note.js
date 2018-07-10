// Notes
module.exports = themeNote = (function ($) {
  var that;

  return {

    $: {
      $noteBtn: $('.footnote-reference'),
      $note: $('.docutils.footnote'),
      $noteBackRef: $('.docutils.footnote').find('.fn-backref'),
      $noteStandardBtn: {},
      $body: $('body'),
      $window: $(window),
      dataObj: {}
    },

    init: function() {
      that = this.$;

      that.$noteStandardBtn = that.$noteBtn.filter(function() {
        return ($(this).closest('table').length == 0)
      });
      that.$note.css('display', 'block').slideUp(0);
      that.$noteStandardBtn.on('click', themeNote.shownoteStandardBtn);
      that.$noteBackRef.on('click', themeNote.backToBtn);
      $('.note-close-btn').on('click', themeNote.closeNote);
      $('.note-back-btn').on('click', themeNote.backToBtn);
    },

    shownoteStandardBtn: function(event) {
      event.preventDefault();

      var $btn = $(event.target),
          noteid = $btn.attr('href').replace('#', ''),
          $note = $('#' +  noteid);

      if($note.hasClass('active')) {
        $("html, body").animate({ scrollTop: $note.offset().top - 150 }, 300);
      } else {
        $note.addClass('active').slideDown();
        $("html, body").animate({ scrollTop: $note.offset().top - 150 }, 300);
      }
    },

    closeNote: function(event) {
      var $target = $(event.target),
          $note = $target.closest('.docutils.footnote.active');

      that.$note.removeClass('active').slideUp();
    },

    backToBtn: function(event) {
      var $target = $(event.target),
          id = $target.closest('.footnote.active').attr('id');

      $("html, body").animate({ scrollTop: $('a[href="#' + id + '"]').offset().top - 150 }, 200);
    }

  }
})(jQuery);
