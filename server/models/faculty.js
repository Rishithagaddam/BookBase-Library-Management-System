const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  facultyName: { type: String, required: true },
  facultyEmail: { type: String, required: true, unique: true },
  password: { type: String }, // Optional password field
  currentlyIssuedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  totalBooksIssued: { type: Number, default: 0 },
  role: { type: String, enum: ['faculty', 'admin'], default: 'faculty' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
});

const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;