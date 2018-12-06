module.exports = {
  distDir: '../build',
  useFileSystemPublicRoutes: false,
  exportPathMap: () => ({}),
  assetPrefix: process.env.STATIC_URL,
  publicRuntimeConfig: {
    ACCOUNT_BASE_URL: process.env.ACCOUNT_BASE_URL,
    STORE_API_BASE_URL: process.env.STORE_API_BASE_URL,
    LIBRARY_API_BASE_URL: process.env.LIBRARY_API_BASE_URL,
    PLATFORM_API_BASE_URL: process.env.PLATFORM_API_BASE_URL,
    STATIC_URL: process.env.STATIC_URL,
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
