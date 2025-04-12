const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty');
const Book = require('../models/book');
const { verifyToken } = require('../middleware/auth.middleware'); // Import verifyToken middleware

// Middleware to check if user is faculty
const isFaculty = async (req, res, next) => {
    try {
        const faculty = await Faculty.findOne({ facultyId: req.user.facultyId });
        if (!faculty) {
            return res.status(403).json({ message: 'Access denied. Faculty only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get faculty dashboard data
router.get('/dashboard', isFaculty, async (req, res) => {
    try {
        const faculty = await Faculty.findOne({ facultyId: req.user.facultyId })
            .populate('currentlyIssuedBooks');

        res.json({
            facultyId: faculty.facultyId,
            facultyName: faculty.facultyName,
            totalBooksIssued: faculty.totalBooksIssued,
            currentlyIssuedBooks: faculty.currentlyIssuedBooks
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get available books
router.get('/books/available', isFaculty, async (req, res) => {
    try {
        const availableBooks = await Book.find({ status: 'available' });
        res.json(availableBooks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all books
router.get('/books',  async (req, res) => {
    try {
        console.log('Fetching all books...');
        const allBooks = await Book.find();
        console.log('Books fetched:', allBooks);
        res.json(allBooks);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/books/issue/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const { issuedDate } = req.body; // Get issuedDate from the request body

        const book = await Book.findOne({ bookId });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status === 'issued') {
            return res.status(400).json({ message: 'Book is already issued' });
        }

        book.status = 'issued';
        book.issuedDate = issuedDate || new Date(); // Set issuedDate to the provided date or current date
        await book.save();

        res.status(200).json({ message: 'Book issued successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;