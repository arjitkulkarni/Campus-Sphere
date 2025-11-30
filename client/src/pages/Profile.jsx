import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI, postsAPI, connectionsAPI } from '../services/api';
import PostCard from '../components/molecules/PostCard';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const Profile = () => {
    const { user, loading: authLoading, updateProfile } = useAuth();
    const { error: showError, success } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        headline: '',
        bio: '',
        skills: '',
    });
    const [loading, setLoading] = useState(false);
    const [myPosts, setMyPosts] = useState([]);
    const [myPostsLoading, setMyPostsLoading] = useState(true);
    const [profileUser, setProfileUser] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    
    // Determine if viewing own profile or another user's
    const isOwnProfile = !userId || userId === user?._id || userId === user?.id;
    const viewingUser = isOwnProfile ? user : profileUser;

    // Fetch profile user data
    const fetchProfileUser = useCallback(async () => {
        if (isOwnProfile) {
            setProfileUser(user);
            setProfileLoading(false);
            return;
        }
        
        if (!userId) return;
        
        setProfileLoading(true);
        try {
            const response = await authAPI.getUserById(userId);
            setProfileUser(response.data);
            
            // Check if already connected
            const connectionsRes = await connectionsAPI.getConnections();
            const connected = connectionsRes.data.some(conn => {
                const mentorId = conn.mentor?._id || conn.mentor || conn.mentorId;
                const menteeId = conn.mentee?._id || conn.mentee || conn.menteeId || conn.student?._id || conn.student || conn.studentId;
                return (mentorId === userId && menteeId === user?._id) || 
                       (mentorId === user?._id && menteeId === userId);
            });
            setIsConnected(connected);
        } catch (error) {
            console.error('Error fetching profile user:', error);
            if (showError) {
                showError(error.response?.data?.message || 'Failed to load user profile');
            }
        } finally {
            setProfileLoading(false);
        }
    }, [userId, user, isOwnProfile, showError]);

    const fetchMyPosts = useCallback(async () => {
        if (!viewingUser) return;
        setMyPostsLoading(true);
        try {
            let response;
            if (isOwnProfile) {
                response = await postsAPI.getMine();
            } else {
                response = await postsAPI.getByUserId(userId);
            }
            setMyPosts(response.data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (showError) {
                showError(error.response?.data?.message || 'Failed to load posts');
            }
        } finally {
            setMyPostsLoading(false);
        }
    }, [viewingUser, isOwnProfile, userId, showError]);
    
    const handleConnect = async () => {
        if (!profileUser || isConnecting) return;
        setIsConnecting(true);
        try {
            await connectionsAPI.requestConnection(profileUser._id);
            success('Connection request sent! 🤝');
            setIsConnected(true);
            
            // Navigate to feed and refresh following count
            navigate('/feed?refresh=following');
        } catch (error) {
            console.error('Error requesting connection:', error);
            if (showError) {
                showError(error.response?.data?.message || 'Failed to send connection request');
            }
        } finally {
            setIsConnecting(false);
        }
    };

    // Animated particle background (same style as auth pages)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = particlesRef.current;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const createParticles = () => {
            const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 20000);
            particles.length = 0;

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.4 + 0.2,
                });
            }
        };

        createParticles();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, i) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
                ctx.fill();

                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        if (user) {
            fetchProfileUser();
        }
    }, [user, authLoading, navigate, userId, fetchProfileUser]);
    
    useEffect(() => {
        if (viewingUser) {
            if (isOwnProfile) {
                setFormData({
                    headline: viewingUser.headline || '',
                    bio: viewingUser.bio || '',
                    skills: viewingUser.skills?.join(', ') || '',
                });
            }
            fetchMyPosts();
        }
    }, [viewingUser, isOwnProfile, fetchMyPosts]);

    // Refresh posts when navigating to profile page
    useEffect(() => {
        if (user && location.pathname === '/profile') {
            fetchMyPosts();
        }
    }, [location.pathname, user, fetchMyPosts]);

    // Refresh posts when page becomes visible (e.g., navigating back from Feed)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && user) {
                fetchMyPosts();
            }
        };

        const handleFocus = () => {
            if (user) {
                fetchMyPosts();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [user, fetchMyPosts]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            await updateProfile({
                headline: formData.headline,
                bio: formData.bio,
                skills: skillsArray,
            });
            setEditing(false);
        } catch (error) {
            alert(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || profileLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user || !viewingUser) return null;

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-primary)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated Background Canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            {/* Floating Shapes */}
            <div className="auth-shapes">
                <div className="auth-shape auth-shape-1"></div>
                <div className="auth-shape auth-shape-2"></div>
            </div>

            {/* Gradient Orbs */}
            <div className="auth-orb auth-orb-1"></div>
            <div className="auth-orb auth-orb-2"></div>

            <Navbar />
            <main style={{ flex: 1, paddingTop: '90px', paddingBottom: '3rem', position: 'relative', zIndex: 1 }}>
                <div
                    className="container"
                    style={{
                        maxWidth: '960px',
                        margin: '0 auto',
                        padding: '2rem 1.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ maxWidth: '720px', width: '100%' }}>
                        <h1
                            style={{
                                marginBottom: '1.5rem',
                                fontSize: '2rem',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {isOwnProfile ? 'My Profile' : `${viewingUser.name}'s Profile`}
                        </h1>

                        <Card>
                            {/* Header / Identity */}
                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                                <div
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '3rem',
                                        flexShrink: 0,
                                        boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
                                        border: '3px solid rgba(0, 240, 255, 0.5)',
                                    }}
                                >
                                    {viewingUser.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>{viewingUser.name}</h2>
                                            <p style={{ margin: 0, color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                                {viewingUser.email} • {viewingUser.role}
                                            </p>
                                            {viewingUser.headline && (
                                                <p style={{ margin: '0.5rem 0', color: 'var(--text-primary)', fontWeight: 500 }}>
                                                    {viewingUser.headline}
                                                </p>
                                            )}
                                        </div>
                                        {!isOwnProfile && (
                                            <Button 
                                                variant={isConnected ? "glass" : "primary"}
                                                onClick={handleConnect}
                                                disabled={isConnecting || isConnected}
                                                style={{ flexShrink: 0 }}
                                            >
                                                {isConnecting ? 'Connecting...' : isConnected ? '✓ Connected' : '🤝 Connect'}
                                            </Button>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.75rem' }}>
                                        {viewingUser.karma > 0 && (
                                            <div
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    padding: '0.4rem 0.9rem',
                                                    background: 'rgba(0, 255, 157, 0.08)',
                                                    border: '1px solid var(--success)',
                                                    borderRadius: '999px',
                                                    fontSize: '0.8rem',
                                                    color: 'var(--success)',
                                                }}
                                            >
                                                <span>⭐</span>
                                                <span>{viewingUser.karma} Karma points</span>
                                            </div>
                                        )}
                                        {viewingUser.isMentor && (
                                            <div
                                                style={{
                                                    padding: '0.4rem 0.9rem',
                                                    borderRadius: '999px',
                                                    background: 'rgba(0, 240, 255, 0.08)',
                                                    border: '1px solid rgba(0, 240, 255, 0.5)',
                                                    fontSize: '0.8rem',
                                                    color: 'var(--primary)',
                                                }}
                                            >
                                                🤝 Mentor
                                            </div>
                                        )}
                                        {viewingUser.createdAt && (
                                            <div
                                                style={{
                                                    padding: '0.4rem 0.9rem',
                                                    borderRadius: '999px',
                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-secondary)',
                                                }}
                                            >
                                                Joined {new Date(viewingUser.createdAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            {viewingUser.bio && (!editing || !isOwnProfile) && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '0.5rem' }}>Bio</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{viewingUser.bio}</p>
                                </div>
                            )}

                            {/* Skills */}
                            {viewingUser.skills && viewingUser.skills.length > 0 && (!editing || !isOwnProfile) && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '0.5rem' }}>Skills</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {viewingUser.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    background: 'rgba(0, 240, 255, 0.08)',
                                                    border: '1px solid var(--primary)',
                                                    borderRadius: '999px',
                                                    fontSize: '0.85rem',
                                                    color: 'var(--primary)',
                                                }}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Academic Info */}
                            {(viewingUser.college || viewingUser.graduationYear) && (!editing || !isOwnProfile) && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '0.5rem' }}>Academic Info</h3>
                                    {viewingUser.college && (
                                        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                            College: {viewingUser.college}
                                        </p>
                                    )}
                                    {viewingUser.graduationYear && (
                                        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                            Graduation year: {viewingUser.graduationYear}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Professional Info (primarily for alumni) */}
                            {(viewingUser.company || viewingUser.jobTitle || typeof viewingUser.isEmployed === 'boolean') && (!editing || !isOwnProfile) && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ marginBottom: '0.5rem' }}>Professional Info</h3>
                                    {typeof viewingUser.isEmployed === 'boolean' && (
                                        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                            Status: {viewingUser.isEmployed ? 'Employed' : 'Not currently employed'}
                                        </p>
                                    )}
                                    {viewingUser.company && (
                                        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                            Company: {viewingUser.company}
                                        </p>
                                    )}
                                    {viewingUser.jobTitle && (
                                        <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                            Title: {viewingUser.jobTitle}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Edit mode for headline, bio and skills - only for own profile */}
                            {editing && isOwnProfile ? (
                                <form onSubmit={handleSubmit}>
                                    <Input
                                        label="Headline"
                                        name="headline"
                                        value={formData.headline}
                                        onChange={handleChange}
                                        placeholder="Your professional headline"
                                    />
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
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
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                    </div>
                                    <Input
                                        label="Skills (comma separated)"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="e.g. React, Python, Design"
                                    />
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Button type="submit" variant="primary" disabled={loading}>
                                            {loading ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button type="button" variant="glass" onClick={() => setEditing(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            ) : isOwnProfile ? (
                                <Button variant="primary" onClick={() => setEditing(true)}>
                                    Edit Profile
                                </Button>
                            ) : null}
                        </Card>

                        <div style={{ marginTop: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: '1.25rem',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    {isOwnProfile ? 'My Posts' : `${viewingUser.name}'s Posts`}
                                </h2>
                                {isOwnProfile && (
                                    <Button 
                                        variant="glass" 
                                        onClick={fetchMyPosts}
                                        disabled={myPostsLoading}
                                        style={{ 
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.875rem',
                                            minWidth: 'auto'
                                        }}
                                        title="Refresh posts"
                                    >
                                        {myPostsLoading ? '⟳' : '↻'} Refresh
                                    </Button>
                                )}
                            </div>

                            {myPostsLoading ? (
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Loading posts...
                                </p>
                            ) : myPosts.length === 0 ? (
                                <Card>
                                    <div style={{ padding: '1.5rem 1.25rem', textAlign: 'center' }}>
                                        <p
                                            style={{
                                                margin: '0 0 0.75rem 0',
                                                color: 'var(--text-secondary)',
                                            }}
                                        >
                                            You haven’t posted anything yet.
                                        </p>
                                        {isOwnProfile && (
                                            <Button variant="primary" onClick={() => navigate('/feed')}>
                                                Go to feed to create your first post
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ) : (
                                myPosts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onUpdate={fetchMyPosts}
                                        enableOwnerActions={isOwnProfile}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;

