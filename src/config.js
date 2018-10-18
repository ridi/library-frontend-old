
module.exports = {
  LOGIN_URL: process.env.LOGIN_URL || 'https://dev.ridi.io/account/login',
  JWT_SECRET: process.env.JWT_SECRET || '***REMOVED***',
  ACCOUNT_BASE_URL: process.env.ACCOUNT_BASE_URL || 'https://account.ridibooks.com',
  LIBRARY_API_BASE_URL: process.env.LIBRARY_API_BASE_URL || 'https://library-api.ridibooks.com',
  PLATFORM_API_BASE_URL: process.env.PLATFORM_API_BASE_URL || 'https://platform-api.ridibooks.com',
};
