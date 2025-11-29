const jwt = require('jsonwebtoken');
const { users } = require('../utils/localDB');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            const user = users.findById(decoded.id);
            if (user) {
                const { password: _, ...userData } = user;
                req.user = userData;
                next();
            } else {
                res.status(401).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
