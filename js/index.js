global.$ = global.jQuery = require('jquery');
global.Popper = require('popper.js');
require('bootstrap-italia');
require('modernizr');

var themeMarkupModifier = require('./markup_modifier.js');
var themeToolTip = require('./tooltip.js');
var themeChapterNav = require('./section_navigation.js');
var themeNote = require('./note.js');
var themeTranslate = require('./theme_translate.js');
var themeGlossary = require('./get_glossary.js');
var themeAdmonitionToggle = require('./admonition_toggle.js');
var themeCopyToClipboard = require('./copy_to_clipboard.js');
var themeSidebarNav = require('./sidebar_nav.js');
var themeGlossaryPage = require('./glossary_page.js');
var themeComments = require('./comments.js');

// Init all
$(document).ready(function() {

  themeGlossary.init(glossayReady.bind(this));
  themeTranslate.init();
  themeMarkupModifier.init();
  themeChapterNav.init();
  themeNote.init();
  themeAdmonitionToggle.init();
  themeSidebarNav.init();
  themeGlossaryPage.init();
  themeCopyToClipboard.init();
  themeComments.init();

  // Load tooltips when the ajax request for glossary terms is completed.
  function glossayReady() {
    themeToolTip.init();
  }

});
