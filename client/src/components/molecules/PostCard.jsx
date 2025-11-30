import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { postsAPI } from '../../services/api';
import Card from '../atoms/Card';

const PostCard = ({ post, onUpdate }) => {
    const { user } = useAuth();
    const { success } = useToast();
    const [liked, setLiked] = useState(post.likes?.some(like => like._id === user?._id || like === user?._id));
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
    const [likeAnimation, setLikeAnimation] = useState(false);

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
            {/* Post Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="post-avatar-container">
                    <div className="post-avatar">
                        {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="post-avatar-ring"></div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
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
                <p style={{ 
                    marginBottom: '1rem', 
                    lineHeight: '1.7',
                    fontSize: '1rem',
                    color: 'var(--text-primary)'
                }}>
                    {post.content}
                </p>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
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
        </Card>
    );
};

export default PostCard;
