import webpack from 'webpack';
import merge from 'webpack-merge';

import settings from './settings/production.json';
import common, { buildDefinitions } from './webpack.common';

export default merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js',
  },
  plugins: [new webpack.DefinePlugin(buildDefinitions(settings))],
  devtool: 'hidden-source-map',
});
