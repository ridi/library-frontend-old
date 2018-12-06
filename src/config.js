import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const {
  ACCOUNT_BASE_URL,
  STORE_API_BASE_URL,
  LIBRARY_API_BASE_URL,
  PLATFORM_API_BASE_URL,
  STATIC_URL,
  RIDI_TOKEN_AUTHORIZE_URL,
  RIDI_OAUTH2_CLIENT_ID,
} = publicRuntimeConfig;

const config = {
  ACCOUNT_BASE_URL,
  STORE_API_BASE_URL,
  LIBRARY_API_BASE_URL,
  PLATFORM_API_BASE_URL,
  STATIC_URL,
  RIDI_TOKEN_AUTHORIZE_URL,
  RIDI_OAUTH2_CLIENT_ID,
};

export default config;
