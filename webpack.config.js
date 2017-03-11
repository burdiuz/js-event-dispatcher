const webpack = require('webpack');
const mainConfig = require('./webpack.config.main');

const minConfig = Object.assign({}, mainConfig, {
  output: Object.assign({}, mainConfig.output, {
    filename: '[name].min.js',
  }),
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
});


module.exports = [
  mainConfig,
  minConfig,
];

