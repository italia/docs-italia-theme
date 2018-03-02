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

window.removeResizeListener = function(element, fn){
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
        if (attachEvent) element.detachEvent('onresize', resizeListener);
        else {
            element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
            element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
        }
    }
};

window.addResizeListener = function(element, fn){
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
};



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

    window.addResizeListener(myElement, onResize);

    $(window).on('load resize scroll', onResize);


    $('.version-list').on('change', function (e) {
        window.location = $(this).val();
    });

    $('.js-preventOffCanvasClose').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

});