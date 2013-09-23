module.exports = function(grunt) {

  var requirejsOptions = require('./js/config'),
      docs = {};

  for (var key in requirejsOptions.paths) {
    docs['docs/dev/' + requirejsOptions.paths[key] + '.js'] = [requirejsOptions.paths[key] + '.js'];
  }
  docs['docs/dev/bower_components/requirejs/require.js'] = 'bower_components/requirejs/require.js';
  docs['docs/dev/js/config.js'] = 'js/config.js';

  requirejsOptions.optimize = 'none';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js', 'tests/*.js']
    },
    karma: {
      dev: {
        configFile: 'tests/karma.conf.js'
      },
      dev_chrome: {
        configFile: 'tests/karma.conf.js',
        browsers: ['Chrome']
      },
      ci: {
        configFile: 'tests/karma.conf.js',
        singleRun: true,
        reporters: ['junit', 'coverage'],
        junitReporter: {
          outputFile: 'test-results.xml'
        },
        coverageReporter: {
          type : 'lcovonly',
          dir : 'coverage/'
        },
        browsers: ['sauce_chrome'],
        sauceLabs: {
          testName: 'PloneExtraMockup',
          startConnect: true
        },
        customLaunchers: {
          'sauce_chrome': {
             base: 'SauceLabs',
             platform: 'Windows 8',
             browserName: 'chrome'
           },
          'sauce_firefox': {
             base: 'SauceLabs',
             platform: 'Windows 8',
             browserName: 'firefox'
           },
           'sauce_ie': {
             base: 'SauceLabs',
             platform: 'Windows 8',
             browserName: 'internet explorer'
           }
        }
      }
    },

    requirejs: {
     options: requirejsOptions,
     all: {
       options: {
         name: 'node_modules/almond/almond.js',
         include: 'mockup-bundles-extra',
         insertRequire: ['mockup-bundles-extra'],
         out: 'build/extra.min.js',
         excludeShallow: ['jquery']
       }
     }
    },

    sed: {
      'bootstrap': {
        path: 'node_modules/lcov-result-merger/index.js',
        pattern: 'throw new Error\\(\'Unknown Prefix ',
        replacement: '//throw// new Error(\'Unknown Prefix '
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-sed');

  grunt.registerTask('compile-all', [
    'requirejs:all'
    ]);

  grunt.registerTask('default', [
    'jshint',
    'karma:dev'
    ]);

};
