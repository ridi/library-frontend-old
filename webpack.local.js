import * as path from 'path';

import webpack from 'webpack';
import merge from 'webpack-merge';

import settings from './settings/local.json';
import { buildDefinitions, buildFileLoader, config } from './webpack.common';

export default merge(config, {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  module: {
    rules: [buildFileLoader(settings)],
  },
  plugins: [
    new webpack.DefinePlugin(buildDefinitions(settings)),
    // new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 3000,
    sockPort: 443,
    allowedHosts: ['library.local.ridi.io'],
    historyApiFallback: true,
    stats: config.stats,
    // hot: true,
  },
});
