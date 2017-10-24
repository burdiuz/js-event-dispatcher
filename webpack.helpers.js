const path = require('path');

const LIBRARY_FILE_NAME = 'event-dispatcher';
const LIBRARY_VAR_NAME = 'EventDispatcher';

const p = (value) => {
  return path.resolve(__dirname, value);
};

const getBabelLoader = (plugins = []) => ({
  loader: 'babel-loader',
  options: {
    presets: [
      ['env', {
        targets: {
          browsers: ['last 2 versions'],
          node: '8.4.0',
        },
      }],
    ],
    plugins: [
      ...plugins,
      'babel-plugin-transform-flow-strip-types',
      'babel-plugin-transform-class-properties',
    ],
  },
});

module.exports = {
  p,
  LIBRARY_FILE_NAME,
  LIBRARY_VAR_NAME,
  getBabelLoader,
};
