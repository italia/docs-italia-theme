// Copy to clipboard
module.exports = themeCopyToClipboard = (function ($) {
  var that;

  return {

    $: {
      $captionLink: {},
      $navLink: {},
      $glossaryLink: {}
    },

    init: function() {
      that = this.$;
      var $iconLink = $('.it-link');

      // Caption
      that.$captionLink = $iconLink.closest('.reference.internal');
      that.$captionLink.on('click', themeCopyToClipboard.copyCaption)

      that.$navLink = $iconLink.closest('.chapter-nav__item');
      that.$navLink.on('click', themeCopyToClipboard.copyNav)

      that.$glossaryLink = $('.glossary-page__copy-link');
      that.$glossaryLink.on('click', themeCopyToClipboard.copyGlossaryLink)
    },

    copyCaption: function(event) {
      event.preventDefault();

      var $btn =  $(event.target).closest('a'),
          location = themeCopyToClipboard.getWindowLocation(),
          $span = $btn.find('span');

      // Add current hashtag
      location += $btn.attr('href');
      themeCopyToClipboard.copyToClipboard(location, $span);
    },

    copyNav: function(event) {
      event.preventDefault();

      var $el = $(this).find('.chapter-link'),
          $section = $el.closest('.section'),
          location = themeCopyToClipboard.getWindowLocation();

      // Add current hashtag
      location += '#' + $section.attr('id');
      themeCopyToClipboard.copyToClipboard(location, $el);
    },

    copyGlossaryLink: function(event) {
      event.preventDefault();

      var $el = $(event.target),
          $dt = $el.closest('dd').prev('dt'),
          location = themeCopyToClipboard.getWindowLocation();

      // Add current hashtag
      location += '#' + $dt.attr('id');
      themeCopyToClipboard.copyToClipboard(location, $el);
    },

    getWindowLocation: function() {
      var location = window.location.href,
          hashtagIndex = location.indexOf("#");

      // Clear previous hashtag
      if( hashtagIndex != -1) location = location.substring(0,hashtagIndex);
      return location;
    },

    copyToClipboard: function(text, $button) {
      if (window.clipboardData && window.clipboardData.setData) {
             return clipboardData.setData("Text", text);

      } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
         var textarea = document.createElement("textarea");
         textarea.textContent = text;
         textarea.style.position = "fixed";
         document.body.appendChild(textarea);
         textarea.select();
         try {
             return document.execCommand("copy");
         } catch (ex) {
             return false;
         } finally {
            document.body.removeChild(textarea)

            $button.html(t.copied_link);
            setTimeout(function(){
              $button.html(t.copy_link);
            }, 3000);
         }
      }
    }
  }

})(jQuery);
