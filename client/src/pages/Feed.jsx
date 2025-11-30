import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
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
    const { success, error: showError } = useToast();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [connections, setConnections] = useState([]);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [newPost, setNewPost] = useState({
        content: '',
        type: 'general',
        tags: '',
    });

    // Background animation refs
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);
    const mousePosRef = useRef({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState([]);
    const [floatingShapes] = useState(() => {
        const shapes = [];
        for (let i = 0; i < 8; i++) {
            shapes.push({
                id: i,
                size: Math.random() * 100 + 50,
                x: Math.random() * 100,
                y: Math.random() * 100,
                speedX: (Math.random() - 0.5) * 0.02,
                speedY: (Math.random() - 0.5) * 0.02,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.15 + 0.05,
                type: Math.random() > 0.5 ? 'circle' : 'square',
            });
        }
        return shapes;
    });

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
            const userConnections = connectionsRes.data || [];
            setConnections(userConnections);
            
            // Calculate followers and following from connections
            // Followers: people who are following the user (where user is the mentor)
            // These are mentees/students who have connected with the user as their mentor
            const followersCount = userConnections.filter(conn => {
                const isUserMentor = conn.mentor?._id === user?._id || 
                                     conn.mentor === user?._id || 
                                     conn.mentorId === user?._id;
                return isUserMentor && conn.status === 'accepted';
            }).length;
            
            // Following: people the user is following (where user is the mentee/student)
            // These are mentors the user has connected with
            const followingCount = userConnections.filter(conn => {
                const isUserMentee = conn.mentee?._id === user?._id || 
                                    conn.mentee === user?._id ||
                                    conn.student?._id === user?._id || 
                                    conn.student === user?._id ||
                                    conn.menteeId === user?._id || 
                                    conn.studentId === user?._id;
                return isUserMentee && conn.status === 'accepted';
            }).length;
            
            setFollowers(followersCount);
            setFollowing(followingCount);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Mouse tracking for interactive effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePosRef.current = { x: e.clientX, y: e.clientY };
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        const handleClick = (e) => {
            // Create ripple effect on click
            setRipples(prev => [...prev, {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
            }]);

            // Remove ripple after animation
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== Date.now()));
            }, 1000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
        };
    }, []);

    // Animated particle background with mouse interaction
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

        // Create particles
        const createParticles = () => {
            const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 18000);
            particles.length = 0;
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.4 + 0.1,
                    color: Math.random() > 0.5 ? 'rgba(0, 240, 255' : 'rgba(112, 0, 255',
                    baseRadius: Math.random() * 1.5 + 0.5,
                });
            }
        };

        createParticles();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouseX = mousePosRef.current.x;
            const mouseY = mousePosRef.current.y;

            particles.forEach((particle, i) => {
                // Mouse interaction - subtle attraction around the cursor
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance && distance > 0) {
                    const force = Math.pow((maxDistance - distance) / maxDistance, 1.2);
                    const angle = Math.atan2(dy, dx);

                    particle.vx += Math.cos(angle) * force * 0.06;
                    particle.vy += Math.sin(angle) * force * 0.06;

                    // Slightly increase opacity and size near mouse
                    particle.opacity = Math.min(0.8, particle.opacity + force * 0.2);
                    particle.radius = particle.baseRadius + force * 2.5;
                } else {
                    // Return to base state
                    particle.opacity = Math.max(0.08, particle.opacity * 0.9);
                    particle.radius = particle.baseRadius;
                }

                // Gentle damping for smoother motion
                particle.vx *= 0.94;
                particle.vy *= 0.94;

                particle.x += particle.vx;
                particle.y += particle.vy;

                // Boundary bounce
                if (particle.x < 0 || particle.x > canvas.width) {
                    particle.vx *= -0.8;
                    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                }
                if (particle.y < 0 || particle.y > canvas.height) {
                    particle.vy *= -0.8;
                    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `${particle.color}, ${particle.opacity})`;
                ctx.fill();

                // Draw connections with mouse influence
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 130) {
                        // Check if connection is near mouse
                        const midX = (particle.x + otherParticle.x) / 2;
                        const midY = (particle.y + otherParticle.y) / 2;
                        const mouseDist = Math.sqrt(
                            Math.pow(midX - mouseX, 2) + Math.pow(midY - mouseY, 2)
                        );

                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        let opacity = 0.08 * (1 - distance / 130);
                        if (mouseDist < 110) {
                            opacity *= 2;
                        }
                        ctx.strokeStyle = `rgba(0, 240, 255, ${Math.min(0.35, opacity)})`;
                        ctx.lineWidth = mouseDist < 110 ? 1.5 : 0.4;
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

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.content.trim() || isPosting) return;
        setIsPosting(true);

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
            success('Post created successfully! 🎉');
            fetchAllData();
        } catch (err) {
            console.error('Error creating post:', err);
            showError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setIsPosting(false);
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
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
                {/* Background for loading state */}
                <div className="feed-background-container" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                }}>
                    <div className="feed-gradient-orb feed-orb-1" style={{
                        position: 'absolute',
                        width: '360px',
                        height: '360px',
                        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15), transparent 70%)',
                        borderRadius: '50%',
                        top: '-200px',
                        left: '-200px',
                        filter: 'blur(60px)',
                        animation: 'orb-float-1 20s ease-in-out infinite',
                    }} />
                    <div className="feed-gradient-orb feed-orb-2" style={{
                        position: 'absolute',
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(112, 0, 255, 0.15), transparent 70%)',
                        borderRadius: '50%',
                        bottom: '-300px',
                        right: '-300px',
                        filter: 'blur(80px)',
                        animation: 'orb-float-2 25s ease-in-out infinite',
                    }} />
                </div>
                <Navbar />
                <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                    <div className="container" style={{ maxWidth: '1400px' }}>
                        <div className="dashboard-layout">
                            {/* Skeleton Sidebar */}
                            <aside className="dashboard-sidebar dashboard-sidebar-left">
                                <Card className="sidebar-card">
                                    <div className="skeleton skeleton-avatar" style={{ margin: '0 auto 1rem' }}></div>
                                    <div className="skeleton skeleton-text" style={{ width: '60%', margin: '0 auto 0.5rem' }}></div>
                                    <div className="skeleton skeleton-text" style={{ width: '40%', margin: '0 auto 1.5rem' }}></div>
                                    <div className="skeleton" style={{ height: '60px', marginBottom: '1rem', borderRadius: '12px' }}></div>
                                    <div className="skeleton skeleton-text" style={{ marginBottom: '0.5rem' }}></div>
                                    <div className="skeleton skeleton-text" style={{ marginBottom: '0.5rem' }}></div>
                                    <div className="skeleton skeleton-text"></div>
                                </Card>
                            </aside>
                            
                            {/* Skeleton Feed */}
                            <section className="dashboard-feed">
                                <div className="skeleton" style={{ height: '120px', borderRadius: '20px', marginBottom: '1.5rem' }}></div>
                                <div className="skeleton-card">
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <div className="skeleton skeleton-avatar"></div>
                                        <div style={{ flex: 1 }}>
                                            <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: '0.5rem' }}></div>
                                            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                    <div className="skeleton skeleton-text" style={{ marginBottom: '0.5rem' }}></div>
                                    <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                                </div>
                                <div className="skeleton-card">
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                        <div className="skeleton skeleton-avatar"></div>
                                        <div style={{ flex: 1 }}>
                                            <div className="skeleton skeleton-text" style={{ width: '40%', marginBottom: '0.5rem' }}></div>
                                            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                    <div className="skeleton skeleton-text" style={{ marginBottom: '0.5rem' }}></div>
                                    <div className="skeleton skeleton-text" style={{ width: '80%' }}></div>
                                </div>
                            </section>
                            
                            {/* Skeleton Right Sidebar */}
                            <aside className="dashboard-sidebar dashboard-sidebar-right">
                                <Card className="sidebar-card">
                                    <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: '1rem' }}></div>
                                    <div className="skeleton" style={{ height: '80px', borderRadius: '12px', marginBottom: '0.75rem' }}></div>
                                    <div className="skeleton" style={{ height: '80px', borderRadius: '12px' }}></div>
                                </Card>
                            </aside>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
            {/* Animated Background */}
            <div className="feed-background-container" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
            }}>
                {/* Canvas Particle Background */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.4,
                    }}
                />

                {/* Floating Shapes with subtle mouse interaction */}
                {floatingShapes.map((shape) => {
                    const shapeCenterX = (shape.x / 100) * window.innerWidth;
                    const shapeCenterY = (shape.y / 100) * window.innerHeight;
                    const distFromMouse = Math.sqrt(
                        Math.pow(shapeCenterX - mousePos.x, 2) + 
                        Math.pow(shapeCenterY - mousePos.y, 2)
                    );
                    const maxDist = 220;
                    const proximity = Math.max(0, 1 - distFromMouse / maxDist);
                    const scale = 1 + proximity * 0.3;
                    const opacity = shape.opacity + proximity * 0.1;

                    return (
                        <div
                            key={shape.id}
                            className={`feed-floating-shape feed-shape-${shape.type}`}
                            style={{
                                position: 'absolute',
                                left: `${shape.x}%`,
                                top: `${shape.y}%`,
                                width: `${shape.size}px`,
                                height: `${shape.size}px`,
                                opacity: Math.min(0.4, opacity),
                                transform: `rotate(${shape.rotation}deg) scale(${scale})`,
                                background: shape.type === 'circle' 
                                    ? 'radial-gradient(circle, rgba(0, 240, 255, 0.3), rgba(112, 0, 255, 0.2), rgba(255, 0, 85, 0.1))'
                                    : 'linear-gradient(135deg, rgba(112, 0, 255, 0.2), rgba(255, 0, 85, 0.2), rgba(0, 240, 255, 0.1))',
                                borderRadius: shape.type === 'circle' ? '50%' : '20%',
                                filter: `blur(${Math.max(10, 20 - proximity * 10)}px)`,
                                animation: `float-${shape.id % 8} ${15 + shape.id * 1.5}s ease-in-out infinite`,
                                transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, filter 0.15s ease-out',
                                boxShadow: proximity > 0.3 ? `0 0 ${proximity * 20}px rgba(0, 240, 255, ${proximity * 0.2})` : 'none',
                            }}
                        />
                    );
                })}

                {/* Gradient Orbs with subtle mouse interaction */}
                <div 
                    className="feed-gradient-orb feed-orb-1"
                    style={{
                        position: 'absolute',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2), rgba(112, 0, 255, 0.1), transparent 70%)',
                        borderRadius: '50%',
                        top: '-200px',
                        left: '-200px',
                        filter: 'blur(60px)',
                        animation: 'orb-float-1 20s ease-in-out infinite',
                        transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.01}px, ${(mousePos.y - window.innerHeight / 2) * 0.01}px)`,
                        transition: 'transform 0.08s ease-out, filter 0.2s ease-out',
                        boxShadow: `0 0 100px rgba(0, 240, 255, 0.2)`,
                    }}
                />
                <div 
                    className="feed-gradient-orb feed-orb-2"
                    style={{
                        position: 'absolute',
                        width: '500px',
                        height: '500px',
                        background: 'radial-gradient(circle, rgba(112, 0, 255, 0.2), rgba(255, 0, 85, 0.1), transparent 70%)',
                        borderRadius: '50%',
                        bottom: '-300px',
                        right: '-300px',
                        filter: 'blur(80px)',
                        animation: 'orb-float-2 25s ease-in-out infinite',
                        transform: `translate(${(mousePos.x - window.innerWidth / 2) * -0.01}px, ${(mousePos.y - window.innerHeight / 2) * -0.01}px)`,
                        transition: 'transform 0.08s ease-out, filter 0.2s ease-out',
                        boxShadow: `0 0 120px rgba(112, 0, 255, 0.2)`,
                    }}
                />
                <div 
                    className="feed-gradient-orb feed-orb-3"
                    style={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(255, 0, 85, 0.1), rgba(0, 240, 255, 0.05), transparent 70%)',
                        borderRadius: '50%',
                        top: '50%',
                        left: '50%',
                        filter: 'blur(50px)',
                        animation: 'orb-pulse 15s ease-in-out infinite',
                        transform: `translate(calc(-50% + ${(mousePos.x - window.innerWidth / 2) * 0.005}px), calc(-50% + ${(mousePos.y - window.innerHeight / 2) * 0.005}px))`,
                        transition: 'transform 0.08s ease-out, filter 0.2s ease-out',
                        boxShadow: `0 0 80px rgba(255, 0, 85, 0.2)`,
                    }}
                />

                {/* Click Ripples */}
                {ripples.map((ripple) => (
                    <div
                        key={ripple.id}
                        className="interactive-ripple"
                        style={{
                            position: 'absolute',
                            left: `${ripple.x}px`,
                            top: `${ripple.y}px`,
                            width: '0',
                            height: '0',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(0, 240, 255, 0.3), rgba(112, 0, 255, 0.2), transparent)',
                            transform: 'translate(-50%, -50%)',
                            pointerEvents: 'none',
                            animation: 'ripple-expand 1s ease-out forwards',
                        }}
                    />
                ))}

                {/* Mouse follower glow - subtle */}
                <div 
                    className="mouse-follower-glow"
                    style={{
                        position: 'absolute',
                        left: `${mousePos.x}px`,
                        top: `${mousePos.y}px`,
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2), rgba(112, 0, 255, 0.1), transparent 70%)',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        transition: 'opacity 0.2s, transform 0.1s',
                        filter: 'blur(30px)',
                        boxShadow: '0 0 40px rgba(0, 240, 255, 0.2)',
                    }}
                />
            </div>

            <Navbar />
            
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <div className="container" style={{ maxWidth: '1400px' }}>
                    <div className="dashboard-layout">
                        {/* Left Sidebar - Enhanced */}
                        <aside className="dashboard-sidebar dashboard-sidebar-left">
                            <Card className="sidebar-card-enhanced">
                                {/* User Avatar with Enhanced Design */}
                                <div className="user-avatar-container-enhanced">
                                    <div className="avatar-glow-enhanced"></div>
                                    <div className="avatar-ring-pulse"></div>
                                    <div className="user-avatar-enhanced">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div className={`online-indicator-enhanced ${user ? 'online' : 'offline'}`}>
                                        <div className="status-pulse"></div>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="user-info-section">
                                    <h3 className="user-name-enhanced">
                                        {user?.name || 'User'}
                                    </h3>
                                    <p className="user-role-enhanced">
                                        {user?.headline || user?.role || 'Member'}
                                    </p>
                                    {user?.college && (
                                        <p className="user-college">
                                            🎓 {user.college}
                                        </p>
                                    )}
                                </div>

                                {/* Enhanced Karma Score */}
                                <div className="karma-display-enhanced">
                                    <div className="karma-icon-enhanced">
                                        <span className="karma-star">⭐</span>
                                        <div className="karma-glow"></div>
                                    </div>
                                    <div className="karma-content">
                                        <div className="karma-value-enhanced">{user?.karma || 0}</div>
                                        <div className="karma-label-enhanced">KARMA POINTS</div>
                                        {user?.karma > 0 && (
                                            <div className="karma-progress">
                                                <div 
                                                    className="karma-progress-bar"
                                                    style={{ width: `${Math.min(100, (user.karma / 200) * 100)}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Quick Actions */}
                                <div className="quick-actions-enhanced">
                                    {/* Followers and Following Buttons */}
                                    <div className="followers-connections-section">
                                        <button 
                                            className="followers-connections-btn fc-followers"
                                            onClick={() => navigate('/profile?tab=followers')}
                                            title="View your followers"
                                        >
                                            <div className="fc-icon-wrapper">
                                                <span className="fc-icon">👥</span>
                                            </div>
                                            <div className="fc-content">
                                                <div className="fc-value">{followers}</div>
                                                <div className="fc-label">FOLLOWERS</div>
                                            </div>
                                        </button>
                                        <button 
                                            className="followers-connections-btn fc-following"
                                            onClick={() => navigate('/profile?tab=following')}
                                            title="View who you're following"
                                        >
                                            <div className="fc-icon-wrapper">
                                                <span className="fc-icon">🔗</span>
                                            </div>
                                            <div className="fc-content">
                                                <div className="fc-value">{following}</div>
                                                <div className="fc-label">FOLLOWING</div>
                                            </div>
                                        </button>
                                    </div>
                                    
                                    <Link to="/opportunities" className="quick-action-btn-enhanced" data-icon="💼">
                                        <span className="action-icon">💼</span>
                                        <span className="action-text">Opportunities</span>
                                        <span className="action-arrow">→</span>
                                    </Link>
                                    <Link to="/mentorship" className="quick-action-btn-enhanced" data-icon="🤝">
                                        <span className="action-icon">🤝</span>
                                        <span className="action-text">Mentorship</span>
                                        <span className="action-arrow">→</span>
                                    </Link>
                                </div>

                                {/* Enhanced Stats */}
                                <div className="user-stats-enhanced">
                                    <div className="stat-item-enhanced">
                                        <div className="stat-icon">📝</div>
                                        <div className="stat-content">
                                            <div className="stat-value-enhanced">
                                                {posts.filter(p => p.user?._id === user?._id || p.user === user?._id).length}
                                            </div>
                                            <div className="stat-label-enhanced">POSTS</div>
                                        </div>
                                    </div>
                                    <div className="stat-divider"></div>
                                    <div className="stat-item-enhanced">
                                        <div className="stat-icon">🔗</div>
                                        <div className="stat-content">
                                            <div className="stat-value-enhanced">{connections.length}</div>
                                            <div className="stat-label-enhanced">CONNECTIONS</div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </aside>

                        {/* Center Feed */}
                        <section className="dashboard-feed">
                            {/* Welcome Message */}
                            <div className="welcome-banner">
                                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>
                                    Welcome back, {user?.name?.split(' ')[0] || 'there'}.
                                </h2>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>
                                    Stay updated on the latest posts and opportunities from your campus network.
                                </p>
                            </div>

                            {/* Post Composer */}
                            <Card className="post-composer-card">
                                {!showCreatePost ? (
                                    <div 
                                        className="post-composer-trigger"
                                        onClick={() => setShowCreatePost(true)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="composer-avatar">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Share an update with your campus network"
                                            readOnly
                                            className="composer-input"
                                        />
                                        <Button variant="primary" style={{ minWidth: '100px' }}>
                                            Post
                            </Button>
                        </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div className="composer-avatar">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 600 }}>
                                            Create a new post
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowCreatePost(false);
                                                setNewPost({ content: '', type: 'general', tags: '' });
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'var(--text-secondary)',
                                                cursor: 'pointer',
                                                fontSize: '1.5rem',
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                                e.target.style.color = 'var(--text-primary)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'none';
                                                e.target.style.color = 'var(--text-secondary)';
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                )}

                        {showCreatePost && (
                                    <form onSubmit={handleCreatePost} className="post-composer-form">
                                        <div className="form-group">
                                            <label className="form-label">
                                                <span style={{ marginRight: '0.5rem' }}>📝</span>
                                            Post Type
                                        </label>
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
                                            <label className="form-label">
                                                <span style={{ marginRight: '0.5rem' }}>✍️</span>
                                                Content
                                        </label>
                                        <textarea
                                            value={newPost.content}
                                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                                rows="5"
                                                className="form-input"
                                                placeholder="Share your thoughts, achievements, or opportunities..."
                                            required
                                                style={{ resize: 'vertical', minHeight: '120px' }}
                                            />
                                            <div style={{ 
                                                fontSize: '0.75rem', 
                                                color: 'var(--text-secondary)', 
                                                marginTop: '0.5rem',
                                                textAlign: 'right'
                                            }}>
                                                {newPost.content.length} characters
                                            </div>
                                    </div>
                                        <div className="form-group">
                                            <label className="form-label">
                                                <span style={{ marginRight: '0.5rem' }}>🏷️</span>
                                                Tags (optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={newPost.tags}
                                            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                                className="form-input"
                                                placeholder="tech, career, advice (comma separated)"
                                        />
                                    </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                            <Button 
                                                type="button" 
                                                variant="glass" 
                                                onClick={() => {
                                                    setShowCreatePost(false);
                                                    setNewPost({ content: '', type: 'general', tags: '' });
                                                }}
                                                style={{ flex: 1 }}
                                                disabled={isPosting}
                                            >
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                variant="primary" 
                                                style={{ flex: 1 }}
                                                disabled={isPosting || !newPost.content.trim()}
                                                className="btn-interactive"
                                            >
                                                {isPosting ? (
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                                                        <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                                                        Posting...
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span>Post</span>
                                                        <span className="btn-shine"></span>
                                                    </>
                                                )}
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
                                            <h3 style={{ margin: '0 0 0.5rem 0' }}>Share your first update</h3>
                                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                                Start the conversation by posting about your projects, wins, or questions.
                                </p>
                                <Button variant="primary" onClick={() => setShowCreatePost(true)}>
                                                Create first post
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
