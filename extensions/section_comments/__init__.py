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
        node += nodes.raw('', text="<div class='section' id='docs-comments-box-"+options['topic_id']+"' data-topic='"+options['topic_id']+"'></div>", format='html')
        node['data-topic-id'] = options['topic_id']

        return [ node ]

def setup(app):
    app.add_node(SectionCommentsNode, html=(SectionCommentsNode.visit, SectionCommentsNode.depart))
    app.add_directive('section_comments', SectionCommentsDirective)
    # Add to nodes custom code / node / markups
