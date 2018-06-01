// temporary comments
module.exports = themeComments = (function ($) {
  var that;

  return {

    $: {
      $container: $('#doc-content > .section')
    },

    init: function(callback) {
      that = this.$;

      var commentMarkup =
      '<div class="block-comments container-fluid" id="accordion-comments">' +

        '<div class="block-comments__header border-top border-bottom border-width-2 pt-3 pb-3 row align-items-center justify-content-between">' +
          '<h6 class="col-auto text-uppercase mb-0">comments</h6><button class="col-auto block-comments__toggle-btn rounded-circle border border-medium-blue border-width-2" data-toggle="collapse" data-target="#comments-collapsed" aria-expanded="false"><span class="it-icon-plus"></span><span class="it-icon-minus"></span></button>' +
        '</div>' +
        '<div class="block-comments__body collapse show pt-4" data-parent="#accordion-comments" id="comments-collapsed">' +

          '<div class="row align-items-center mt-4 mb-4 block-comments__input">' +
            '<figure class="col-auto mb-0"><img class="block-comments__img rounded-circle" src="http://via.placeholder.com/80x80"></figure>' +
            '<input class="col ml-2 pl-3 pr-3" id="comments-input" placeholder="scrivi un commento">' +
          '</div>' +
          '<div class="row">' +

            '<div class="block-comments__list col">' +
              '<div class="row mt-4 mb-4">' +
                '<ul class="block-comments__list col" id="accordion-comment-item">' +

                  '<li class="row mb-5 block-comments__item">' +
                    '<figure class="col-auto mb-0"><img class="block-comments__img rounded-circle" src="http://via.placeholder.com/80x80"></figure>' +
                    '<div class="col">' +
                      '<div class="row align-items-center justify-content-between" id="comment-heading-1">' +
                        '<div class="col-auto">' +
                          '<span class="block-comments__name text-capitalize mb-0">paola turcini</span></div>' +
                        '<div class="col-auto">' +
                          '<p class="d-inline-block mr-2 block-comments__date mb-0">16 apr 2018, 16:24</p><button class="block-comments__item-btn collapsed" data-toggle="collapse" data-target="#collapse-1" aria-expanded="false" aria-controls="collapse-1"><span class="it-icon-collapse"></span><span class="it-icon-expand"></span></button></div>' +
                      '</div>' +
                      '<p class="text-uppercase block-comments__role">giornalista</p>' +
                      '<p id="collapse-1" class="block-comments__paragraph pl-3 border-left collapse show" aria-labelledby="comment-heading-1">Lorem Ipsum è un testo segnaposto <a href="#">utilizzato nel settore</a> della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta' +
                        'di caratteri e li assemblò per preparare un testo campi-1. È sopravvissuto non solo a più di cinque secoli, ma anche al</p>' +
                    '</div>' +
                  '</li>' +

                  '<li class="row mb-5 block-comments__item">' +
                    '<figure class="col-auto mb-0"><img class="block-comments__img rounded-circle" src="http://via.placeholder.com/80x80"></figure>' +
                    '<div class="col">' +
                      '<div class="row align-items-center justify-content-between" id="comment-heading-2">' +
                        '<div class="col-auto">' +
                          '<span class="block-comments__name text-capitalize mb-0">paola turcini</span></div>' +
                        '<div class="col-auto">' +
                          '<p class="d-inline-block mr-2 block-comments__date mb-0">16 apr 2018, 16:24</p><button class="block-comments__item-btn" data-toggle="collapse" data-target="#collapse-2" aria-expanded="true" aria-controls="collapse-2"><span class="it-icon-collapse"></span><span class="it-icon-expand"></span></button></div>' +
                      '</div>' +
                      '<p class="text-uppercase block-comments__role">giornalista</p>' +
                      '<p id="collapse-2" class="block-comments__paragraph pl-3 border-left collapse" aria-labelledby="comment-heading-2">Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li' +
                        'assemblò per preparare un testo campi-1. È sopravvissuto non solo a più di cinque secoli, ma anche al</p>' +
                    '</div>' +
                  '</li>' +

                  '<li class="row mb-5 block-comments__item">' +
                    '<figure class="col-auto mb-0"><img class="block-comments__img rounded-circle" src="http://via.placeholder.com/80x80"></figure>' +
                    '<div class="col">' +
                      '<div class="row align-items-center justify-content-between" id="comment-heading-3">' +
                        '<div class="col-auto">' +
                          '<span class="block-comments__name text-capitalize mb-0">paola turcini</span></div>' +
                        '<div class="col-auto">' +
                          '<p class="d-inline-block mr-2 block-comments__date mb-0">16 apr 2018, 16:24</p><button class="block-comments__item-btn collapsed" data-toggle="collapse" data-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3"><span class="it-icon-collapse"></span><span class="it-icon-expand"></span></button></div>' +
                      '</div>' +
                      '<p class="text-uppercase block-comments__role">giornalista</p>' +
                      '<p id="collapse-3" class="block-comments__paragraph pl-3 border-left collapse" aria-labelledby="comment-heading-3">Lorem Ipsum è un testo segnaposto utilizzato nel settore della tipografia e della stampa. Lorem Ipsum è considerato il testo segnaposto standard sin dal sedicesimo secolo, quando un anonimo tipografo prese una cassetta di caratteri e li' +
                        'assemblò per preparare un testo campi-1. È sopravvissuto non solo a più di cinque secoli, ma anche al</p>' +
                    '</div>' +
                  '</li>' +
                '</ul>' +
              '</div>' +
            '</div>' +

          '</div>' +
        '</div>' +
      '</div>';

      that.$container.append(commentMarkup)

    }
  }

})(jQuery);
