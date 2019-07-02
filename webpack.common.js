import * as path from 'path';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
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
  },
  plugins: [
    new webpack.DefinePlugin({
      SENTRY_RELEASE_VERSION: JSON.stringify(process.env.SENTRY_RELEASE_VERSION),
    }),
    new HtmlWebpackPlugin({
      title: '내 서재',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    }),
  ],
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

export function buildDefinitions(settings) {
  const ret = {};
  for (const key of DEF_KEYS) {
    ret[key] = JSON.stringify(settings[key.toLowerCase()]);
  }
  return ret;
}
