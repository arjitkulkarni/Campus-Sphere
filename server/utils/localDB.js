const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const OPPORTUNITIES_FILE = path.join(DATA_DIR, 'opportunities.json');
const CONNECTIONS_FILE = path.join(DATA_DIR, 'connections.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize empty files if they don't exist
const initFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
};

initFile(USERS_FILE);
initFile(POSTS_FILE);
initFile(OPPORTUNITIES_FILE);
initFile(CONNECTIONS_FILE);

// Helper functions to read/write JSON files
const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeData = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// User operations
const users = {
    findAll: () => readData(USERS_FILE),
    findById: (id) => {
        const users = readData(USERS_FILE);
        return users.find(u => u._id === id || u.id === id);
    },
    findByEmail: (email) => {
        const users = readData(USERS_FILE);
        return users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
    },
    create: (userData) => {
        const users = readData(USERS_FILE);
        const newUser = {
            _id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            id: null, // Will be set to _id
            ...userData,
            createdAt: new Date().toISOString(),
        };
        newUser.id = newUser._id;
        users.push(newUser);
        writeData(USERS_FILE, users);
        return newUser;
    },
    update: (id, updates) => {
        const users = readData(USERS_FILE);
        const index = users.findIndex(u => u._id === id || u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            writeData(USERS_FILE, users);
            return users[index];
        }
        return null;
    },
};

// Post operations
const posts = {
    findAll: () => readData(POSTS_FILE),
    findById: (id) => {
        const posts = readData(POSTS_FILE);
        return posts.find(p => p._id === id || p.id === id);
    },
    findByUser: (userId) => {
        const posts = readData(POSTS_FILE);
        return posts.filter(p => p.user === userId || (p.user && p.user._id === userId));
    },
    create: (postData) => {
        const posts = readData(POSTS_FILE);
        const newPost = {
            _id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            id: null,
            ...postData,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString(),
        };
        newPost.id = newPost._id;
        posts.push(newPost);
        writeData(POSTS_FILE, posts);
        return newPost;
    },
    update: (id, updates) => {
        const posts = readData(POSTS_FILE);
        const index = posts.findIndex(p => p._id === id || p.id === id);
        if (index !== -1) {
            posts[index] = { ...posts[index], ...updates };
            writeData(POSTS_FILE, posts);
            return posts[index];
        }
        return null;
    },
    delete: (id) => {
        const posts = readData(POSTS_FILE);
        const filtered = posts.filter(p => p._id !== id && p.id !== id);
        writeData(POSTS_FILE, filtered);
        return filtered.length !== posts.length;
    },
};

// Opportunity operations
const opportunities = {
    findAll: (filters = {}) => {
        let opps = readData(OPPORTUNITIES_FILE);
        if (filters.isActive !== undefined) {
            const isActive = filters.isActive === 'true' || filters.isActive === true;
            opps = opps.filter(o => o.isActive === isActive);
        }
        if (filters.type) {
            opps = opps.filter(o => o.type === filters.type);
        }
        return opps;
    },
    findById: (id) => {
        const opps = readData(OPPORTUNITIES_FILE);
        return opps.find(o => o._id === id || o.id === id);
    },
    create: (oppData) => {
        const opps = readData(OPPORTUNITIES_FILE);
        const newOpp = {
            _id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            id: null,
            ...oppData,
            applicants: [],
            isActive: true,
            createdAt: new Date().toISOString(),
        };
        newOpp.id = newOpp._id;
        opps.push(newOpp);
        writeData(OPPORTUNITIES_FILE, opps);
        return newOpp;
    },
    update: (id, updates) => {
        const opps = readData(OPPORTUNITIES_FILE);
        const index = opps.findIndex(o => o._id === id || o.id === id);
        if (index !== -1) {
            opps[index] = { ...opps[index], ...updates };
            writeData(OPPORTUNITIES_FILE, opps);
            return opps[index];
        }
        return null;
    },
    delete: (id) => {
        const opps = readData(OPPORTUNITIES_FILE);
        const filtered = opps.filter(o => o._id !== id && o.id !== id);
        writeData(OPPORTUNITIES_FILE, filtered);
        return filtered.length !== opps.length;
    },
};

// Connection operations
const connections = {
    findAll: () => readData(CONNECTIONS_FILE),
    findByUser: (userId) => {
        const connections = readData(CONNECTIONS_FILE);
        return connections.filter(c => 
            c.mentor === userId || 
            c.mentorId === userId || 
            c.student === userId || 
            c.studentId === userId
        );
    },
    findByMentor: (mentorId) => {
        const connections = readData(CONNECTIONS_FILE);
        return connections.filter(c => c.mentor === mentorId || c.mentorId === mentorId);
    },
    create: (connData) => {
        const connections = readData(CONNECTIONS_FILE);
        const newConn = {
            _id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            id: null,
            ...connData,
            status: 'pending',
            sessions: [],
            createdAt: new Date().toISOString(),
        };
        newConn.id = newConn._id;
        connections.push(newConn);
        writeData(CONNECTIONS_FILE, connections);
        return newConn;
    },
    update: (id, updates) => {
        const connections = readData(CONNECTIONS_FILE);
        const index = connections.findIndex(c => c._id === id || c.id === id);
        if (index !== -1) {
            connections[index] = { ...connections[index], ...updates };
            writeData(CONNECTIONS_FILE, connections);
            return connections[index];
        }
        return null;
    },
};

// Helper function to populate user data
const populateUser = (userId) => {
    if (!userId) return null;
    const user = users.findById(userId);
    if (!user) return null;
    const { password: _, ...userData } = user;
    return userData;
};

// Helper function to populate multiple users
const populateUsers = (userIds) => {
    if (!userIds || !Array.isArray(userIds)) return [];
    return userIds.map(id => populateUser(id)).filter(u => u !== null);
};

module.exports = {
    users,
    posts,
    opportunities,
    connections,
    populateUser,
    populateUsers,
};

