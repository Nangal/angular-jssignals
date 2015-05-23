module.exports = function( config ) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],
    // list of files / patterns to load in the browser
    files: [
      //'bower_components/jquery/dist/jquery.js',
      //js-signals
      'bower_components/angular/angular.js',
      //'https://code.angularjs.org/snapshot/angular.js',

      'bower_components/angular-animate/angular-animate.min.js',
      //'https://code.angularjs.org/snapshot/angular-animate.js',

      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/sinonjs/sinon.js',
      'bower_components/jasmine-sinon/lib/jasmine-sinon.js',
      'bower_components/js-signals/dist/signals.min.js',
      'src/angular-jssignals.js',
//      'src/angular-jssignals.js',
      'tests/*jasmine_spec.js'/*,
      //'tests/assets*//*.json'*/

      //'tests/teste*.js'


    ],
    // list of files to exclude
    exclude: [
    ],
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    /*preprocessors: {
        'src*//*.js': ['coverage']
        },*/
    /*coverageReporter: {
        type : 'html',
        //type : 'text-summary',
        dir : 'coverage/'
    },*/
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'/*, 'coverage'*/],
    // web server port
    hostname: 'localhost',
    port: 8080,
    // enable / disable colors in the output (reporters and logs)
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'/*,'Chrome'*/],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
    /*,customLaunchers: {
        'PhantomJS_custom': {
            base: 'PhantomJS',
            options: {
                settings: {
                    localToRemoteUrlAccessEnabled: true,
                    webSecurityEnabled: false
                }
            }
        }
    }*/
    //        ,transports : ['flashsocket', 'xhr-polling', 'jsonp-polling']

  });
};
