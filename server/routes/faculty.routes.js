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
router.get('/dashboard', async (req, res) => {
    try {
        // Changed: Get facultyId from query parameters
        const { facultyId } = req.query;

        if (!facultyId) {
            return res.status(400).json({ message: 'Invalid user data: facultyId is missing' });
        }

        const faculty = await Faculty.findOne({ facultyId }).populate('currentlyIssuedBooks');
        
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        console.log('Faculty found:', faculty); // Add this for debugging

        res.json({
            facultyId: faculty.facultyId,
            facultyName: faculty.facultyName,
            totalBooksIssued: faculty.totalBooksIssued,
            currentlyIssuedBooks: faculty.currentlyIssuedBooks,
        });
    } catch (error) {
        console.error('Error in dashboard route:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get available books
router.get('/books/available', async (req, res) => {
    try {
        const availableBooks = await Book.find({ status: 'available' });
        res.json(availableBooks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all books
router.get('/books', async (req, res) => {
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

// Issue a book
router.put('/books/issue/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const { issuedDate, facultyId } = req.body;

        // Find the book using MongoDB _id
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status === 'issued') {
            return res.status(400).json({ message: 'Book is already issued' });
        }

        // Update book status
        book.status = 'issued';
        book.issuedDate = issuedDate || new Date();
        await book.save();

        // Update faculty's currentlyIssuedBooks
        const faculty = await Faculty.findOne({ facultyId });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        faculty.currentlyIssuedBooks.push(book._id);
        faculty.totalBooksIssued += 1;
        await faculty.save();

        res.status(200).json({ 
            message: 'Book issued successfully', 
            book,
            faculty: {
                totalBooksIssued: faculty.totalBooksIssued,
                currentlyIssuedBooks: faculty.currentlyIssuedBooks
            }
        });
    } catch (error) {
        console.error('Error issuing book:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Return a book
router.put('/books/return/:bookId', async (req, res) => {
    try {
        const { bookId } = req.params;
        const { facultyId } = req.body;

        // Find the book using MongoDB _id
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status !== 'issued') {
            return res.status(400).json({ message: 'Book is not currently issued' });
        }

        // Update book status
        book.status = 'available';
        book.issuedDate = null;
        await book.save();

        // Remove book from faculty's currentlyIssuedBooks
        const faculty = await Faculty.findOne({ facultyId });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        faculty.currentlyIssuedBooks = faculty.currentlyIssuedBooks.filter(
            (issuedBookId) => issuedBookId.toString() !== bookId
        );
        faculty.totalBooksIssued -= 1;
        await faculty.save();

        res.status(200).json({ 
            message: 'Book returned successfully',
            book,
            faculty: {
                totalBooksIssued: faculty.totalBooksIssued,
                currentlyIssuedBooks: faculty.currentlyIssuedBooks
            }
        });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;