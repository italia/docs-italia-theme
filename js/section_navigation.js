// Section navigation
module.exports = themeSectionNav = (function ($) {
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
      $('.chapter-nav').remove();

      that.$title = $('.chapter-header.has-nav h1,.chapter-header.has-nav h2,.chapter-header.has-nav h3'),
      that.$title.each(function(index) {
        var $element = $(this),
            title = $element.html();
        themeSectionNav.addNav($element,title);
      });
      themeSectionNav.addHandler();
    },

    // Add navigation markdown, in case of mobile ( window width <=  991) the class for bootsrapp modale will be applied.
    addNav: function(element,title) {
      var modalClass = detectCModal(),
          modalContentClass = detectCModalContent(),
          modalContainerClass = detectCModalContainer(),
          nav = "<div class='chapter-nav'><div class='chapter-nav__wrap'>" +
          "<ul class='chapter-nav__list chapter-nav__list--visible'>" +
          // "<li class='chapter-nav__item'>" +
          // "<span class='Icon it-icon-comment'></span>" +
          // "<button type='button' class='chapter-link'><span class='chapter-link__counter'>4</span>" +
          // "<span class='chapter-link__title'>" + themeTranslate.getTranslation().comments + "</span></button type='button'></li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='Icon docs-icon-more'></span>" +
          "<button type='button' data-toggle='modal' class='chapter-link chapter-link--expand'>" + themeTranslate.getTranslation().seeActions + "</button></li>" +
          // "<li class='chapter-nav__item'>" +
          // "<span class='Icon it-icon-more'></span>" +
          // "<button type='button' data-toggle='modal' class='chapter-link chapter-link--expand'>" + themeTranslate.getTranslation().otherActions + "</button></li></ul>" +
          "<div class='" + modalClass + "chapter-nav__list--hidden' tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>" +
          "<div class='" + modalContainerClass + "'>" +
          "<div class='" + modalContentClass + " chapter-nav__list-wrap'>" +
          "<div class='chapter-nav__title'>" + title + "</div>" +
          "<ul class='chapter-nav__list'>" +
          "<li class='chapter-nav__item'>" +
          "<i class='it-link mr-2 align-middle'></i>" +
          "<button type='button' class='chapter-link'>" + themeTranslate.getTranslation().copyLink + "</button></li>" +
          // "<li class='chapter-nav__item'>" +
          // "<span class='Icon it-icon-compare'></span>" +
          // "<button type='button' class='chapter-link'>" + themeTranslate.getTranslation().compareVersions + "</button></li>" +
          // "<li class='chapter-nav__item'>" +
          // "<span class='Icon it-icon-share'></span>" +
          // "<button type='button' class='chapter-link'>" + themeTranslate.getTranslation().shareMsg + "</button></li>" +
          "</ul></div>" +
          "</div>" +
          "</div></div></div>";
      container = element.closest('.chapter-header');
      container.append(nav);

      function detectCModal(){
        if( that.$window.outerWidth() <=  991 ) {
          return 'modal fade ';
        } else {
          return '';
        }
      }

      function detectCModalContent(){
        if( that.$window.outerWidth() <=  991 ) {
          return 'modal-content ';
        } else {
          return '';
        }
      }

      function detectCModalContainer(){
        if( that.$window.outerWidth() <=  991 ) {
          return 'modal-dialog modal-dialog-centered modal-sm ';
        } else {
          return '';
        }
      }
    },

    addHandler: function(element) {
      // Display nav on mouseover ( desktop width no tochevents )
      $('.chapter-header.has-nav').on('mouseover' , function(){
        if (!Modernizr.touchevents && that.$window.outerWidth() > 992) {
          var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden'),
          $wrap = $(this).find('.title-wrap');
          lineHeight = parseInt($(this).find('.title-has-nav').css('line-height'))+2;

          $nav.addClass('active');
          $wrap.addClass('active');
          $wrap.find('.title__background').css('height',lineHeight);
        }
      });

      // Close nav on mouseout ( desktop width no tochevents )
      $('.chapter-header.has-nav').on('mouseout' , function(){
        if (!Modernizr.touchevents && that.$window.outerWidth() > 992) {
          var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden'),
              $wrap = $(this).find('.title-wrap');
          $nav.removeClass('active');
          $wrap.removeClass('active');
        }
      });

      // Display nav on click, dropdown on desktop and modal on mobile/tablet
      $('.chapter-link--expand').on('click' , function(){
        var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden'),
            $wrap = $(this).closest('.chapter-header').find('.title-wrap'),
            lineHeight = parseInt($(this).closest('.chapter-header').find('.title-has-nav').css('line-height'))+4;

        if( that.$window.outerWidth() > 992 ) {
          if( $nav.hasClass('active') ) {
            $nav.removeClass('active');
            $wrap.removeClass('active');
          }
          else {
            $nav.addClass('active');
            $wrap.addClass('active');
            $wrap.find('.title__background').css('height',lineHeight);
            if(that.$window.outerWidth() <= 576) {
              that.$body.addClass('no-scroll');
            }
          }
        } else if ( that.$window.outerWidth() <= 991 ) {
          var $modal = $(this).closest('.chapter-nav__wrap').find('.chapter-nav__list--hidden');
          $modal.modal('show')
        }
      });

      // Close when body is clikked ( Desktop with touchevents ).
      that.$body.on('click' , function(event){
        if ( Modernizr.touchevents && that.$window.outerWidth() > 992 ) {
          var $nav = that.$title.closest('.chapter-header').find('.chapter-nav__list--hidden');
          if( !$('.chapter-header').has(event.target).length > 0 ) {
            $('.chapter-nav__list--hidden').removeClass('active');
            $('.title-wrap').removeClass('active');
          }
        }
      });
    }
  }
})(jQuery);
