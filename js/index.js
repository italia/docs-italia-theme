global.$ = global.jQuery = require('jquery');
global.Popper = require('popper.js');
require('bootstrap-italia');

var themeMarkupModifier = require('./markup_modifier.js');
var themeToolTip = require('./tooltip.js');
var themeChapterNav = require('./section_navigation.js');
var themeNote = require('./note.js');
var themeTranslate = require('./theme_translate.js');
var themeGlossary = require('./get_glossary.js');
var themeAdmonitionToggle = require('./admonition_toggle.js');


// Init all
$(document).ready(function() {

  themeGlossary.init(glossayReady.bind(this));
  themeTranslate.init();
  themeMarkupModifier.init();
  themeChapterNav.init();
  themeNote.init();
  themeAdmonitionToggle.init();

  // Load tooltips when the ajax request for glossary terms is completed.
  function glossayReady() {
    themeToolTip.init();
  }

});
