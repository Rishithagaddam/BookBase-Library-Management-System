const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookId: { type: String, required: true },  // Corrected to Number
    author: String,
    title: String,
    publisher: String,
    source: String,
    category: String,
    status: {
        type: String,
        enum: ['available', 'issued'],
        default: 'available',
    },
    issuedDate: { type: Date, default: null },
    placeLocated: { type: String, default: null },  // Place where the book is located
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;