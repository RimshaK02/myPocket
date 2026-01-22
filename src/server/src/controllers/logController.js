const Log = require('../models/Log');
const User = require('../models/User');
const MilkshakeClient = require('../milkshake_api/client');

/**
 * Get all logs for the authenticated user
 * GET /api/logs
 */
const getLogs = async (req, res) => {
  try {
    const { type, status, syncStatus, limit = 50, offset = 0 } = req.query;

    const filter = { userId: req.user._id };

    if (type) {
      filter.type = type;
    }
    if (status) {
      filter.status = status;
    }
    if (syncStatus) {
      filter.syncStatus = syncStatus;
    }

    const logs = await Log.find(filter)
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await Log.countDocuments(filter);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch logs',
      error: error.message
    });
  }
};

/**
 * Get a single log by ID
 * GET /api/logs/:id
 */
const getLog = async (req, res) => {
  try {
    const log = await Log.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Get log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch log',
      error: error.message
    });
  }
};

/**
 * Create a new log
 * POST /api/logs
 */
const createLog = async (req, res) => {
  try {
    const { type, data, audio, ai } = req.body;

    // Validate required fields
    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Log type is required'
      });
    }

    // Get user settings for auto-approve
    const user = await User.findById(req.user._id);
    const autoApprove = user?.settings?.autoApprove || false;

    const log = new Log({
      type,
      userId: req.user._id,
      milkshakeUserId: req.user.milkshakeUserId,
      data: data || {},
      audio: audio || {},
      ai: ai || {},
      status: autoApprove ? 'approved' : 'pending',
      approvedAt: autoApprove ? new Date() : null
    });

    await log.save();

    // If auto-approve is enabled, try to sync with Milkshake
    if (autoApprove && req.user.milkshakeUserId) {
      await syncLogToMilkshake(log, req.milkshakeCookie);
    }

    res.status(201).json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Create log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create log',
      error: error.message
    });
  }
};

/**
 * Update a log
 * PATCH /api/logs/:id
 */
const updateLog = async (req, res) => {
  try {
    const { data, audio, ai, status } = req.body;

    const log = await Log.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    // Update fields if provided
    if (data) {
      log.data = { ...log.data, ...data };
    }
    if (audio) {
      log.audio = { ...log.audio, ...audio };
    }
    if (ai) {
      log.ai = { ...log.ai, ...ai };
    }
    if (status && status !== log.status) {
      log.status = status;
      if (status === 'approved') {
        log.approvedAt = new Date();
      }
    }

    await log.save();

    // If status changed to approved, try to sync with Milkshake
    if (status === 'approved' && log.syncStatus === 'pending' && req.user.milkshakeUserId) {
      await syncLogToMilkshake(log, req.milkshakeCookie);
    }

    // If already synced, update on Milkshake too (bidirectional sync)
    if (log.milkshakeId && data) {
      await updateLogOnMilkshake(log, req.milkshakeCookie);
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Update log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update log',
      error: error.message
    });
  }
};

/**
 * Delete a log
 * DELETE /api/logs/:id
 */
const deleteLog = async (req, res) => {
  try {
    const log = await Log.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    // If synced with Milkshake, delete there too (bidirectional sync)
    if (log.milkshakeId) {
      await deleteLogOnMilkshake(log, req.milkshakeCookie);
    }

    await Log.deleteOne({ _id: log._id });

    res.json({
      success: true,
      message: 'Log deleted successfully'
    });
  } catch (error) {
    console.error('Delete log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete log',
      error: error.message
    });
  }
};

/**
 * Approve a single log
 * POST /api/logs/:id/approve
 */
const approveLog = async (req, res) => {
  try {
    const log = await Log.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Log not found'
      });
    }

    if (log.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Log is already approved'
      });
    }

    await log.approve();

    // Try to sync with Milkshake
    if (req.user.milkshakeUserId) {
      await syncLogToMilkshake(log, req.milkshakeCookie);
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Approve log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve log',
      error: error.message
    });
  }
};

/**
 * Approve all pending logs
 * POST /api/logs/approve-all
 */
const approveAllLogs = async (req, res) => {
  try {
    const pendingLogs = await Log.find({
      userId: req.user._id,
      status: 'pending'
    });

    const results = [];

    for (const log of pendingLogs) {
      await log.approve();

      // Try to sync with Milkshake
      if (req.user.milkshakeUserId) {
        await syncLogToMilkshake(log, req.milkshakeCookie);
      }

      results.push(log);
    }

    res.json({
      success: true,
      message: `${results.length} logs approved`,
      data: results
    });
  } catch (error) {
    console.error('Approve all logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve logs',
      error: error.message
    });
  }
};

/**
 * Sync pending logs to Milkshake
 * POST /api/logs/sync
 */
const syncLogs = async (req, res) => {
  try {
    if (!req.user.milkshakeUserId) {
      return res.status(400).json({
        success: false,
        message: 'User is not connected to Milkshake'
      });
    }

    const pendingLogs = await Log.findPendingSync(req.user._id);
    const results = { synced: [], failed: [] };

    for (const log of pendingLogs) {
      const success = await syncLogToMilkshake(log, req.milkshakeCookie);
      if (success) {
        results.synced.push(log._id);
      } else {
        results.failed.push(log._id);
      }
    }

    res.json({
      success: true,
      message: `Synced ${results.synced.length} logs, ${results.failed.length} failed`,
      data: results
    });
  } catch (error) {
    console.error('Sync logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync logs',
      error: error.message
    });
  }
};

/**
 * Update user settings (autoApprove)
 * PATCH /api/logs/settings
 */
const updateSettings = async (req, res) => {
  try {
    const { autoApprove } = req.body;

    const user = await User.findById(req.user._id);

    if (typeof autoApprove === 'boolean') {
      user.settings = user.settings || {};
      user.settings.autoApprove = autoApprove;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        autoApprove: user.settings?.autoApprove || false
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
};

/**
 * Get user settings
 * GET /api/logs/settings
 */
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        autoApprove: user.settings?.autoApprove || false
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get settings',
      error: error.message
    });
  }
};

// ==================== Helper Functions ====================

/**
 * Sync a log to Milkshake API
 * @param {Object} log - Log document
 * @param {string} cookie - Milkshake auth cookie
 * @returns {boolean} Success status
 */
async function syncLogToMilkshake(log, cookie) {
  if (!cookie) {
    await log.markSyncError('No Milkshake authentication');
    return false;
  }

  try {
    const client = new MilkshakeClient();
    client.setAuth(cookie);

    let result;

    switch (log.type) {
      case 'task':
        result = await client.createTask(log.data);
        break;
      case 'note':
        result = await client.createNote(log.data);
        break;
      case 'animalEvent':
        result = await client.createAnimalEvent(log.data);
        break;
      case 'animal':
        result = await client.createAnimal(log.data);
        break;
      default:
        await log.markSyncError(`Unknown log type: ${log.type}`);
        return false;
    }

    if (result.success && result.data?.id) {
      await log.markSynced(result.data.id);
      return true;
    } else {
      await log.markSyncError(result.error || 'Unknown error');
      return false;
    }
  } catch (error) {
    await log.markSyncError(error.message);
    return false;
  }
}

/**
 * Update a log on Milkshake API (bidirectional sync)
 * @param {Object} log - Log document
 * @param {string} cookie - Milkshake auth cookie
 */
async function updateLogOnMilkshake(log, cookie) {
  if (!cookie || !log.milkshakeId) return;

  try {
    const client = new MilkshakeClient();
    client.setAuth(cookie);

    switch (log.type) {
      case 'task':
        await client.updateTask(log.milkshakeId, log.data);
        break;
      case 'animal':
        await client.updateAnimal(log.milkshakeId, log.data);
        break;
      // Notes and animal events don't have update endpoints in the API
    }
  } catch (error) {
    console.error('Update on Milkshake error:', error.message);
  }
}

/**
 * Delete a log from Milkshake API (bidirectional sync)
 * @param {Object} log - Log document
 * @param {string} cookie - Milkshake auth cookie
 */
async function deleteLogOnMilkshake(log, cookie) {
  if (!cookie || !log.milkshakeId) return;

  try {
    const client = new MilkshakeClient();
    client.setAuth(cookie);

    switch (log.type) {
      case 'task':
        await client.deleteTask(log.milkshakeId);
        break;
      case 'animalEvent':
        await client.deleteAnimalEvent(log.milkshakeId);
        break;
      // Notes and animals don't have delete endpoints in the Capstone API
    }
  } catch (error) {
    console.error('Delete on Milkshake error:', error.message);
  }
}

module.exports = {
  getLogs,
  getLog,
  createLog,
  updateLog,
  deleteLog,
  approveLog,
  approveAllLogs,
  syncLogs,
  updateSettings,
  getSettings
};
