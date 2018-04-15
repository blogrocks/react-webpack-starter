const path = require('path');
const webpack = require('webpack');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const isProd = process.env.NODE_ENV === 'production';
const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
  entry: {
    // According to HtmlWebpackPlugin config, it's possible that
    // not all entry chunks are included into index.html
    main: ['./polyfills.js', './src/index.js'],
    /*
    ** A bootstrap entry is added. To Use bootstrap class styles, simply add
    ** 'bootstrap' to HtmlWebpackPlugin chunks array. Bootstrap scripts are
    ** disabled by default, which can be enabled selectively by tweaking .bootstraprc.
     */
    // bootstrap: bootstrapConfig
  },
  resolve: {
    // Tell webpack what directories should be searched when resolving modules.
    modules: [
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "assets"),
      "node_modules"
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    chunkFilename: '[name].bundle.js'
  },
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './index-template.html',
      favicon: 'favicon.ico',
      // manifest should be included before main,
      // but html webpack plugin will take care of this. (ps: CommonsChunkPlugin is removed, so no manifest any more)
      chunks: ['main', 'vendors', 'commons', 'manifest' /*'bootstrap'*/], // select the entry items to include
    }),
    new webpack.ProvidePlugin({
      "window.Tether": "tether",
      React: 'react',
      Component: ['react', 'Component'],

      // For Bootstrap
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      // Tether: "tether",
      // "window.Tether": "tether",
      // Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      // Button: "exports-loader?Button!bootstrap/js/dist/button",
      // Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      // Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      // Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      // Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      // Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      // Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      // Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      // Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      // Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),
    new Visualizer()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
          sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[hash:12].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // Specifying webp here will create a WEBP version of your JPG/PNG images
              // webp: {
              //   quality: 75
              // }
            }
          }
        ]
      },
      {
        test: /\.(woff2)$/,
        loaders: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|otf|woff)$/,
        use: [
          'file-loader?name=fonts/[name].[ext]'
        ]
      },

      // Use one of these to serve jQuery for Bootstrap scripts:

      // Bootstrap 4
      // { test: /bootstrap\/dist\/js\/umd\//, use: 'imports-loader?jQuery=jquery' },

      // Bootstrap 3
      // { test: /bootstrap-sass\/assets\/javascripts\//, use: 'imports-loader?jQuery=jquery' },
    ]
  }
};