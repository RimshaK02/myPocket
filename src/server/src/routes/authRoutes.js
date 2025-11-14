const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const {
  register,
  login,
  verifyTokenEndpoint,
  getCurrentUser,
  logout,
  googleCallback
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const {
  registerValidation,
  loginValidation,
  validate
} = require('../middleware/validation');

// Public routes - Email/Password authentication
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/error'
  }),
  googleCallback
);

// Protected routes (authentication required)
router.get('/verify', authenticate, verifyTokenEndpoint);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

module.exports = router;
