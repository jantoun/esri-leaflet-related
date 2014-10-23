var fs = require('fs');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef:  true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          XMLHttpRequest: true,
          ActiveXObject: true,
          module: true,
          L:true
        }
      },
      all: ['src/**/*.js']
    },
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache 2.0 License ' +
        '*/\n\n'
      },
      js: {
        src: [
          'src/esri-leaflet-related.js'
        ],
        dest: 'dist/esri-leaflet-related-src.js'
      },
      css: {
        src: [
          'src/esri-leaflet-related.css'
        ],
        dest: 'dist/esri-leaflet-related-src.css'
      }
    },
    uglify: {
      options: {
        wrap: false,
        preserveComments: 'some',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/esri-leaflet-related.js': [
            'dist/esri-leaflet-related-src.js'
          ]
        }
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['img/*.{png,jpg,gif}'],
          dest: 'dist/'
        }]
      }
    },
    cssmin: {
      main: {
        options: {
          wrap: false,
          preserveComments: 'some',
          report: 'gzip'
        },
        files: {
          'dist/esri-leaflet-related.css': [
            'dist/esri-leaflet-related-src.css'
          ]
        }
      }
    },
    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        headers: {
          // 1 Year cache policy (1000 * 60 * 60 * 24 * 365)
          "Cache-Control": "max-age=630720000, public",
          "Expires": new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      dev: {
        upload: [
          {
            src: 'dist/*',
            dest: 'esri-leaflet-related/<%= pkg.version %>/'
          },
          {
            src: 'dist/img/*',
            dest: 'esri-leaflet-related/<%= pkg.version %>/img'
          }
        ]
      }
    }

  });

  var awsExists = fs.existsSync(process.env.HOME + '/esri-leaflet-s3.json');

  if (awsExists) {
    grunt.config.set('aws', grunt.file.readJSON(process.env.HOME + '/esri-leaflet-s3.json'));
  }

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'imagemin', 'cssmin']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-s3');

};