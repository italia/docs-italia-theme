$(function(){
    var versionsBar = $('.js-versions-bar');
    var footer = $('.Footer');
    $(window).on('load resize scroll',function(){
        $(window).scrollTop() + $(window).height() > $(document).height() - footer.outerHeight() ?
            versionsBar.removeClass('u-fixedBottom') :
            versionsBar.addClass('u-fixedBottom');
    });
    $('.version-list').on('change', function(e) {
        window.location = $(this).val();
    });
    $('.js-preventOffCanvasClose').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
});