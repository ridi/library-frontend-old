const secrets = require('./secrets.json');

module.exports = {
  distDir: '../build',
  useFileSystemPublicRoutes: false,
  exportPathMap: () => ({}),
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  assetPrefix: process.env.STATIC_URL,
  serverRuntimeConfig: {
    ENVIRONMENT: secrets.environment,
    RIDI_OAUTH2_JWT_SECRET: secrets.ridi_oauth2_jwt_secret,

    RIDI_TOKEN_AUTHORIZE_URL: secrets.ridi_token_authorize_url,
    RIDI_OAUTH2_CLIENT_ID: secrets.ridi_oauth2_client_id,
    SENTRY_DSN: secrets.sentry_dsn,
  },
  publicRuntimeConfig: {
    ACCOUNT_BASE_URL: process.env.ACCOUNT_BASE_URL,
    STORE_API_BASE_URL: process.env.STORE_API_BASE_URL,
    LIBRARY_API_BASE_URL: process.env.LIBRARY_API_BASE_URL,
    PLATFORM_API_BASE_URL: process.env.PLATFORM_API_BASE_URL,
    STATIC_URL: process.env.STATIC_URL,

    RIDI_TOKEN_AUTHORIZE_URL: secrets.ridi_token_authorize_url,
    RIDI_OAUTH2_CLIENT_ID: secrets.ridi_oauth2_client_id,
    SENTRY_DSN: secrets.sentry_dsn,
  },
};
