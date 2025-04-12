const Broadcast = require('../models/Broadcast');

exports.createBroadcast = async (req, res) => {
    try {
        const { title, content, priority, expiresIn } = req.body;
        const broadcast = new Broadcast({
            title,
            content,
            priority,
            expiresIn,
            expiresAt: new Date(Date.now() + parseInt(expiresIn) * 60 * 60 * 1000)
        });

        await broadcast.save();
        res.status(201).json(broadcast);
    } catch (error) {
        res.status(500).json({ message: 'Error creating broadcast message' });
    }
};

exports.getBroadcasts = async (req, res) => {
    try {
        const broadcasts = await Broadcast.find()
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(broadcasts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching broadcasts' });
    }
};