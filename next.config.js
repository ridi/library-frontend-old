

const isLocal = process.env.NODE_ENV === 'local';
const assetPrefix = isLocal ? '' : process.env.STATIC_URL;
module.exports = {
  distDir: '../build',
  useFileSystemPublicRoutes: false,
  exportPathMap: defaultPathMap => ({}),
  assetPrefix: assetPrefix,
};
