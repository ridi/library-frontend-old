const jwt = require('jsonwebtoken');
const config = require('./config');
const utils = require('./utils');

const getLoginUrl = next => `${config.LOGIN_URL}?client_id=${config.CLIENT_ID}&redirect_uri=${next}`;

const jwtAuth = (req, res, next) => {
  const redirect = () => {
    const loginUrl = getLoginUrl(utils.getFullPath(req));
    res.redirect(302, loginUrl);
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
  } catch (err) {
    redirect();
  }
};

module.exports = {
  jwtAuth,
};
