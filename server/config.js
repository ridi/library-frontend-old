const getConfig = require('next/config').default;

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const {
  ENVIRONMENT,

  RIDI_OAUTH2_CLIENT_ID,
  RIDI_OAUTH2_JWT_SECRET,
  RIDI_TOKEN_AUTHORIZE_URL,

  RIDI_INTERNAL_AUTH_LIBRARY_WEB_TO_STORE,
} = serverRuntimeConfig;

const { STORE_API_BASE_URL } = publicRuntimeConfig;

module.exports = {
  ENVIRONMENT,

  RIDI_OAUTH2_CLIENT_ID,
  RIDI_OAUTH2_JWT_SECRET,
  RIDI_TOKEN_AUTHORIZE_URL,

  RIDI_INTERNAL_AUTH_LIBRARY_WEB_TO_STORE,

  STORE_API_BASE_URL,
};
