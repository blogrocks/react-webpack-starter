const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.config');

module.exports = merge(common, {
  output: {
    filename: '[name].[chunkhash].js',
    publicPath: ''
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        test: /\.js($|\?)/i,
        cache: true,
        parallel: true,
        toplevel: false,
        compress: {
          warnings: false,
          drop_console: true,
          drop_debugger: true
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ]
});