# -*- coding: utf-8 -*-

"""Sphinx Team Digitale theme"""

import codecs
import json

from setuptools import setup

package_file = codecs.open('package.json', 'r', 'utf-8')
package_data = json.load(package_file)


setup(
    name='sphinx_italia_theme',
    version=package_data['version'],
    license=package_data['license'],
    author='Team Digitale',
    description=__doc__,
    long_description=codecs.open('README.rst', 'r', 'utf-8').read(),
    zip_safe=False,
    packages=['sphinx_italia_theme'],
    package_data={'sphinx_italia_theme': [
        'theme.conf',
        '*.html',
        'static/css/*.css',
        'static/js/*.js',
        'static/font/*.*',
        'data/*.*',
    ]},
    include_package_data=True,
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'License :: OSI Approved :: MIT License',
        'Environment :: Console',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Operating System :: OS Independent',
        'Topic :: Documentation',
        'Topic :: Software Development :: Documentation',
    ],
)
