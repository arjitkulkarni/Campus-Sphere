import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postsAPI } from '../../services/api';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const PostCard = ({ post, onUpdate }) => {
    const { user } = useAuth();
    const [liked, setLiked] = useState(post.likes?.some(like => like._id === user?._id || like === user?._id));
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            const response = await postsAPI.like(post._id);
            setLiked(!liked);
            setLikesCount(response.data.likes?.length || 0);
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        try {
            await postsAPI.comment(post._id, commentText);
            setCommentText('');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    fontWeight: 'bold',
                }}>
                    {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                        {post.user?.name || 'Unknown User'}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {post.user?.headline || post.user?.role || ''} • {formatDate(post.createdAt)}
                    </div>
                </div>
            </div>

            <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{post.content}</p>

            {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {post.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            style={{
                                padding: '0.25rem 0.75rem',
                                background: 'rgba(0, 240, 255, 0.1)',
                                border: '1px solid var(--primary)',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                color: 'var(--primary)',
                            }}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <button
                    onClick={handleLike}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: liked ? 'var(--primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'var(--transition-fast)',
                    }}
                >
                    <span>❤️</span>
                    <span>{likesCount}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <span>💬</span>
                    <span>{post.comments?.length || 0}</span>
                </button>
            </div>

            {showComments && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                    <form onSubmit={handleComment} style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'white',
                                outline: 'none',
                            }}
                        />
                    </form>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {post.comments?.map((comment, idx) => (
                            <div key={idx} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {comment.user?.name || 'Unknown'}
                                </div>
                                <div style={{ color: 'var(--text-secondary)' }}>{comment.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default PostCard;
