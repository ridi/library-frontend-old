import * as path from 'path';

import webpack from 'webpack';
import merge from 'webpack-merge';

import settings from './settings/local.json';
import common, { buildDefinitions } from './webpack.common';

export default merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  plugins: [
    new webpack.DefinePlugin(buildDefinitions(settings)),
    // new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['library.local.ridi.io'],
    stats: common.stats,
    // hot: true,
  },
});
