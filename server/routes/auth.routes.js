const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// Replace with your Faculty model
const Faculty = require('../models/faculty'); // Use the Faculty model
const router = express.Router();
const authController = require('../controllers/auth.controller');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/login', authController.login);

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // 1. Find the faculty by email
        const faculty = await Faculty.findOne({ email });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // 2. Generate a plain reset token and hash it
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // 3. Save the hashed token and expiration time
        faculty.resetPasswordToken = hashedToken;
        faculty.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration time
        await faculty.save();
        console.log('Faculty updated successfully:', faculty);

        // 4. Send email with plain reset token in URL
        const resetLink = `http://:5173/reset-password/${resetToken}`;
        
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                faculty: 'rishithagaddam79@gmail.com',
                pass: 'zxnj pjun qhtp nlhn' // App password
            }
        });

        const mailOptions = {
            from: 'no-reply@example.com',
            to: faculty.email,
            subject: 'Password Reset',
            text: `You requested a password reset. Click the link to reset your password: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Failed to send password reset email' });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;  // Token from URL
    const { password } = req.body; // New password from request body

    try {
        // Ensure password is provided
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Find the faculty whose reset token matches and is not expired
        const faculty = await Faculty.findOne({
            resetPasswordExpires: { $gt: Date.now() }  // Token should not be expired
        });

        // If no faculty is found or the token is invalid/expired
        if (!faculty) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Compare the provided token with the hashed token stored in the database
        const isMatch = await bcrypt.compare(token, faculty.resetPasswordToken);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash and save the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        faculty.password = password;

        // Clear reset token and expiry
        faculty.resetPasswordToken = undefined;
        faculty.resetPasswordExpires = undefined;

        await faculty.save();  // Save updated faculty to the database
        console.log(faculty);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

router.get('/profile/:facultyId', async (req, res) => {
    const { facultyId } = req.params;

    try {
        const faculty = await Faculty.findOne({ facultyId });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        res.status(200).json({
            facultyname: faculty.facultyname,
            facultyId: faculty.facultyId,
            email: faculty.email,
            phone: faculty.phone || '',
            mobile: faculty.mobile || '', // Include mobile in the response
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/profile/:facultyId', async (req, res) => {
    const { facultyId } = req.params;
    const { facultyname, email, phone, mobile } = req.body;

    try {
        const faculty = await Faculty.findOne({ facultyId });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        faculty.facultyname = facultyname || faculty.facultyname;
        faculty.email = email || faculty.email;
        faculty.phone = phone || faculty.phone;
        faculty.mobile = mobile || faculty.mobile; // Update mobile

        await faculty.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/profile/:facultyId/image', upload.single('profileImage'), async (req, res) => {
    const { facultyId } = req.params;

    try {
        const faculty = await Faculty.findOne({ facultyId });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        // Save the profile image path
        faculty.profileImage = `uploads/${req.file.filename}`; // Save relative path
        await faculty.save();

        res.status(200).json({ message: 'Profile image updated successfully', profileImage: faculty.profileImage });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
