// https://github.com/zeit/next-plugins/tree/master/packages/next-source-maps 에서 직접 가져옴
//
// TerserPlugin의 소스맵 출력 설정도 켜야 소스맵이 제대로 생성되는데, 패키징된
// @zeit/next-source-maps에는 그런 코드가 없습니다.
module.exports = (pluginOptions = {}) => {
  return (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        if (!options.defaultLoaders) {
          throw new Error('This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade');
        }

        const { dev } = options;

        if (!dev) {
          config.devtool = pluginOptions.devtool || 'source-map';

          for (const plugin of config.plugins) {
            if (plugin.constructor.name === 'UglifyJsPlugin') {
              plugin.options.sourceMap = true;
              break;
            }
          }

          if (config.optimization && config.optimization.minimizer) {
            for (const plugin of config.optimization.minimizer) {
              if (plugin.constructor.name === 'TerserPlugin') {
                plugin.options.sourceMap = true;
                break;
              }
            }
          }
        }

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }
        return config;
      },
    });
  };
};
