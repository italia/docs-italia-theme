# coding=utf-8

# define custom node
from docutils import nodes

# define custom directive
from docutils.parsers.rst import Directive
from docutils.parsers.rst import directives

class ForumItaliaCommentsNode(nodes.Structural, nodes.Element):
    @staticmethod
    def visit(self, node):
        pass
    @staticmethod
    def depart(self, node):
        pass

class ForumItaliaCommentsDirective(Directive):
    # parameters
    required_arguments = 0
    optional_arguments = 0
    option_spec = {
        'topic_id': directives.unchanged
    }
    final_argument_whitespace = True

    def run(self):
        options = self.options

        node = ForumItaliaCommentsNode()

        topic_markup = """
            <div class="forum-italia-comments" data-topic='""" + options['topic_id'] + """'></div>
        """

        # Create "account suspended" modal
        suspended_modal = """
            <div class="modal suspended-modal" id="suspended-modal" tabindex="-1" role="dialog">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Account sospeso</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <p>Il tuo account e&grave; stato sospeso, se ti serve aiuto vieni a trovarci sul workspace Slack di Developers Italia.</p>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" id="logout-modal__cancel">Chiudi</button>
                  </div>
                </div>
              </div>
            </div>
        """

        node += nodes.raw(text=topic_markup, format='html')
        node += nodes.raw(text=suspended_modal, format='html')

        node['data-topic-id'] = options['topic_id']

        return [ node ]
