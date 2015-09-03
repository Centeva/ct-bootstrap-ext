'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-lesslint');
    grunt.loadNpmTasks('grunt-contrib-connect');


    //Using exclusion patterns slows down Grunt significantly
    //instead of creating a set of patterns like '**/*.js' and '!**/node_modules/**'
    //this method is used to create a set of inclusive patterns for all subdirectories
    //skipping node_modules, bower_components, dist, and any .dirs
    //This enables users to create any directory structure they desire.
    var createFolderGlobs = function (fileTypePatterns) {
        fileTypePatterns = Array.isArray(fileTypePatterns) ? fileTypePatterns : [fileTypePatterns];
        var ignore = ['node_modules', 'bower_components', 'dist', 'temp'];
        var fs = require('fs');
        return fs.readdirSync(process.cwd())
						.map(function (file) {
						    if (ignore.indexOf(file) !== -1 ||
									file.indexOf('.') === 0 ||
									!fs.lstatSync(file).isDirectory()) {
						        return null;
						    } else {
						        return fileTypePatterns.map(function (pattern) {
						            return file + '/**/' + pattern;
						        });
						    }
						})
						.filter(function (patterns) {
						    return patterns;
						})
						.concat(fileTypePatterns);
    };

    // Project configuration.
    grunt.initConfig({
        watch: {
            options: {
                livereload: true,
                atBegin: true
            },
            less: {
                files: [createFolderGlobs(['*.less'])],
                tasks: ['less'],
                options: {
                    livereload: false
                }
            },
            html: {
                files: [createFolderGlobs('*.html')],
                tasks: []
            },
            css: {
                files: [createFolderGlobs('*.css'), 'temp/app.css'],
                tasks: []
            }
        },
        less: {
            production: {
                options: {
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'temp/bootstrap-ext.css.map'
                },
                files: {
                    'temp/bootstrap-ext.css': 'less/bootstrap-ext.less'
                }
            }
        },
        connect: {
            demo: {
                options: {
                    port: 9001,
                    open: 'http://localhost:9001/demo/index.html'
                }
            }
        }
    });

    grunt.registerTask('fewer', ['less']);
    grunt.registerTask('build', ['less']);
	grunt.registerTask('serve',['connect','watch']);
};
