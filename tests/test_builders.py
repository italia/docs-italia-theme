import os

import pytest
import sphinx
from sphinx import addnodes
from sphinx.builders.html import SingleFileHTMLBuilder, DirectoryHTMLBuilder

from .util import build_all


def test_basic():
    for (app, status, warning) in build_all('test-basic'):
        assert app.env.get_doctree('index').traverse(addnodes.toctree)
        content = open(os.path.join(app.outdir, 'index.html')).read()

        if isinstance(app.builder, DirectoryHTMLBuilder):
            search = (
                '<body role="document" class="docs-italia">'
            )
            assert search in content
        elif isinstance(app.builder, SingleFileHTMLBuilder):
            search = (
                '<body role="document" class="docs-italia">'
            )
            assert search in content
        else:
            search = (
                '<body role="document" class="docs-italia">'
            )
            assert search in content, ('Missing search with builder {0}'
                                       .format(app.builder.name))
