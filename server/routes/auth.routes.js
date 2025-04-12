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

        // Check if the user already exists
        const existingUser = await Faculty.findOne({ $or: [{ facultyId }, { facultyEmail: email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already registered' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user in the Faculty collection
        const newUser = new Faculty({
            facultyId,
            facultyEmail: email,
            password: hashedPassword,
            role: 'faculty' // Default role
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
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Ensure password is provided
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Find the user whose token matches and is not expired
        const user = await Faculty.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }  // Ensure the token is not expired
        });

        // If no user is found or the token is invalid/expired
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash and save the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;

        // Clear reset token and expiry
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save(); // Save updated user to the database

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});


// Forgot Password Endpoint
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await Faculty.findOne({ facultyEmail: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Save the hashed token and expiration time in the database
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Send the reset link via email
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'rishithagaddam79@gmail.com', // Replace with your Gmail address
                pass: 'zxnj pjun qhtp nlhn' // Replace with your App Password
            }
        });

        const mailOptions = {
            from: 'no-reply@example.com',
            to: user.facultyEmail,
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

module.exports = router;


