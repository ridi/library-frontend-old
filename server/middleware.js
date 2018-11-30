const jwt = require('jsonwebtoken');
const config = require('./config');
const utils = require('./utils');

const _make_ridi_authorize_url = req => {
  const redirect_uri = utils.getFullPath(req);
  return `${config.RIDI_TOKEN_AUTHORIZE_URL}?client_id=${config.RIDI_OAUTH2_CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}`;
};

const jwtAuth = (req, res, next) => {
  const redirect = () => {
    res.redirect(302, _make_ridi_authorize_url(req));
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
