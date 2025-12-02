import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/atoms/Card';

const EventManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upcoming');

    const stats = [
        { label: 'Total Events', value: '156', icon: '📅', color: 'rgba(0, 255, 150, 0.2)' },
        { label: 'Upcoming', value: '42', icon: '⏰', color: 'rgba(0, 240, 255, 0.2)' },
        { label: 'Total Attendees', value: '8,234', icon: '👥', color: 'rgba(112, 0, 255, 0.2)' },
        { label: 'Avg Attendance', value: '87%', icon: '📊', color: 'rgba(255, 200, 0, 0.2)' },
    ];

    const upcomingEvents = [
        { id: 1, title: 'Tech Career Fair 2025', date: '2025-01-15', time: '10:00 AM', location: 'Main Auditorium', attendees: 234, capacity: 300 },
        { id: 2, title: 'AI & Machine Learning Workshop', date: '2025-01-18', time: '2:00 PM', location: 'Tech Lab', attendees: 45, capacity: 50 },
        { id: 3, title: 'Startup Pitch Competition', date: '2025-01-22', time: '6:00 PM', location: 'Innovation Hub', attendees: 128, capacity: 150 },
        { id: 4, title: 'Networking Mixer', date: '2025-01-25', time: '5:00 PM', location: 'Student Center', attendees: 89, capacity: 120 },
    ];

    const pastEvents = [
        { id: 5, title: 'Industry Leaders Panel', date: '2024-12-10', attendees: 312, feedback: 4.8 },
        { id: 6, title: 'Resume Building Workshop', date: '2024-12-05', attendees: 156, feedback: 4.6 },
        { id: 7, title: 'Mock Interview Session', date: '2024-11-28', attendees: 98, feedback: 4.9 },
    ];

    const workshops = [
        { title: 'Python for Data Science', instructor: 'Dr. Priya Sharma', sessions: 8, enrolled: 45 },
        { title: 'Web Development Bootcamp', instructor: 'Prof. Rohan Kumar', sessions: 12, enrolled: 67 },
        { title: 'Leadership & Communication', instructor: 'Dr. Ananya Reddy', sessions: 6, enrolled: 34 },
    ];

    if (!user || user.role !== 'faculty') {
        navigate('/faculty-tools');
        return null;
    }

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
                <div className="feed-gradient-orb feed-orb-2" style={{
                    position: 'absolute',
                    width: '500px',
                    height: '500px',
                    background: 'radial-gradient(circle, rgba(0, 255, 150, 0.2), rgba(0, 240, 255, 0.1), transparent 70%)',
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
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <button
                                onClick={() => navigate('/faculty-tools')}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.9rem',
                                }}
                            >
                                ← Back to Faculty Tools
                            </button>
                            <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 700 }}>
                                Event & Workshop Management
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Create, manage, and track campus events and workshops
                            </p>
                        </div>

                        {/* Statistics Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            {stats.map((stat, idx) => (
                                <Card key={idx} style={{
                                    padding: '1.5rem',
                                    background: stat.color,
                                    border: `1px solid ${stat.color.replace('0.2', '0.4')}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
                                        <div>
                                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                {stat.value}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                            {['upcoming', 'past', 'workshops'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: activeTab === tab ? 'rgba(0, 255, 150, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderBottom: activeTab === tab ? '2px solid var(--success)' : '2px solid transparent',
                                        color: activeTab === tab ? 'var(--success)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab ? '600' : '400',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'upcoming' && (
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Upcoming Events
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {upcomingEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '10px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                        {event.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        📍 {event.location} • 🕐 {event.time}
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                                                    {event.date}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    👥 {event.attendees} / {event.capacity} registered
                                                </div>
                                                <div style={{
                                                    width: '100px',
                                                    height: '6px',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '3px',
                                                    overflow: 'hidden',
                                                }}>
                                                    <div style={{
                                                        width: `${(event.attendees / event.capacity) * 100}%`,
                                                        height: '100%',
                                                        background: 'var(--success)',
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'past' && (
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Past Events
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {pastEvents.map((event) => (
                                        <div
                                            key={event.id}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '10px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                    {event.title}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    📅 {event.date} • 👥 {event.attendees} attendees
                                                </div>
                                            </div>
                                            <div style={{
                                                padding: '0.5rem 1rem',
                                                borderRadius: '8px',
                                                background: 'rgba(255, 200, 0, 0.2)',
                                                color: 'var(--warning)',
                                                fontWeight: 600,
                                            }}>
                                                ⭐ {event.feedback}/5.0
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'workshops' && (
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Active Workshops
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {workshops.map((workshop, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '10px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                {workshop.title}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                👨‍🏫 {workshop.instructor} • 📚 {workshop.sessions} sessions
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                                                👥 {workshop.enrolled} students enrolled
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EventManagement;
