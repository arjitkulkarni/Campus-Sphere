import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { postsAPI, connectionsAPI, opportunitiesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import PostCard from '../components/molecules/PostCard';
import MentorCard from '../components/molecules/MentorCard';
import OpportunityCard from '../components/molecules/OpportunityCard';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';

const Feed = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [newPost, setNewPost] = useState({
        content: '',
        type: 'general',
        tags: '',
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [postsRes, mentorsRes, opportunitiesRes, connectionsRes] = await Promise.all([
                postsAPI.getAll().catch(() => ({ data: [] })),
                connectionsAPI.getMentors().catch(() => ({ data: [] })),
                opportunitiesAPI.getAll({ isActive: 'true' }).catch(() => ({ data: [] })),
                connectionsAPI.getConnections().catch(() => ({ data: [] }))
            ]);

            setPosts(postsRes.data || []);
            setMentors((mentorsRes.data || []).slice(0, 3)); // Top 3 mentors
            setOpportunities((opportunitiesRes.data || []).slice(0, 3)); // Top 3 opportunities
            setConnections(connectionsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.content.trim()) return;

        try {
            const tagsArray = newPost.tags
                ? newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                : [];

            await postsAPI.create({
                content: newPost.content,
                type: newPost.type,
                tags: tagsArray,
            });

            setNewPost({ content: '', type: 'general', tags: '' });
            setShowCreatePost(false);
            fetchAllData();
        } catch (error) {
            console.error('Error creating post:', error);
            alert(error.response?.data?.message || 'Failed to create post');
        }
    };

    const getUpcomingSession = () => {
        // Find the next upcoming session from connections
        const now = new Date();
        const upcomingSessions = connections
            .filter(conn => conn.sessions && conn.sessions.length > 0)
            .flatMap(conn => 
                conn.sessions
                    .filter(session => new Date(session.dateTime) > now)
                    .map(session => ({ ...session, mentor: conn.mentor || conn.mentorId }))
            )
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

        return upcomingSessions[0] || null;
    };

    const upcomingSession = getUpcomingSession();

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
            <Navbar />
            
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div className="container" style={{ maxWidth: '1400px' }}>
                    <div className="dashboard-layout">
                        {/* Left Sidebar */}
                        <aside className="dashboard-sidebar dashboard-sidebar-left">
                            <Card className="sidebar-card">
                                {/* User Avatar with Neon Frame */}
                                <div className="user-avatar-container">
                                    <div className="avatar-glow"></div>
                                    <div className="user-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className={`online-indicator ${user ? 'online' : 'offline'}`}></div>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>
                                        {user?.name || 'User'}
                                    </h3>
                                    <p style={{ 
                                        margin: '0 0 1rem 0', 
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.875rem'
                                    }}>
                                        {user?.headline || user?.role || 'Member'}
                                    </p>
                                </div>

                                {/* Karma Score */}
                                <div className="karma-display">
                                    <div className="karma-icon">⭐</div>
                                    <div>
                                        <div className="karma-value">{user?.karma || 0}</div>
                                        <div className="karma-label">Karma Points</div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="quick-actions">
                                    <Link to="/profile" className="quick-action-btn">
                                        <span>👤</span>
                                        <span>Profile</span>
                                    </Link>
                                    <Link to="/opportunities" className="quick-action-btn">
                                        <span>💼</span>
                                        <span>Opportunities</span>
                                    </Link>
                                    <Link to="/mentorship" className="quick-action-btn">
                                        <span>🤝</span>
                                        <span>Mentorship</span>
                                    </Link>
                                </div>

                                {/* Stats */}
                                <div className="user-stats">
                                    <div className="stat-item">
                                        <div className="stat-value">{posts.filter(p => p.user?._id === user?._id || p.user === user?._id).length}</div>
                                        <div className="stat-label">Posts</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{connections.length}</div>
                                        <div className="stat-label">Connections</div>
                                    </div>
                                </div>
                            </Card>
                        </aside>

                        {/* Center Feed */}
                        <section className="dashboard-feed">
                            {/* Welcome Message */}
                            <div className="welcome-banner">
                                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>
                                    Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
                                </h2>
                                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                                    Let's grow today 🌱
                                </p>
                            </div>

                            {/* Post Composer */}
                            <Card className="post-composer-card">
                                <div 
                                    className="post-composer-trigger"
                                    onClick={() => setShowCreatePost(!showCreatePost)}
                                >
                                    <div className="composer-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="What's on your mind?"
                                        readOnly
                                        className="composer-input"
                                    />
                                    <Button variant="primary" style={{ minWidth: '100px' }}>
                                        Post
                            </Button>
                        </div>

                        {showCreatePost && (
                                    <form onSubmit={handleCreatePost} className="post-composer-form">
                                        <div className="form-group">
                                            <label className="form-label">Post Type</label>
                                        <select
                                            value={newPost.type}
                                            onChange={(e) => setNewPost({ ...newPost, type: e.target.value })}
                                                className="form-input"
                                            >
                                                <option value="general">💬 General</option>
                                                <option value="achievement">🏆 Achievement</option>
                                                <option value="discussion">💭 Discussion</option>
                                                <option value="event">📅 Event</option>
                                                <option value="opportunity">💼 Opportunity</option>
                                        </select>
                                    </div>
                                        <div className="form-group">
                                        <textarea
                                            value={newPost.content}
                                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                            rows="4"
                                                className="form-input"
                                            placeholder="Share your thoughts..."
                                            required
                                        />
                                    </div>
                                        <div className="form-group">
                                        <input
                                            type="text"
                                            value={newPost.tags}
                                            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                                className="form-input"
                                                placeholder="Tags (comma separated): tech, career, advice"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <Button 
                                                type="button" 
                                                variant="glass" 
                                                onClick={() => {
                                                    setShowCreatePost(false);
                                                    setNewPost({ content: '', type: 'general', tags: '' });
                                                }}
                                                style={{ flex: 1 }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" variant="primary" style={{ flex: 1 }}>
                                                Post
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </Card>

                            {/* Events Banner */}
                            <Card className="events-banner">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div className="events-icon">📅</div>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: '0 0 0.25rem 0' }}>Campus Events</h4>
                                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                            Check out upcoming events and workshops
                                        </p>
                                    </div>
                                    <Button variant="glass" onClick={() => navigate('/opportunities')}>
                                        Explore
                                    </Button>
                                </div>
                            </Card>

                            {/* Posts Feed */}
                            <div className="posts-container">
                        {posts.length === 0 ? (
                                    <Card className="empty-state">
                                        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                                            <h3 style={{ margin: '0 0 0.5rem 0' }}>No posts yet</h3>
                                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                                Be the first to share something with the community!
                                </p>
                                <Button variant="primary" onClick={() => setShowCreatePost(true)}>
                                    Create First Post
                                </Button>
                                        </div>
                            </Card>
                        ) : (
                            posts.map((post) => (
                                        <PostCard key={post._id} post={post} onUpdate={fetchAllData} />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Right Sidebar */}
                        <aside className="dashboard-sidebar dashboard-sidebar-right">
                            {/* Recommended Mentors */}
                            <Card className="sidebar-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Recommended Mentors</h3>
                                    <Link 
                                        to="/mentorship" 
                                        style={{ 
                                            color: 'var(--primary)', 
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        View All
                                    </Link>
                                </div>
                                {mentors.length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                                        No mentors available yet
                                    </p>
                                ) : (
                                    <div className="mentors-list">
                                        {mentors.map((mentor) => (
                                            <div key={mentor._id} className="mentor-preview">
                                                <div className="mentor-avatar-small">
                                                    {mentor.name?.charAt(0).toUpperCase() || 'M'}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                        {mentor.name}
                                                    </div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                        {mentor.headline || mentor.role}
                                                    </div>
                                                </div>
                                                <Link to="/mentorship">
                                                    <Button variant="glass" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                                                        Connect
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>

                            {/* Trending Opportunities */}
                            <Card className="sidebar-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Trending Opportunities</h3>
                                    <Link 
                                        to="/opportunities" 
                                        style={{ 
                                            color: 'var(--primary)', 
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        View All
                                    </Link>
                                </div>
                                {opportunities.length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
                                        No opportunities available yet
                                    </p>
                                ) : (
                                    <div className="opportunities-list">
                                        {opportunities.map((opp) => (
                                            <div key={opp._id} className="opportunity-preview">
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                        {opp.title}
                                                    </div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                        {opp.company} • {opp.location}
                                                    </div>
                                                </div>
                                                <Link to="/opportunities">
                                                    <Button variant="glass" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>

                            {/* Next Booking */}
                            {upcomingSession && (
                                <Card className="sidebar-card booking-card">
                                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>Next Session</h3>
                                    <div className="booking-info">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                            <div className="booking-avatar">
                                                {upcomingSession.mentor?.name?.charAt(0) || 'M'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                                    {upcomingSession.mentor?.name || 'Mentor'}
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                                    Mentorship Session
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ 
                                            padding: '0.75rem', 
                                            background: 'rgba(0, 240, 255, 0.1)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0, 240, 255, 0.2)'
                                        }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                                📅 {new Date(upcomingSession.dateTime).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                🕐 {new Date(upcomingSession.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feed;
