const getFullPath = req => `https://${req.get('host')}${req.originalUrl}`;

module.exports = {
  getFullPath,
};
