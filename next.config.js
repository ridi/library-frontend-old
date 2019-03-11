const { NODE_ENV } = process.env;

let settings;
if (NODE_ENV === 'local') {
  settings = require('./settings/local.json');
} else if (NODE_ENV === 'development') {
  settings = require('./settings/dev.json');
} else {
  settings = require('./settings/production.json');
}

module.exports = {
  distDir: '../build',
  useFileSystemPublicRoutes: false,
  exportPathMap: () => ({
    '/': { page: '/' },
  }),
  webpack: (config, { dev, buildId, isServer }) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  assetPrefix: settings.static_url,

  publicRuntimeConfig: {
    ENVIRONMENT: settings.environment,
    BASE_URL: settings.base_url,
    STATIC_URL: settings.static_url,
    ACCOUNT_BASE_URL: settings.account_base_url,
    STORE_API_BASE_URL: settings.store_api_base_url,
    VIEWER_API_BASE_URL: settings.viewer_api_base_url,
    SELECT_BASE_URL: settings.select_base_url,
    LIBRARY_API_BASE_URL: settings.library_api_base_url,
    BOOK_API_BASE_URL: settings.book_api_base_url,
    BOOK_FEEDBACK_API_BASE_URL: settings.book_feedback_api_base_url,

    LOGOUT_URL: settings.ridi_logout_url,
    REVIEW_URL: settings.ridi_review_url,
    READING_NOTE_URL: settings.ridi_reading_note_url,

    RIDI_TOKEN_AUTHORIZE_URL: settings.ridi_token_authorize_url,
    RIDI_OAUTH2_CLIENT_ID: settings.ridi_oauth2_client_id,

    SENTRY_DSN: settings.sentry_dsn,
  },
};
