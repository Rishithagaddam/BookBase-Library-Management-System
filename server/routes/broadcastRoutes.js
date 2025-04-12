const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { createBroadcast, getBroadcasts } = require('../controllers/broadcastController');

// Admin routes
router.post('/broadcast', authMiddleware, adminMiddleware, createBroadcast);
router.get('/broadcasts', authMiddleware, getBroadcasts);

module.exports = router;