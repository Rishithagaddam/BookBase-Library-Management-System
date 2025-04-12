const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String },
    category: {
        type: String,
        enum: ['Subject', 'Research', 'General', 'Magazine'],
        required: true
    },
    reason: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);