const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Faculty = require('./models/faculty');

// Import routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const facultyRoutes = require('./routes/faculty.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { facultyId, email, password } = req.body;

        // Check if faculty exists but not registered
        const existingFaculty = await Faculty.findOne({ facultyId });
        
        if (!existingFaculty) {
            return res.status(404).json({ message: "Faculty ID not found in database" });
        }

        if (existingFaculty.password) {
            return res.status(400).json({ message: "Faculty already registered" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update faculty with password
        existingFaculty.password = hashedPassword;
        existingFaculty.email = email;
        await existingFaculty.save();

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { facultyId, password } = req.body;

        // Find faculty
        const faculty = await Faculty.findOne({ facultyId });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, faculty.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Send response with role for redirection
        res.status(200).json({
            message: "Login successful",
            role: faculty.role,
            facultyId: faculty.facultyId,
            email: faculty.email
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));