const webpack = require('webpack');
const path = require('path');

const p = (value) => {
  return path.resolve(__dirname, value);
};

const mainConfig = {
  context: __dirname,
  entry: {
    lib: p('source/index.js')
  },
  output: {
    library: 'lib-project',
    libraryTarget: 'umd',
    filename: 'dist/[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          p('source'),
          p('tests')
        ],
        loader: 'babel-loader'
      }
    ]
  },
};

const minConfig = Object.assign({}, mainConfig, {
  output: Object.assign({}, mainConfig.output, {
    filename: 'dist/[name].min.js',
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

