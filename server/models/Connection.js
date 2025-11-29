const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'active', 'completed'],
        default: 'pending',
    },
    sessions: [{
        scheduledAt: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number, // in minutes
            default: 60,
        },
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled'],
            default: 'scheduled',
        },
        notes: {
            type: String,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure one connection per mentor-mentee pair
connectionSchema.index({ mentor: 1, mentee: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
