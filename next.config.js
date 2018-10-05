
const DEVELOPMENT = 'development';
const STAGING = 'staging';
const PRODUCTION = 'production';

const getStaticUrl = environment => {
  switch (environment) {
    case DEVELOPMENT:
      return 'https://library-static.dev.ridi.io';
    case STAGING:
    case PRODUCTION:
      return 'https://library-static.ridibooks.com';
    default:
      return '';
  }
};

module.exports = {
  distDir: '../build',
  useFileSystemPublicRoutes: false,
  exportPathMap: defaultPathMap => ({}),
  assetPrefix: getStaticUrl(process.env.NODE_ENV),
};
