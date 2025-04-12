const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // Make username a required field
        unique: true, // Ensure usernames are unique
        trim: true, // Remove extra spaces
    },
    facultyId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'], // Email validation
    },
    password: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: false, // Optional field
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'], // Validation for 10-digit number
    },
    profileImage: {
        type: String, // Path to the uploaded image
        required: false,
    },
    currentlyIssuedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }] ,// Add this field
    role: { type: String, enum: ['admin', 'faculty'], default: 'faculty' },
    resetPasswordToken: { type: String }, // Token for password reset
    resetPasswordExpires: { type: Date }, // Expiration time for the reset token
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'rishithagaddam79@gmail.com', // Replace with your Gmail address
        pass: 'zxnj pjun qhtp nlhn'    // Replace with the App Password
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;