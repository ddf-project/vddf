'use strict';

var path    = require('path');
var webpack = require('webpack');
var config  = require('../config.json');
var ROOT    = require('../path-helper').ROOT;

module.exports = {
  context: ROOT,
  entry: {
    vddf: path.join(ROOT, config.path.src, 'vddf')
  },
  output: {
    path: path.join(ROOT, config.path.build),
    publicPath: config.path.build,
    filename: '[name].js',
    chunkFilename: '[name].chunk.[id].js'
  },
  externals: {
    'fetch': 'fetch',
    'chrome': 'chrome'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js'],
    alias: {
      'src': path.join(ROOT, config.path.src).slice(0, -1),
      'adaviz': path.join(ROOT, 'adaviz/').slice(0, -1)
    }
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    //new webpack.optimize.CommonsChunkPlugin("init.js"),
    new webpack.optimize.AggressiveMergingPlugin(),
    // new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.ResolverPlugin([
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', ['main'])
    ]),
    new webpack.DefinePlugin({
      'process.env.runtimeEnv': '"client"'
    })
  ]
};
