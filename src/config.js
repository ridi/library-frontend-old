import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { ACCOUNT_BASE_URL, LIBRARY_API_BASE_URL, PLATFORM_API_BASE_URL, STATIC_URL } = publicRuntimeConfig;
const config = {
  ACCOUNT_BASE_URL: ACCOUNT_BASE_URL || 'https://account.ridibooks.com',
  LIBRARY_API_BASE_URL: LIBRARY_API_BASE_URL || 'https://library-api.ridibooks.com',
  PLATFORM_API_BASE_URL: PLATFORM_API_BASE_URL || 'https://platform-api.ridibooks.com',
  STATIC_URL,
};

export default config;
