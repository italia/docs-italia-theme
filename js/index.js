global.$ = global.jQuery = require('jquery');
global.Popper = require('popper.js');
global.stickybits = require('stickybits');
// global.ResizeSensor = require('resize-sensor'); // needed by themeStickySidebar.
// require('sticky-sidebar')
require('bootstrap-italia');
require('modernizr');


var themeMarkupModifier = require('./markup_modifier.js');
var themeToolTip = require('./tooltip.js');
var themeChapterNav = require('./section_navigation.js');
var themeNote = require('./note.js');
var themeTranslate = require('./theme_translate.js');
var themeGlossary = require('./get_glossary.js');
var themeAdmonitionToggle = require('./admonition_toggle.js');
var themeActiveVersions = require('./active_versions.js');
var themeCopyToClipboard = require('./copy_to_clipboard.js');
var discourseAuth = require('./discourseAuth.js');
var discourseComments = require('./discourseComments.js');
var themeSidebarNav = require('./sidebar_nav.js');
var themeGlossaryPage = require('./glossary_page.js');
var themeScrollProgressBar = require('./scroll_progressbar.js');
var themeStickyHeader = require('./sticky_header.js');
var themeStickySidebar = require('./sticky_sidebar.js');
var themeOffcanvasFeature = require('./offcanvas_feature.js');
var themeSearchboxCollapse = require('./searchbox_collapse.js');
var themeScrollspy = require('./scrollspy.js');

// Init all
$(document).ready(function() {

  themeGlossary.init(glossayReady.bind(this));
  themeTranslate.init();
  themeMarkupModifier.init();
  themeChapterNav.init();
  themeNote.init();
  themeAdmonitionToggle.init();
  themeCopyToClipboard.init();
  themeSidebarNav.init();
  themeGlossaryPage.init();
  themeCopyToClipboard.init();
  themeActiveVersions.init();
  themeScrollProgressBar.init();
  themeStickyHeader.init();
  // themeStickySidebar.init();
  themeOffcanvasFeature.init();
  themeSearchboxCollapse.init();
  // themeScrollspy.init();

  // Load tooltips when the ajax request for glossary terms is completed.
  function glossayReady() {
    themeToolTip.init();
  }
});

window.onload = function() {
  var topicId = [];
  var $commentBox = $('ul.block-comments__list.items');

  if ($commentBox.length > 1) {
    $commentBox.each(function (idx, cB) {
      topicId.push($(cB).data('topic'));
    });
  } else {
    topicId = [$commentBox.first().data('topic')];
  }
  if (typeof topicId !== "undefined" || location.href.indexOf('payload') > 0) {
    discourseAuth.init(topicId).then(function() {
      discourseComments.init();
    });
  }
}
