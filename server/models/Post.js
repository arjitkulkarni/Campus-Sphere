const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
        maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    type: {
        type: String,
        enum: ['achievement', 'discussion', 'event', 'opportunity', 'general'],
        default: 'general',
    },
    media: {
        type: [String], // URLs to images/videos
        default: [],
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxlength: 500,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    tags: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Post', postSchema);
