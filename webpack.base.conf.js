var path = require('path');
var svgoConfig = require('./svgo.config');

var AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 35',
  'Firefox >= 31',
  'Explorer >= 9',
  'iOS >= 7',
  'Opera >= 12',
  'Safari >= 7.1',
];

var babelRC = {
  presets: ['es2015-loose', 'stage-0', 'react'],
  plugins: ['transform-runtime', 'transform-decorators-legacy', ['antd']],
  comments: false,
  cacheDirectory: true,
  env: {
    development: {
      presets: ['react-hmre'],
      plugins: [
        ['dva-hmr', {
          'entries': [ './src/entry.js' ]
        }]
      ]
    }
  }
};

module.exports = {
  entry: {
    app: './src/entry.js'
  },
  output: {
    path: path.join(__dirname, './dist/assets'),
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    fallback: [path.join(__dirname, './node_modules')],
    alias: {
      '#': path.resolve(__dirname, './src')
    }
  },
  resolveLoader: {
    fallback: [path.join(__dirname, './node_modules')]
  },
  module: {
    preLoaders: [
			{
        test: /\.svg$/,
        loader: 'svgo-loader?' + JSON.stringify(svgoConfig)
      }
		],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.js$/,
        loader: 'babel',
        query: babelRC,
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite',
        include: /assets\/icons/
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        exclude: /assets\/icons/,
        query: {
          limit: 1000,
          name: 'images/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  postcss: function () {
    return [
      require('postcss-flexibility'),
      require('autoprefixer')(AUTOPREFIXER_BROWSERS)
    ];
  }
}
