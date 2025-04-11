const bcrypt = require('bcryptjs');
const Faculty = require('../models/faculty');

exports.signup = async (req, res) => {
    try {
        const { facultyId, email, password } = req.body;

        // Check if faculty exists with this email or facultyId
        const existingFaculty = await Faculty.findOne({
            $or: [
                { facultyId },
                { email }
            ]
        });
        
        if (existingFaculty) {
            return res.status(400).json({ message: "Faculty already registered" });
        }

        // Create new faculty
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newFaculty = new Faculty({
            facultyId,
            email,
            password: hashedPassword,
            role: 'faculty' // Default role
        });

        await newFaculty.save();
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.login = async (req, res) => {
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
}; 