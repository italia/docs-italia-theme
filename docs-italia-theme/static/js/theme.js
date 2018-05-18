(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var ThemeMarkupModifier = require('./markup_modifier.js');
var ThemeToolTip = require('./tooltip.js');
var ThemeChapterNav = require('./section_navigation.js');
var ThemeNote = require('./note.js');

// Init all 
$(document).ready(function() {
  ThemeMarkupModifier.init();
  ThemeToolTip.init();
  ThemeChapterNav.init();
  ThemeNote.init();
});

},{"./markup_modifier.js":2,"./note.js":3,"./section_navigation.js":4,"./tooltip.js":5}],2:[function(require,module,exports){
/// Modify DOM via JS.
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
                             "<button type='button' class='note-back-btn'>torna al testo</button>" +
                             "</div>";

        $(this).text('Note ' + newStr);
        $(this).closest('td').next().append(stringToAppend);
      });
    }
  }
})(jQuery);

},{}],3:[function(require,module,exports){
// Notes
module.exports = ThemeNote = (function ($) {
  var that;

  return {

    $: {
      $noteBtn: $('.footnote-reference'),
      $note: $('.docutils.footnote'),
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
      that.$noteStandardBtn.on('click', ThemeNote.shownoteStandardBtn);
      $('.note-close-btn').on('click', ThemeNote.closeNote);
      $('.note-back-btn').on('click', ThemeNote.backToBtn);
    },

    shownoteStandardBtn: function(event) {
      event.preventDefault();

      var $btn = $(event.target),
          noteid = $btn.attr('href').replace('#', ''),
          $note = $('#' +  noteid);

      if($note.hasClass('active')) {
        $("html, body").animate({ scrollTop: $note.offset().top - 10 }, 300);
      } else {
        $note.addClass('active').slideDown();
        $("html, body").animate({ scrollTop: $note.offset().top - 10 }, 300);
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

      $("html, body").animate({ scrollTop: $('a[href="#' + id + '"]').offset().top }, 200);
    }

  }
})(jQuery);

},{}],4:[function(require,module,exports){
/// Section navigation
module.exports = ThemeChapterNav = (function ($) {
  var that;

  return {

    $: {
      $title: {},
      $body: $('body'),
      $html: $('html'),
      $window: $(window)
    },

    init: function() {
      that = this.$;
      that.$title = $('.chapter-header.has-nav h1,.chapter-header.has-nav h2,.chapter-header.has-nav h3'),
      that.$title.each(function(index) {
        $element = $(this);
        ThemeChapterNav.addNav($element);
      });
      ThemeChapterNav.addHandler();
    },

    addNav: function(element) {
      var nav = "<div class='chapter-nav'><div class='chapter-nav__wrap'>" +
          "<ul class='chapter-nav__list chapter-nav__list--visible'>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-comment'></span>" +
          "<button type='button' class='chapter-link'><span>4</span> commenti</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-more'></span>" +
          "<button type='button' class='chapter-link chapter-link--expand'>Vedi Azioni</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-more'></span>" +
          "<button type='button' class='chapter-link chapter-link--expand'>Altre Azioni</button></li></ul>" +
          "<div class='chapter-nav__list--hidden'>" +
          "<ul class='chapter-nav__list'>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-link'></span>" +
          "<button type='button' class='chapter-link'>Copia link</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-compare'></span>" +
          "<button type='button' class='chapter-link'>Confronta versioni</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-share'></span>" +
          "<button type='button' class='chapter-link'>Condividi</button>" +
          "</li></ul></div></div></div>";
      container = element.closest('.chapter-header');
      container.append(nav);
    },

    addHandler: function(element) {
      var $expanded = $('.chapter-link--expand');

      if (!that.$html.hasClass('touch')) {
        $('.chapter-header.has-nav').on('mouseover' , function(){
          if( that.$window.outerWidth() > 992 ) {
            var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden'),
            $wrap = $(this).find('.title-wrap');
            lineHeight = parseInt($(this).find('.title-has-nav').css('line-height'))+2;

            $nav.addClass('active');
            $wrap.addClass('active');
            $wrap.find('.title__background').css('height',lineHeight);

            // if (typeof ThemeNote != "undefined") {
            //   ThemeNote.closeAllNote();
            // }
          }
        });
        $('.chapter-header.has-nav').on('mouseout' , function(){
          if( that.$window.outerWidth() > 992 ) {
            var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden'),
                $wrap = $(this).find('.title-wrap');
            $nav.removeClass('active');
            $wrap.removeClass('active');
          }
        });
      }

      // Close lightbox on click ( toch monitor)
      $('.chapter-nav__list--hidden').on('click' , function(event){
        if( $(event.target).is( $('.chapter-nav__list--hidden'))){
          var $wrap = $(this).closest('.chapter-header').find('.title-wrap');
          $(this).removeClass('active');
          that.$body.removeClass('no-scroll');
          $wrap.removeClass('active');
        }
      });

      // Open nav ( toch monitor)
      $expanded.on('click' , function(){
        var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden'),
            $wrap = $(this).closest('.chapter-header').find('.title-wrap'),
            lineHeight = parseInt($(this).closest('.chapter-header').find('.title-has-nav').css('line-height'))+4;
        if( $nav.hasClass('active') ) {
          $nav.removeClass('active');
          $wrap.removeClass('active');
        } else {
          $nav.addClass('active');
          if( that.$window.outerWidth() > 992 ) {
            $wrap.addClass('active');
            $wrap.find('.title__background').css('height',lineHeight);
            if(that.$window.outerWidth() <= 576) {
              that.$body.addClass('no-scroll');
            }

            if (typeof ThemeNote != "undefined") {
              ThemeNote.closeAllNote();
            }
          }
        }
      });

      // Close when bosy is clikked.
      that.$body.on('click' , function(event){
        var $nav = that.$title.closest('.chapter-header').find('.chapter-nav__list--hidden');
        if( !$('.chapter-header').has(event.target).length > 0 ) {
          $('.chapter-nav__list--hidden').removeClass('active');
          $('.title-wrap').removeClass('active');
        }
      });

    }
  }
})(jQuery);

},{}],5:[function(require,module,exports){
// Keywords Tooltip
module.exports = ThemeToolTip = (function ($) {
  var that;

  return {

    $: {
      btn: $('#doc-content .reference.internal'),
      $btnKeywords : {},
      $btnGlossay: {},
      docWindow: $( window ),
      $body: $('body'),
      toolTipArray: [],
      toolTipArrayKeywords: [],
      toolTipNote: [],

      $noteBtn: $('.footnote-reference'),
      $note: $('.docutils.footnote'),
      $tableNoteBtn: {}
    },

    init: function() {
      that = this.$;
      // Tolltip keywords
      that.$btnKeywords = that.btn.filter(function(){
        return ($(this).closest('.pull-quote').length)
      });
      // Tolltip glossary
      that.$btnGlossay = that.btn.filter(function(){
        return ($(this).closest('.pull-quote').length == 0)
      });
      // Tolltip inside Table
      that.$tableNoteBtn = that.$noteBtn.filter(function(){
        return ( $(this).closest('table').length  )
      });

      ThemeToolTip.addAttribute();

      // ThemeNote.setTollTip();
    },

    // Add atribute to keywords btn for enable tooltip
    addAttribute: function() {
      that.$btnKeywords.each(function(index) {
        var title = $(this).find('span').html();
        $(this).attr('data-toggle','popover').attr('tabindex',index).attr('data-placement','top').attr('role','button').attr('data-trigger','focus').attr('data-html','true').attr('title',title).attr('data-ref',index);
        that.toolTipArray.push(new ThemeToolTip.setData($(this),index));
      });

      that.$btnGlossay.each(function(index) {
        var title = $(this).find('span').html();
        $(this).attr('data-toggle','popover').attr('tabindex',index).attr('data-placement','top').attr('role','button').attr('data-trigger','focus').attr('data-html','true').attr('title',title).attr('data-ref',index);
        that.toolTipArrayKeywords.push(new ThemeToolTip.setDataKeywords($(this),index,title));
      });

      that.$tableNoteBtn.each(function(index) {
        var title = $(this).text();
        $(this).attr('data-toggle','popover').attr('tabindex',index).attr('data-placement','top').attr('role','button').attr('data-trigger','focus').attr('data-html','true').attr('title',title).attr('data-ref',index);
        that.toolTipNote.push(new ThemeToolTip.setDataNote($(this),index));
      });

      ThemeToolTip.addhandler();
    },

    // Set array whith keywords btn info
    setData: function(item , index) {
      this.btn = item;
      this.term = item.attr('href');
      this.title = $(this.term).html();
      this.body = $(this.term).next('dd').html();
      this.ref = index
    },

    // Set array whith keywords btn info
    setDataKeywords: function(item , index , title) {
      this.btn = item;
      this.term = item.attr('href');
      this.title = title;
      this.ref = index
    },

    // Set array whith note info
    setDataNote: function(item , index) {
      this.btn = item;
      this.href = item.attr('href').replace('#','');
      this.note = $('#' + this.href );
      this.title = this.note.find('.fn-backref').text();
      this.body = this.note.find('td:nth-of-type(2)').html();
      this.ref = index
    },

    // Enable toottip custom
    addhandler: function() {
      for (var index = 0; index < that.toolTipArray.length; ++index) {
        var toolTipTemplate = "<div class='tooltip tooltip--active doc-tooltip' role='tooltip'><div class='tooltip__wrap'>" +
            "<button type='button' role='button' class='tooltip__close-btn' data-ref=" + that.toolTipArray[index].ref + "></button>" +
            "<h2 class='tooltip__title'>" + that.toolTipArray[index].title + "</h2>" +
            "<p class='tooltip__content'>" + that.toolTipArray[index].body + "</p>" +
            "</div></div>",
            btn = that.toolTipArray[index].btn;
        btn.popover({template:toolTipTemplate,offset:'115px , 40px',container: btn});
      };

      for (var index = 0; index < that.toolTipArrayKeywords.length; ++index) {
        var toolTipTemplate = "<div class='tooltip tooltip--active doc-tooltip' role='tooltip'><div class='tooltip__wrap'>" +
            "<button type='button' role='button' class='tooltip__close-btn' data-ref=" + that.toolTipArrayKeywords[index].ref + "></button>" +
            "<h2 class='tooltip__title'>" + that.toolTipArrayKeywords[index].title + "</h2>" +
            // "<p class='tooltip__content'>" + that.toolTipArrayKeywords[index].body + "</p>" +
            "<h2 class='tooltip__link'>" + "vai al Glossario"+ "</h2>" +
            "</div></div>",
            btn = that.toolTipArrayKeywords[index].btn;
        btn.popover({template:toolTipTemplate,offset:'125px , 40px',container: btn});
      };

      for (var index = 0; index < that.toolTipNote.length; ++index) {
        var toolTipTemplate = "<div class='tooltip tooltip--active doc-tooltip doc-tooltip--note' role='tooltip'><div class='tooltip__wrap'>" +
            "<button type='button' role='button' class='tooltip__close-btn' data-ref=" + that.toolTipNote[index].ref + "></button>" +
            "<h2 class='tooltip__title'>" + that.toolTipNote[index].title + "</h2>" +
            "<p class='tooltip__content'>" + that.toolTipNote[index].body + "</p>" +
            "</div></div>",
            btn = that.toolTipNote[index].btn;
        btn.popover({template:toolTipTemplate,container: btn});
      };

      that.$tableNoteBtn.on('click' , function(event){
        event.preventDefault();
      });

      that.$btnKeywords.on('click' , function(event){
        event.preventDefault();
      });

      that.$btnGlossay.on('click' , function(event){
        event.preventDefault();
      });

      $(document).on('click','.tooltip__close-btn', function(e){
        $(e.target).blur();
      });

    }
  }
})(jQuery);

},{}]},{},[1,2,3,4,5]);
