const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-key' } = process.env;
const AuthError = require('../errors/auth-error');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ', '')) {
    throw new AuthError('Необходима авторизация');
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Необходима авторизация');
  }
  req.user = payload;
  return next();
};
