const secrets = require('./secrets.json');

module.exports = {
  distDir: '../build',
  useFileSystemPublicRoutes: false,
  exportPathMap: () => ({
    '/': { page: '/' },
  }),
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  assetPrefix: secrets.static_url,

  serverRuntimeConfig: {
    ENVIRONMENT: secrets.environment,
    RIDI_OAUTH2_JWT_SECRET: secrets.ridi_oauth2_jwt_secret,

    RIDI_TOKEN_AUTHORIZE_URL: secrets.ridi_token_authorize_url,
    RIDI_OAUTH2_CLIENT_ID: secrets.ridi_oauth2_client_id,

    RIDI_INTERNAL_AUTH_LIBRARY_WEB_TO_STORE: secrets.ridi_internal_auth_library_web_to_store,

    SENTRY_DSN: secrets.sentry_dsn,
  },

  publicRuntimeConfig: {
    BASE_URL: secrets.base_url,
    STATIC_URL: secrets.static_url,
    ACCOUNT_BASE_URL: secrets.account_base_url,
    STORE_API_BASE_URL: secrets.store_api_base_url,
    SELECT_BASE_URL: secrets.select_base_url,
    LIBRARY_API_BASE_URL: secrets.library_api_base_url,
    BOOK_API_BASE_URL: secrets.book_api_base_url,
    BOOK_FEEDBACK_API_BASE_URL: secrets.book_feedback_api_base_url,

    LOGOUT_URL: secrets.ridi_logout_url,
    REVIEW_URL: secrets.ridi_review_url,
    READING_NOTE_URL: secrets.ridi_reading_note_url,

    RIDI_TOKEN_AUTHORIZE_URL: secrets.ridi_token_authorize_url,
    RIDI_OAUTH2_CLIENT_ID: secrets.ridi_oauth2_client_id,

    SENTRY_DSN: secrets.sentry_dsn,
  },
};
