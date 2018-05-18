var ThemeMarkupModifier = require('./markup_modifier.js');
var ThemeToolTip = require('./tooltip.js');
var ThemeChapterNav = require('./section_navigation.js');
var ThemeNote = require('./note.js');
var themeTranslate = require('./theme_translate.js');

// Init all
$(document).ready(function() {
  themeTranslate.init();
  ThemeMarkupModifier.init();
  ThemeToolTip.init();
  ThemeChapterNav.init();
  ThemeNote.init();
});
