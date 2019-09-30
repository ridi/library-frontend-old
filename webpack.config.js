const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackBar = require('webpackbar');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  'RIDI_STATUS_URL',
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

function buildBaseConfig(isProduction, indexName, settings) {
  return {
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
        storeStaticUrl: settings.store_static_base_url,
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
    devtool: isProduction ? 'hidden-source-map' : 'inline-source-map',
  };
}

module.exports = function buildConfig(env = 'dev') {
  const settings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'settings', `${env}.json`)));

  const isProduction = env === 'staging' || env === 'production';
  const indexName = env === 'staging' ? 'staging.html' : 'index.html';
  const baseConfig = buildBaseConfig(isProduction, indexName, settings);
  const overrideConfig = {};

  if (env === 'local') {
    overrideConfig.output = {
      filename: '[name].js',
      chunkFilename: '[id].js',
    };
    overrideConfig.devServer = {
      contentBase: path.resolve(__dirname, 'dist'),
      host: '0.0.0.0',
      port: 3000,
      sockPort: 443,
      allowedHosts: ['library.local.ridi.io'],
      historyApiFallback: true,
      stats: baseConfig.stats,
    };
  }

  return merge(baseConfig, overrideConfig);
};
