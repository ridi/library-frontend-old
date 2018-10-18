
const getFullPath = req => {
  return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
};

module.exports = {
  getFullPath,
};
