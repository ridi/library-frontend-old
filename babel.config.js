module.exports = function(api) {
  const emotionAdditionalPresets = api.env('production')
    ? {
        sourceMap: true,
        hoist: true,
      }
    : {
        sourceMap: true,
        autoLabel: true,
      };

  const presets = [
    ['@babel/preset-react'],
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'usage',
        shippedProposals: true,
      },
    ],
    [
      '@emotion/babel-preset-css-prop',
      {
        autoLabel: true,
        labelFormat: '[local]',
        ...emotionAdditionalPresets,
      },
    ],
  ];
  const plugins = ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-optional-chaining'];

  return {
    presets,
    plugins,
  };
};
