const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    facultyId: { type: String, required: true, unique: true },
    facultyName: { type: String, required: true },
    role: { type: String, enum: ['faculty', 'admin'], default: 'faculty' },
    currentlyIssuedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    totalBooksIssued: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Faculty', facultySchema);