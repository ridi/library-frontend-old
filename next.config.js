
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
  publicRuntimeConfig: {
    ACCOUNT_BASE_URL: process.env.ACCOUNT_BASE_URL,
    LIBRARY_API_BASE_URL: process.env.LIBRARY_API_BASE_URL,
    PLATFORM_API_BASE_URL: process.env.PLATFORM_API_BASE_URL,
  }
};
