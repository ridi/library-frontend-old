const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const WebpackBar = require('webpackbar');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DEF_KEYS = [
  'ACCOUNT_BASE_URL',
  'BASE_URL',
  'BOOK_API_BASE_URL',
  'BOOK_FEEDBACK_API_BASE_URL',
  'ENVIRONMENT',
  'HELP_BASE_URL',
  'LIBRARY_API_BASE_URL',
  'POLICY_BASE_URL',
  'RIDI_LOGOUT_URL',
  'RIDI_OAUTH2_CLIENT_ID',
  'RIDI_READING_NOTE_URL',
  'RIDI_REVIEW_URL',
  'RIDI_STATUS_URL',
  'RIDI_TOKEN_AUTHORIZE_URL',
  'SELECT_BASE_URL',
  'SENTRY_DSN',
  'SENTRY_ENV',
  'STATIC_URL',
  'STORE_API_BASE_URL',
  'STORE_BASE_URL',
  'VIEWER_API_BASE_URL',
];

function buildDefinitions(settings) {
  const ret = {};
  DEF_KEYS.forEach(key => {
    ret[key] = settings[key.toLowerCase()];
  });
  return {
    __CONFIG__: JSON.stringify(ret),
  };
}

function buildFileLoader(settings) {
  const fileLoader = {
    loader: 'file-loader',
    options: {
      name: '[name].[sha1:hash:base62:12].[ext]',
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
}

module.exports = (env = 'dev') => {
  const settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'settings', `${env}.json`)));

  const isProduction = env === 'staging' || env === 'production';
  const indexName = env === 'staging' ? 'staging.html' : 'index.html';

  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: {
      app: './src/index.jsx',
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[id].[hash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: settings.static_url,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          use: [
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: '@svgr/webpack',
          exclude: path.resolve(__dirname, './src/static/favicon/'),
        },
        ...buildFileLoader(settings),
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      plugins: [new TsconfigPathsWebpackPlugin({ extensions: ['.tsx', '.ts', '.jsx', '.js'] })],
    },
    plugins: [
      new webpack.DefinePlugin({
        SENTRY_RELEASE_VERSION: JSON.stringify(process.env.SENTRY_RELEASE_VERSION),
      }),
      new webpack.DefinePlugin(buildDefinitions(settings)),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        filename: indexName,
        libraryBaseUrl: settings.base_url,
      }),
      new ForkTsCheckerWebpackPlugin(),
      new WebpackBar(),
    ],
    stats: {
      all: false,
      assets: true,
      assetsSort: isProduction ? '!size' : 'id',
      errors: true,
      errorDetails: true,
      excludeAssets: [/\.map$/],
      hash: true,
      moduleTrace: true,
      performance: isProduction,
      version: true,
      warnings: true,
      warningsFilter: 'size limit',
    },
    devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  };

  if (env === 'local') {
    config.output.filename = '[name].js';
    config.output.chunkFilename = '[id].js';
    config.devServer = {
      contentBase: path.resolve(__dirname, 'dist'),
      host: '0.0.0.0',
      port: 3000,
      sockPort: 443,
      allowedHosts: ['library.local.ridi.io'],
      historyApiFallback: true,
      stats: config.stats,
    };
  }

  return config;
};
