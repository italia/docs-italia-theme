// Tooltips
module.exports = themeToolTip = (function ($) {
  var that;

  return {

    $: {
      btn: $('#doc-content .reference.internal'),
      $btnKeywords : {},
      $btnGlossay: {},
      docWindow: $( window ),
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
      that.$btnKeywords = that.btn.filter(function(){
        return ($(this).closest('.pull-quote').length)
      });
      // Tooltip glossary
      that.$btnGlossay = that.btn.filter(function(){
        return ($(this).closest('.pull-quote').length == 0)
      });
      // Tooltip inside Table
      that.$tableNoteBtn = that.$noteBtn.filter(function(){
        return ( $(this).closest('table').length  )
      });

      themeToolTip.addAttribute();

      // themeNote.setToolTip();
    },

    // Add attribute to keywords btn for enable tooltip
    addAttribute: function() {
      that.$btnKeywords.each(function(index) {
        var title = $(this).find('span').html();
        $(this).attr('data-toggle','popover').attr('tabindex',index).attr('data-placement','top').attr('role','button').attr('data-trigger','focus').attr('data-html','true').attr('title',title).attr('data-ref',index);
        that.toolTipArrayKeywords.push(new themeToolTip.setDataKeywords($(this),index));
      });

      that.$btnGlossay.each(function(index) {
        var title = $(this).find('span').html();
        $(this).attr('data-toggle','popover').attr('tabindex',index).attr('data-placement','top').attr('role','button').attr('data-trigger','focus').attr('data-html','true').attr('title',title).attr('data-ref',index);
        that.toolTipArrayGlossary.push(new themeToolTip.setDataGlossary($(this),index,title));
      });

      that.$tableNoteBtn.each(function(index) {
        var title = $(this).text();
        $(this).attr('data-toggle','popover').attr('tabindex',index).attr('data-placement','top').attr('role','button').attr('data-trigger','focus').attr('data-html','true').attr('title',title).attr('data-ref',index);
        that.toolTipArrayNote.push(new themeToolTip.setDataNote($(this),index));
      });

      themeToolTip.addhandler();
    },

    // Set array whith keywords btn info
    setDataKeywords: function(item , index) {
      this.btn = item;
      this.term = item.attr('href');
      this.title = $(this.term).html();
      this.body = $(this.term).next('dd').html();
      this.ref = index
    },

    // Set array whith keywords btn info
    setDataGlossary: function(item , index , title) {
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

    // Enable tooltip custom
    addhandler: function() {
      for (var index = 0; index < that.toolTipArrayKeywords.length; ++index) {
        var toolTipTemplate = "<div class='tooltip tooltip--active doc-tooltip' role='tooltip'><div class='tooltip__wrap'>" +
            "<button type='button' role='button' class='tooltip__close-btn' data-ref=" + that.toolTipArrayKeywords[index].ref + "></button>" +
            "<h2 class='tooltip__title'>" + that.toolTipArrayKeywords[index].title + "</h2>" +
            "<p class='tooltip__content'>" + that.toolTipArrayKeywords[index].body + "</p>" +
            "</div></div>",
            btn = that.toolTipArrayKeywords[index].btn;
        btn.popover({template:toolTipTemplate,offset:'115px , 40px',container: btn});
      };

      // Glossary popover
      for (var index = 0; index < that.toolTipArrayGlossary.length; ++index) {
        var glossaryFounded = false,
            summary = '',
            trimmedSummary = '',
            btnToGlossary = '';

        // Check if glossary term exist, if not replace default text and hide link.
        if ( themeToolTip.validateGlossaryData(index) ) {
          summary = themeGlossary.getGlossay()[that.toolTipArrayGlossary[index].title];
          trimmedSummary = summary.substr(0 , 90);
          trimmedSummary = trimmedSummary.substr(0, Math.min(trimmedSummary.length, trimmedSummary.lastIndexOf(" "))) + ' ...'
          btnToGlossary = "<a class='tooltip__link' href=" + that.toolTipArrayGlossary[index].term + " + title=" + that.toolTipArrayGlossary[index].title + ">" +
          themeTranslate.getTranslation().goToGlossay + "</a>";
        } else {
          trimmedSummary = themeTranslate.getTranslation().glossayEmpty;
        }

        var toolTipTemplate = "<div class='tooltip tooltip--active doc-tooltip' role='tooltip'><div class='tooltip__wrap'>" +
            "<button type='button' role='button' class='tooltip__close-btn' data-ref=" + that.toolTipArrayGlossary[index].ref + "></button>" +
            "<h2 class='tooltip__title'>" + that.toolTipArrayGlossary[index].title + "</h2>" +
            "<p class='tooltip__content'>" +  trimmedSummary + "</p>" + btnToGlossary +
            "</div></div>",
            btn = that.toolTipArrayGlossary[index].btn;
        btn.popover({template:toolTipTemplate,offset:'125px , 40px',container: btn});
      };

      // Note Popover.
      for (var index = 0; index < that.toolTipArrayNote.length; ++index) {
        var toolTipTemplate = "<div class='tooltip tooltip--active doc-tooltip doc-tooltip--note' role='tooltip'><div class='tooltip__wrap'>" +
            "<button type='button' role='button' class='tooltip__close-btn' data-ref=" + that.toolTipArrayNote[index].ref + "></button>" +
            "<h2 class='tooltip__title'>" + that.toolTipArrayNote[index].title + "</h2>" +
            "<p class='tooltip__content'>" + that.toolTipArrayNote[index].body + "</p>" +
            "</div></div>",
            btn = that.toolTipArrayNote[index].btn;
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

      $(document).on('click','.tooltip__link', function(event){
        event.preventDefault();
        var href = $(event.target).attr('href');
        window.location.href = href;
      });

      $(document).on('click','.tooltip__close-btn', function(event){
        $(event.target).blur();
      });
    },

    validateGlossaryData: function(index) {
      if ( themeGlossary.getGlossay()[that.toolTipArrayGlossary[index].title] != undefined ) {
        return true
      } else {
        return false
      }
    }

  }
})(jQuery);
