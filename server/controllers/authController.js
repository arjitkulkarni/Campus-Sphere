const { users } = require('../utils/localDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all required fields (name, email, password)' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // Check if user exists
        const userExists = users.findByEmail(email.toLowerCase().trim());
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Validate role
        const validRoles = ['student', 'alumni', 'faculty', 'admin'];
        const userRole = role && validRoles.includes(role.toLowerCase()) ? role.toLowerCase() : 'student';

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = users.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: userRole,
            college: '',
            graduationYear: null,
            isEmployed: false,
            company: '',
            jobTitle: '',
            isMentor: false,
            bio: '',
            skills: [],
            karma: 0,
            headline: '',
        });

        if (user) {
            // Remove password from response
            const { password: _, ...userResponse } = user;
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            message: error.message || 'Server error during registration. Please try again.' 
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = users.findByEmail(email);

        if (user && user.password) {
            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id),
                    // Return onboarding status fields to help frontend redirect
                    college: user.college,
                    isEmployed: user.isEmployed
                });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = users.findById(req.user.id);
        if (user) {
            // Remove password from response
            const { password: _, ...userResponse } = user;
            res.status(200).json(userResponse);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile (Onboarding)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const user = users.findById(req.user.id);

        if (user) {
            const updates = {
                college: req.body.college !== undefined ? req.body.college : user.college,
                graduationYear: req.body.graduationYear !== undefined ? req.body.graduationYear : user.graduationYear,
                isEmployed: req.body.isEmployed !== undefined ? req.body.isEmployed : user.isEmployed,
                company: req.body.company !== undefined ? req.body.company : user.company,
                jobTitle: req.body.jobTitle !== undefined ? req.body.jobTitle : user.jobTitle,
                isMentor: req.body.isMentor !== undefined ? req.body.isMentor : user.isMentor,
                bio: req.body.bio !== undefined ? req.body.bio : user.bio,
                skills: req.body.skills !== undefined ? req.body.skills : user.skills,
                headline: req.body.headline !== undefined ? req.body.headline : user.headline,
            };

            const updatedUser = users.update(req.user.id, updates);

            if (updatedUser) {
                const { password: _, ...userResponse } = updatedUser;
                res.json({
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    token: generateToken(updatedUser._id),
                    college: updatedUser.college,
                    isEmployed: updatedUser.isEmployed
                });
            } else {
                res.status(400).json({ message: 'Failed to update profile' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('UpdateProfile error:', error);
        res.status(500).json({ message: error.message });
    }
};
