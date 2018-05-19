global.$ = global.jQuery = require('jquery');
global.Popper = require('popper.js');
require('bootstrap-italia');

var themeMarkupModifier = require('./markup_modifier.js');
var themeToolTip = require('./tooltip.js');
var themeChapterNav = require('./section_navigation.js');
var themeNote = require('./note.js');
var themeTranslate = require('./theme_translate.js');

// Init all
$(document).ready(function() {
  themeTranslate.init();
  themeMarkupModifier.init();
  themeToolTip.init();
  themeChapterNav.init();
  themeNote.init();
});
