import sys

##############################
# Define the new custom node #
##############################
from docutils import nodes

###################################
# Define the new custom directive #
###################################
from docutils.parsers.rst import Directive
from docutils.parsers.rst import directives

class SectionCommentsNode(nodes.Structural, nodes.Element):
    @staticmethod
    def visit(self, node):
        pass
    @staticmethod
    def depart(self, node):
        pass

class SectionCommentsDirective(Directive):
    # Directive's parameters
    required_arguments = 0
    optional_arguments = 0
    option_spec = {
        'topic_id': directives.unchanged
    }
    final_argument_whitespace = True

    def run(self):
        settings = self.state.document.settings
        lang_code = settings.language_code
        env = settings.env

        # Stored configs
        config = env.config
        # Directive's options
        options = self.options

        node = SectionCommentsNode()

        #############
        # Templates #
        #############

        # Form for write new comment
        form_template = """
            <form id='new-comment-""" + options['topic_id'] + """' data-topic='""" + options['topic_id'] + """'>
                <div class="form group">
                    <div class="new-comment__errors-box"></div>
                    <textarea class='form-control new-comment__body' placeholder='Commenta...' rows='5'></textarea>
                    <div class='new-comment__buttons d-none'>
                        <input type='submit' class='btn btn-sm new-comment__submit' value='invia' disabled='true' />
                        <input type='reset' class='btn btn-sm new-comment__delete' value='annulla' />
                    </div>
                    <div class="new-comment__required d-none">
                        <span>Caratteri richiesti: <span class='required-chars'></span></span>
                    </div>

                    <div class='new-comment__legend d-none'>
                        Markdown per la formattazione del testo:
                        <ul>
                            <li> Grassetto: __text__ (o **text**) </li>
                            <li> Corsivo: _text_ </li>
                            <li> Link: [Testo](http://url-to-link.ex) </li>
                            <li> Citazione: > Testo citazione </li>
                        </ul>
                    </div>
                </div>
            </from>
        """
        cbox_template = """
            <div class="collapse-header" id="cbox-header">
                <button data-toggle="collapse" data-target="#cbox-collapse" aria-expanded="true" aria-controls="cbox-collapse">
                    Commenti
                </button>
            </div>
            <div id="cbox-collapse" class="collapse show" role="tabpanel" aria-labelledby="cbox-header">
                <div class="collapse-body">
                    """ + form_template + """

                    <div class='section' id='docs-comments-box-"""+ options['topic_id'] +"""' data-topic='"""+ options['topic_id'] +"""'>
                    </div>
                </div>
            </div>
        """
        #node += nodes.raw(text="<div class='section' id='docs-comments-box-"+options['topic_id']+"' data-topic='"+options['topic_id']+"'></div>", format='html')
        node += nodes.raw(text=cbox_template, format='html')

        #form = nodes.raw(text=form_template, format='html')
        #node += form

        node['data-topic-id'] = options['topic_id']

        return [ node ]

def setup(app):
    app.add_node(SectionCommentsNode, html=(SectionCommentsNode.visit, SectionCommentsNode.depart))
    app.add_directive('section_comments', SectionCommentsDirective)
    # Add to nodes custom code / node / markups
