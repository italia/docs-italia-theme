// Section navigation
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
          "<button type='button' class='chapter-link'><span class='chapter-link__counter'>4</span>" +
          "<span class='chapter-link__title'>" + themeTranslate.getComment() + "</span></button type='button'></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-more'></span>" +
          "<button type='button' class='chapter-link chapter-link--expand'>" + themeTranslate.getSeeAction() + "</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-more'></span>" +
          "<button type='button' class='chapter-link chapter-link--expand'>" + themeTranslate.getOtherActions() + "</button></li></ul>" +
          "<div class='chapter-nav__list--hidden'>" +
          "<ul class='chapter-nav__list'>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-link'></span>" +
          "<button type='button' class='chapter-link'>" + themeTranslate.getCopyLink() + "</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-compare'></span>" +
          "<button type='button' class='chapter-link'>" + themeTranslate.getCompareVersions() + "</button></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon it-icon-share'></span>" +
          "<button type='button' class='chapter-link'>" + themeTranslate.getShareMsg() + "</button>" +
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
