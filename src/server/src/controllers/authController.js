const User = require('../models/User');
const { generateToken } = require('../config/jwt');

/**
 * Register
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = new User({
      email,
      password
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      oid: user._id.toString(),
      email: user.email
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

/**
 * Login
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (include password)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if Google login user
    if (user.googleId && !user.password) {
      return res.status(400).json({
        success: false,
        message: 'Please login with Google'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login time
    await user.updateLastLogin();

    // Generate JWT token
    const token = generateToken({
      oid: user._id.toString(),
      email: user.email
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

/**
 * Verify token
 * GET /api/auth/verify
 */
const verifyTokenEndpoint = async (req, res) => {
  // Already verified by authenticate middleware
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: {
        id: req.user._id,
        email: req.user.email
      }
    }
  });
};

/**
 * Get current user info
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          createdAt: req.user.createdAt,
          lastLogin: req.user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information',
      error: error.message
    });
  }
};

/**
 * Logout
 * POST /api/auth/logout
 * (Token deletion happens on client side, but endpoint provided for logging purposes)
 */
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

/**
 * Google OAuth Callback
 * GET /api/auth/google/callback
 */
const googleCallback = async (req, res) => {
  try {
    // User authenticated by Passport
    const user = req.user;

    // Generate JWT token
    const token = generateToken({
      oid: user._id.toString(),
      email: user.email
    });

    // Redirect to frontend (pass token)
    // For mobile apps, use custom URL scheme
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

module.exports = {
  register,
  login,
  verifyTokenEndpoint,
  getCurrentUser,
  logout,
  googleCallback
};
