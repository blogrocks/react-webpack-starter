const merge = require('webpack-merge');
const common = require('./vendor-bundles.webpack.common');
const path = require('path');
const webpack = require('webpack');

module.exports = merge(common, {
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dev-build', '[name]-manifest.json'),
      name: '[name]_[hash]',
    }),
  ]
});