// Modify DOM via JS.
module.exports = ThemeMarkupModifier = (function ($) {
  var that;

  return {

    $: {
      title: $('#doc-content h1, #doc-content h2, #doc-content h3'),
      $table: $('table:not(.footnote):not(.docutils.field-list)'),
      $captionReference: $('table, .figure'),
      $noteBtn: $('.footnote-reference'),
      $note: $('.docutils.footnote'),
      $noteBackref: $('.fn-backref'),
      $imgFixed: $('.figure-fixed'),
      titleReady: false
    },

    init: function() {
      that = this.$;
      ThemeMarkupModifier.titleModifier();
      ThemeMarkupModifier.tableModifier();
      ThemeMarkupModifier.captionModifier();
      ThemeMarkupModifier.procedureModifier();
      ThemeMarkupModifier.addIcon();
      ThemeMarkupModifier.noteModifier();
      ThemeMarkupModifier.imgModifier();
    },

    imgModifier: function() {
      var $imgContainer = that.$imgFixed.closest('.figure');
      $imgContainer.addClass('figure-fixed-wrap');
    },

    titleModifier: function() {
      that.title.each(function(index) {

        var $element = $(this),
            title = $element.html(),
            number = ThemeMarkupModifier.startingNumber(title);

        $element.wrap('<div class="chapter-header clearfix"><div class="title-wrap">');
        if( !ThemeMarkupModifier.dotNumberValidator(number) ) {
          $element.html(title.replace(number , '<span class="title__chapter">' + number + '</span>'));
          $element.addClass('title-has-nav');
          $element.closest('.title-wrap').append('<span class="title__background">');
          $element.closest('.chapter-header').addClass('has-nav');
        }
      });
      that.titleReady = true;
    },

    startingNumber: function(string) {
      var startingNumber=string.substr(0 , string.indexOf(' '))
      return startingNumber;
    },

    dotNumberValidator: function(string) {
      var regex = /^[0-9.]+$/;
      return !regex.test(string)
    },

    tableModifier: function() {
      // Wrap table into 'table-responsive'.
      that.$table.wrap('<div class="table-responsive">');
      that.$table.addClass('table');
    },

    captionModifier: function() {
      // Move caption after table.
      var $caption = that.$captionReference.find('caption, .caption');
      if ( $caption.length ) {
        $caption.each(function(index) {
          var $caption = $(this),
              $table = $caption.closest('.table-responsive, .figure');
              $p = $table.next(),
              $reference = $p.find('.reference.internal');

          $table.after($caption);
          $caption.addClass('caption--table');
          // check if there is a copy link after cation
          if($reference.length) {
            $reference.prepend('<div class="reference-icon Icon it-icon-link"></div>')
            $p.addClass('reference--wrap')
            $caption.wrap('<div class="caption-wrap">');
            $caption.closest('.caption-wrap').append($p);
          }
        });
      }
    },

    procedureModifier: function() {
      // Wrap procedure img
      var $img = $('.procedure.topic').find('img');
      $img.wrap('<div class="procedure__img">');
    },

    addIcon: function() {
      var $note = $('.admonition.note .admonition-title'),
          $error = $('.admonition.error .admonition-title'),
          $consiglio = $('.admonition.hint .admonition-title'),
          $attention = $('.admonition.attention .admonition-title'),
          $important = $('.admonition.important .admonition-title'),
          $usefulDocs = $('.useful-docs li'),
          $numericList = $('#doc-content ol li');

      $note.prepend('<span class="Icon it-icon-note"></span>');
      $error.prepend('<span class="Icon it-icon-procedure"></span>');
      $consiglio.prepend('<span class="Icon it-icon-hint"></span>');
      $attention.prepend('<span class="Icon it-icon-attention"></span>');
      $important.prepend('<span class="Icon it-icon-hint"></span>');
      $usefulDocs.prepend('<span class="Icon it-icon-pdf"></span>');
      $numericList.prepend('<span class="Icon it-icon-step Icon--ol"></span>');
    },

    noteModifier: function() {
      that.$noteBtn.each(function(index) {
        var str =  $(this).text(),
            newStr = str.replace(/[\[\]]/g,'');
        $(this).text(newStr);
      });

      that.$noteBackref.each(function(index) {
        var str =  $(this).text(),
            newStr = str.replace(/[\[\]]/g,'');
            stringToAppend = "<div class='note-action'>" +
                             "<button type='button' class='note-close-btn'>X</button>" +
                             "<button type='button' class='note-back-btn'>" + themeTranslate.getTranslation().backToText + "</button>" +
                             "</div>";

        $(this).text('Note ' + newStr);
        $(this).closest('td').next().append(stringToAppend);
      });
    }
  }
})(jQuery);
