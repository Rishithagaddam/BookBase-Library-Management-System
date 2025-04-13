const mongoose = require('mongoose');

const holidaySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Holiday', holidaySchema);