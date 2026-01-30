const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyTokenEndpoint,
  getCurrentUser,
  logout
} = require('../controllers/authController');
const {
  milkshakeLogin,
  refreshAccessToken
} = require('../controllers/milkshakeAuthController');
const { authenticate } = require('../middleware/authMiddleware');
const {
  registerValidation,
  loginValidation,
  validate
} = require('../middleware/validation');

// Public routes - Email/Password authentication
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Milkshake authentication routes
router.post('/milkshake/login', milkshakeLogin);
router.post('/refresh', refreshAccessToken);

// Protected routes (authentication required)
router.get('/verify', authenticate, verifyTokenEndpoint);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

module.exports = router;
