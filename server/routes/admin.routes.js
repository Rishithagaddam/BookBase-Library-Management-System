const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty');
const Book = require('../models/book');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const faculty = await Faculty.findOne({ facultyId: req.user.facultyId });
        if (!faculty || faculty.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get dashboard statistics
router.get('/dashboard/stats', isAdmin, async (req, res) => {
    try {
        const totalFaculty = await Faculty.countDocuments();
        const totalBooks = await Book.countDocuments();
        const availableBooks = await Book.countDocuments({ status: 'available' });
        const issuedBooks = await Book.countDocuments({ status: 'issued' });

        res.json({
            totalFaculty,
            totalBooks,
            availableBooks,
            issuedBooks
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all faculty members
router.get('/faculty', isAdmin, async (req, res) => {
    try {
        const faculty = await Faculty.find().select('-password');
        res.json(faculty);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router; 