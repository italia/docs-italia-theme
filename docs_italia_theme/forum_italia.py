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
        'topic_id': directives.unchanged_required,
        'scope': directives.unchanged
    }
    final_argument_whitespace = True

    def run(self):
        options = self.options
        scope = options['scope'] if 'scope' in options else 'section'

        node = ForumItaliaCommentsNode()

        topic_markup = ' '.join([
            '<div class="forum-italia-comments"',
            'data-topic="' + options['topic_id'] + '"',
            'data-scope="' + scope + '"',
            '></div>'
        ])

        node += nodes.raw(text=topic_markup, format='html')
        node['data-topic-id'] = options['topic_id']

        return [ node ]
