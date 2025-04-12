const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Replace with your User model
const Faculty = require('../models/faculty'); // Use the Faculty model
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Auth routes
router.post('/signup', async (req, res) => {
    try {
        const { facultyId, email, password } = req.body;

        // Check if faculty exists but not registered
        const existingFaculty = await Faculty.findOne({ facultyId });
        if (!existingFaculty) {
            return res.status(404).json({ message: "Faculty ID not found in database" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ facultyId });
        if (existingUser) {
            console.error(existingUser);
            return res.status(400).json({ message: 'User already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update faculty with email and password
        existingFaculty.email = email;
        existingFaculty.password = hashedPassword;
        await existingFaculty.save();

        const newUser = new User({
            facultyId,
            email,
            password: hashedPassword,
            role: existingFaculty.role,
        });

        // Save the user in the database
        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/login', authController.login);

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // 1. Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Generate a plain reset token and hash it
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // 3. Save the hashed token and expiration time
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration time
        await user.save();
        console.log('User updated successfully:', user);

        // 4. Send email with plain reset token in URL
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'rishithagaddam79@gmail.com',
                pass: 'zxnj pjun qhtp nlhn' // App password
            }
        });

        const mailOptions = {
            from: 'no-reply@example.com',
            to: user.email,
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

        // Find the user whose reset token matches and is not expired
        const user = await User.findOne({
            resetPasswordExpires: { $gt: Date.now() }  // Token should not be expired
        });

        // If no user is found or the token is invalid/expired
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Compare the provided token with the hashed token stored in the database
        const isMatch = await bcrypt.compare(token, user.resetPasswordToken);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash and save the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = password;

        // Clear reset token and expiry
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();  // Save updated user to the database
        console.log(user);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

module.exports = router;
