const webpack = require('webpack');
const { p } = require('./webpack.helpers');

module.exports = {
  context: __dirname,
  entry: {
    'event-dispatcher': p('source/index.js')
  },
  output: {
    library: 'EventDispatcher',
    libraryTarget: 'umd',
    filename: '[name].js',
    path: p('dist'),
    publicPath: 'http://localhost:8081/dist/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          p('source'),
          p('tests'),
          p('node_modules/SymbolImpl')
        ],
        loader: 'babel-loader'
      }
    ]
  },
  devtool: 'source-map'
};

