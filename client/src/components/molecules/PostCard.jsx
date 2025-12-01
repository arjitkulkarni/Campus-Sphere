import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { postsAPI } from '../../services/api';
import Card from '../atoms/Card';

const PostCard = ({ post, onUpdate, enableOwnerActions = false }) => {
    const { user } = useAuth();
    const { success, error } = useToast();
    const navigate = useNavigate();
    
    // Get the post author's user ID - handle different formats
    const postUserId = post.user?._id || post.user || post.userId;
    const currentUserId = user?._id || user?.id;
    
    // Check if this post belongs to the current user
    const isCurrentUserPost = !!user && (
        // Normal ID based checks
        (currentUserId &&
            (postUserId === currentUserId ||
                String(postUserId) === String(currentUserId) ||
                (post.user?._id && String(post.user._id) === String(currentUserId)))) ||
        // Fallback for legacy posts that may not have proper IDs attached
        (post.user?.name && user.name && post.user.name === user.name)
    );
    
    // Always allow clicking on profile (for any user)
    const canViewProfile = !!postUserId;
    
    // Handler for navigating to profile
    const handleProfileClick = () => {
        const postUserId = post.user?._id || post.user || post.userId;
        if (postUserId) {
            navigate(`/profile/${postUserId}`);
        } else {
            navigate('/profile');
        }
    };
    
    const [liked, setLiked] = useState(post.likes?.some(like => like._id === user?._id || like === user?._id));
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content || '');
    const [editTags, setEditTags] = useState(
        Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || '')
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Treat the current user as owner when this post belongs to them
    // and the parent component has explicitly enabled owner actions.
    const isOwner = enableOwnerActions && isCurrentUserPost;

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        setLikeAnimation(true);
        try {
            const response = await postsAPI.like(post._id);
            setLiked(!liked);
            setLikesCount(response.data.likes?.length || 0);
            setTimeout(() => setLikeAnimation(false), 600);
        } catch (error) {
            console.error('Error liking post:', error);
            setLikeAnimation(false);
        } finally {
            setIsLiking(false);
        }
    };

    const handleStartEdit = () => {
        setEditContent(post.content || '');
        setEditTags(Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''));
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim()) {
            error('Post content cannot be empty');
            return;
        }
        if (isSaving) return;
        setIsSaving(true);
        try {
            const tagsArray = editTags
                ? editTags.split(',').map(tag => tag.trim()).filter(tag => tag)
                : [];
            await postsAPI.update(post._id, {
                content: editContent,
                tags: tagsArray,
            });
            success('Post updated ✏️');
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Error updating post:', err);
            error(err.response?.data?.message || 'Failed to update post');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        try {
            await postsAPI.delete(post._id);
            success('Post deleted 🗑️');
            setShowDeleteConfirm(false);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Error deleting post:', err);
            error(err.response?.data?.message || 'Failed to delete post');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || isCommenting) return;
        setIsCommenting(true);
        try {
            await postsAPI.comment(post._id, commentText);
            setCommentText('');
            success('Comment added! 💬');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsCommenting(false);
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInSeconds = Math.floor((now - postDate) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        
        return postDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const getPostTypeIcon = (type) => {
        const icons = {
            achievement: '🏆',
            discussion: '💭',
            event: '📅',
            opportunity: '💼',
            general: '💬',
        };
        return icons[type] || '💬';
    };

    const getPostTypeColor = (type) => {
        const colors = {
            achievement: 'var(--success)',
            discussion: 'var(--primary)',
            event: 'var(--secondary)',
            opportunity: 'var(--accent)',
            general: 'var(--text-secondary)',
        };
        return colors[type] || 'var(--text-secondary)';
    };

    return (
        <Card className="post-card-enhanced" style={{ marginBottom: '2rem', position: 'relative' }}>
            {isOwner && (
                <div
                    className="post-owner-actions"
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '2rem',
                        display: 'flex',
                        gap: '0.5rem',
                    }}
                >
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="post-owner-action-btn post-owner-action-primary"
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(0, 240, 255, 0.6)',
                                    background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(112, 0, 255, 0.3))',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                }}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                disabled={isSaving}
                                className="post-owner-action-btn"
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleStartEdit}
                                className="post-owner-action-btn"
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    background: 'rgba(0, 0, 0, 0.3)',
                                    color: 'var(--text-secondary)',
                                    cursor: 'pointer',
                                }}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isDeleting}
                                className="post-owner-action-btn"
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255, 0, 85, 0.7)',
                                    background: 'rgba(255, 0, 85, 0.18)',
                                    color: '#ffb3c7',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    opacity: isDeleting ? 0.6 : 1,
                                }}
                            >
                                🗑️ Delete
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Post Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                <div 
                    className={`post-avatar-container ${canViewProfile ? 'clickable' : ''}`}
                    onClick={canViewProfile ? handleProfileClick : undefined}
                    style={{ cursor: canViewProfile ? 'pointer' : 'default' }}
                    title={canViewProfile ? 'View profile' : undefined}
                >
                    <div className="post-avatar">
                        {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="post-avatar-ring"></div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <h4 
                            className={canViewProfile ? 'post-user-name' : ''}
                            onClick={canViewProfile ? handleProfileClick : undefined}
                            style={{ 
                                margin: 0, 
                                fontSize: '1rem', 
                                fontWeight: 600,
                                cursor: canViewProfile ? 'pointer' : 'default',
                            }}
                            title={canViewProfile ? 'View profile' : undefined}
                        >
                            {post.user?.name || 'Unknown User'}
                        </h4>
                        <span 
                            className="post-type-badge"
                            style={{
                                padding: '0.25rem 0.625rem',
                                background: `${getPostTypeColor(post.type)}20`,
                                border: `1px solid ${getPostTypeColor(post.type)}`,
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                color: getPostTypeColor(post.type),
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                            }}
                        >
                            {getPostTypeIcon(post.type)} {post.type}
                        </span>
                    </div>
                    <div style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <span>{post.user?.headline || post.user?.role || ''}</span>
                        {post.user?.headline && <span>•</span>}
                        <span>{formatDate(post.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="post-content">
                {isEditing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows="4"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            fontSize: '0.95rem',
                        }}
                    />
                ) : (
                    <p style={{ 
                        marginBottom: '1rem', 
                        lineHeight: '1.7',
                        fontSize: '1rem',
                        color: 'var(--text-primary)'
                    }}>
                        {post.content}
                    </p>
                )}
            </div>

            {/* Tags */}
            {isEditing ? (
                <div style={{ marginBottom: '1.25rem' }}>
                    <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="Tags (comma separated)"
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '999px',
                            color: 'var(--text-secondary)',
                            outline: 'none',
                            fontSize: '0.875rem',
                        }}
                    />
                </div>
            ) : (
                post.tags && post.tags.length > 0 && (
                    <div className="post-tags" style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        marginBottom: '1.25rem', 
                        flexWrap: 'wrap' 
                    }}>
                        {post.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="post-tag"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )
            )}

            {/* Post Actions */}
            <div className="post-actions" style={{ 
                display: 'flex', 
                gap: '2rem', 
                marginTop: '1.5rem', 
                paddingTop: '1.25rem', 
                borderTop: '1px solid var(--glass-border)' 
            }}>
                <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`post-action-btn ${liked ? 'post-action-btn-active' : ''} ${likeAnimation ? 'like-animate' : ''}`}
                >
                    <span className="post-action-icon">
                        {liked ? '❤️' : '🤍'}
                    </span>
                    <span className="post-action-count">{likesCount}</span>
                    <span className="post-action-label">Like</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className={`post-action-btn ${showComments ? 'post-action-btn-active' : ''}`}
                >
                    <span className="post-action-icon">💬</span>
                    <span className="post-action-count">{post.comments?.length || 0}</span>
                    <span className="post-action-label">Comment</span>
                </button>
                <button className="post-action-btn">
                    <span className="post-action-icon">🔗</span>
                    <span className="post-action-label">Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="post-comments" style={{ 
                    marginTop: '1.5rem', 
                    paddingTop: '1.5rem', 
                    borderTop: '1px solid var(--glass-border)',
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    {/* Comment Form */}
                    <form onSubmit={handleComment} className="comment-form">
                        <div className="comment-input-wrapper">
                            <div className="comment-avatar-small">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="comment-input"
                                disabled={isCommenting}
                            />
                            {commentText.trim() && (
                                <button 
                                    type="submit" 
                                    className="comment-submit-btn"
                                    disabled={isCommenting}
                                >
                                    {isCommenting ? '...' : 'Post'}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Comments List */}
                    {post.comments && post.comments.length > 0 && (
                        <div className="comments-list" style={{ 
                            marginTop: '1.5rem',
                            maxHeight: '400px',
                            overflowY: 'auto'
                        }}>
                            {post.comments.map((comment, idx) => (
                                <div key={idx} className="comment-item">
                                    <div className="comment-avatar-small">
                                        {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '0.5rem',
                                            marginBottom: '0.25rem',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                {comment.user?.name || 'Unknown'}
                                            </span>
                                            <span style={{ 
                                                fontSize: '0.75rem', 
                                                color: 'var(--text-secondary)' 
                                            }}>
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p style={{ 
                                            margin: 0, 
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.9375rem',
                                            lineHeight: '1.6'
                                        }}>
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        backdropFilter: 'blur(8px)',
                    }}
                    onClick={() => !isDeleting && setShowDeleteConfirm(false)}
                >
                    <Card
                        style={{
                            maxWidth: '400px',
                            width: '90%',
                            padding: '2rem',
                            position: 'relative',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                            Delete Post?
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={isDeleting}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-secondary)',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255, 0, 85, 0.7)',
                                    background: isDeleting 
                                        ? 'rgba(255, 0, 85, 0.3)' 
                                        : 'linear-gradient(135deg, rgba(255, 0, 85, 0.3), rgba(255, 0, 85, 0.5))',
                                    color: '#ffb3c7',
                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    opacity: isDeleting ? 0.6 : 1,
                                }}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Post'}
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </Card>
    );
};

export default PostCard;
