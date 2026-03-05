const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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
    default: null
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
    default: null
  },

  // Audio recording info (local storage)
  audio: {
    localPath: {
      type: String,
      default: null
    },
    duration: {
      type: Number,
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
      type: Number,
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

  // Actual data for each type
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'logs'
});


// ==============================
// INDEXES
// ==============================
logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ type: 1 });
logSchema.index({ status: 1 });
logSchema.index({ syncStatus: 1 });
logSchema.index({ milkshakeId: 1 }, { sparse: true });


// ==============================
// STATIC METHODS
// ==============================

// Find logs pending sync
logSchema.statics.findPendingSync = function(userId) {
  return this.find({
    userId,
    status: 'approved',
    syncStatus: 'pending'
  }).sort({ createdAt: 1 });
};

// 🔥 Sync user's logs to JSON mirror file
logSchema.statics.syncUserToJSON = async function(userId) {
  try {
    const logs = await this.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const directoryPath = path.join(__dirname, '../../../command_logs');

    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filePath = path.join(directoryPath, `${userId}.json`);

    fs.writeFileSync(
      filePath,
      JSON.stringify(logs, null, 2),
      'utf8'
    );

    return true;

  } catch (error) {
    console.error('JSON Sync Error:', error);
    return false;
  }
};


// ==============================
// INSTANCE METHODS
// ==============================

// Approve log
logSchema.methods.approve = async function() {
  this.status = 'approved';
  this.approvedAt = new Date();
  return await this.save();
};

// Mark as synced
logSchema.methods.markSynced = async function(milkshakeId) {
  this.milkshakeId = milkshakeId;
  this.milkshakeSyncedAt = new Date();
  this.syncStatus = 'synced';
  this.syncError = null;
  return await this.save();
};

// Mark sync error
logSchema.methods.markSyncError = async function(errorMessage) {
  this.syncStatus = 'error';
  this.syncError = errorMessage;
  return await this.save();
};

// ==============================
// MODEL EXPORT
// ==============================
const Log = mongoose.model('Log', logSchema);
module.exports = Log;