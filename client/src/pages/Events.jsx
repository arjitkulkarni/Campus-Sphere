import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';

const Events = () => {
    const { user, refreshUser } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: '' });

    useEffect(() => {
        // For now, using mock data. In production, this would fetch from an API
        fetchEvents();
    }, [filter]);

    const fetchEvents = async () => {
        // Mock events data - replace with actual API call
        const mockEvents = [
            {
                _id: '1',
                title: 'Tech Innovation Hackathon 2024',
                type: 'hackathon',
                description: 'Join us for a 48-hour hackathon where students can showcase their coding skills and build innovative solutions.',
                date: '2024-03-15',
                time: '09:00',
                location: 'Main Campus - Tech Building',
                organizer: 'Computer Science Department',
                registrationLink: 'https://example.com/hackathon',
                image: null,
            },
            {
                _id: '2',
                title: 'Web Development Workshop',
                type: 'workshop',
                description: 'Learn modern web development with React, Node.js, and MongoDB. Perfect for beginners and intermediate developers.',
                date: '2024-03-20',
                time: '14:00',
                location: 'Engineering Block - Room 301',
                organizer: 'Tech Club',
                registrationLink: 'https://example.com/workshop',
                image: null,
            },
            {
                _id: '3',
                title: 'Spring Music Concert',
                type: 'concert',
                description: 'Enjoy an evening of live music featuring student bands and guest performers. Food and drinks available.',
                date: '2024-03-25',
                time: '18:00',
                location: 'Auditorium',
                organizer: 'Music Society',
                registrationLink: 'https://example.com/concert',
                image: null,
            },
            {
                _id: '4',
                title: 'AI & Machine Learning Seminar',
                type: 'technical',
                description: 'Expert talks on the latest trends in AI and ML. Network with industry professionals and researchers.',
                date: '2024-04-01',
                time: '10:00',
                location: 'Conference Hall',
                organizer: 'AI Research Lab',
                registrationLink: 'https://example.com/seminar',
                image: null,
            },
        ];

        // Filter events based on selected type
        let filteredEvents = mockEvents;
        if (filter.type) {
            filteredEvents = mockEvents.filter(event => event.type === filter.type);
        }

        setEvents(filteredEvents);
        setLoading(false);
    };

    const getEventTypeLabel = (type) => {
        const labels = {
            workshop: 'Workshop',
            hackathon: 'Hackathon',
            technical: 'Technical Event',
            concert: 'Concert',
            seminar: 'Seminar',
            competition: 'Competition',
        };
        return labels[type] || 'Event';
    };

    const getEventTypeIcon = (type) => {
        const icons = {
            workshop: '🔧',
            hackathon: '💻',
            technical: '⚙️',
            concert: '🎵',
            seminar: '📚',
            competition: '🏆',
        };
        return icons[type] || '📅';
    };

    const handleRegister = async (registrationLink) => {
        if (registrationLink) {
            window.open(registrationLink, '_blank');
        }
        try {
            // Small karma boost for joining an event
            await authAPI.addKarma(8, 'event_register');
            if (refreshUser) {
                await refreshUser();
            }
        } catch (error) {
            console.error('Event register karma error:', error);
        }
    };

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
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
                </div>
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
                {/* Gradient Orbs */}
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
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            </div>
            <Navbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Campus Events
                        </h1>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <select
                                value={filter.type}
                                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                                style={{
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(15, 15, 25, 0.95)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="">All Events</option>
                                <option value="workshop">Workshops</option>
                                <option value="hackathon">Hackathons</option>
                                <option value="technical">Technical Events</option>
                                <option value="concert">Concerts</option>
                                <option value="seminar">Seminars</option>
                                <option value="competition">Competitions</option>
                            </select>
                        </div>

                        {events.length === 0 ? (
                            <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                                    No events found. Check back later for upcoming campus events!
                                </p>
                            </Card>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {events.map((event) => (
                                    <Card key={event._id} style={{ padding: '2rem', transition: 'all 0.3s' }}>
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                            <div style={{ 
                                                fontSize: '3rem', 
                                                flexShrink: 0,
                                                filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.3))'
                                            }}>
                                                {getEventTypeIcon(event.type)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                                    <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                                        {event.title}
                                                    </h2>
                                                    <span style={{
                                                        padding: '0.375rem 0.875rem',
                                                        background: 'rgba(0, 240, 255, 0.1)',
                                                        border: '1px solid rgba(0, 240, 255, 0.3)',
                                                        borderRadius: '12px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        color: 'var(--primary)',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em',
                                                    }}>
                                                        {getEventTypeLabel(event.type)}
                                                    </span>
                                                </div>
                                                <p style={{ 
                                                    color: 'var(--text-secondary)', 
                                                    marginBottom: '1.5rem',
                                                    lineHeight: 1.7,
                                                    fontSize: '1rem'
                                                }}>
                                                    {event.description}
                                                </p>
                                                <div style={{ 
                                                    display: 'grid', 
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                                    gap: '1rem',
                                                    marginBottom: '1.5rem',
                                                    padding: '1rem',
                                                    background: 'rgba(255, 255, 255, 0.03)',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(255, 255, 255, 0.08)'
                                                }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            📅 Date
                                                        </div>
                                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                                            {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            🕐 Time
                                                        </div>
                                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                                            {event.time}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            📍 Location
                                                        </div>
                                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                                            {event.location}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            👤 Organizer
                                                        </div>
                                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                                                            {event.organizer}
                                                        </div>
                                                    </div>
                                                </div>
                                                {event.registrationLink && (
                                                    <Button 
                                                        variant="primary" 
                                                        onClick={() => handleRegister(event.registrationLink)}
                                                        style={{ width: '100%', maxWidth: '300px' }}
                                                    >
                                                        Register Now →
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Events;


