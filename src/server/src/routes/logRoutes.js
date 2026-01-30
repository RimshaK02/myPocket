const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/logController');
const { authenticate } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticate);

// Settings routes (must be before /:id routes)
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);

// Bulk actions
router.post('/approve-all', approveAllLogs);
router.post('/sync', syncLogs);

// Single log actions
router.post('/:id/approve', approveLog);

// CRUD routes
router.get('/', getLogs);
router.get('/:id', getLog);
router.post('/', createLog);
router.patch('/:id', updateLog);
router.delete('/:id', deleteLog);

module.exports = router;
