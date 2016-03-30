'use strict';

var _                   = require('lodash');
var webpack             = require('webpack');
var ManifestPlugin      = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var ExtractTextPlugin   = require('extract-text-webpack-plugin');
var defaultConfig       = require('./default');

module.exports = _.merge(defaultConfig, {
  devtool: false,
  output: {
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        // loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader')
        loader: 'style!css!autoprefixer'
      },
      {
        test: /\.less$/,
        // loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!less-loader')
        loader: 'style!css!autoprefixer!less'
      },
      {
        test: /\.scss$/,
        // loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!sass-loader')
        loader: 'style!css!autoprefixer!sass'
      },
      {
        test: /\.styl$/,
        // loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!stylus-loader')
        loader: 'style!css!autoprefixer!stylus'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    //new ExtractTextPlugin('[name]-[contenthash].css'),
    new ManifestPlugin({
      fileName: 'webpack-asset-manifest.json'
    }),
    new ChunkManifestPlugin({
      filename: 'webpack-common-manifest.json',
      manfiestVariable: 'webpackManifest'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}, function(obj1, obj2) {
  return _.isArray(obj2) ? obj2.concat(obj1) : undefined;
});
