const express = require('express');
const router = express.Router();
const {
    getOpportunities,
    getOpportunity,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    applyToOpportunity,
} = require('../controllers/opportunityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getOpportunities).post(protect, createOpportunity);
router.route('/:id').get(protect, getOpportunity).put(protect, updateOpportunity).delete(protect, deleteOpportunity);
router.route('/:id/apply').put(protect, applyToOpportunity);

module.exports = router;
