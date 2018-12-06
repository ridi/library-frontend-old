import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();
const { ENVIRONMENT, RIDI_OAUTH2_JWT_SECRET, RIDI_TOKEN_AUTHORIZE_URL, RIDI_OAUTH2_CLIENT_ID } = serverRuntimeConfig;

module.exports = {
  ENVIRONMENT,
  RIDI_OAUTH2_CLIENT_ID,
  RIDI_OAUTH2_JWT_SECRET,
  RIDI_TOKEN_AUTHORIZE_URL,
};
