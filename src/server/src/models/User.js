const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: function() {
      // Google and Milkshake login users don't need password
      return !this.googleId && !this.milkshakeUserId;
    },
    minlength: [10, 'Password must be at least 10 characters long'],
    select: false // Don't include password in query results by default
  },
  googleId: {
    type: String,
    sparse: true, // Only Google login users have this value
    unique: true
  },
  milkshakeUserId: {
    type: Number,
    sparse: true, // Only Milkshake users have this value
    unique: true
  },
  milkshakeEmail: {
    type: String,
    sparse: true // Milkshake account email
  },
  refreshToken: {
    type: String,
    select: false // Don't include refresh token in query results by default
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Skip if password not modified
  if (!this.isModified('password')) {
    return next();
  }

  // Skip hashing for Google login users
  if (this.googleId && !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login time
userSchema.methods.updateLastLogin = async function() {
  this.lastLogin = Date.now();
  return await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
