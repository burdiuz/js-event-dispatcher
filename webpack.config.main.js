const webpack = require('webpack');
const { p, LIBRARY_FILE_NAME, LIBRARY_VAR_NAME, getBabelLoader } = require('./webpack.helpers');

module.exports = {
  context: __dirname,
  entry: {
    [LIBRARY_FILE_NAME]: p('source/index.js')
  },
  output: {
    library: LIBRARY_VAR_NAME,
    libraryTarget: 'umd',
    filename: '[name].js',
    path: p('dist'),
    publicPath: 'http://localhost:8081/dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          p('source'),
          p('tests'),
        ],
        use: getBabelLoader(),
      },
    ],
  },
  devtool: 'source-map',
};
