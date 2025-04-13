const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Replace with your User model
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

// Auth routes
router.post('/signup', async (req, res) => {
    try {
        const { facultyId, email, password } = req.body;

        const existingFaculty = await Faculty.findOne({ facultyId });

        if (!existingFaculty) {
            return res.status(404).json({ message: "Faculty ID not found in database" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { facultyId },
                { email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with the provided faculty ID, or email'
            });
        }

        // Create new user
        const newUser = new User({
            username: existingFaculty.facultyName,
            facultyId,
            email,
            password, // Password will be hashed by the pre-save hook
            role: existingFaculty.role,
        });

        await newUser.save();

        res.status(201).json({
            message: 'Registration successful',
            facultyId: newUser.facultyId
        });
    } catch (error) {
        console.error('Signup error:', error);
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

router.get('/profile/:facultyId', async (req, res) => {
    const { facultyId } = req.params;

    try {
        const user = await User.findOne({ facultyId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            username: user.username,
            facultyId: user.facultyId,
            email: user.email,
            phone: user.phone || '',
            mobile: user.mobile || '', // Include mobile in the response
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/profile/:facultyId', async (req, res) => {
    const { facultyId } = req.params;
    const { username, email, phone, mobile } = req.body;

    try {
        const user = await User.findOne({ facultyId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.mobile = mobile || user.mobile; // Update mobile

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/profile/:facultyId/image', upload.single('profileImage'), async (req, res) => {
    const { facultyId } = req.params;

    try {
        const user = await User.findOne({ facultyId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Save the profile image path
        user.profileImage = `uploads/${req.file.filename}`; // Save relative path
        await user.save();

        res.status(200).json({ message: 'Profile image updated successfully', profileImage: user.profileImage });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const user = JSON.parse(localStorage.getItem('user')); // Get facultyId from localStorage
            const response = await axios.put(
                `http://localhost:5000/api/auth/profile/${user.facultyId}/image`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setProfilePhoto(`http://localhost:5000/${response.data.profileImage}`);
            console.log('Profile image updated successfully:', response.data);
        } catch (error) {
            console.error('Error uploading profile image:', error.response?.data?.message || error.message);
        }
    }
};

module.exports = router;
