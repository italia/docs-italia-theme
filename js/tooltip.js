// Keywords Tooltip
var ThemeToolTip = (function ($) {
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

$(document).ready(function() {
  ThemeToolTip.init();
});
