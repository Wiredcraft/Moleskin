
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        separator: ';',
        stripBanners : true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        src: ['js/jquery.autogrow.js',
              'js/moleskine.js',
              'js/moleskine.conf.js',
              'js/reMarked.js',
              'js/showdown.js'],
        dest: 'dist/moleskin.min.js'
      },
      angular_dist : {
        src: ['js/jquery.autogrow.js',
              'js/moleskine.js',
              'js/moleskine.conf.js',
              'js/reMarked.js',
              'js/showdown.js',
              'js/moleskine-angular.js'],
        dest: 'dist/moleskin-angular.min.js'
      }
    },
    watch: {
      scripts: {
        files: ['js/*.js'],
        tasks: ['compile'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['watch']);

  grunt.registerTask('compile', ['uglify:dist',
                                 'uglify:angular_dist']);

};
