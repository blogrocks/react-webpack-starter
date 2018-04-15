const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const autoprefixer = require('autoprefixer');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = merge(common, {
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    host: require('my-local-ip')(),
    disableHostCheck: true,
    port: 9000,
    open: true,
    hot: true,
    overlay: true,
    historyApiFallback: true,
    proxy: {
      // "/appapi/za-plutuscat": {
      //   target: "https://xxx.com",
      //   // pathRewrite: {"^/https://xxx.com/appapi/za-plutuscat" : ""},
      //   secure: false,
      //   changeOrigin: true
      // }
    }
  },
  mode: 'development',
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname),
      manifest: require('./dev-build/vendor-manifest.json'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    // After webpack 4+, it is required to apply AddAssetHtmlPlugin after HtmlWebpackPlugin to
    // register html-webpack-plugin-before-html-generation hook which is used inside first,
    // while previous versions of webpack do not care about it.
    new AddAssetHtmlPlugin([
      {
        includeSourcemap: false,
        hash: true,
        filepath: require.resolve('./dev-build/vendor.dll.js')
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          'style-loader?sourceMap',
          {
            loader: 'css-loader',
            options: {
              camelCase: true,
              modules: true,
              importLoaders: 1,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              sourceMap: true,
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  remove: false
                }),
              ],
            },
          },
          'sass-loader?sourceMap'
        ]
      }
    ]
  }
});