const express = require('express');
const router = express.Router();
const { register, login, getMe, getUserById, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/user/:id', protect, getUserById);
router.put('/profile', protect, updateProfile);

module.exports = router;
