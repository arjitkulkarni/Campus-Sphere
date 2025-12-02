import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { connectionsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MentorCard from '../components/molecules/MentorCard';
import Card from '../components/atoms/Card';

const Mentorship = () => {
    const { user, loading: authLoading } = useAuth();
    const { success, error: showError } = useToast();
    
    const [mentors, setMentors] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('discover');
    const [mentorshipMode, setMentorshipMode] = useState('give'); // 'request' or 'give' for faculty/alumni
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [scheduleDuration, setScheduleDuration] = useState(45);
    const [isScheduling, setIsScheduling] = useState(false);
    const [mockConnections, setMockConnections] = useState([]);
    const mockInitialized = useRef(false);

    const fetchMentors = useCallback(async () => {
        try {
            setLoading(true);
            const response = await connectionsAPI.getMentors();
            console.log('Mentors API Response:', response);
            
            let mentorsData = [];
            if (response) {
                if (Array.isArray(response)) {
                    mentorsData = response;
                } else if (Array.isArray(response.data)) {
                    mentorsData = response.data;
                }
            }
            
            setMentors(mentorsData || []);
        } catch (error) {
            console.error('Error fetching mentors:', error);
            setMentors([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchConnections = useCallback(async () => {
        try {
            const response = await connectionsAPI.getConnections();
            console.log('Connections API Response:', response);
            
            let connectionsData = [];
            if (response) {
                if (Array.isArray(response)) {
                    connectionsData = response;
                } else if (Array.isArray(response.data)) {
                    connectionsData = response.data;
                }
            }
            
            setConnections(connectionsData || []);
        } catch (error) {
            console.error('Error fetching connections:', error);
            setConnections([]);
        }
    }, []);

    useEffect(() => {
        if (!authLoading && user) {
            fetchMentors();
            fetchConnections();
        }
    }, [authLoading, user, fetchMentors, fetchConnections]);

    const handleUpdate = () => {
        fetchMentors();
        fetchConnections();
    };

    // Show loading state
    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
                </div>
            </div>
        );
    }

    // Show auth required if no user
    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <Card style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
                        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Authentication Required</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Please log in to access mentorship features.</p>
                    </Card>
                </div>
            </div>
        );
    }

    // Initialize mock connections for alumni - MUST BE AT TOP LEVEL
    useEffect(() => {
        try {
            if (!user) return;
            const userId = user._id || user.id;
            if (!userId) return;
            const isAlumni = Boolean(user?.role === 'alumni');
            const isFaculty = Boolean(user?.role === 'faculty');
            const safeConnectionsArray = Array.isArray(connections) ? connections : [];
            
            if ((isAlumni || isFaculty) && !loading && !mockInitialized.current) {
                const realMentorConnections = safeConnectionsArray.filter(conn => {
                    if (!conn) return false;
                    const mentorId = conn.mentor?._id || conn.mentor || conn.mentorId;
                    return mentorId === userId && !conn._id?.startsWith('mock_');
                });
                
                if (realMentorConnections.length === 0) {
                    const now = new Date();
                    const inDays = (d) => {
                        const copy = new Date(now);
                        copy.setDate(copy.getDate() + d);
                        copy.setHours(18, 0, 0, 0);
                        return copy.toISOString();
                    };

                    setMockConnections([
                        {
                            _id: 'mock_conn_1',
                            status: 'pending',
                            mentee: { name: 'Ananya Rao' },
                            sessions: [],
                        },
                        {
                            _id: 'mock_conn_2',
                            status: 'accepted',
                            mentee: { name: 'Rahul Sharma' },
                            sessions: [{
                                dateTime: inDays(5),
                                duration: 30,
                            }],
                        },
                    ]);
                    mockInitialized.current = true;
                }
            }
        } catch (error) {
            console.error('Error initializing mock connections:', error);
        }
    }, [user, loading, connections]);

    // Safe data processing with error handling
    let userId, safeConnectionsArray, myConnections, isAlumni, mentorConnections, allMentorConnections, pendingRequests, upcomingSessions, safeMentors, totalMentees, totalSessions, pastSessions;
    
    try {
        userId = user?._id || user?.id || '';
        safeConnectionsArray = Array.isArray(connections) ? connections : [];
        
        myConnections = safeConnectionsArray.filter(conn => {
            if (!conn) return false;
            try {
                const mentorId = conn.mentor?._id || conn.mentor || conn.mentorId;
                const menteeId = conn.mentee?._id || conn.mentee || conn.menteeId || conn.student?._id || conn.student || conn.studentId;
                return mentorId === userId || menteeId === userId;
            } catch {
                return false;
            }
        });

        isAlumni = Boolean(user?.role === 'alumni');

        mentorConnections = safeConnectionsArray.filter(conn => {
            if (!conn) return false;
            try {
                const mentorId = conn.mentor?._id || conn.mentor || conn.mentorId;
                return mentorId === userId;
            } catch {
                return false;
            }
        }).filter(conn => conn && !conn._id?.startsWith('mock_'));

        allMentorConnections = [...mentorConnections, ...mockConnections];
        pendingRequests = (allMentorConnections || []).filter(conn => conn && conn.status === 'pending');
        totalMentees = (allMentorConnections || []).filter(conn => conn && (conn.status === 'accepted' || conn.status === 'active')).length;
        totalSessions = (() => {
            try {
                return (allMentorConnections || []).reduce((total, conn) => {
                    return total + (conn.sessions?.length || 0);
                }, 0);
            } catch {
                return 0;
            }
        })();

        upcomingSessions = (() => {
            try {
                const now = new Date();
                return (allMentorConnections || [])
                    .filter(conn => conn && conn !== null && conn !== undefined)
                    .flatMap(conn => {
                        const sessions = conn.sessions || [];
                        return sessions.map(session => ({
                            ...session,
                            connection: conn,
                        }));
                    })
                    .filter(session => {
                        const when = session.dateTime || session.scheduledAt;
                        if (!when) return false;
                        try {
                            const date = new Date(when);
                            return !isNaN(date.getTime()) && date > now;
                        } catch {
                            return false;
                        }
                    })
                    .sort((a, b) => {
                        try {
                            const dateA = new Date(a.dateTime || a.scheduledAt);
                            const dateB = new Date(b.dateTime || b.scheduledAt);
                            return dateA - dateB;
                        } catch {
                            return 0;
                        }
                    });
            } catch (error) {
                console.error('Error computing upcomingSessions:', error);
                return [];
            }
        })();

        pastSessions = (() => {
            try {
                const now = new Date();
                return (allMentorConnections || [])
                    .filter(conn => conn && conn !== null && conn !== undefined)
                    .flatMap(conn => {
                        const sessions = conn.sessions || [];
                        return sessions.map(session => ({
                            ...session,
                            connection: conn,
                        }));
                    })
                    .filter(session => {
                        const when = session.dateTime || session.scheduledAt;
                        if (!when) return false;
                        try {
                            const date = new Date(when);
                            return !isNaN(date.getTime()) && date <= now;
                        } catch {
                            return false;
                        }
                    })
                    .sort((a, b) => {
                        try {
                            const dateA = new Date(a.dateTime || a.scheduledAt);
                            const dateB = new Date(b.dateTime || b.scheduledAt);
                            return dateB - dateA; // Most recent first
                        } catch {
                            return 0;
                        }
                    })
                    .slice(0, 5);
            } catch (error) {
                console.error('Error computing pastSessions:', error);
                return [];
            }
        })();

        safeMentors = Array.isArray(mentors) ? mentors : [];
    } catch (error) {
        console.error('Error processing mentorship data:', error);
        // Set safe defaults
        userId = user?._id || user?.id || '';
        safeConnectionsArray = [];
        myConnections = [];
        isAlumni = false;
        mentorConnections = [];
        allMentorConnections = [];
        pendingRequests = [];
        upcomingSessions = [];
        safeMentors = [];
        totalMentees = 0;
        totalSessions = 0;
        pastSessions = [];
    }

    // Calculate isFaculty for use in render
    const isFaculty = Boolean(user?.role === 'faculty');

    // Calculate accepted connections and statistics for alumni
    const acceptedConnections = Array.isArray(allMentorConnections) 
        ? allMentorConnections.filter(conn => conn && (conn.status === 'accepted' || conn.status === 'active'))
        : [];
    const stats = {
        totalMentees: totalMentees || 0,
        totalSessions: totalSessions || 0,
        pendingRequests: Array.isArray(pendingRequests) ? pendingRequests.length : 0,
        upcomingSessions: Array.isArray(upcomingSessions) ? upcomingSessions.length : 0,
        completedSessions: Array.isArray(pastSessions) ? pastSessions.length : 0,
    };

    // Always render something
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
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
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2), rgba(112, 0, 255, 0.1), transparent 70%)',
                    borderRadius: '50%',
                    top: '-200px',
                    left: '-200px',
                    filter: 'blur(60px)',
                    animation: 'orb-float-1 20s ease-in-out infinite',
                }} />
                <div className="feed-gradient-orb feed-orb-2" style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(112, 0, 255, 0.2), rgba(255, 0, 85, 0.1), transparent 70%)',
                    borderRadius: '50%',
                    bottom: '-300px',
                    right: '-300px',
                    filter: 'blur(80px)',
                    animation: 'orb-float-2 25s ease-in-out infinite',
                }} />
            </div>
            <Navbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <div className="container" style={{ padding: '0 1rem' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 700 }}>
                                {isAlumni || isFaculty ? 'Mentorship' : 'Mentorship'}
                            </h1>
                            {(isAlumni || isFaculty) && (
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    Welcome back, {user?.name || 'User'}! Manage your mentorship journey.
                                </p>
                            )}
                        </div>

                        {/* Tabs for Faculty and Alumni */}
                        {(isAlumni || isFaculty) && (
                            <div style={{ 
                                display: 'flex', 
                                gap: '1rem', 
                                marginBottom: '2rem', 
                                borderBottom: '1px solid var(--glass-border)'
                            }}>
                                <button
                                    onClick={() => setMentorshipMode('give')}
                                    style={{
                                        padding: '1rem 2rem',
                                        background: mentorshipMode === 'give' ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderBottom: mentorshipMode === 'give' ? '2px solid var(--primary)' : '2px solid transparent',
                                        color: mentorshipMode === 'give' ? 'var(--primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: mentorshipMode === 'give' ? '600' : '400',
                                        transition: 'var(--transition-fast)',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Give Mentorship
                                </button>
                                <button
                                    onClick={() => setMentorshipMode('request')}
                                    style={{
                                        padding: '1rem 2rem',
                                        background: mentorshipMode === 'request' ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderBottom: mentorshipMode === 'request' ? '2px solid var(--primary)' : '2px solid transparent',
                                        color: mentorshipMode === 'request' ? 'var(--primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: mentorshipMode === 'request' ? '600' : '400',
                                        transition: 'var(--transition-fast)',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Request Mentorship
                                </button>
                            </div>
                        )}

                        {/* Give Mentorship View (for Alumni and Faculty) */}
                        {(isAlumni || isFaculty) && mentorshipMode === 'give' ? (
                            <>
                                {/* Statistics Dashboard */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                    gap: '1rem',
                                    marginBottom: '2rem'
                                }}>
                                    <Card style={{ 
                                        background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.1), rgba(112, 0, 255, 0.05))',
                                        border: '1px solid rgba(0, 240, 255, 0.2)',
                                        padding: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '48px', 
                                                height: '48px', 
                                                borderRadius: '12px',
                                                background: 'rgba(0, 240, 255, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem'
                                            }}>👥</div>
                                            <div>
                                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
                                                    {stats.totalMentees}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    Active Mentees
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card style={{ 
                                        background: 'linear-gradient(135deg, rgba(112, 0, 255, 0.1), rgba(255, 0, 85, 0.05))',
                                        border: '1px solid rgba(112, 0, 255, 0.2)',
                                        padding: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '48px', 
                                                height: '48px', 
                                                borderRadius: '12px',
                                                background: 'rgba(112, 0, 255, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem'
                                            }}>📅</div>
                                            <div>
                                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
                                                    {stats.totalSessions}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    Total Sessions
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card style={{ 
                                        background: 'linear-gradient(135deg, rgba(255, 200, 0, 0.1), rgba(255, 100, 0, 0.05))',
                                        border: '1px solid rgba(255, 200, 0, 0.2)',
                                        padding: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '48px', 
                                                height: '48px', 
                                                borderRadius: '12px',
                                                background: 'rgba(255, 200, 0, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem'
                                            }}>⏰</div>
                                            <div>
                                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)', lineHeight: 1 }}>
                                                    {stats.upcomingSessions}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    Upcoming
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card style={{ 
                                        background: 'linear-gradient(135deg, rgba(0, 255, 150, 0.1), rgba(0, 200, 100, 0.05))',
                                        border: '1px solid rgba(0, 255, 150, 0.2)',
                                        padding: '1.5rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ 
                                                width: '48px', 
                                                height: '48px', 
                                                borderRadius: '12px',
                                                background: 'rgba(0, 255, 150, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem'
                                            }}>✅</div>
                                            <div>
                                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)', lineHeight: 1 }}>
                                                    {stats.completedSessions}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    Completed
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Main Content Grid */}
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', 
                                    gap: '1.5rem',
                                    marginBottom: '2rem'
                                }}>
                                    <Card>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h3 style={{ marginTop: 0, marginBottom: 0 }}>Upcoming Sessions</h3>
                                            {upcomingSessions.length > 0 && (
                                                <span style={{ 
                                                    fontSize: '0.75rem', 
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '12px',
                                                    background: 'rgba(0, 240, 255, 0.2)',
                                                    color: 'var(--primary)'
                                                }}>
                                                    {upcomingSessions.length} scheduled
                                                </span>
                                            )}
                                        </div>
                                        {upcomingSessions.length === 0 ? (
                                            <div style={{ 
                                                textAlign: 'center', 
                                                padding: '2rem 1rem',
                                                color: 'var(--text-secondary)'
                                            }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                                                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                                                    No upcoming sessions scheduled. Accept requests to get started!
                                                </p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {upcomingSessions.slice(0, 5).map((session, idx) => {
                                                    const menteeName = session.connection?.mentee?.name || session.connection?.student?.name || 'Student';
                                                    const when = session.dateTime || session.scheduledAt;
                                                    let dateStr = 'Date TBD';
                                                    let timeUntil = '';
                                                    
                                                    try {
                                                        if (when) {
                                                            const date = new Date(when);
                                                            if (!isNaN(date.getTime())) {
                                                                dateStr = date.toLocaleDateString('en-US', { 
                                                                    month: 'short', 
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                });
                                                                const timeStr = date.toLocaleTimeString('en-US', { 
                                                                    hour: 'numeric', 
                                                                    minute: '2-digit',
                                                                    hour12: true 
                                                                });
                                                                const now = new Date();
                                                                const diffMs = date - now;
                                                                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                                                                if (diffDays === 0) timeUntil = 'Today';
                                                                else if (diffDays === 1) timeUntil = 'Tomorrow';
                                                                else if (diffDays < 7) timeUntil = `In ${diffDays} days`;
                                                                else timeUntil = `In ${Math.floor(diffDays / 7)} weeks`;
                                                                dateStr = `${dateStr} at ${timeStr}`;
                                                            }
                                                        }
                                                    } catch {}

                                                    return (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                padding: '1rem',
                                                                borderRadius: '12px',
                                                                background: 'rgba(0, 240, 255, 0.08)',
                                                                border: '1px solid rgba(0, 240, 255, 0.3)',
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                gap: '0.5rem',
                                                                transition: 'all 0.2s',
                                                                cursor: 'pointer'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = 'rgba(0, 240, 255, 0.12)';
                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = 'rgba(0, 240, 255, 0.08)';
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                                        {menteeName}
                                                                    </div>
                                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                        {dateStr}
                                                                    </div>
                                                                </div>
                                                                {timeUntil && (
                                                                    <span style={{ 
                                                                        fontSize: '0.7rem',
                                                                        padding: '0.2rem 0.5rem',
                                                                        borderRadius: '8px',
                                                                        background: 'rgba(0, 240, 255, 0.15)',
                                                                        color: 'var(--primary)',
                                                                        whiteSpace: 'nowrap'
                                                                    }}>
                                                        {timeUntil}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {session.duration && (
                                                                <div style={{ 
                                                                    fontSize: '0.75rem', 
                                                                    color: 'var(--text-secondary)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.25rem'
                                                                }}>
                                                                    <span>⏱</span> {session.duration} minutes
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </Card>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <Card>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <h3 style={{ marginTop: 0, marginBottom: 0 }}>Pending Requests</h3>
                                                {pendingRequests.length > 0 && (
                                                    <span style={{ 
                                                        fontSize: '0.75rem', 
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '12px',
                                                        background: 'rgba(255, 200, 0, 0.2)',
                                                        color: 'var(--warning)'
                                                    }}>
                                                        {pendingRequests.length} new
                                                    </span>
                                                )}
                                            </div>
                                            {pendingRequests.length === 0 ? (
                                                <div style={{ 
                                                    textAlign: 'center', 
                                                    padding: '2rem 1rem',
                                                    color: 'var(--text-secondary)'
                                                }}>
                                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
                                                    <p style={{ fontSize: '0.9rem', margin: 0 }}>
                                                        All caught up! No pending requests.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {pendingRequests.map((connection) => {
                                                        const menteeName = connection.mentee?.name || connection.student?.name || 'Student';
                                                        const menteeCollege = connection.mentee?.college || connection.student?.college || '';
                                                        const menteeYear = connection.mentee?.graduationYear || connection.student?.graduationYear || '';
                                                        
                                                        return (
                                                            <div
                                                                key={connection._id}
                                                                style={{
                                                                    padding: '1rem',
                                                                    borderRadius: '12px',
                                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: '0.75rem',
                                                                }}
                                                            >
                                                                <div>
                                                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                                                                        {menteeName}
                                                                    </div>
                                                                    {(menteeCollege || menteeYear) && (
                                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                            {menteeCollege}{menteeYear ? ` • Class of ${menteeYear}` : ''}
                                                                        </div>
                                                                    )}
                                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                                        Wants mentorship guidance
                                                                    </div>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedRequest(connection);
                                                                            const now = new Date();
                                                                            now.setDate(now.getDate() + 2);
                                                                            const yyyy = now.getFullYear();
                                                                            const mm = String(now.getMonth() + 1).padStart(2, '0');
                                                                            const dd = String(now.getDate()).padStart(2, '0');
                                                                            setScheduleDate(`${yyyy}-${mm}-${dd}`);
                                                                            setScheduleTime('18:00');
                                                                            setScheduleDuration(45);
                                                                        }}
                                                                        className="btn btn-primary"
                                                                        style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                                                    >
                                                                        ✓ Accept
                                                                    </button>
                                                                    <button
                                                                        onClick={async () => {
                                                                            try {
                                                                                const connectionId = connection._id || connection.id;
                                                                                const isMockConnection = connectionId?.startsWith('mock_');
                                                                                
                                                                                if (isMockConnection) {
                                                                                    setMockConnections(prevMock => 
                                                                                        prevMock.filter(conn => {
                                                                                            const connId = conn._id || conn.id;
                                                                                            return connId !== connectionId;
                                                                                        })
                                                                                    );
                                                                                } else {
                                                                                    setConnections(prevConnections => 
                                                                                        prevConnections.map(conn => {
                                                                                            const connId = conn._id || conn.id;
                                                                                            if (connId === connectionId) {
                                                                                                return { ...conn, status: 'rejected' };
                                                                                            }
                                                                                            return conn;
                                                                                        })
                                                                                    );
                                                                                    
                                                                                    try {
                                                                                        await connectionsAPI.updateConnection(connectionId, 'rejected');
                                                                                        fetchConnections();
                                                                                    } catch (error) {
                                                                                        console.warn('Backend sync failed, but local state updated:', error);
                                                                                    }
                                                                                }
                                                                            } catch (error) {
                                                                                console.error('Error updating connection:', error);
                                                                                if (showError) showError('Failed to reject request. Please try again.');
                                                                            }
                                                                        }}
                                                                        className="btn btn-glass"
                                                                        style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                                                                    >
                                                                        ✕ Decline
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </Card>

                                        {/* Active Mentees */}
                                        {acceptedConnections.length > 0 && (
                                            <Card>
                                                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Active Mentees</h3>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    {acceptedConnections.slice(0, 3).map((connection) => {
                                                        const menteeName = connection.mentee?.name || connection.student?.name || 'Student';
                                                        const menteeSkills = connection.mentee?.skills || connection.student?.skills || [];
                                                        const sessionCount = connection.sessions?.length || 0;
                                                        
                                                        return (
                                                            <div
                                                                key={connection._id}
                                                                style={{
                                                                    padding: '0.75rem',
                                                                    borderRadius: '10px',
                                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                <div>
                                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                                                        {menteeName}
                                                                    </div>
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                                        {sessionCount} session{sessionCount !== 1 ? 's' : ''} completed
                                                                    </div>
                                                                </div>
                                                                <div style={{ 
                                                                    fontSize: '1.5rem',
                                                                    opacity: 0.6
                                                                }}>
                                                                    →
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </Card>
                                        )}
                                    </div>
                            </div>
                            </>
                        ) : null}

                        {/* Request Mentorship View (for Alumni and Faculty) */}
                        {(isAlumni || isFaculty) && mentorshipMode === 'request' ? (
                            <>
                                {safeMentors.length === 0 ? (
                                    <Card style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No mentors available</h3>
                                        <p style={{ color: 'var(--text-secondary)' }}>
                                            No mentors available at the moment. Check back later!
                                        </p>
                                    </Card>
                                ) : (
                                    <div>
                                        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
                                            Discover Available Mentors
                                        </h2>
                                        {safeMentors.map((mentor) => {
                                            if (!mentor || (!mentor._id && !mentor.id)) return null;
                                            return (
                                                <MentorCard
                                                    key={mentor._id || mentor.id}
                                                    mentor={mentor}
                                                    onUpdate={fetchConnections}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : null}

                        {!isAlumni ? (
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                                <button
                                    onClick={() => setActiveTab('discover')}
                                    style={{
                                        padding: '1rem 2rem',
                                        background: activeTab === 'discover' ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderBottom: activeTab === 'discover' ? '2px solid var(--primary)' : '2px solid transparent',
                                        color: activeTab === 'discover' ? 'var(--primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === 'discover' ? '600' : '400',
                                        transition: 'var(--transition-fast)',
                                    }}
                                >
                                    Discover Mentors
                                </button>
                                <button
                                    onClick={() => setActiveTab('connections')}
                                    style={{
                                        padding: '1rem 2rem',
                                        background: activeTab === 'connections' ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderBottom: activeTab === 'connections' ? '2px solid var(--primary)' : '2px solid transparent',
                                        color: activeTab === 'connections' ? 'var(--primary)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === 'connections' ? '600' : '400',
                                        transition: 'var(--transition-fast)',
                                    }}
                                >
                                    My Connections ({myConnections.length})
                                </button>
                            </div>
                        ) : null}

                        {(!isAlumni && activeTab === 'discover') ? (
                            <>
                                {safeMentors.length === 0 ? (
                                    <Card style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No mentors available</h3>
                                        <p style={{ color: 'var(--text-secondary)' }}>
                                            No mentors available at the moment. Check back later!
                                        </p>
                                    </Card>
                                ) : (
                                    <div>
                                        {safeMentors.map((mentor) => {
                                            if (!mentor || (!mentor._id && !mentor.id)) return null;
                                            return (
                                                <MentorCard 
                                                    key={mentor._id || mentor.id} 
                                                    mentor={mentor} 
                                                    onUpdate={handleUpdate}
                                                    existingConnections={safeConnectionsArray}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                            ) : (
                                <>
                                    {myConnections.length === 0 ? (
                                        <Card style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)' }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                                            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Start Your Mentorship Journey</h3>
                                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                                                You don't have any connections yet. Discover mentors to get started!
                                            </p>
                                            <button
                                                onClick={() => setActiveTab('discover')}
                                                className="btn btn-primary"
                                                style={{ padding: '0.75rem 1.5rem' }}
                                            >
                                                Browse Mentors
                                            </button>
                                        </Card>
                                    ) : (
                                    myConnections.map((connection) => {
                                        if (!connection) return null;
                                        const mentorId = connection.mentor?._id || connection.mentor || connection.mentorId;
                                        const isMentor = mentorId === userId;
                                        const otherPerson = isMentor 
                                            ? (connection.mentee || connection.student) 
                                            : (connection.mentor || {});

                                        if (!otherPerson || !otherPerson.name) return null;

                                        return (
                                            <Card key={connection._id || connection.id} style={{ marginBottom: '2rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ marginBottom: '0.5rem' }}>
                                                            {isMentor ? 'Mentee' : 'Mentor'}: {otherPerson.name}
                                                        </h3>
                                                        <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                                            Status: <span style={{ 
                                                                color: connection.status === 'accepted' ? 'var(--success)' : 
                                                                       connection.status === 'pending' ? 'var(--warning)' : 'var(--text-secondary)'
                                                            }}>
                                                                {connection.status}
                                                            </span>
                                                        </div>
                                                        {connection.sessions && connection.sessions.length > 0 && (
                                                            <div style={{ marginTop: '1rem' }}>
                                                                <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Scheduled Sessions:</h4>
                                                                {connection.sessions.map((session, idx) => {
                                                                    const sessionDate = session.scheduledAt || session.dateTime;
                                                                    return (
                                                                        <div key={idx} style={{ 
                                                                            padding: '0.75rem',
                                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                                            borderRadius: '8px',
                                                                            marginBottom: '0.5rem',
                                                                        }}>
                                                                            {sessionDate ? (
                                                                                <>
                                                                                    {(() => {
                                                                                        try {
                                                                                            const date = new Date(sessionDate);
                                                                                            if (isNaN(date.getTime())) return 'Invalid date';
                                                                                            return date.toLocaleString();
                                                                                        } catch {
                                                                                            return 'Date TBD';
                                                                                        }
                                                                                    })()}
                                                                                    {session.duration && ` (${session.duration} min)`}
                                                                                </>
                                                                            ) : (
                                                                                `Session ${idx + 1}${session.duration ? ` (${session.duration} min)` : ''}`
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Mentorship;
