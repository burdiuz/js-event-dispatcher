// Karma configuration
module.exports = (config) => {
  config.set({
    basePath: __dirname,
    frameworks: ['mocha', 'sinon-chai'],
    files: [
      'source/**/*.js'
    ],
    exclude: [],

    preprocessors: {
      'source/**/!(*.spec).js': ['coverage', 'webpack'],
      'source/**/*.spec.js': ['webpack'],
    },
    reporters: ['coverage', 'progress', 'coveralls'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    webpack: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader'
        }
      ]
    },
    webpackMiddleware: {
      noInfo: true,
      stats: {
        chunks: false
      }
    },
    plugins: [
      require('karma-webpack')
    ],
    port: 9876,
    colors: true,
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    browsers: ['Chrome'],
    //browsers: ['Chrome', 'IE', 'Firefox'],
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
