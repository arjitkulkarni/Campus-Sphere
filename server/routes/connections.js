const express = require('express');
const router = express.Router();
const {
    getMentors,
    getConnections,
    requestConnection,
    updateConnection,
    scheduleSession,
} = require('../controllers/connectionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/mentors', protect, getMentors);
router.route('/').get(protect, getConnections).post(protect, requestConnection);
router.route('/:id').put(protect, updateConnection);
router.route('/:id/sessions').post(protect, scheduleSession);

module.exports = router;
