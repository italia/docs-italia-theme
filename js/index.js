var ThemeMarkupModifier = require('./markup_modifier.js');
var ThemeToolTip = require('./tooltip.js');
var ThemeChapterNav = require('./section_navigation.js');
var ThemeNote = require('./note.js');
var themeTranslate = require('./theme_translate.js');
var themeGlossary = require('./get_glossay.js');

// Init all
$(document).ready(function() {

  themeGlossary.init(glossayReady.bind(this));
  themeTranslate.init();
  ThemeMarkupModifier.init();
  ThemeChapterNav.init();
  ThemeNote.init();

  // Load tooltips when the ajax request for glossary terms is completed.
  function glossayReady() {
    ThemeToolTip.init();
  }

});
