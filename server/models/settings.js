const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Holiday', holidaySchema);

const settingsSchema = new mongoose.Schema({
    workingHours: {
        start: { type: String, required: true },
        end: { type: String, required: true }
    }
});

module.exports = mongoose.model('Settings', settingsSchema);