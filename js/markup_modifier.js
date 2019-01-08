var $tpl = require('./getTpl');

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
      $admonitionDeepenings: $('.admonition-deepening'),
      titleReady: false
    },

    init: function() {
      that = this.$;
      themeMarkupModifier.deepeningModifier();
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

        $element.wrap($tpl({}, 'markup_modifier__chapter-header'));
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
      if ($caption.length) {
        $caption.each(function(index) {
          var $caption = $(this),
              $table = $caption.closest('.table-responsive, .figure'),
              $table_id = $table.hasClass('figure') ? $table.attr('id') : $table.find('table').attr('id');
              $reference = $('<p></p>').addClass('reference--wrap').append(
                $('<a></a>').addClass('reference internal').append(
                  $('<i></i>').addClass('it-link mr-2 align-middle')
                ).append(
                  $('<span></span>').text('copia link')
                ).attr('href', '#' + $table_id)
              );
              
          $caption.addClass('caption--table');
          $table.after($caption);
          $caption.wrap('<div class="caption-wrap">');
          $caption.closest('.caption-wrap').append($reference);
        });
      }
    },

    procedureModifier: function() {
      // Wrap procedure img
      var $img = $('.procedure.topic').find('img');
      $img.wrap('<div class="procedure__img">');
    },
  
    iconMarkup: function (value) {
      return $tpl({ i: value }, 'markup_modifier__icon');
    },

    addIcon: function() {
      var $note = $('.admonition.note .admonition-title'),
          $error = $('.admonition.error .admonition-title'),
          $consiglio = $('.admonition.hint .admonition-title'),
          $attention = $('.admonition.attention .admonition-title'),
          $warning = $('.admonition.warning .admonition-title'),
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
          $consultationTitle = $('.admonition-consultation .admonition-title');
          $procedureTitle = $('.procedure .topic-title');

      $note.prepend(this.iconMarkup('note'));
      $error.prepend(this.iconMarkup('procedure'));
      $consiglio.prepend(this.iconMarkup('hint'));
      $attention.prepend(this.iconMarkup('attention'));
      $warning.prepend(this.iconMarkup('attention'));
      $important.prepend(this.iconMarkup('hint'));
      $usefulDocsPdf.prepend(this.iconMarkup('pdf'));
      $usefulDocsHtml.prepend(this.iconMarkup('html'));
      $numericList.prepend(this.iconMarkup('step'));
      $codeTitle.prepend(this.iconMarkup('example'));
      $deepeningTitle.prepend(this.iconMarkup('attention'));
      $consultationTitle.prepend(this.iconMarkup('edit'));
      $procedureTitle.prepend(this.iconMarkup('procedure'));
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
            newStr = str.replace(/[\[\]]/g,''),
            backToText = t.back_to_text,
            stringToAppend = $tpl({ text: stringToAppend }, 'markup_modifier__note-action');

        $element.text(t.note +  ' ' + newStr);

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
            regex = /admonition-(\S*)(\s)/,
            matches = str.match(regex),
            idName = '';

        if(matches != null) {
          idName = matches[1];
          idName = idName.replace('-', '_');
        }

        if(idName != undefined && t[idName] != undefined) {
          return t[idName];
        } else {
          return title;
        }
      }
    },

    deepeningModifier: function() {
      var more = t.show_more,
      less = t.show_less,
      btn = $tpl({ more: more, less: less }, 'markup_modifier__admonition');

      that.$admonitionDeepenings.each(function() {
        var $hiddenBlock = $(this).find('.more.container');
        var $deepeningElements = $(this).children(':not(.admonition-title)');

        if ($hiddenBlock.length === 0 && $deepeningElements.length > 4) {
          $hiddenBlock = $deepeningElements.slice(4, $deepeningElements.length);
        }

        if ($hiddenBlock.length > 0) {
          $hiddenBlock.wrapAll('<div class="admonition__hidden-paragraph">');
          $(this).append(btn);
        }
      });
    }

  }
})(jQuery);
