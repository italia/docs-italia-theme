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
      title: $('#rst-content h1, #rst-content h2, #rst-content h3')
    },

    init: function() {
      that = this.$;
      ThemeMarkupModifier.titleModifier();
    },

    titleModifier: function() {
      that.title.each(function(index) {

        var $element = $(this),
            title = $element.html(),
            number = ThemeMarkupModifier.startingNumber(title);

        $element.wrap('<div class="chapter-header clearfix"><div class="title-wrap">');
        if( !ThemeMarkupModifier.dotNumberValidator(number) ) {
          $element.html(title.replace(number , '<span class="title__chapter">' + number + '</span>'));
          $element.addClass('has-nav');
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
    }
  }
})(jQuery);

ThemeMarkupModifier.init();


/// Paragraph navigation
var ThemeChapterNav = (function ($) {
  var that;

  return {

    $: {
      $title: $('h1.has-nav, h2.has-nav, h3.has-nav'),
      $body: $('body')
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
          "<ul class='chapter-nav__list'>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-comment'></span>" +
          "<button type='button' class='chapter-link'><span>4</span> commenti</button>" +
          "</li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-more-items'></span>" +
          "<button type='button' class='chapter-link chapter-link--expand'>Vedi Azioni</button>" +
          "</li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-more-items'></span>" +
          "<button type='button' class='chapter-link chapter-link--expand'>Altre Azioni</button>" +
          "</li></ul>" +
          "<ul class='chapter-nav__list chapter-nav__list--hidden'>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-link'></span>" +
          "<button type='button' class='chapter-link'>Copia link</button>" +
          "</li>" +
          "<li class='chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-share'></span>" +
          "<button type='button' class='chapter-link'>Confronta versioni</button>" +
          "</li>" +
          "<li class='chapter-link chapter-nav__item'>" +
          "<span class='u-text-r-l Icon Icon-share'></span>" +
          "<button type='button' class='chapter-link'>Condividi</button>" +
          "</li>" +
          "</ul></div></div>";
      container = element.closest('.chapter-header');
      container.append(nav);
    },

    addHandler: function(element) {
      var $expanded = $('.chapter-link--expand');

      that.$title.on('mouseover' , function(){
        var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden');
        $nav.addClass('active');
      });

      $expanded.on('click' , function(){
        var $nav = $(this).closest('.chapter-header').find('.chapter-nav__list--hidden');
        ($nav.hasClass('active')) ? $nav.removeClass('active') : $nav.addClass('active')
      });

      that.$body.on('click' , function(){
        var $nav = that.$title.closest('.chapter-header').find('.chapter-nav__list--hidden');
        if( !$('.chapter-header').has(event.target).length > 0 ) {
          $('.chapter-nav__list--hidden.active').removeClass('active');
        }
      });
    }
  }
})(jQuery);

ThemeChapterNav.init();
