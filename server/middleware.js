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

  // Step 1. Access token 있는지 확인
  const token = req.cookies['ridi-at'];
  if (!token) {
    console.log('Missing token');
    redirect();
    return;
  }

  // Step 2. Access token 이 올바른지 확인
  try {
    jwt.verify(token, config.RIDI_OAUTH2_JWT_SECRET);
    req.token = token;
  } catch (err) {
    console.log(err);
    redirect();
    return;
  }

  // Step 3. Access token 으로 유저 정보 셋팅
  const decoded = jwt.decode(token);
  req.user = {};
  req.user.id = decoded.sub;
  req.user.idx = decoded.u_idx;

  next();
};

module.exports = {
  jwtAuth,
};
