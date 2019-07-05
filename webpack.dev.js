import webpack from 'webpack';
import merge from 'webpack-merge';
import settings from './settings/dev.json';
import { buildDefinitions, buildFileLoader, config } from './webpack.common';

export default merge(config, {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  module: {
    rules: buildFileLoader(settings),
  },
  plugins: [new webpack.DefinePlugin(buildDefinitions(settings))],
});
