var relatedDocuments = null

function createCardElement (card, group) {
  var footerContent = group === 'same_publisher_project'
    ? 'Publisher' + ' <a href="' + card.extra_data.publisher.canonical_url + '" target="_blank">' + card.extra_data.publisher.name + '</a>'
    : 'Progetto' + ' <a href="' + card.extra_data.publisher_project.canonical_url + '" target="_blank">' + card.extra_data.publisher_project.name + '</a>'

  return (
    '<div class="card-custom col-xs-12 col-sm-6 col-md-3 col-lg-3 p-2 p-md-3">' +
      '<div class="card-wrapper">' +
        '<div class="card">' +
          '<div class="card-body p-0">' +
            '<div class="categoryicon-top pb-3">' +
              '<img src="_static/images/document.svg" alt="' + card.name + '">' +
            '</div>' +
            '<a href="' + card.canonical_url + '">' +
              '<h5 class="card-title">' + card.name + '</h5>' +
            '</a>' +
            '<p class="card-text">' + card.description + '</p>' +
          '</div>' +
          '<div class="card-footer border-0 px-0 pb-0">' + footerContent + '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
  )
}

module.exports = {
  init: function () {
    this.getRelatedDocuments()
    var modal = $('#related-documents-modal')

    // Options
    // https://getbootstrap.com/docs/4.0/components/modal/#options
    modal.modal({
      backdrop: false,
      show: false
    })

    // Event triggered on open modal click
    modal.on('show.bs.modal', function () {
      // Scroll to top
      $(document).scrollTop(0)

      // Hide mobile modal menu
      $('#document-actions').removeClass('show')
      $('#document-actions').attr('aria-hidden', 'true')
      $('#document-actions').hide()
      $('.modal-backdrop').remove()

      // Update header z-index
      $('header').css('z-index', 1051)

      // Scroll header with modal
      modal.on('scroll', function () {
        $(document).scrollTop(modal.scrollTop())
      })
    })

    // Event triggered on close modal animation finished
    modal.on('hidden.bs.modal', function () {
      // Update header z-index
      $('header').css('z-index', 'auto')

      modal.off('scroll')
      $(document).off('scroll')
    })
  },

  getRelatedDocuments: function () {
    var modalButtons = $('.related-documents-button') // More than one if mobile is open
    var documentSlug = window.READTHEDOCS_DATA.project
    var url = '/api/relatedprojects/' + documentSlug + '/'

    $.ajax({
      dataType: 'json',
      cache: true,
      url: url,
      success: function (res) {
        relatedDocuments = res
        modalButtons.each(function (index, buttonElement) {
          $(buttonElement).removeClass('disabled')
        })

        var elements = {
          'same_publisher': {
            title: '#related-documents-publisher-title',
            cards: '#related-documents-publisher-cards'
          },
          'same_publisher_project': {
            title: '#related-documents-projects-title',
            cards: '#related-documents-projects-cards'
          },
          'similar_tags': {
            title: '#related-documents-tags-title',
            cards: '#related-documents-tags-cards'
          }
        }

        for (var cardsGroup in relatedDocuments) {
          if (relatedDocuments.hasOwnProperty(cardsGroup)) {
            var cards = relatedDocuments[cardsGroup]

            cards.map(function (card) {
              var cardElement = createCardElement(card, cardsGroup)
              $(elements[cardsGroup].title).show()
              $(elements[cardsGroup].cards).append(cardElement)
            })
          }
        }
      },
      error: function () {
        relatedDocuments = null
        modalButtons.each(function (index, buttonElement) {
          $(buttonElement).addClass('disabled')
        })
      }
    })
  }
}
