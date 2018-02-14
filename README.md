# Docs Italia theme

This is (going to be) the official theme for any piece of documentation hosted on the
upcoming Docs Italia.

## How to use Sphinx Italia on your documentation 

* Add the following line to your documentation `requirements.txt` file:

    ```
    $ pip install git+https://github.com/italia/docs-italia-theme.git
    ```

* In your `conf.py` file, you'll need to specify the theme as follows:

    ```
    html_theme = "docs-italia-theme"
    ```


## Configuration

The theme's project-wide options are defined in the `docs-italia-theme/theme.conf`
file of this repository, and can be defined in your project's `conf.py` via
`html_theme_options`. For example:

```
html_theme_options = {
    # Enable the landing page template, instead of a doc template layout
    'layout': 'landing',
}
```

This theme has three different layouts included:

* documentation page layout (default),
* home page layout
* landing page layout

The home page and landing page don't show content, and instead only relies on a special data
syntax from Read the Docs to populate.

## Contributing or modifying the theme

* Clone the repository and fetch the submodules:
    
    ```
    git clone git+https://github.com/italia/docs-italia-theme.git
    ```

* If needed, install [Sphinx](http://www.sphinx-doc.org/en/stable/) into a virtual environment:
    
    ```
    pip install sphinx
    ```

* If needed, install [SASS](http://sass-lang.com/):

    ```
    gem install sass
    ```

4. Install [node.js](https://nodejs.org) and grunt:

    ```
    // Install node on OS X
    brew install node

    // Install grunt
    npm install -g grunt-cli

    // Now that everything is installed, let's install the theme dependecies.
    npm install
    ```

5. Run the main script to load a sample docs with the Sphinx Italia theme applied:

    ```
    npm start
    ```

This will compile static assets and watch files required for the theme to reload at runtime.

## Building a release

To make a release that can be installed via pip:

    ```
    npm build
    ```

This builds the final release forms of the theme and static assets, and copies
everything to the template path. You can then commit these files to the
repository.

TODO: versioning system to enable automatic update on Docs Italia / ReadTheDocs
