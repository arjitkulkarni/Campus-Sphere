import React, { useState } from 'react';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { postsAPI } from '../../utils/api';

const PostForm = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [type, setType] = useState('post');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            await postsAPI.create({
                content,
                type,
                tags: tagsArray,
            });
            setContent('');
            setTags('');
            if (onPostCreated) onPostCreated();
        } catch (error) {
            alert(error.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Create a Post</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                        Post Type
                    </label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'rgba(15, 15, 25, 0.95)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    >
                        <option value="post">Post</option>
                        <option value="achievement">Achievement</option>
                        <option value="event">Event</option>
                        <option value="discussion">Discussion</option>
                    </select>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    rows="4"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        color: 'white',
                        outline: 'none',
                        resize: 'none',
                        marginBottom: '1rem',
                        fontFamily: 'inherit'
                    }}
                    required
                />

                <Input
                    label="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. tech, career, advice"
                />

                <Button type="submit" variant="primary" disabled={loading || !content.trim()}>
                    {loading ? 'Posting...' : 'Post'}
                </Button>
            </form>
        </Card>
    );
};

export default PostForm;

