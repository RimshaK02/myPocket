const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  // Log type
  type: {
    type: String,
    enum: ['task', 'note', 'animalEvent', 'animal'],
    required: [true, 'Log type is required']
  },

  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  milkshakeUserId: {
    type: Number
  },

  // Milkshake sync status
  milkshakeId: {
    type: Number,
    default: null  // null means not synced yet
  },
  milkshakeSyncedAt: {
    type: Date,
    default: null
  },
  syncStatus: {
    type: String,
    enum: ['pending', 'synced', 'conflict', 'error'],
    default: 'pending'
  },
  syncError: {
    type: String,
    default: null  // Error message when sync fails
  },

  // Audio recording info (local storage)
  audio: {
    localPath: {
      type: String,
      default: null
    },
    duration: {
      type: Number,  // In seconds
      default: null
    },
    recordedAt: {
      type: Date,
      default: null
    }
  },

  // AI processing result
  ai: {
    transcript: {
      type: String,
      default: null
    },
    confidence: {
      type: Number,  // 0-1
      min: 0,
      max: 1,
      default: null
    },
    processedAt: {
      type: Date,
      default: null
    }
  },

  // Approval status
  status: {
    type: String,
    enum: ['pending', 'approved', 'error'],
    default: 'pending'
  },
  approvedAt: {
    type: Date,
    default: null
  },

  // Actual data for each type (based on Milkshake API schema)
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'logs'
});

// Index settings
logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ type: 1 });
logSchema.index({ status: 1 });
logSchema.index({ syncStatus: 1 });
logSchema.index({ milkshakeId: 1 }, { sparse: true });

// Static method to find logs pending sync
logSchema.statics.findPendingSync = function(userId) {
  return this.find({
    userId,
    status: 'approved',
    syncStatus: 'pending'
  }).sort({ createdAt: 1 });
};

// Instance method to approve log
logSchema.methods.approve = async function() {
  this.status = 'approved';
  this.approvedAt = new Date();
  return await this.save();
};

// Instance method to mark as synced
logSchema.methods.markSynced = async function(milkshakeId) {
  this.milkshakeId = milkshakeId;
  this.milkshakeSyncedAt = new Date();
  this.syncStatus = 'synced';
  this.syncError = null;
  return await this.save();
};

// Instance method to mark sync error
logSchema.methods.markSyncError = async function(errorMessage) {
  this.syncStatus = 'error';
  this.syncError = errorMessage;
  return await this.save();
};

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
