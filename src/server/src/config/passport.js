const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    !process.env.GOOGLE_CLIENT_ID.startsWith('your-')) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists (by Google ID)
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Existing user - update last login
          await user.updateLastLogin();
          return done(null, user);
        }

        // Check if user exists by email
        const email = profile.emails[0].value;
        user = await User.findOne({ email });

        if (user) {
          // User exists but no Google ID - add Google ID
          user.googleId = profile.id;
          await user.save();
          await user.updateLastLogin();
          return done(null, user);
        }

        // Create new user
        user = new User({
          email: email,
          googleId: profile.id
        });

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
} else {
  console.log('⚠️  Google OAuth not configured - skipping Google authentication strategy');
}

// Serialize user to session (if needed)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
