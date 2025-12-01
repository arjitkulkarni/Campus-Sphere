const { opportunities, users, populateUser, populateUsers } = require('../utils/localDB');

// Helper to populate opportunity with user data
const populateOpportunity = (opp) => {
    if (!opp) return null;
    const populated = { ...opp };
    populated.postedBy = populateUser(opp.postedBy);
    populated.applicants = populateUsers(opp.applicants || []);
    return populated;
};

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Private
exports.getOpportunities = async (req, res) => {
    try {
        const { type, isActive } = req.query;
        const filters = {};
        
        if (type) filters.type = type;
        if (isActive !== undefined) filters.isActive = isActive;
        
        let allOpps = opportunities.findAll(filters);
        // Sort by createdAt descending
        allOpps.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Populate user data
        const populatedOpps = allOpps.map(opp => populateOpportunity(opp));
        
        res.status(200).json(populatedOpps);
    } catch (error) {
        console.error('GetOpportunities error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
// @access  Private
exports.getOpportunity = async (req, res) => {
    try {
        const opportunity = opportunities.findById(req.params.id);
        
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        const populatedOpp = populateOpportunity(opportunity);
        res.status(200).json(populatedOpp);
    } catch (error) {
        console.error('GetOpportunity error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create opportunity
// @route   POST /api/opportunities
// @access  Private
exports.createOpportunity = async (req, res) => {
    try {
        const { title, description, type, company, location, skills, applicationLink, deadline } = req.body;
        
        if (!title || !description || !type || !company) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }
        
        const opportunity = opportunities.create({
            postedBy: req.user.id,
            title,
            description,
            type,
            company,
            location: location || 'Remote',
            skills: skills || [],
            applicationLink,
            deadline,
        });
        
        const populatedOpp = populateOpportunity(opportunity);
        res.status(201).json(populatedOpp);
    } catch (error) {
        console.error('CreateOpportunity error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private
exports.updateOpportunity = async (req, res) => {
    try {
        const opportunity = opportunities.findById(req.params.id);
        
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Check if user owns the opportunity
        if (opportunity.postedBy !== req.user.id && opportunity.postedBy?._id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        const updatedOpp = opportunities.update(req.params.id, req.body);
        const populatedOpp = populateOpportunity(updatedOpp);
        res.status(200).json(populatedOpp);
    } catch (error) {
        console.error('UpdateOpportunity error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private
exports.deleteOpportunity = async (req, res) => {
    try {
        const opportunity = opportunities.findById(req.params.id);
        
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        // Check if user owns the opportunity
        if (opportunity.postedBy !== req.user.id && opportunity.postedBy?._id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        opportunities.delete(req.params.id);
        res.status(200).json({ message: 'Opportunity deleted' });
    } catch (error) {
        console.error('DeleteOpportunity error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Apply to opportunity
// @route   PUT /api/opportunities/:id/apply
// @access  Private
exports.applyToOpportunity = async (req, res) => {
    try {
        const opportunity = opportunities.findById(req.params.id);
        
        if (!opportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }
        
        if (!opportunity.isActive) {
            return res.status(400).json({ message: 'Opportunity is no longer active' });
        }
        
        const applicants = opportunity.applicants || [];
        const hasApplied = applicants.includes(req.user.id) || applicants.some(app =>
            (typeof app === 'object' ? app._id || app.id : app) === req.user.id
        );
        
        if (hasApplied) {
            return res.status(400).json({ message: 'Already applied' });
        }
        
        const updatedApplicants = [...applicants, req.user.id];
        const updatedOpp = opportunities.update(req.params.id, { applicants: updatedApplicants });

        // Increment user karma for applying to an opportunity
        try {
            const user = users.findById(req.user.id);
            if (user) {
                const currentKarma = typeof user.karma === 'number' ? user.karma : 0;
                const updatedKarma = currentKarma + 15; // +15 karma per application
                users.update(req.user.id, { karma: updatedKarma });
            }
        } catch (karmaError) {
            console.error('ApplyToOpportunity karma update error:', karmaError);
        }

        const populatedOpp = populateOpportunity(updatedOpp);
        res.status(200).json(populatedOpp);
    } catch (error) {
        console.error('ApplyToOpportunity error:', error);
        res.status(500).json({ message: error.message });
    }
};
