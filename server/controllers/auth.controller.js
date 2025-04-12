const bcrypt = require('bcryptjs');
const Faculty = require('../models/faculty');
const User = require('../models/user');

exports.login = async (req, res) => {
    try {
        const { facultyId, password } = req.body;

        // Find faculty
        const faculty = await User.findOne({ facultyId });
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