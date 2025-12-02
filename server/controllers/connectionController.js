const { connections, users, populateUser } = require('../utils/localDB');

// Helper to populate connection with user data
const populateConnection = (conn) => {
    if (!conn) return null;
    const populated = { ...conn };
    populated.mentor = populateUser(conn.mentor || conn.mentorId);
    populated.mentee = populateUser(conn.mentee || conn.menteeId || conn.student || conn.studentId);
    return populated;
};

// @desc    Get all mentors
// @route   GET /api/connections/mentors
// @access  Private
exports.getMentors = async (req, res) => {
    try {
        const allUsers = users.findAll();
        // Filter mentors: either isMentor is true OR role is 'alumni'
        const mentors = allUsers
            .filter(user => {
                if (!user || user._id === req.user.id) return false;
                // Check if user is a mentor (either isMentor flag or alumni role)
                return (user.isMentor === true) || (user.role === 'alumni');
            })
            .map(user => {
                const { password: _, ...userData } = user;
                return {
                    _id: user._id || user.id,
                    id: user.id || user._id,
                    name: user.name || 'Unknown',
                    email: user.email || '',
                    role: user.role || 'student',
                    headline: user.headline || '',
                    bio: user.bio || '',
                    skills: Array.isArray(user.skills) ? user.skills : [],
                    company: user.company || '',
                    jobTitle: user.jobTitle || '',
                    college: user.college || '',
                    graduationYear: user.graduationYear || null,
                    karma: user.karma || 0,
                };
            });
        
        res.status(200).json(mentors);
    } catch (error) {
        console.error('GetMentors error:', error);
        res.status(500).json({ message: error.message || 'Failed to fetch mentors' });
    }
};

// @desc    Get user's connections
// @route   GET /api/connections
// @access  Private
exports.getConnections = async (req, res) => {
    try {
        const allConnections = connections.findAll();
        const userConnections = allConnections.filter(conn =>
            (conn.mentor === req.user.id || conn.mentorId === req.user.id) ||
            (conn.mentee === req.user.id || conn.menteeId === req.user.id) ||
            (conn.student === req.user.id || conn.studentId === req.user.id)
        );
        
        // Sort by createdAt descending
        userConnections.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Populate user data
        const populatedConnections = userConnections.map(conn => populateConnection(conn));
        
        res.status(200).json(populatedConnections);
    } catch (error) {
        console.error('GetConnections error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request mentorship connection
// @route   POST /api/connections
// @access  Private
exports.requestConnection = async (req, res) => {
    try {
        const { mentorId } = req.body;
        
        if (!mentorId) {
            return res.status(400).json({ message: 'Please provide mentor ID' });
        }
        
        if (mentorId === req.user.id) {
            return res.status(400).json({ message: 'Cannot request yourself as mentor' });
        }
        
        const mentor = users.findById(mentorId);
        
        if (!mentor || !mentor.isMentor) {
            return res.status(400).json({ message: 'User is not a mentor' });
        }
        
        // Check if connection already exists
        const allConnections = connections.findAll();
        const existingConnection = allConnections.find(conn =>
            (conn.mentor === mentorId || conn.mentorId === mentorId) &&
            (conn.mentee === req.user.id || conn.menteeId === req.user.id || conn.student === req.user.id || conn.studentId === req.user.id)
        );
        
        if (existingConnection) {
            return res.status(400).json({ message: 'Connection request already exists' });
        }
        
        const connection = connections.create({
            mentor: mentorId,
            mentorId: mentorId,
            mentee: req.user.id,
            menteeId: req.user.id,
            student: req.user.id,
            studentId: req.user.id,
            status: 'pending',
        });
        
        const populatedConnection = populateConnection(connection);
        res.status(201).json(populatedConnection);
    } catch (error) {
        console.error('RequestConnection error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update connection status
// @route   PUT /api/connections/:id
// @access  Private
exports.updateConnection = async (req, res) => {
    try {
        const { status } = req.body;
        const connection = connections.findById(req.params.id);
        
        if (!connection) {
            return res.status(404).json({ message: 'Connection not found' });
        }
        
        // Only mentor can accept/reject, mentee can cancel
        if (status === 'accepted' || status === 'rejected') {
            const mentorId = connection.mentor || connection.mentorId;
            if (mentorId !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized' });
            }
        }
        
        const updatedConn = connections.update(req.params.id, { status });
        const populatedConnection = populateConnection(updatedConn);
        res.status(200).json(populatedConnection);
    } catch (error) {
        console.error('UpdateConnection error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Schedule session
// @route   POST /api/connections/:id/sessions
// @access  Private
exports.scheduleSession = async (req, res) => {
    try {
        const { scheduledAt, duration, dateTime } = req.body;
        const connection = connections.findById(req.params.id);
        
        if (!connection) {
            return res.status(404).json({ message: 'Connection not found' });
        }
        
        if (connection.status !== 'accepted' && connection.status !== 'active') {
            return res.status(400).json({ message: 'Connection must be accepted to schedule sessions' });
        }
        
        // Check if user is part of this connection
        const mentorId = connection.mentor || connection.mentorId;
        const menteeId = connection.mentee || connection.menteeId || connection.student || connection.studentId;
        
        if (mentorId !== req.user.id && menteeId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        const sessions = connection.sessions || [];
        sessions.push({
            scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : new Date().toISOString(),
            dateTime: dateTime ? new Date(dateTime).toISOString() : (scheduledAt ? new Date(scheduledAt).toISOString() : new Date().toISOString()),
            duration: duration || 60,
            createdAt: new Date().toISOString(),
        });
        
        const updatedConn = connections.update(req.params.id, {
            sessions,
            status: 'active',
        });
        
        const populatedConnection = populateConnection(updatedConn);
        res.status(200).json(populatedConnection);
    } catch (error) {
        console.error('ScheduleSession error:', error);
        res.status(500).json({ message: error.message });
    }
};
