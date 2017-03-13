const path = require('path');

const LIBRARY_FILE_NAME = 'event-dispatcher';
const LIBRARY_VAR_NAME = 'EventDispatcher';

const p = (value) => {
  return path.resolve(__dirname, value);
};

module.exports = {
  p,
  LIBRARY_FILE_NAME,
  LIBRARY_VAR_NAME
};
