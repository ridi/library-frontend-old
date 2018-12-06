const jwt = require('jsonwebtoken');
const config = require('./config');
const utils = require('./utils');

const _makeRidiAuthorizeURL = req => {
  const redirectURI = utils.getFullPath(req);
  return `${config.RIDI_TOKEN_AUTHORIZE_URL}?client_id=${config.RIDI_OAUTH2_CLIENT_ID}&response_type=code&redirect_uri=${redirectURI}`;
};

const jwtAuth = (req, res, next) => {
  const redirect = () => {
    res.redirect(302, _makeRidiAuthorizeURL(req));
  };

  const token = req.cookies['ridi-at'];
  if (!token) {
    redirect();
    return;
  }

  try {
    jwt.verify(token, config.RIDI_OAUTH2_JWT_SECRET);
    req.token = token;
    next();
  } catch (err) {
    redirect();
  }
};

module.exports = {
  jwtAuth,
};
