var $tpl = require('./getTpl');

// Tooltips
module.exports = themeToolTip = (function($) {
  var that;

  return {

    $: {
      btn: $('#doc-content .reference.internal').not('.download'),
      $btnKeywords: {},
      $btnGlossary: {},
      docWindow: $(window),
      $body: $('body'),
      toolTipArrayKeywords: [],
      toolTipArrayGlossary: [],
      toolTipArrayNote: [],
      $noteBtn: $('.footnote-reference'),
      $note: $('.docutils.footnote'),
      $tableNoteBtn: {}
    },

    init: function() {
      that = this.$;
      // Tooltip keywords
      that.$btnKeywords = that.btn.filter(function() {
        return ($(this).closest('.pull-quote').length)
      });
      // Tooltip glossary
      that.$btnGlossary = that.btn.filter(function() {
        return ($(this).closest('.pull-quote').length == 0 && $(this).find('.xref').length)
      });
      // Tooltip inside Table
      that.$tableNoteBtn = that.$noteBtn.filter(function() {
        return ($(this).closest('table').length)
      });

      themeToolTip.addAttribute();
      themeToolTip.setPopOver();
      themeToolTip.addHandler();
    },

    getDesktop: function() {
      if ($(window).width() > 1200) {
        return true;
      } else {
        return false;
      }
    },

    getTablet: function() {
      if ($(window).width() < 1199 && $(window).width() > 576) {
        return true;
      } else {
        return false;
      }
    },

    // Add attribute to keywords btn for enable tooltip
    addAttribute: function() {
      that.$btnKeywords.each(function(index) {
        var title = $(this).find('span').html();
        $(this).attr('data-toggle', 'popover').attr('tabindex', index).attr('role', 'button').attr('data-trigger', 'manual').attr('data-html', 'true').attr('title', title).attr('data-ref', index);
        if (themeToolTip.getDesktop()) {
          $(this).attr('data-placement', 'top');
        }
        that.toolTipArrayKeywords.push(new themeToolTip.setDataKeywords($(this), index));
      });

      that.$btnGlossary.each(function(index) {
        var title = $(this).attr('href'),
          hashIndex = title.indexOf("#"),
          title = title.substring(hashIndex + 1, title.length).replace('term-', '');

        $(this).attr('data-toggle', 'popover').attr('tabindex', index).attr('role', 'button').attr('data-trigger', 'manual').attr('data-html', 'true').attr('title', title).attr('data-ref', index);
        if (themeToolTip.getDesktop()) {
          $(this).attr('data-placement', 'top');
        }
        that.toolTipArrayGlossary.push(new themeToolTip.setDataGlossary($(this), index, title));
      });

      that.$tableNoteBtn.each(function(index) {
        var title = $(this).text();
        $(this).attr('data-toggle', 'popover').attr('tabindex', index).attr('role', 'button').attr('data-trigger', 'manual').attr('data-html', 'true').attr('title', title).attr('data-ref', index);
        if (themeToolTip.getDesktop()) {
          $(this).attr('data-placement', 'top')
        }
        that.toolTipArrayNote.push(new themeToolTip.setDataNote($(this), index));
      });
    },

    // Set array whith keywords btn info
    setDataKeywords: function(item, index) {
      this.btn = item;
      this.term = item.attr('href');
      this.title = $(this.term).html();
      this.body = $(this.term).next('dd').html();
      this.ref = index;
    },

    // Set array whith keywords btn info
    setDataGlossary: function(item, index, title) {
      this.btn = item;
      this.term = item.attr('href');
      this.title = title;
      this.ref = index;
    },

    // Set array whith note info
    setDataNote: function(item, index) {
      this.btn = item;
      this.href = item.attr('href').replace('#', '');
      this.note = $('#' + this.href);
      this.title = this.note.find('.fn-backref').text();
      this.body = this.note.find('td:nth-of-type(2)').html();
      this.ref = index;
    },

    // Enable tooltip custom
    setPopOver: function() {
      // Keywords popover
      for (var index = 0; index < that.toolTipArrayKeywords.length; ++index) {
        var toolTipTemplate = $tpl({
            item: that.toolTipArrayKeywords[index]
          }, 'tooltip__main'),
          btn = that.toolTipArrayKeywords[index].btn;

        if (themeToolTip.getDesktop()) {
          btn.popover({
            template: toolTipTemplate,
            offset: '115px , 40px',
            container: btn
          });
        } else if (themeToolTip.getTablet()) {
          btn.popover({
            template: toolTipTemplate,
            container: btn
          });
        } else {
          btn.popover({
            template: toolTipTemplate,
            offset: '-160px , 0',
            container: btn
          });
        }
      };

      // Glossary popover
      for (var index = 0; index < that.toolTipArrayGlossary.length; ++index) {
        var glossaryFounded = false,
          summary = '',
          trimmedSummary = '',
          btnToGlossary = '';

        // Check if glossary term exist, if not replace default text and hide link.
        if (themeToolTip.validateGlossaryData(index)) {
          summary = themeGlossary.getGlossary()[that.toolTipArrayGlossary[index].title];
          trimmedSummary = summary.substr(0, 90);
          trimmedSummary = trimmedSummary.substr(0, Math.min(trimmedSummary.length, trimmedSummary.lastIndexOf(" "))) + ' ...'
          btnToGlossary = "<a class='tooltip__link' href=" + that.toolTipArrayGlossary[index].term + " + title=" + that.toolTipArrayGlossary[index].title + ">" + t.go_to_glossary + "</a>";
        } else {
          trimmedSummary = t.glossary_empty;
        }

        var toolTipTemplate = $tpl({
            item: that.toolTipArrayGlossary[index],
            trimmedSummary: trimmedSummary,
            btnToGlossary: btnToGlossary
          }, 'tooltip__glossary'),
          btn = that.toolTipArrayGlossary[index].btn;

        if (themeToolTip.getDesktop()) {
          btn.popover({
            template: toolTipTemplate,
            offset: '125px , 40px',
            container: btn
          });
        } else if (themeToolTip.getTablet()) {
          btn.popover({
            template: toolTipTemplate,
            container: btn
          });
        } else {
          btn.popover({
            template: toolTipTemplate,
            offset: '-160px , 0',
            container: btn
          });
        }
      };

      // Note Popover.
      for (var index = 0; index < that.toolTipArrayNote.length; ++index) {
        var toolTipTemplate = $tpl({
            item: that.toolTipArrayNote[index]
          }, 'tooltip__note'),
          btn = that.toolTipArrayNote[index].btn;
        btn.popover({
          template: toolTipTemplate,
          container: btn
        });
      };
    },

    addHandler: function() {
      $('[data-trigger="manual"]').click(function() {
        if ($('.tooltip').has(event.target).length) return;
        event.preventDefault();

        if ($(this).find('.tooltip').length > 0) {
          $(this).popover('hide');
        } else {
          $(this).popover('show');
        }
      }).blur(function() {
        $(this).popover('hide');
      });

      $(document).on('click', '.tooltip__close-btn', function(event) {
        $('[data-trigger="manual"]').popover('hide');
      });

      $(document).on('click', '.tooltip__link', function(event) {
        event.preventDefault();
        var href = $(event.target).attr('href');
        window.location.href = href;
      });
    },

    validateGlossaryData: function(index) {
      if (themeGlossary.getGlossary()[that.toolTipArrayGlossary[index].title] != undefined) {
        return true
      } else {
        return false
      }
    }

  }
})(jQuery);