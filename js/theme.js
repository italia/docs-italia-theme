require=(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({"docs-italia-theme":[function(require,module,exports){
// Keywords Tolltip
var ThemeToolTip = (function ($) {
  var that;

  return {

    $: {
      btn: $('.pull-quote .reference.internal'),
      docWindow: $( window ),
      $body: $('body'),
      toolTipArray: []
    },

    init: function() {
      that = this.$;
      ThemeToolTip.addAttribute();
    },

    // Add atribute to keywords btn for enable tooltip
    addAttribute: function() {
      that.btn.each(function(index) {
        var title = $(this).find('span').html();
        $(this).attr('data-toggle','tooltip').attr('data-html','true').attr('title',title).attr('data-ref',index);
        that.toolTipArray.push(new ThemeToolTip.setData($(this),index));
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

    // Enable toottip custom
    addhandler: function() {
      for (var index = 0; index < that.toolTipArray.length; ++index) {
        var toolTipTemplate = "<div class='tooltip tooltip--active doc-tooltip' role='tooltip'><div class='tooltip__wrap'>" +
            "<button type='button' class='tooltip__close-btn' data-ref=" + that.toolTipArray[index].ref + "></button>" +
            "<h2 class='tooltip__title'>" + that.toolTipArray[index].title + "</h2>" +
            "<p class='tooltip__content'>" + that.toolTipArray[index].body + "</p>" +
            "</div></div>";
            btn = that.toolTipArray[index].btn;
        btn.tooltip({template:toolTipTemplate,trigger:'click', placement:'top',offset:'115px , 40px'});
      };

      // Close toolTip from button.
      $(document).on('click','.tooltip__close-btn', function(){
        var ref = $(this).attr('data-ref');
            btn = that.btn.filter(function(){
              return ($(this).attr("data-ref") == ref)
             });
        btn.tooltip('hide');
      });

      // Close other btn when one is active.
      that.btn.on('click' , function(){
        that.btn.not($(this)).tooltip('hide');
      });

      // Hide tool tip on resize
      that.docWindow.resize(function() {
        that.btn.tooltip('hide');
      });

      // Hide tool tip when body is clickked
      that.$body.on('click' , function(event) {
        if( !$('.tooltip').has(event.target).length > 0 && !$(event.target).is($('.std-term'))) {
          that.btn.tooltip('hide');
        }
      });
    }
  }
})(jQuery);

ThemeToolTip.init();


/// Modify DOM via JS.
var ThemeMarkupModifier = (function ($) {
  var that;

  return {

    $: {
      title: $('#doc-content h1, #doc-content h2, #doc-content h3'),
      $table: $('table:not(.footnote)'),
      $captionReference: $('table, .figure')
    },

    init: function() {
      that = this.$;
      ThemeMarkupModifier.titleModifier();
      ThemeMarkupModifier.tableModifier()
      ThemeMarkupModifier.captionModifier()
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
      })
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
          $reference.prepend('<div class="reference-icon u-text-r-l Icon Icon-link"></div>')
          $p.addClass('reference--wrap')
          $caption.wrap('<div class="caption-wrap">');
          $caption.closest('.caption-wrap').append($p);
        }
        });

      }
    }
  }
})(jQuery);

ThemeMarkupModifier.init();


/// Paragraph navigation
var ThemeChapterNav = (function ($) {
  var that;

  return {

    $: {
      $title: $('.chapter-header.has-nav h1,.chapter-header.has-nav h2,.chapter-header.has-nav h3'),
      $body: $('body'),
      $html: $('html'),
      $window: $(window)
    },

    init: function() {
      that = this.$;
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
          "<span class='u-text-r-l Icon Icon-comment'></span>" +
          "<button type='button' class='chapter-link'><span>4</span> commenti</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-more-items'></span>" +
          "<button type='button' class='chapter-link chapter-link--expand'>Vedi Azioni</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-more-items'></span>" +
          "<button type='button' class='chapter-link chapter-link--expand'>Altre Azioni</button></li></ul>" +
          "<div class='chapter-nav__list--hidden'>" +
          "<ul class='chapter-nav__list'>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-link'></span>" +
          "<button type='button' class='chapter-link'>Copia link</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-share'></span>" +
          "<button type='button' class='chapter-link'>Confronta versioni</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-share'></span>" +
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
          $wrap.addClass('active');
          $wrap.find('.title__background').css('height',lineHeight);
          if(that.$window.outerWidth() <= 576) {
            that.$body.addClass('no-scroll');
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

ThemeChapterNav.init();

},{}]},{},["docs-italia-theme"]);
