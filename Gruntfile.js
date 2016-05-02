module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['js/*.js'],
                    dest: 'build/'
                }]
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['*.html'],
                    dest: 'build/'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['css/*.css'],
                    dest: 'build/'
                }]
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'src',
                src: '**/*',
                dest: 'build/'
            }
        }
    });

    var modules = ['copy','uglify','cssmin','htmlmin'];
    for(i=0;i<modules.length;i++) {
        grunt.loadNpmTasks('grunt-contrib-'+modules[i]);
    }
    grunt.registerTask('default', modules);
};
