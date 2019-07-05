const path = require('path');

const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {};

module.exports.config = {
  entry: {
    app: './src/index.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        use: '@svgr/webpack',
      },
    ],
  },
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      pages: path.resolve(__dirname, 'src/pages'),
      components: path.resolve(__dirname, 'src/components'),
      services: path.resolve(__dirname, 'src/services'),
      constants: path.resolve(__dirname, 'src/constants'),
      static: path.resolve(__dirname, 'src/static'),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      SENTRY_RELEASE_VERSION: JSON.stringify(process.env.SENTRY_RELEASE_VERSION),
    }),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      title: '내 서재',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    }),
    new WebpackBar(),
  ],
  stats: {
    all: false,
    assets: true,
    assetsSort: 'id',
    errors: true,
    errorDetails: true,
    hash: true,
    moduleTrace: true,
    version: true,
    warnings: true,
    warningsFilter: 'size limit',
  },
  devtool: 'inline-source-map',
};

const DEF_KEYS = [
  'ENVIRONMENT',
  'BASE_URL',
  'STATIC_URL',
  'ACCOUNT_BASE_URL',
  'STORE_BASE_URL',
  'STORE_API_BASE_URL',
  'STORE_STATIC_BASE_URL',
  'VIEWER_API_BASE_URL',
  'SELECT_BASE_URL',
  'LIBRARY_API_BASE_URL',
  'BOOK_API_BASE_URL',
  'BOOK_FEEDBACK_API_BASE_URL',
  'RIDI_LOGOUT_URL',
  'RIDI_REVIEW_URL',
  'RIDI_READING_NOTE_URL',
  'RIDI_TOKEN_AUTHORIZE_URL',
  'RIDI_OAUTH2_CLIENT_ID',
  'SENTRY_DSN',
];

module.exports.buildDefinitions = function buildDefinitions(settings) {
  const ret = {};
  for (const key of DEF_KEYS) {
    ret[key] = settings[key.toLowerCase()];
  }
  return {
    __CONFIG__: JSON.stringify(ret),
  };
};

module.exports.buildFileLoader = function buildFileLoader(settings) {
  const fileLoader = {
    loader: 'file-loader',
    options: {
      name(file) {
        if (file.endsWith('/maintenance.json')) {
          return '[name].[ext]';
        }
        return '[name].[sha1:hash:base62:12].[ext]';
      },
      outputPath: 'static',
      publicPath: new URL('static', settings.static_url).toString(),
    },
  };
  const manifestPaths = [
    path.resolve(__dirname, 'src/static/favicon/browserconfig.xml'),
    path.resolve(__dirname, 'src/static/favicon/site.webmanifest.json'),
  ];
  return [
    {
      include: path.resolve(__dirname, 'src/static'),
      exclude: manifestPaths,
      type: 'javascript/auto',
      use: [fileLoader],
    },
    {
      include: manifestPaths,
      type: 'javascript/auto',
      use: [fileLoader, 'app-manifest-loader'],
    },
  ];
};
