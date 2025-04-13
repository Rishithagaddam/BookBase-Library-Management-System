const express = require('express');
const router = express.Router();
const Faculty = require('../models/faculty');
const Book = require('../models/book');
const Feedback = require('../models/feedback');
const Holiday = require('../models/settings');
const User = require('../models/user');

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
router.get('/dashboard/stats', async (req, res) => {
    try {
        const [totalFaculty, totalBooks, availableBooks, issuedBooks, pendingFeedbacks] = await Promise.all([
            Faculty.countDocuments(),
            Book.countDocuments(),
            Book.countDocuments({ status: 'available' }),
            Book.countDocuments({ status: 'issued' }),
            Feedback.countDocuments({ status: 'Pending' })
        ]);

        res.json({
            totalFaculty,
            totalBooks,
            availableBooks,
            issuedBooks,
            pendingFeedbacks
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all faculty members
router.get('/faculty', async (req, res) => {
    try {
        const faculty = await Faculty.find()
            .select('-__v')
            .populate('currentlyIssuedBooks');
        res.json(faculty);
    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new faculty
router.post('/faculty', async (req, res) => {
    try {
        const { facultyId, facultyName, role } = req.body;

        const existingFaculty = await Faculty.findOne({ facultyId });
        if (existingFaculty) {
            return res.status(400).json({ message: 'Faculty ID already exists' });
        }

        const faculty = new Faculty({
            facultyId,
            facultyName,
            role: role || 'faculty',
            currentlyIssuedBooks: [],
            totalBooksIssued: 0
        });

        const savedFaculty = await faculty.save();
        res.status(201).json(savedFaculty);
    } catch (error) {
        console.error('Error adding faculty:', error);
        res.status(500).json({ message: 'Error adding faculty', error: error.message });
    }
});

// Remove faculty by facultyId (not _id)
router.delete('/faculty', async (req, res) => {
    try {
        const facultyIds = req.body.facultyIds; // Array of faculty IDs to delete

        if (!Array.isArray(facultyIds) || facultyIds.length === 0) {
            return res.status(400).json({ message: 'No faculty IDs provided' });
        }

        // Loop through faculty IDs to check and delete each one
        for (const facultyId of facultyIds) {
            const faculty = await Faculty.findOne({ facultyId });

            if (!faculty) {
                return res.status(404).json({ message: `Faculty with ID ${facultyId} not found` });
            }

            // Check if the faculty has any currently issued books
            if (Array.isArray(faculty.currentlyIssuedBooks) && faculty.currentlyIssuedBooks.length > 0) {
                return res.status(400).json({ message: `Cannot remove faculty with ID ${facultyId} as they have issued books` });
            }

            // Delete faculty and user associated with the facultyId
            await Promise.all([
                Faculty.deleteOne({ facultyId }),
                User.deleteOne({ facultyId })
            ]);
        }

        res.status(200).json({ message: 'Faculties removed successfully from all tables' });
    } catch (error) {
        console.error('Error removing faculty:', error.stack); // Log error stack for better debugging
        res.status(500).json({ message: 'Error removing faculty', error: error.message });
    }
});


router.patch('/faculty/:facultyId/status', async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.facultyId);
        
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        if (req.body.status === 'inactive' && faculty.currentlyIssuedBooks?.length > 0) {
            return res.status(400).json({ message: 'Cannot deactivate faculty with issued books' });
        }

        faculty.status = req.body.status;
        await faculty.save();
        
        res.status(200).json({ message: 'Faculty status updated successfully', faculty });
    } catch (error) {
        console.error('Error updating faculty status:', error);
        res.status(500).json({ message: 'Error updating faculty status', error: error.message });
    }
});

// Get all feedbacks with filters
router.get('/feedbacks', async (req, res) => {
    try {
        const { status = 'all' } = req.query;
        const query = status !== 'all' ? { status } : {};
        
        const feedbacks = await Feedback.find(query)
            .sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update feedback status
router.put('/feedbacks/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add admin response to feedback
router.put('/feedbacks/:id/respond', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { 
                adminResponse: req.body.adminResponse,
                status: 'Resolved'
            },
            { new: true }
        );
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get working hours
router.get('/settings/working-hours', async (req, res) => {
    try {
        // Default working hours if not set
        res.json({ start: '09:00', end: '17:00' });
    } catch (error) {
        console.error('Error fetching working hours:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update working hours
router.post('/settings/working-hours', async (req, res) => {
    try {
        const { start, end } = req.body;
        // Save to database if you have a settings model
        res.json({ start, end });
    } catch (error) {
        console.error('Error updating working hours:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get holidays
router.get('/settings/holidays', async (req, res) => {
    try {
        const holidays = await Holiday.find().sort({ date: 1 });
        res.json(holidays);
    } catch (error) {
        console.error('Error fetching holidays:', error);
        res.status(500).json({ message: 'Error fetching holidays' });
    }
});

// Add holiday
router.post('/settings/holidays', async (req, res) => {
    try {
        const holiday = new Holiday(req.body);
        await holiday.save();
        res.status(201).json(holiday);
    } catch (error) {
        console.error('Error adding holiday:', error);
        res.status(500).json({ message: 'Error adding holiday' });
    }
});

// Remove holiday
router.delete('/settings/holidays/:id', async (req, res) => {
    try {
        const holiday = await Holiday.findByIdAndDelete(req.params.id);
        if (!holiday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }
        res.json({ message: 'Holiday removed successfully' });
    } catch (error) {
        console.error('Error removing holiday:', error);
        res.status(500).json({ message: 'Error removing holiday' });
    }
});

// Get all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books' });
    }
});

// Search book by ID
router.get('/books/search', async (req, res) => {
    try {
        const { bookId } = req.query;
        const book = await Book.findOne({ bookId });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        console.error('Error searching book:', error);
        res.status(500).json({ message: 'Error searching book' });
    }
});

// Add new book
router.post('/books', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Error adding book' });
    }
});

// Update book
router.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true }
        );
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        res.json(book);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Error updating book' });
    }
});

// Remove book
router.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book removed successfully' });
    } catch (error) {
        console.error('Error removing book:', error);
        res.status(500).json({ message: 'Error removing book' });
    }
});

module.exports = router;