const path = require('path');

const p = (value) => {
  return path.resolve(__dirname, value);
};

module.exports = {
	p,
};