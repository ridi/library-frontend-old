import webpack from 'webpack';
import merge from 'webpack-merge';
import settings from './settings/production.json';
import { buildDefinitions, buildFileLoader, config } from './webpack.common';

export default merge(config, {
  mode: 'production',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js',
  },
  module: {
    rules: buildFileLoader(settings),
  },
  plugins: [new webpack.DefinePlugin(buildDefinitions(settings))],
  stats: {
    assetsSort: '!size',
    performance: true,
  },
  devtool: 'hidden-source-map',
});
