const express = require('express');
const router = express.Router();
const Broadcast = require('../models/Broadcast');

// Get all active broadcasts
router.get('/broadcasts', async (req, res) => {
    try {
        const broadcasts = await Broadcast.find({
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });
        res.json(broadcasts);
    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        res.status(500).json({ message: 'Error fetching broadcasts' });
    }
});

router.post('/broadcast', async (req, res) => {
    try {
        const { title, content, priority, expiresIn } = req.body;
        const broadcast = new Broadcast({
            title,
            content,
            priority: priority || 'normal',
            expiresIn,
            expiresAt: new Date(Date.now() + parseInt(expiresIn) * 60 * 60 * 1000)
        });
        await broadcast.save();
        res.status(201).json(broadcast);
    } catch (error) {
        console.error('Error creating broadcast:', error);
        res.status(500).json({ message: 'Error creating broadcast' });
    }
});

module.exports = router;