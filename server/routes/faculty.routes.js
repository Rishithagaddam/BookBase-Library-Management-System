const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty');
const Book = require('../models/book');

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

module.exports = router; 