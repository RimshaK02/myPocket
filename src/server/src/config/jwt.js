const jwt = require('jsonwebtoken');

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'default-secret-change-this',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  issuer: process.env.JWT_ISSUER || 'pocket-ai-server',
  audience: process.env.JWT_AUDIENCE || 'pocket-ai-app'
};

/**
 * Generate JWT token
 * @param {Object} payload - { oid, email }
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(
    {
      iss: JWT_CONFIG.issuer,
      aud: JWT_CONFIG.audience,
      oid: payload.oid,
      email: payload.email
    },
    JWT_CONFIG.secret,
    {
      expiresIn: JWT_CONFIG.expiresIn
    }
  );
};

/**
 * Verify JWT token
 * @param {String} token
 * @returns {Object} decoded token
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_CONFIG.secret, {
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience
  });
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_CONFIG
};
