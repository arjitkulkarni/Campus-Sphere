const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['student', 'alumni', 'faculty', 'admin'],
        default: 'student',
    },
    // Onboarding Fields
    college: {
        type: String,
        default: '',
    },
    graduationYear: {
        type: Number,
    },
    // Professional Info (for Alumni/Mentors)
    isEmployed: {
        type: Boolean,
        default: false,
    },
    company: {
        type: String,
        default: '',
    },
    jobTitle: {
        type: String,
        default: '',
    },
    isMentor: {
        type: Boolean,
        default: false,
    },
    bio: {
        type: String,
        maxlength: 500,
        default: '',
    },
    skills: {
        type: [String],
        default: [],
    },
    karma: {
        type: Number,
        default: 0,
    },
    headline: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
