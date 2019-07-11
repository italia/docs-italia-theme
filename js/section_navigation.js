var $tpl = require('./getTpl');

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

      that.$title = $('.chapter-header.has-nav h1, .chapter-header.has-nav h2, .chapter-header.has-nav h3'),
      that.$title.each(function(index) {
        var $element = $(this),
            title = $element.html();
        themeSectionNav.addNav($element,title);
      });
      themeSectionNav.addHandler();
    },

    // Add navigation markdown, in case of mobile (window width <=  991) the class for bootstrap modal will be applied.
    addNav: function(element,title) {
      var modalClass = detectCModal(),
          modalContentClass = detectCModalContent(),
          modalContainerClass = detectCModalContainer(),
          nav = $tpl({
            seeActions: t.see_actions,
            modalClass: modalClass,
            modalContainerClass: modalContainerClass,
            modalContentClass: modalContentClass,
            title: title,
            copyLink: t.copy_link
          }, 'section_navigation__nav');
      container = element.closest('.chapter-header');
      container.append(nav);

      function detectCModal(){
        if (Modernizr.touchevents && that.$window.outerWidth() <=  991) {
          return 'modal fade ';
        } else {
          return '';
        }
      }

      function detectCModalContent(){
        if (that.$window.outerWidth() <=  991) {
          return 'modal-content ';
        } else {
          return '';
        }
      }

      function detectCModalContainer(){
        if (that.$window.outerWidth() <=  991) {
          return 'modal-dialog modal-dialog-centered modal-sm ';
        } else {
          return '';
        }
      }
    },

    addHandler: function(element) {
      // Display nav on mouseover (desktop)
      $('.chapter-header.has-nav').on('mouseover', function() {
        if (!Modernizr.touchevents && that.$window.outerWidth() > 992) {
          var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden'),
          $wrap = $(this).find('.title-wrap');
          lineHeight = parseInt($(this).find('.title-has-nav').css('line-height'))+2;

          $nav.addClass('active');
          $wrap.addClass('active');
          $wrap.find('.title__background').css('height',lineHeight);
        }
      });

      // Close nav on mouseout (desktop)
      $('.chapter-header.has-nav').on('mouseout', function() {
        if (!Modernizr.touchevents && that.$window.outerWidth() > 992) {
          var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden'),
              $wrap = $(this).find('.title-wrap');
          $nav.removeClass('active');
          $wrap.removeClass('active');
        }
      });

      // Display nav on click, dropdown on desktop and modal on mobile/tablet
      $('.chapter-link--expand').on('click', function() {
        var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden'),
            $wrap = $(this).closest('.chapter-header').find('.title-wrap'),
            lineHeight = parseInt($(this).closest('.chapter-header').find('.title-has-nav').css('line-height'))+4;

        if (that.$window.outerWidth() > 992) {
          if ($nav.hasClass('active')) {
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
        } else if (that.$window.outerWidth() <= 991) {
          var $modal = $(this).closest('.chapter-nav__wrap').find('.chapter-nav__list--hidden');
          $modal.modal('show')
        }
      });

      // Close when body is clicked (desktop)
      that.$body.on('click', function(event){
        if (Modernizr.touchevents && that.$window.outerWidth() > 992) {
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
