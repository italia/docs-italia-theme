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

############################
# Import comment directive #
############################
sys.path.append("..")
from comment import CommentBoxNode, CommentBoxDirective


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
        comment = CommentBoxNode()
        return [ node ]

def doctree_resolved_handler(app, doctree, docname):
    for doc_node in doctree.traverse(nodes.section):
        b_markup = nodes.raw('<b>Hello World</b>')
        doc_node += b_markup
        doc_node.replace_self(doc_node)


def setup(app):
    app.add_node(SectionCommentsNode, html=(SectionCommentsNode.visit, SectionCommentsNode.depart))
    app.add_directive('section_comments', SectionCommentsDirective)
    # Add to nodes custom code / node / markups
    app.connect('doctree-resolved', doctree_resolved_handler)
