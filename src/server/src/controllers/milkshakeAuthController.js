const User = require('../models/User');
const MilkshakeClient = require('../milkshake_api/client');
const { generateTokenPair } = require('../config/jwt');

/**
 * Milkshake Login
 * 1. Authenticate with Milkshake API
 * 2. Find or create user in our DB
 * 3. Generate access + refresh tokens
 * 4. Return tokens and user info
 */
const milkshakeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Step 1: Authenticate with Milkshake API
    console.log(`[Milkshake Auth] Authenticating user: ${email}`);
    const milkshakeClient = new MilkshakeClient();
    const milkshakeResult = await milkshakeClient.authenticate(email, password);

    if (!milkshakeResult.success) {
      return res.status(401).json({
        success: false,
        message: 'Milkshake authentication failed',
        error: milkshakeResult.error
      });
    }

    // Extract Milkshake user data
    const milkshakeUser = milkshakeResult.data;
    const milkshakeUserId = milkshakeUser.userId;

    if (!milkshakeUserId) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get Milkshake user ID'
      });
    }

    // Step 2: Find or create user in our database
    let user = await User.findOne({ milkshakeUserId });

    if (!user) {
      // Try to find by email (in case user was created via regular registration)
      user = await User.findOne({ email: milkshakeUser.email });

      if (user) {
        // Update existing user with Milkshake ID
        console.log(`[Milkshake Auth] Linking existing user ${user._id} to Milkshake ID: ${milkshakeUserId}`);
        user.milkshakeUserId = milkshakeUserId;
        user.milkshakeEmail = milkshakeUser.email;
        user.lastLogin = new Date();
        await user.save();
      } else {
        // Create new user with Milkshake data
        console.log(`[Milkshake Auth] Creating new user for Milkshake ID: ${milkshakeUserId}`);
        user = await User.create({
          email: milkshakeUser.email,
          milkshakeUserId: milkshakeUserId,
          milkshakeEmail: milkshakeUser.email,
          // No password needed for Milkshake users
          lastLogin: new Date()
        });
      }
    } else {
      // Update existing user
      console.log(`[Milkshake Auth] Found existing user: ${user._id}`);
      user.lastLogin = new Date();
      user.milkshakeEmail = milkshakeUser.email; // Update in case it changed
      await user.save();
    }

    // Step 3: Generate token pair
    const tokens = generateTokenPair({
      oid: user._id.toString(),
      email: user.email
    });

    // Step 4: Save refresh token to database
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Step 5: Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user._id,
          email: user.email,
          milkshakeUserId: user.milkshakeUserId,
          milkshakeEmail: user.milkshakeEmail,
          milkshakeData: {
            firstName: milkshakeUser.firstName,
            lastName: milkshakeUser.lastName,
            siteId: milkshakeUser.siteId,
            role: milkshakeUser.role
          },
          lastLogin: user.lastLogin
        },
        milkshakeCookie: milkshakeResult.cookie // Include cookie for future API calls
      }
    });

  } catch (error) {
    console.error('[Milkshake Auth] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Refresh Access Token
 * 1. Verify refresh token
 * 2. Generate new access token
 * 3. Optionally generate new refresh token (sliding window)
 */
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Import here to avoid circular dependency
    const { verifyRefreshToken, generateTokenPair } = require('../config/jwt');

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.oid).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new token pair (sliding window - extends session)
    const tokens = generateTokenPair({
      oid: user._id.toString(),
      email: user.email
    });

    // Update refresh token in database
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });

  } catch (error) {
    console.error('[Token Refresh] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  milkshakeLogin,
  refreshAccessToken
};
