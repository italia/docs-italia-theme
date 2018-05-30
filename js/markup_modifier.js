// Modify DOM via JS.
module.exports = themeMarkupModifier = (function ($) {
  var that;

  return {

    $: {
      $title: $('#doc-content h1, #doc-content h2, #doc-content h3'),
      $table: $('table:not(.footnote):not(.docutils.field-list)'),
      $captionReference: $('table, .figure'),
      $noteBtn: $('.footnote-reference'),
      $note: $('.docutils.footnote'),
      $noteBackref: $('.fn-backref'),
      $imgFixed: $('.figure-fixed'),
      $admonitionTitle: $('.admonition .admonition-title'),
      $admonitionDeepening: $('.admonition-deepening'),
      $deepeningParagraph: $('.admonition-deepening > p:not(.admonition-title)'),
      titleReady: false
    },

    init: function() {
      that = this.$;
      themeMarkupModifier.deepeninModifier();
      themeMarkupModifier.titleModifier();
      themeMarkupModifier.tableModifier();
      themeMarkupModifier.captionModifier();
      themeMarkupModifier.procedureModifier();
      themeMarkupModifier.admonitionTitleModifier();
      themeMarkupModifier.addIcon();
      themeMarkupModifier.noteModifier();
      themeMarkupModifier.imgModifier();
    },

    imgModifier: function() {
      var $imgContainer = that.$imgFixed.closest('.figure');
      $imgContainer.addClass('figure-fixed-wrap');
    },

    titleModifier: function() {
      that.$title.each(function(index) {

        var $element = $(this),
            title = $element.html(),
            number = themeMarkupModifier.startingNumber(title);

        $element.wrap('<div class="chapter-header clearfix"><div class="title-wrap">');
        if( !themeMarkupModifier.dotNumberValidator(number) ) {
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
          $usefulDocsPdf = $usefulDocs.filter(function(){
            return $(this).find('.mimetype').html() == 'application/pdf';
          });
          $usefulDocsHtml = $usefulDocs.filter(function(){
            return $(this).find('.mimetype').html() == 'text/html';
          });
          $numericList = $('.procedure ol li'),
          $codeTitle = $('.admonition-example .admonition-title');
          $deepeningTitle = $('.admonition-deepening .admonition-title');
          $consultationTitle = $('.admonition-consultazione .admonition-title');

      $note.prepend('<span class="Icon it-icon-note"></span>');
      $error.prepend('<span class="Icon it-icon-procedure"></span>');
      $consiglio.prepend('<span class="Icon it-icon-hint"></span>');
      $attention.prepend('<span class="Icon it-icon-attention"></span>');
      $important.prepend('<span class="Icon it-icon-hint"></span>');
      $usefulDocsPdf.prepend('<span class="Icon it-icon-pdf"></span>');
      $usefulDocsHtml.prepend('<span class="Icon it-icon-html"></span>');
      $numericList.prepend('<span class="Icon it-icon-step Icon--ol"></span>');
      $codeTitle.prepend('<span class="Icon it-icon-example"></span>');
      $deepeningTitle.prepend('<span class="Icon it-icon-attention"></span>');
      $consultationTitle.prepend('<span class="Icon it-icon-edit"></span>');
    },

    noteModifier: function() {
      that.$noteBtn.each(function(index) {
        var str =  $(this).text(),
            newStr = str.replace(/[\[\]]/g,'');
        $(this).text(newStr);

        // Check if the button is inside a table and add a specific class to note element 'footnote-from-table'
        if($(this).closest('.table-responsive').length) {
          var id = $(this).attr('href').replace('#',''),
              $noteBackref = $('#' + id);

          $noteBackref.addClass('footnote-from-table');
        }
      });

      that.$noteBackref.each(function(index) {
        var $element = $(this),
            str =  $element.text(),
            newStr = str.replace(/[\[\]]/g,'');
            stringToAppend = "<div class='note-action'>" +
                             "<button type='button' class='note-close-btn'>X</button>" +
                             "<button type='button' class='note-back-btn'>" + themeTranslate.getTranslation().backToText + "</button>" +
                             "</div>";

        $element.text(themeTranslate.getTranslation().note +  ' ' + newStr);

        // Add btn ( x | back) if popover isn't showed inside table checking the 'footnote-from-table' class
        if( $element.closest('.footnote-from-table').length == 0 ) {
          $element.closest('td').next().append(stringToAppend);
        }
      });
    },

    admonitionTitleModifier: function() {
      that.$admonitionTitle.each(function(index) {
        var $title = $(this);
        $title.html(getTitleTranslation($title));
      });
      that.$admonitionTitle.wrap('<div class="admonition__header">');

      // Print title translation in case the parent admonition contain class name-{titleValue}
      function getTitleTranslation($el) {
        var title = $el.html(),
            str = $el.closest('.admonition').attr('class'),
            // Find the value between name- and ' ' the last class is always 'admonition' insert by sphinx
            regex = /name-(.*)(\s)/,
            matches = str.match(regex),
            idName = '';

        if(matches != null) {
          idName = matches[1];
        }

        if( idName != undefined && themeTranslate.getTranslation()[idName] != undefined ) {
          return themeTranslate.getTranslation()[idName];
        } else {
          return title;
        }
      }
    },

    deepeninModifier: function() {
      var $hiddenBlock = that.$deepeningParagraph.slice(4,that.$deepeningParagraph.length),
          btn = "<div class='admonition__toggle-wrap'><button type='button' class='admonition__toggle-btn'>" +
          "<span class='admonition__toggle-show-more'>" + themeTranslate.getTranslation().showMore + "<span class='Icon it-icon-plus'></span></span>" +
          "<span class='admonition__toggle-show-less'>" + themeTranslate.getTranslation().showLess + "<span class='Icon it-icon-minus'></span></span>" +
          "</button></div>";

      $hiddenBlock.wrapAll('<div class="admonition__hidden-paragraph">');
      that.$admonitionDeepening.append(btn);
    }

  }
})(jQuery);
