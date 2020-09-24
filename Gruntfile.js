module.exports = function (grunt) {

    const sass = require('node-sass');
    const mozjpeg = require('imagemin-mozjpeg');


    require('time-grunt')(grunt);

    grunt.initConfig({

        babel: {
            options: {
                sourceMap: false,
                presets: ['@babel/preset-env']
            },
            dist: {
                files: {
                    'temp/es5.js': 'temp/scripts.js'
                }
            }
        },



        sass: {
            options: {
                implementation: sass
            },
            dist: {
                files: {
                    'src/assets/css/scss_style.css': 'src/assets/scss/*.scss'
                }
            }
        },
        concat: {
            css: {
                files: {
                    'temp/styles.css': [
                        'src/assets/css/scss_style.css',
                        'src/assets/css/main.css',
                        'src/assets/css/media.css'
                    ],
                },
            },
            js: {
                files: {
                    'dist/scripts.min.js': 'src/assets/js/**/*.js',
                    //'temp/scripts.js': 'src/assets/js/**/*.js',
                },
            },
        },
        cssmin: {
            dist: {
                files: {
                    'dist/styles.min.css': ['temp/styles.css']
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/scripts.min.js': ['temp/es5.js']
                }
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 5,
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'dist/images'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');



    grunt.registerTask('default', [ 'sass', 'concat', 'babel', 'cssmin',   'imagemin']);

};