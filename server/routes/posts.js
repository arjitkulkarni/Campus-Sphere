const express = require('express');
const router = express.Router();
const {
    getPosts,
    getMyPosts,
    getPostsByUserId,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPosts).post(protect, createPost);
router.route('/me').get(protect, getMyPosts);
router.route('/user/:userId').get(protect, getPostsByUserId);
router.route('/:id').get(protect, getPost).put(protect, updatePost).delete(protect, deletePost);
router.route('/:id/like').put(protect, likePost);
router.route('/:id/comment').post(protect, addComment);

module.exports = router;
