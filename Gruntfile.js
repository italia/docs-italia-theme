module.exports = function(grunt) {

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    open: {
      dev: {
        path: 'http://localhost:1919'
      }
    },

    connect: {
      server: {
        options: {
          port: 1919,
          base: 'demo_docs/build',
          livereload: true
        }
      }
    },

    stylelint: {
      dev: {
        options: {
          failOnError: false
        },
        src: ['sass/**/*.scss']
      },

      build: ['sass/**/*.scss']
    },

    sass: {
      all: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: 'docs_italia_theme/static/css',
          ext: '.css'
        }]
      }
    },

    postcss: {
      dev: {
        options: {
          map: {
              inline: false,
              annotation: 'docs_italia_theme/static/css'
          },
          processors: [
            require('pixrem')(),
            require('autoprefixer')({browsers: 'last 2 versions'})
          ]
        },
        files: [{
          src: 'docs_italia_theme/static/css/theme.css',
          dest: 'docs_italia_theme/static/css/theme.css',
        }]
      },

      build: {
        options: {
          map: {
              inline: false,
              annotation: 'docs_italia_theme/static/css'
          },
          processors: [
            require('pixrem')(),
            require('autoprefixer')({browsers: 'last 2 versions'}),
            require('cssnano')()
          ]
        },
        files: [{
          src: 'docs_italia_theme/static/css/theme.css',
          dest: 'docs_italia_theme/static/css/theme.css',
        }]
      }
    },

    copy: {
      all: {
        files: [
          {
            src: ['node_modules/bootstrap-italia/dist/css/bootstrap-italia.min.css'],
            dest: 'docs_italia_theme/static/css/vendor/bootstrap-italia.min.css'
          },
        ],
      },
    },

    browserify: {
      dev: {
        options: {
          alias: {
            'bootstrap-italia': './node_modules/bootstrap-italia/dist/js/bootstrap-italia.min.js',
            'modernizr': './js/modernizr.min.js'
          }
        },
        src: ['js/index.js'],
        dest: 'docs_italia_theme/static/js/theme.js'
      },
      build: {
        options: {
          alias: {
            'bootstrap-italia': './node_modules/bootstrap-italia/dist/js/bootstrap-italia.min.js',
            'modernizr': './js/modernizr.min.js'
          },
          transform: [
                'uglifyify'
            ],
        },
        src: ['js/index.js'],
        dest: 'docs_italia_theme/static/js/theme.js'
      }
    },

    cacheBust: {
      all: {
        options: {
          baseDir: 'docs_italia_theme/',
          assets: [
            'static/css/*.css',
            'static/js/*.js'
          ],
          deleteOriginals: true
        },
        files: [{
          expand: true,
          cwd: 'docs_italia_theme/layouts/',
          src: ['head.html', 'scripts.html']
        }]
      }
    },

    exec: {
      build_sphinx: {
        cmd: 'sphinx-build demo_docs/source demo_docs/build'
      }
    },

    clean: {
      build: ["demo_docs/build"]
    },

    watch: {
      /* Stylelint scss files */
      stylelint: {
        files: [
          'sass/**/*.scss'
        ],
        tasks: ['stylelint:dev']
      },
      /* Compile sass changes into theme directory */
      sass: {
        files: [
          'sass/**/*.scss'
        ],
        tasks: ['sass']
      },
      /* Process css into theme directory */
      postcss: {
        files: [
          'docs_italia_theme/static/css/**/*.css'
        ],
        tasks: ['postcss:dev']
      },
      /* Changes in theme dir rebuild sphinx */
      sphinx: {
        files: ['docs_italia_theme/**/*', 'demo_docs/**/*.rst', 'demo_docs/**/*.py'],
        tasks: ['clean:build', 'exec:build_sphinx']
      },
      /* JavaScript */
      browserify: {
        files: ['js/*.js'],
        tasks: ['browserify:dev']
      },
      /* live-reload the demo_docs if sphinx re-builds */
      livereload: {
        files: ['demo_docs/build/**/*'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'stylelint:dev',
    'sass',
    'postcss:dev',
    'copy',
    'browserify:dev',
    'exec:build_sphinx',
    'connect',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean',
    'stylelint:build',
    'sass',
    'postcss:build',
    'copy',
    'browserify:build',
    'exec:build_sphinx'
  ]);

  grunt.registerTask('release', [
    'clean',
    'stylelint:build',
    'sass',
    'postcss:build',
    'copy',
    'browserify:build',
    'cacheBust',
    'exec:build_sphinx'
  ]);
}
