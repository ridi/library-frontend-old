
const getFullPath = req => {
  return `https://${req.get('host')}${req.originalUrl}`;
};

module.exports = {
  getFullPath,
};
