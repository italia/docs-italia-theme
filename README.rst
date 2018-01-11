.. _readthedocs.org: http://www.readthedocs.org
.. _bower: http://www.bower.io
.. _sphinx: http://www.sphinx-doc.org
.. _compass: http://www.compass-style.org
.. _sass: http://www.sass-lang.com
.. _wyrm: http://www.github.com/snide/wyrm/
.. _grunt: http://www.gruntjs.com
.. _node: http://www.nodejs.com
.. _demo: http://docs.readthedocs.org
.. _hidden: http://sphinx-doc.org/markup/toctree.html

Installation
============

Download the package or add it to your ``requirements.txt`` file:

.. code:: bash

    $ pip install git+https://github.com/italia/sphinx_italia_theme.git

In your ``conf.py`` file, you'll need to specify the theme as follows:

.. code:: python

    html_theme = "sphinx_italia_theme"


Configuration
=============

You can configure different parts of the theme.

Project-wide configuration
--------------------------

The theme's project-wide options are defined in the ``sphinx_italia_theme/theme.conf``
file of this repository, and can be defined in your project's ``conf.py`` via
``html_theme_options``. For example:

.. code:: python

    html_theme_options = {
        # Enable the landing page template, instead of a doc template layout
        'layout': 'landing',
    }

This theme has three different layouts included: documentation page layout (default),
home page layout and landing page layout. Both use the same style sheets and included
templates. The home page and landing page don't show content, and instead only relies
on a special data syntax from Read the Docs to populate.

Contributing or modifying the theme
===================================

1. Clone the repository and fetch the submodules

    git clone git+https://github.com/italia/sphinx_italia_theme.git
    git submodule init
    git submodule update

2. Install sphinx_ into a virtual environment.

.. code::

    pip install sphinx

3. Install sass

.. code::

    gem install sass

4. Install node, bower and grunt.

.. code::

    // Install node on OS X
    brew install node

    // Install bower and grunt
    npm install -g bower grunt-cli

    // Now that everything is installed, let's install the theme dependecies.
    npm install

5. Run Grunt

.. code::

    grunt

This will watch files required for the theme, compile static assets, and copy
files from the `developers` submodule.

Building a release
==================

To make a release that can be installed via pip:

.. code::

    grunt build
    git add -u
    git commit

This builds the final release forms of the theme and static assets, and copies
everything to the template path. You can then commit these files to the
repository.
