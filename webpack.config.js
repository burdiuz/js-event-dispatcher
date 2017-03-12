const webpack = require('webpack');
const { p } = require('./webpack.helpers');
const mainConfig = require('./webpack.config.main');

const minConfig = Object.assign({}, mainConfig, {
  output: Object.assign({}, mainConfig.output, {
    filename: '[name].min.js',
  }),
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
	  sourceMap: true
    })
  ]
});

const directConfig = Object.assign({}, minConfig, {
  entry: {
    'event-dispatcher': p('source/direct.js')
  },
  output: Object.assign({}, mainConfig.output, {
    libraryTarget: 'var',
    filename: '[name].direct.js',
  })
});

module.exports = [
  mainConfig,
  directConfig,
  minConfig,
];

