require=(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var attachEvent = document.attachEvent;
var isIE = navigator.userAgent.match(/Trident/);
var requestFrame = (function(){
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){ return window.setTimeout(fn, 20); };
    return function(fn){ return raf(fn); };
})();

var cancelFrame = (function(){
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
        window.clearTimeout;
    return function(id){ return cancel(id); };
})();

function resizeListener(e){
    var win = e.target || e.srcElement;
    if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
    win.__resizeRAF__ = requestFrame(function(){
        var trigger = win.__resizeTrigger__;
        trigger.__resizeListeners__.forEach(function(fn){
            fn.call(trigger, e);
        });
    });
}

function objectLoad(e){
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
}

module.exports = {
    removeResizeListener: function(element, fn){
        element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
        if (!element.__resizeListeners__.length) {
            if (attachEvent) element.detachEvent('onresize', resizeListener);
            else {
                element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
                element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
            }
        }
    },

    addResizeListener: function(element, fn){
        if (!element.__resizeListeners__) {
            element.__resizeListeners__ = [];
            if (attachEvent) {
                element.__resizeTrigger__ = element;
                element.attachEvent('onresize', resizeListener);
            }
            else {
                if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
                var obj = element.__resizeTrigger__ = document.createElement('object');
                obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
                obj.__resizeElement__ = element;
                obj.onload = objectLoad;
                obj.type = 'text/html';
                if (isIE) element.appendChild(obj);
                obj.data = 'about:blank';
                if (!isIE) element.appendChild(obj);
            }
        }
        element.__resizeListeners__.push(fn);
    }
};

},{}],"docs-italia-theme":[function(require,module,exports){
var resizeListener = require("./resize-listener.js");


var jQuery = (typeof(window) != 'undefined') ? window.jQuery : require('jquery');

// Sphinx theme nav state
function ThemeNav() {

    var nav = {
        navBar: null,
        win: null,
        winScroll: false,
        winResize: false,
        linkScroll: false,
        winPosition: 0,
        winHeight: null,
        docHeight: null,
        isRunning: false
    };

    nav.enable = function () {
        var self = this;

        if (!self.isRunning) {
            self.isRunning = true;
            jQuery(function ($) {
                self.init($);

                self.reset();
                self.win.on('hashchange', self.reset);

                // Set scroll monitor
                self.win.on('scroll', function () {
                    if (!self.linkScroll) {
                        self.winScroll = true;
                    }
                });
                setInterval(function () {
                    self.onScroll();
                }, 25);


                // Set resize monitor
                self.win.on('resize', function () {
                    self.winResize = true;
                });
                setInterval(function () {
                    if (self.winResize) self.onResize();
                }, 25);
                self.onResize();
            });
        }
        ;
    };

    nav.init = function ($) {
        var doc = $(document),
            self = this;

        this.navBar = $('div.wy-side-scroll:first');
        this.win = $(window);

        // Set up javascript UX bits
        $(document)
        // Shift nav in mobile when clicking the menu.
            .on('click', "[data-toggle='wy-nav-top']", function () {
                $("[data-toggle='wy-nav-shift']").toggleClass("shift");
                $("[data-toggle='rst-versions']").toggleClass("shift");
            })

            // Nav menu link click operations
            .on('click', ".wy-menu-vertical .current ul li a", function () {
                var target = $(this);
                // Close menu when you click a link.
                $("[data-toggle='wy-nav-shift']").removeClass("shift");
                $("[data-toggle='rst-versions']").toggleClass("shift");
                // Handle dynamic display of l3 and l4 nav lists
                self.toggleCurrent(target);
                self.hashChange();
            })
            .on('click', "[data-toggle='rst-current-version']", function () {
                $("[data-toggle='rst-versions']").toggleClass("shift-up");
            })

        // Make tables responsive
        $("table.docutils:not(.field-list)")
            .wrap("<div class='wy-table-responsive'></div>");

        // Add expand links to all parents of nested ul
        $('.wy-menu-vertical ul').not('.simple').siblings('a').each(function () {
            var link = $(this);
            expand = $('<span class="toctree-expand"></span>');
            expand.on('click', function (ev) {
                self.toggleCurrent(link);
                ev.stopPropagation();
                return false;
            });
            link.prepend(expand);
        });
    };

    nav.reset = function () {
        // Get anchor from URL and open up nested nav
        var anchor = encodeURI(window.location.hash);
        if (anchor) {
            try {
                var link = $('.wy-menu-vertical')
                    .find('[href="' + anchor + '"]');
                // If we didn't find a link, it may be because we clicked on
                // something that is not in the sidebar (eg: when using
                // sphinxcontrib.httpdomain it generates headerlinks but those
                // aren't picked up and placed in the toctree). So let's find
                // the closest header in the document and try with that one.
                if (link.length === 0) {
                    var doc_link = $('.document a[href="' + anchor + '"]');
                    var closest_section = doc_link.closest('div.section');
                    // Try again with the closest section entry.
                    link = $('.wy-menu-vertical')
                        .find('[href="#' + closest_section.attr("id") + '"]');

                }
                $('.wy-menu-vertical li.toctree-l1 li.current')
                    .removeClass('current');
                link.closest('li.toctree-l2').addClass('current');
                link.closest('li.toctree-l3').addClass('current');
                link.closest('li.toctree-l4').addClass('current');
            }
            catch (err) {
                console.log("Error expanding nav for anchor", err);
            }
        }
    };

    nav.onScroll = function () {
        this.winScroll = false;
        var newWinPosition = this.win.scrollTop(),
            winBottom = newWinPosition + this.winHeight,
            navPosition = this.navBar.scrollTop(),
            newNavPosition = navPosition + (newWinPosition - this.winPosition);
        if (newWinPosition < 0 || winBottom > this.docHeight) {
            return;
        }
        this.navBar.scrollTop(newNavPosition);
        this.winPosition = newWinPosition;
    };

    nav.onResize = function () {
        this.winResize = false;
        this.winHeight = this.win.height();
        this.docHeight = $(document).height();
    };

    nav.hashChange = function () {
        this.linkScroll = true;
        this.win.one('hashchange', function () {
            this.linkScroll = false;
        });
    };

    nav.toggleCurrent = function (elem) {
        var parent_li = elem.closest('li');
        parent_li.siblings('li.current').removeClass('current');
        parent_li.siblings().find('li.current').removeClass('current');
        parent_li.find('> ul li.current').removeClass('current');
        parent_li.toggleClass('current');
    }

    return nav;
};

module.exports.ThemeNav = ThemeNav();

if (typeof(window) != 'undefined') {
    window.SphinxRtdTheme = {StickyNav: module.exports.ThemeNav};
}

$(function () {

    var versionsBar = $('.js-versions-bar');
    var footer = $('.Footer');
    var header = $('.Header');

    var menuContainerElement = $('.js-menu-container');
    var menuElement = $('.js-menu');
    var menuInnerElement = $('.js-menu-inner');

    var myElement = document.getElementById('rst-content');
    var onResize = function (e) {

        if (window.innerWidth > 992) {
            var versionsBarHeight = versionsBar.outerHeight();
            var headerHeight = header.outerHeight();
            var sidebarWidth = menuContainerElement.width();

            var headerScrollHeight = (window.scrollY < headerHeight) ? window.scrollY : headerHeight;
            var headerScrollAmount = headerHeight - headerScrollHeight;

            var footerVisibleAmount = $(window).scrollTop() + $(window).height() - ($(document).height() - footer.outerHeight());
            var footerOffset = Math.max(0, footerVisibleAmount);

            // menu height è il valore minimo tra:
            // - lo spazio disponibile senza header, versionsBar e footer
            // - l'altezza di menuContainerElement (necessario quando lo schermo è molto grande e il footer è sopra la baseline del viewport)
            var menuHeight = Math.min(menuContainerElement.height(), window.innerHeight - headerScrollAmount - versionsBarHeight - footerOffset);

            menuElement.css({
                top: Math.floor(headerScrollAmount) + 'px',
                width: Math.floor(sidebarWidth) + 'px',
                height: Math.floor(menuHeight) + 'px'
            });

            versionsBar.toggleClass('u-fixedBottom', footerVisibleAmount < 0);

            if (e.type === "load") {

                // riposizionamento menu selezionato
                var currentElement = $('.toctree-l1.current');
                if (currentElement.length) {
                    menuInnerElement.animate({
                        scrollTop: currentElement.offset().top - menuInnerElement.offset().top
                    });
                }
            }
        } else {
            menuElement.css({
                top: 'auto',
                width: 'auto',
                height: 'auto'
            });
        }
    }

    resizeListener.addResizeListener(myElement, onResize);

    $(window).on('load resize scroll', onResize);


    $('.version-list').on('change', function (e) {
        window.location = $(this).val();
    });

    $('.js-preventOffCanvasClose').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });
    
});
},{"./resize-listener.js":1,"jquery":"jquery"}]},{},[1,"docs-italia-theme"]);
