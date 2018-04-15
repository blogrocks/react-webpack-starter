const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const autoprefixer = require('autoprefixer');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob-all');
const common = require('./webpack.common');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

module.exports = merge(common, {
  output: {
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname),
      manifest: require('./build/vendor-manifest.json'),
    }),
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
    new ExtractTextPlugin({
      filename: 'css/[name]-style-[hash].css',
      allChunks: true
    }),
    // PurifyCSSPlugins generates a warning:
    // DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, './*.html')).concat(
        glob.sync(path.join(__dirname, './src/**/*.js'))
      ),
      minimize: true,
      moduleExtensions: ['.js'], //An array of file extensions for determining used classes within node_modules
      purifyOptions: {
        whitelist: ['*purify*']
      }
    }),
    // After webpack 4+, it is required to apply AddAssetHtmlPlugin after HtmlWebpackPlugin to
    // register html-webpack-plugin-before-html-generation hook which is used inside first,
    // while previous versions of webpack do not care about it.
    new AddAssetHtmlPlugin([
      {
        includeSourcemap: false,
        hash: true,
        filepath: require.resolve('./build/vendor.dll.js')
      }
    ])
  ],
  optimization: {
    minimize: true,
    // splitChunks: {
    //   // chunks: "all",
    //   maxAsyncRequests: 5,
    //   maxInitialRequests: 3,
    //   minChunks: 1,
    //   cacheGroups: {
    //     default: false,
    //     // Create a commons chunk, which includes all code shared between entrypoints.
    //     commons: {
    //       name: 'commons',
    //       chunks: "initial",
    //       minChunks: 2
    //     },
    //     // vendors: {
    //     //   test: /[\\/]node_modules[\\/]/,
    //     //   name: "vendors",
    //     //   chunks: "all"
    //     // }
    //   }
    // },
    runtimeChunk: {
      name: 'manifest',
    }
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                camelCase: true,
                modules: true,
                localIdentName: 'purify_[hash:base64:10]'
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    remove: false
                  }),
                ],
              },
            },
            'sass-loader'
          ]
        })
      }
    ]
  }
});