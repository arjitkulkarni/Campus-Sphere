const { posts, users, populateUser, populateUsers } = require('../utils/localDB');

// Helper to populate post with user data
const populatePost = (post) => {
    if (!post) return null;
    const populated = { ...post };
    populated.user = populateUser(post.user);
    populated.likes = populateUsers(post.likes || []);
    if (post.comments && Array.isArray(post.comments)) {
        populated.comments = post.comments.map(comment => ({
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
        if (post.user !== req.user.id && post.user?._id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
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
        if (post.user !== req.user.id && post.user?._id !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
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
