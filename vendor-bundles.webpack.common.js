const path = require('path');

module.exports = {
  entry: {
    vendor: ['react-dom', 'react-router-dom', 'lodash'],
  },
  // devtool: 'nosources-source-map',
  mode: 'development',
  output: {
    path: path.join(__dirname, 'dev-build'),
    filename: '[name].dll.js',
    library: '[name]_[hash]',
  }
};


