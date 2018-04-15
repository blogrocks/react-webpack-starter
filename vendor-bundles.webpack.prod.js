const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./vendor-bundles.webpack.common');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.join(__dirname, 'build')
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'build', '[name]-manifest.json'),
      name: '[name]_[hash]',
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
});
