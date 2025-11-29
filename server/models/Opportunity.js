const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    type: {
        type: String,
        enum: ['job', 'internship', 'referral', 'research', 'volunteer'],
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: 'Remote',
    },
    skills: {
        type: [String],
        default: [],
    },
    applicationLink: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
