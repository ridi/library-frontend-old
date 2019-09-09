import webpack from 'webpack';
import merge from 'webpack-merge';
import settings from './settings/production.json';
import { buildDefinitions, buildFileLoader, config } from './webpack.common';

const HtmlWebpackPlugin = require('html-webpack-plugin');

export default merge(config, {
  mode: 'production',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js',
    publicPath: settings.static_url,
  },
  module: {
    rules: buildFileLoader(settings),
  },
  plugins: [
    new webpack.DefinePlugin(buildDefinitions(settings)),
    new HtmlWebpackPlugin({
      template: './src/index.ejs',
      libraryBaseUrl: settings.base_url,
      storeStaticUrl: settings.store_static_base_url,
    }),
  ],
  stats: {
    assetsSort: '!size',
    performance: true,
  },
  devtool: 'hidden-source-map',
});
