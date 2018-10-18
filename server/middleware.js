
const jwt = require('jsonwebtoken');
const config = require('../src/config');

const jwtAuth = (req, res, next) => {
  const redirect = () => {
    const loginUrl = `${config.LOGIN_URL}?return_url=${getFullPath(req)}`
    res.redirect(301, loginUrl);
  };

  const token = req.cookies['ridi-at'];
  if (!token) {
    redirect();
  }

  jwt.verify(token, config.JWT_SECRET, (err, token) => {
    if (err) {
      redirect();
      return;
    }

    req.token = token;
    next();
  });
};

module.exports = {
  jwtAuth,
};
