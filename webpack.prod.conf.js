var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var baseWebpackConfig = require('./webpack.base.conf');
var env = process.env.NODE_ENV || 'production';

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?localIdentName=[name]__[local]___[hash:base64:5]!postcss'),
        include: /src/
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss'),
        exclude: /src/
      },
      {
        test: /\.s(css|ass)$/,
        loader: ExtractTextPlugin.extract('style', 'css?importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass'),
        include: /src/,
        exclude: /styles/
      },
      {
        test: /\.s(css|ass)$/,
        loader: ExtractTextPlugin.extract('style', 'css?importLoaders=2!postcss!sass'),
        include: /styles/
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css?importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less'),
        include: /src/
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1!less'),
        exclude: /src/
      },
    ]
  },
  devtool: false,
  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[id].[chunkhash].js',
    publicPath: '//116.251.229.197:8888/assets/',
  //  publicPath: '//172.20.2.169:8888/assets/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {'NODE_ENV': JSON.stringify(env) }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin('css/[name].[contenthash].css'),
    new HtmlWebpackPlugin({
      production: true,
      filename: '../index.html',
      template: 'index.ejs',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    })
  ]
})
