module.exports = function (grunt) {

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
        sass: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['*.sass'],
                    dest: 'sphinx_italia_theme/static/css',
                    ext: '.css'
                }]
            },
            build: {
                options: {
                    style: 'compressed'
                },
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['*.sass'],
                    dest: 'sphinx_italia_theme/static/css',
                    ext: '.css'
                }]
            }
        },

        browserify: {
            dev: {
                options: {
                    external: ['jquery'],
                    alias: {
                        'sphinx-italia-theme': './js/theme.js'
                    }
                },
                src: ['js/*.js'],
                dest: 'sphinx_italia_theme/static/js/theme.js'
            },
            build: {
                options: {
                    external: ['jquery'],
                    alias: {
                        'sphinx-italia-theme': './js/theme.js'
                    }
                },
                src: ['js/*.js'],
                dest: 'sphinx_italia_theme/static/js/theme.js'
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
            /* Compile sass changes into theme directory */
            sass: {
                files: [
                    'sass/*.sass'
                ],
                tasks: ['sass:dev']
            },
            /* Changes in theme dir rebuild sphinx */
            sphinx: {
                files: ['sphinx_italia_theme/**/*', 'demo_docs/**/*.rst', 'demo_docs/**/*.py'],
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
                options: {livereload: true}
            }
        }

    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', [
        'clean:build',
        'sass:build',
        'browserify:build',
        'exec:build_sphinx',
        'connect',
        'open',
        'watch'
    ]);
    grunt.registerTask('build', [
        'clean:build',
        'sass:build',
        'browserify:build',
        'exec:build_sphinx'
    ]);
}
