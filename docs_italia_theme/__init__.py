"""Docs Italia theme"""

import os
import re
import yaml
import json
from discourse_comments import *
from docutils.nodes import figure
from docutils.nodes import table
from docutils.nodes import bullet_list
from docutils.nodes import list_item
from docutils.nodes import reference
from docutils.nodes import Text
from sphinx.addnodes import compact_paragraph
from sphinx.addnodes import glossary
from sphinx.addnodes import toctree
from sphinx.environment.adapters.toctree import TocTree

# This part would be better placed as an extension:
# It loads yaml data files to set them as variables
def get_html_theme_path():
    """Return list of HTML theme paths."""
    cur_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    return cur_dir


def deep_merge(source, destination):
    """Deep merge dictionaries"""
    for key, value in source.items():
        if isinstance(value, dict):
            node = destination.setdefault(key, {})
            deep_merge(value, node)
        else:
            destination[key] = value
    return destination


def load_theme_data():
    """Load data from YAML config file"""
    source_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), 'data')
    )
    config_path = os.path.join(source_path, '_config.yml')
    data_path = os.path.join(source_path, '_data')
    context = {}

    # Load site config
    config_h = open(config_path)
    config_data = yaml.load(config_h)
    context.update(config_data)

    # Load Jekyll data files
    filename_re = re.compile('\.yml$')
    context['data'] = {}
    for filename in os.listdir(data_path):
        if filename_re.search(filename):
            datafile_source = filename_re.sub('', filename)
            datafile_path = os.path.join(data_path, filename)
            datafile_h = open(datafile_path)
            datafile_data = yaml.load(datafile_h)
            context['data'].update({datafile_source: datafile_data})

    # Transform network links to ordered mapping. Doing this dynamically
    # instead of with overrides to alter mapping into an ordered list and keep
    # the existing data
    network_links = []
    for link in ['trasformazione_digitale', 'developers', 'design', 'forum',
                 'docs', 'github']:
        link_data = context['data']['network_links'].get(link, {}).copy()
        link_data['name'] = link

        # Alter classes
        class_str = link_data.get('class', '')
        classes = class_str.split(' ')
        try:
            del classes[classes.index('current')]
        except (IndexError, ValueError):
            pass
        if link == 'docs':
            classes.append('current')
        link_data['class'] = ' '.join(classes)

        network_links.append(link_data)
    context['data']['network_links'] = network_links

    footer_links = []
    for link in ['privacy', 'legal']:
        link_data = context['data']['footer_links'].get(link, {}).copy()
        footer_links.append(link_data)
    context['data']['footer_links'] = footer_links

    return context

def add_yaml_data(app, pagename, templatename, context, doctree):
    """Add yaml data to Sphinx context"""
    context['site'] = app.site_data
    # The translation context is pinned to the Italian sources, as Sphinx has
    # it's own translation mechanism built in
    if 'language' in context and context['language'] != None:
        language = context['language']
    else:
        language = app.site_data['default_language']
    context['t'] = app.site_data['data']['l10n'][language]['t']

def generate_additonal_tocs(app, pagename, templatename, context, doctree):
    """Generate and add additional tocs to Sphinx context"""
    content_tocs = []
    glossary_tocs = []
    content_toc = ''
    glossary_toc = ''
    figures_toc = bullet_list()
    tables_toc = bullet_list()
    index = app.env.config.master_doc
    doctree_index = app.env.get_doctree(index)

    for toctreenode in doctree_index.traverse(toctree):
        toctree_element = TocTree(app.env).resolve(pagename, app.builder, toctreenode, includehidden=True)
        if 'glossary_toc' in toctreenode.parent.attributes['names']:
            glossary_tocs.append(toctree_element)
        else:
            content_tocs.append(toctree_element)

    if content_tocs:
        content_toc = content_tocs[0]
        for content_element in content_tocs[1:]:
            content_toc.extend(content_element.children)
    if glossary_tocs:
        glossary_toc = glossary_tocs[0]
        for glossary_element in glossary_tocs[1:]:
            glossary_toc.extend(glossary_element.children)
        glossary_toc = glossary_toc.children[0].children[0].children[1]

    for page in app.env.toc_fignumbers:
        doctree_page = app.env.get_doctree(page)

        for figurenode in doctree_page.traverse(figure):
            figure_id = figurenode.attributes['ids'][0]
            figure_number = app.env.toc_fignumbers[page]['figure'][figure_id]
            figure_title = figurenode.children[0]['alt'] if 'alt' in figurenode.children[0] else context['t']['no_description']
            figure_text_string = 'Fig. ' + str(figure_number[0]) + '.' + str(figure_number[1]) + ' - ' + figure_title.capitalize()
            figure_text = Text(figure_text_string)
            figure_text.rawsource = figure_text_string
            figure_reference = reference()
            figure_reference.attributes['internal'] = True
            figure_reference.attributes['refuri'] = page + app.builder.out_suffix + '#' + figure_id
            figure_compact_paragraph = compact_paragraph()
            figure_list_item = list_item()
            figure_text.parent = figure_reference
            figure_reference.children.append(figure_text)
            figure_reference.parent = figure_compact_paragraph
            figure_compact_paragraph.children.append(figure_reference)
            figure_compact_paragraph.parent = figure_list_item
            figure_list_item.children.append(figure_compact_paragraph)
            figure_list_item.parent = figures_toc
            figures_toc.children.append(figure_list_item)

        for tablenode in doctree_page.traverse(table):
            table_id = tablenode.attributes['ids'][0]
            table_number = app.env.toc_fignumbers[page]['table'][table_id]
            table_title = tablenode.children[0].rawsource if tablenode.children[0].rawsource else context['t']['no_description']
            table_title = (table_title[:60] + '...') if len(table_title) > 60 else table_title
            table_text_string = 'Tab. ' + str(table_number[0]) + '.' + str(table_number[1]) + ' - ' + table_title.capitalize()
            table_text = Text(table_text_string)
            table_text.rawsource = table_text_string
            table_reference = reference()
            table_reference.attributes['internal'] = True
            table_reference.attributes['refuri'] = page + app.builder.out_suffix + '#' + table_id
            table_compact_paragraph = compact_paragraph()
            table_list_item = list_item()
            table_text.parent = table_reference
            table_reference.children.append(table_text)
            table_reference.parent = table_compact_paragraph
            table_compact_paragraph.children.append(table_reference)
            table_compact_paragraph.parent = table_list_item
            table_list_item.children.append(table_compact_paragraph)
            table_list_item.parent = tables_toc
            tables_toc.children.append(table_list_item)

    context['content_toc'] = app.builder.render_partial(content_toc)['fragment'] if hasattr(content_toc, 'children') else context['t']['no_content'].capitalize()
    context['glossary_toc'] = app.builder.render_partial(glossary_toc)['fragment'] if hasattr(glossary_toc, 'children') else context['t']['no_glossary'].capitalize()
    context['figures_toc'] = app.builder.render_partial(figures_toc)['fragment'] if hasattr(figures_toc, 'children') else context['t']['no_figures'].capitalize()
    context['tables_toc'] = app.builder.render_partial(tables_toc)['fragment'] if hasattr(tables_toc, 'children') else context['t']['no_tables'].capitalize()

def generate_glossary_json(app, doctree, docname):
    """Generate glossary JSON file"""
    current_builder = app.builder.name
    if current_builder == 'html' or current_builder == 'readthedocs':
        glossary_data = {}
        data_dir = app.outdir + '/_static/data'
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
        if os.path.exists(data_dir + '/glossary.json'):
            with open(data_dir + '/glossary.json', 'r') as existing_glossary:
                glossary_data = json.loads(existing_glossary.read())
        for node in doctree.traverse(glossary):
            for definition_list in node.children:
                for definition_list_item in definition_list.children:
                    term = definition_list_item.children[0].rawsource
                    definition = ''
                    for paragraphs in definition_list_item.children[1].children:
                        definition += paragraphs.rawsource + '\n'
                    definition = definition[:-2]
                    glossary_data[term] = definition
        glossary_json = json.dumps(glossary_data)
        glossary_json_file = open(data_dir + '/glossary.json', 'w')
        glossary_json_file.write(glossary_json)
        glossary_json_file.close()

def glossary_page_id(app, doctree, docname):
    glossary_pages = []
    index = app.env.config.master_doc
    doctree_index = app.env.get_doctree(index)

    for toctreenode in doctree_index.traverse(toctree):
        toctree_element = TocTree(app.env).resolve(index, app.builder, toctreenode, includehidden=True)
        if 'glossary_toc' in toctreenode.parent.attributes['names']:
            glossary_pages = toctreenode['includefiles']

    if docname in glossary_pages:
        for glossary_section in doctree.children:
            glossary_section.attributes['ids'] = ['glossary-page']

def setup(app):
    app.site_data = load_theme_data()
    app.connect('html-page-context', add_yaml_data)
    app.connect('html-page-context', generate_additonal_tocs)
    app.connect('doctree-resolved', generate_glossary_json)
    app.connect('doctree-resolved', glossary_page_id)
    # Setup for discourse_comments custom directive
    app.add_node(DiscourseCommentsNode, html=(DiscourseCommentsNode.visit, DiscourseCommentsNode.depart))
    app.add_directive('discourse_comments', DiscourseCommentsDirective)
    app.add_html_theme('docs_italia_theme', os.path.abspath(os.path.dirname(__file__)))