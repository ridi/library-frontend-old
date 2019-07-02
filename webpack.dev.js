import webpack from 'webpack';
import merge from 'webpack-merge';

import settings from './settings/dev.json';
import common, { buildDefinitions } from './webpack.common';

export default merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
  },
  plugins: [new webpack.DefinePlugin(buildDefinitions(settings))],
});
