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
                    <!-- Write -->
                    <div class="row align-items-center mt-4 mb-4 block-comments__input new-comment__write">
                        <figure class="col-auto mb-0">
                            <img class="block-comments__img new-comment__figure rounded-circle" src="">
                        </figure>
                        <input class='form-control new-comment__body col ml-2 pl-3 pr-3' id="comments-input" placeholder='Commenta...' />
                    </div>
                    <!-- Buttons -->
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
            <div class="block-comments container-fluid" id="accordion-comments">
                <!-- Top header -->
                <div class="block-comments__header border-top border-bottom border-width-2 pt-3 pb-3 row align-items-center justify-content-between">
                    <h6 class="col-auto text-uppercase mb-0">{{ _(t.comments) }}</h6>
                    <button class="col-auto block-comments__toggle-btn rounded-circle border border-medium-blue border-width-2" data-toggle="collapse" data-target="#comments-collapsed0" aria-expanded="true"><span class="it-icon-plus"></span><span class="it-icon-minus"></span></button>
                </div>
            </div>

            <div class="block-comments__body pt-4 collapse show" data-parent="#accordion-comments" id="comments-collapsed0" style="">
                <!-- Input row -->
                <div class="row align-items-center mt-4 mb-4 block-comments__input">
                    """ + form_template + """
                    <div class='section' id='docs-comments-box-"""+ options['topic_id'] +"""' data-topic='"""+ options['topic_id'] +"""'></div>
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
