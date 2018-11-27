module.exports = {
  apps: [
    {
      name: 'App',
      script: 'server/entry.js',
      node_args: '-r esm',
      kill_timeout: 3000,
      env_local: {
        PORT: 8080,
        NODE_ENV: 'local',
        STATIC_URL: '',
        ACCOUNT_BASE_URL: 'https://account.dev.ridi.io',
        LIBRARY_API_BASE_URL: 'https://library-api.dev.ridi.io',
        PLATFORM_API_BASE_URL: 'https://platform-api.dev.ridi.io',
      },
      env_development: {
        PORT: 8080,
        NODE_ENV: 'development',
        STATIC_URL: 'https://library-static.dev.ridi.io',
        ACCOUNT_BASE_URL: 'https://account.dev.ridi.io',
        LIBRARY_API_BASE_URL: 'https://library-api.dev.ridi.io',
        PLATFORM_API_BASE_URL: 'https://platform-api.dev.ridi.io',
      },
      env_production: {
        PORT: 8080,
        NODE_ENV: 'production',
        STATIC_URL: 'https://library-static.ridibooks.com',
        ACCOUNT_BASE_URL: 'https://account.ridibooks.com',
        LIBRARY_API_BASE_URL: 'https://library-api.ridibooks.com',
        PLATFORM_API_BASE_URL: 'https://platform-api.ridibooks.com',
      },
    },
  ],
};
