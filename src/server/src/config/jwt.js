const jwt = require('jsonwebtoken');

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'default-secret-change-this',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret-change-this',
  accessTokenExpire: process.env.JWT_ACCESS_EXPIRE || '15m', // Short-lived access token
  refreshTokenExpire: process.env.JWT_REFRESH_EXPIRE || '7d', // Long-lived refresh token
  issuer: process.env.JWT_ISSUER || 'pocket-ai-server',
  audience: process.env.JWT_AUDIENCE || 'pocket-ai-app'
};

/**
 * Generate Access Token (short-lived)
 * @param {Object} payload - { oid, email }
 * @returns {String} JWT access token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(
    {
      iss: JWT_CONFIG.issuer,
      aud: JWT_CONFIG.audience,
      oid: payload.oid,
      email: payload.email,
      type: 'access'
    },
    JWT_CONFIG.secret,
    {
      expiresIn: JWT_CONFIG.accessTokenExpire
    }
  );
};

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} payload - { oid, email }
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(
    {
      iss: JWT_CONFIG.issuer,
      aud: JWT_CONFIG.audience,
      oid: payload.oid,
      email: payload.email,
      type: 'refresh'
    },
    JWT_CONFIG.refreshSecret,
    {
      expiresIn: JWT_CONFIG.refreshTokenExpire
    }
  );
};

/**
 * Generate both Access and Refresh tokens
 * @param {Object} payload - { oid, email }
 * @returns {Object} { accessToken, refreshToken }
 */
const generateTokenPair = (payload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

/**
 * Verify Access Token
 * @param {String} token
 * @returns {Object} decoded token
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_CONFIG.secret, {
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience
  });
};

/**
 * Verify Refresh Token
 * @param {String} token
 * @returns {Object} decoded token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_CONFIG.refreshSecret, {
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience
  });
};

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use generateAccessToken instead
 */
const generateToken = generateAccessToken;

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use verifyAccessToken instead
 */
const verifyToken = verifyAccessToken;

module.exports = {
  generateToken, // Legacy
  verifyToken, // Legacy
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  JWT_CONFIG
};
