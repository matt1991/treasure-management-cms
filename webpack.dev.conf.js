var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var baseWebpackConfig = require('./webpack.base.conf');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['webpack-hot-middleware/client'].concat(baseWebpackConfig.entry[name])
})

module.exports =  merge(baseWebpackConfig, {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css?localIdentName=[name]__[local]___[hash:base64:5]!postcss',
        include: /src/
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss',
        exclude: /src/
      },
      {
        test: /\.s(css|ass)$/,
        loader: 'style!css?importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass',
        include: /src/,
        exclude: /styles/
      },
      {
        test: /\.s(css|ass)$/,
        loader: 'style!css?importLoaders=2!postcss!sass',
        include: /styles/
      },
      {
        test: /\.less$/,
        loader: 'style!css?importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less',
        include: /src/
      },
      {
        test: /\.less$/,
        loader: 'style!css?importLoaders=1!less',
        exclude: /src/
      },
    ]
  },
  // eval-source-map is faster for development
  devtool: '#cheap-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {'NODE_ENV': '"development"'}
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.ejs',
      inject: 'body'
    })
  ]
})
