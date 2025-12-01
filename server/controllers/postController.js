const { posts, users, populateUser, populateUsers } = require('../utils/localDB');

// Helper to add fake engagement data
const addFakeEngagement = (post, allUsers) => {
    if (!post || !allUsers || allUsers.length === 0) return post;
    
    const populated = { ...post };
    const postUserId = typeof post.user === 'object' ? post.user?._id : post.user;
    
    // Add fake likes if post has few or no likes
    if (!populated.likes || populated.likes.length < 3) {
        const numFakeLikes = Math.floor(Math.random() * 15) + 3; // 3-18 fake likes
        const fakeLikes = [];
        const availableUsers = allUsers.filter(u => {
            const userId = u._id || u.id;
            return userId && userId !== postUserId;
        });
        
        // Get existing like IDs
        const existingLikeIds = (populated.likes || []).map(like => {
            return typeof like === 'object' ? (like._id || like.id) : like;
        });
        
        for (let i = 0; i < Math.min(numFakeLikes, availableUsers.length) && fakeLikes.length < numFakeLikes; i++) {
            const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
            const userId = randomUser._id || randomUser.id;
            if (randomUser && userId && !fakeLikes.includes(userId) && !existingLikeIds.includes(userId)) {
                fakeLikes.push(userId);
            }
        }
        
        // Merge with existing likes
        const existingLikes = populated.likes || [];
        populated.likes = [...existingLikes, ...fakeLikes];
    }
    
    // Add fake comments if post has few or no comments
    if (!populated.comments || populated.comments.length < 2) {
        const numFakeComments = Math.floor(Math.random() * 5) + 1; // 1-6 fake comments
        const fakeComments = [];
        const availableUsers = allUsers.filter(u => {
            const userId = u._id || u.id;
            return userId && userId !== postUserId;
        });
        const commentTemplates = [
            "Great post! 👍",
            "This is really helpful, thanks for sharing!",
            "I totally agree with this!",
            "Interesting perspective!",
            "Thanks for the insights!",
            "Looking forward to more posts like this!",
            "Well said! 💯",
            "This resonates with me!",
        ];
        
        // Get existing comment user IDs
        const existingCommentUserIds = (populated.comments || []).map(comment => {
            const commentUserId = typeof comment.user === 'object' ? comment.user?._id : comment.user;
            return commentUserId;
        });
        
        for (let i = 0; i < Math.min(numFakeComments, availableUsers.length) && fakeComments.length < numFakeComments; i++) {
            const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
            const userId = randomUser._id || randomUser.id;
            if (randomUser && userId && !existingCommentUserIds.includes(userId) && 
                !fakeComments.some(c => (typeof c.user === 'object' ? c.user?._id : c.user) === userId)) {
                const daysAgo = Math.floor(Math.random() * 7); // 0-7 days ago
                const commentDate = new Date();
                commentDate.setDate(commentDate.getDate() - daysAgo);
                
                fakeComments.push({
                    _id: `comment_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
                    user: userId,
                    content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
                    createdAt: commentDate.toISOString(),
                });
            }
        }
        
        // Merge with existing comments
        const existingComments = populated.comments || [];
        populated.comments = [...existingComments, ...fakeComments];
    }
    
    return populated;
};

// Helper to populate post with user data
const populatePost = (post) => {
    if (!post) return null;
    const populated = { ...post };
    populated.user = populateUser(post.user);
    populated.likes = populateUsers(populated.likes || []);
    if (populated.comments && Array.isArray(populated.comments)) {
        populated.comments = populated.comments.map(comment => ({
            ...comment,
            user: populateUser(comment.user),
        }));
    }
    return populated;
};

// @desc    Get all posts (Feed)
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
    try {
        let allPosts = posts.findAll();
        const allUsers = users.findAll();
        
        // Add fake engagement data
        allPosts = allPosts.map(post => addFakeEngagement(post, allUsers));
        
        // Sort by createdAt descending
        allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Populate user data
        const populatedPosts = allPosts.map(post => populatePost(post));
        
        res.status(200).json(populatedPosts);
    } catch (error) {
        console.error('GetPosts error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get posts for the authenticated user (My Posts)
// @route   GET /api/posts/me
// @access  Private
exports.getMyPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        let userPosts = posts.findByUser(userId);

        // Sort by createdAt descending
        userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Populate user data
        const populatedPosts = userPosts.map(post => populatePost(post));

        res.status(200).json(populatedPosts);
    } catch (error) {
        console.error('GetMyPosts error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get posts by user ID
// @route   GET /api/posts/user/:userId
// @access  Private
exports.getPostsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        let userPosts = posts.findByUser(userId);
        const allUsers = users.findAll();
        
        // Add fake engagement data
        userPosts = userPosts.map(post => addFakeEngagement(post, allUsers));

        // Sort by createdAt descending
        userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Populate user data
        const populatedPosts = userPosts.map(post => populatePost(post));

        res.status(200).json(populatedPosts);
    } catch (error) {
        console.error('GetPostsByUserId error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPost = async (req, res) => {
    try {
        const post = posts.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const populatedPost = populatePost(post);
        res.status(200).json(populatedPost);
    } catch (error) {
        console.error('GetPost error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        const { content, type, media, tags } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: 'Please add content' });
        }
        
        const post = posts.create({
            user: req.user.id,
            content,
            type: type || 'general',
            media: media || [],
            tags: tags || [],
        });

        // Increment user karma for creating a post
        try {
            const user = users.findById(req.user.id);
            if (user) {
                const currentKarma = typeof user.karma === 'number' ? user.karma : 0;
                const updatedKarma = currentKarma + 10; // +10 karma per post
                users.update(req.user.id, { karma: updatedKarma });
            }
        } catch (karmaError) {
            console.error('CreatePost karma update error:', karmaError);
        }

        const populatedPost = populatePost(post);
        res.status(201).json(populatedPost);
    } catch (error) {
        console.error('CreatePost error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
    try {
        const post = posts.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // Check if user owns the post
        // Use 403 (Forbidden) so the frontend's 401 handler only runs on real auth failures
        if (post.user !== req.user.id && post.user?._id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }
        
        const updatedPost = posts.update(req.params.id, req.body);
        const populatedPost = populatePost(updatedPost);
        res.status(200).json(populatedPost);
    } catch (error) {
        console.error('UpdatePost error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
    try {
        const post = posts.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        // Check if user owns the post
        // Use 403 (Forbidden) so the frontend's 401 handler only runs on real auth failures
        if (post.user !== req.user.id && post.user?._id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
        posts.delete(req.params.id);
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        console.error('DeletePost error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = posts.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const likes = post.likes || [];
        const isLiked = likes.includes(req.user.id) || likes.some(like => 
            (typeof like === 'object' ? like._id || like.id : like) === req.user.id
        );
        
        let updatedLikes;
        if (isLiked) {
            updatedLikes = likes.filter(like => {
                const likeId = typeof like === 'object' ? like._id || like.id : like;
                return likeId !== req.user.id;
            });
        } else {
            updatedLikes = [...likes, req.user.id];
        }
        
        const updatedPost = posts.update(req.params.id, { likes: updatedLikes });
        const populatedPost = populatePost(updatedPost);
        res.status(200).json(populatedPost);
    } catch (error) {
        console.error('LikePost error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment
// @route   POST /api/posts/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: 'Please add comment content' });
        }
        
        const post = posts.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const comments = post.comments || [];
        comments.push({
            user: req.user.id,
            content,
            createdAt: new Date().toISOString(),
        });
        
        const updatedPost = posts.update(req.params.id, { comments });
        const populatedPost = populatePost(updatedPost);
        res.status(200).json(populatedPost);
    } catch (error) {
        console.error('AddComment error:', error);
        res.status(500).json({ message: error.message });
    }
};
