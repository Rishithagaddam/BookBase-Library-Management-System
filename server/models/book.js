const mongoose = require('mongoose'); // Import mongoose

const bookSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
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
    placeLocated: { type: String, default: null },
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;