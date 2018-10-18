var $tpl = require('./getTpl');

// Get glossary terms
module.exports = themeGlossaryPage = (function ($) {
  var that;

  return {

    $: {
      $letterBnt: $('#glossary-page .glossary.docutils dt'),
      $navLink: $('.sidebar-accordion-content a')
    },

    init: function() {
      that = this.$;
      var sectionid = document.title.toLowerCase(document.title);

      if( $('#glossary-page').length ) {
        themeGlossaryPage.buildAccordion();
        themeGlossaryPage.showRightTerm();

        // Detect url change and open the right term, use to detect the click on nav item ex: 'A' 'B' etc..
        $(window).bind('hashchange', function() {
         themeGlossaryPage.showRightTerm();
        });
      }
    },

    buildAccordion: function() {
      that.$letterBnt.each(function(index){
        var $btn = $(this),
            id = $btn.attr('id'),
            $target = $btn.next('dd'),
            $customBtn = $tpl({ id: id, text: $btn.text() }, 'glossary__btn');

        $btn.html($customBtn);
        $target.attr('id', 'glossary-' + id).attr('aria-labelledby' , id).addClass(themeGlossaryPage.showClass(index));
        $target.append($tpl({ copyLink: t.copy_link }, 'glossary__copy-link'));
      });
    },

    // Show first element is there is no anchor.
    showClass: function(index) {
      if (index == 0 && themeGlossaryPage.getWindowLocation() == undefined) {
        return 'pb-3 term-content collapse show'
      } else {
        return 'pb-3 term-content collapse'
      }
    },

    // Open the right accordion.
    // If there is an anchor in url open the first term found.
    showRightTerm: function() {

      // If there is an anchor in url open the right accordion.
      if( themeGlossaryPage.getWindowLocation() != undefined ) {
        var anchor = themeGlossaryPage.getWindowLocation().replace('#' , ''),
            $glossaryTarget = $('#glossary-' + anchor);

        // A) Find a real anchor ex: '#glossary-term-btimeam'.
        if( $glossaryTarget.length ) {
          $('#glossary-' + anchor).collapse('show');
          // call themeSidebarNav to open glossary accordion item
          themeSidebarNav.openGlossaryAccordion();

          var letter = $('#glossary-' + anchor).closest('.section').attr('id');
          // call themeSidebarNav to select nav item
          themeSidebarNav.selectCustomItem(letter);
        }

        // B) Find a letter anchor ex: '#a'.
        // Open the first term of letter.
        else if( themeGlossaryPage.getWindowLocation().length == 2 ) {
          $("#" + anchor + " dd:nth-of-type(1)").collapse('show');
        }
      }
    },

    getWindowLocation: function() {
      var location = window.location.href,
          hashtagIndex = location.indexOf("#");

      // Clear previous hashtag
      if ( hashtagIndex != -1) {
        location = location.substring(hashtagIndex,location.length);
        return location
      } else {
        return undefined
      }
    }
  }


})(jQuery);
