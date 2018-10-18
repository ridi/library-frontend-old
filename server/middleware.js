
const jwt = require('jsonwebtoken');
const config = require('./config');
const utils = require('./utils');

const jwtAuth = (req, res, next) => {
  const redirect = () => {
    const loginUrl = `${config.LOGIN_URL}?return_url=${utils.getFullPath(req)}`
    res.redirect(301, loginUrl);
  };

  const token = req.cookies['ridi-at'];
  if (!token) {
    redirect();
    return;
  }

  try {
    jwt.verify(token, config.JWT_SECRET);
    req.token = token;
    next();
  } catch(err) {
    redirect();
  }
};

module.exports = {
  jwtAuth,
};
