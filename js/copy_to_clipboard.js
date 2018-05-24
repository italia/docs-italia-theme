// Copy to clipboard
module.exports = themeCopyToClipboard = (function ($) {
  var that;

  return {

    $: {
      $captionLink: {},
      $navLink: {}
    },

    init: function() {
      that = this.$;
      var $iconLink = $('.it-icon-link');

      // Caption
      that.$captionLink = $iconLink.closest('.reference.internal');
      that.$captionLink.on('click', themeCopyToClipboard.copyCaption)

      that.$navLink = $iconLink.closest('.chapter-nav');
      that.$navLink.on('click', themeCopyToClipboard.copyNav)
    },

    copyCaption: function(event) {
      event.preventDefault();

      var $btn =  $(event.target).closest('a'),
          location = themeCopyToClipboard.getWindowLocation();

      // Add current hashtag
      location += $btn.attr('href');
      themeCopyToClipboard.copyToClipboard(location);
    },

    copyNav: function() {
      event.preventDefault();

      var $section =  $(event.target).closest('.section'),
          location = themeCopyToClipboard.getWindowLocation();

      // Add current hashtag
      location += '#' + $section.attr('id');
      themeCopyToClipboard.copyToClipboard(location);
    },

    getWindowLocation: function() {
      var location = window.location.href,
          hashtagIndex = location.indexOf("#");

      // Clear previous hashtag
      if( hashtagIndex != -1) location = location.substring(0,hashtagIndex);
      return location;
    },

    copyToClipboard: function(text) {
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
            //  console.warn("Copy to clipboard failed.", ex);
             return false;
         } finally {
             document.body.removeChild(textarea);
         }
      }
    }
  }

})(jQuery);
