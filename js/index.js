global.$ = global.jQuery = require('jquery');
global.Popper = require('popper.js');
require('modernizr');
require('bootstrap-italia');


var themeMarkupModifier = require('./markup_modifier.js');
var themeToolTip = require('./tooltip.js');
var themeChapterNav = require('./section_navigation.js');
var themeNote = require('./note.js');
var themeGlossary = require('./get_glossary.js');
var themeAdmonitionToggle = require('./admonition_toggle.js');
var themeActiveVersions = require('./active_versions.js');
var themeCopyToClipboard = require('./copy_to_clipboard.js');
var themeSidebarNav = require('./sidebar_nav.js');
var themeGlossaryPage = require('./glossary_page.js');
var themeScrollProgressBar = require('./scroll_progressbar.js');
var themeStickyHeader = require('./sticky_header.js');
var themeOffcanvasFeature = require('./offcanvas_feature.js');
var themeSearchboxCollapse = require('./searchbox_collapse.js');
var forumItalia = require('./forum_italia.js');

// Init all
$(document).ready(function() {

  themeGlossary.init(glossaryReady.bind(this));
  themeMarkupModifier.init();
  themeChapterNav.init();
  themeNote.init();
  themeAdmonitionToggle.init();
  themeSidebarNav.init();
  themeGlossaryPage.init();
  themeCopyToClipboard.init();
  themeActiveVersions.init();
  themeScrollProgressBar.init();
  themeStickyHeader.init();
  themeOffcanvasFeature.init();
  themeSearchboxCollapse.init();
  forumItalia.init();

  // Load tooltips when the ajax request for glossary terms is completed.
  function glossaryReady() {
    themeToolTip.init();
  }
});
