import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { connectionsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MentorCard from '../components/molecules/MentorCard';
import Card from '../components/atoms/Card';

const Mentorship = () => {
    const { user } = useAuth();
    const [mentors, setMentors] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('discover'); // 'discover' or 'connections'

    useEffect(() => {
        fetchMentors();
        fetchConnections();
    }, []);

    const fetchMentors = async () => {
        try {
            const response = await connectionsAPI.getMentors();
            setMentors(response.data);
        } catch (error) {
            console.error('Error fetching mentors:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConnections = async () => {
        try {
            const response = await connectionsAPI.getConnections();
            setConnections(response.data);
        } catch (error) {
            console.error('Error fetching connections:', error);
        }
    };

    const handleUpdate = () => {
        fetchMentors();
        fetchConnections();
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
            </div>
        );
    }

    const myConnections = connections.filter(conn => 
        conn.mentor._id === user?._id || conn.mentee._id === user?._id
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '4rem' }}>
                <div className="container">
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h1 style={{ marginBottom: '2rem' }}>Mentorship</h1>

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

                        {activeTab === 'discover' ? (
                            <>
                                {mentors.length === 0 ? (
                                    <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                        <p style={{ color: 'var(--text-secondary)' }}>
                                            No mentors available at the moment.
                                        </p>
                                    </Card>
                                ) : (
                                    mentors.map((mentor) => (
                                        <MentorCard key={mentor._id} mentor={mentor} onUpdate={handleUpdate} />
                                    ))
                                )}
                            </>
                        ) : (
                            <>
                                {myConnections.length === 0 ? (
                                    <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                        <p style={{ color: 'var(--text-secondary)' }}>
                                            You don't have any connections yet. Discover mentors to get started!
                                        </p>
                                    </Card>
                                ) : (
                                    myConnections.map((connection) => {
                                        const isMentor = connection.mentor._id === user?._id;
                                        const otherPerson = isMentor ? connection.mentee : connection.mentor;

                                        return (
                                            <Card key={connection._id} style={{ marginBottom: '2rem' }}>
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
                                                                {connection.sessions.map((session, idx) => (
                                                                    <div key={idx} style={{ 
                                                                        padding: '0.75rem',
                                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                                        borderRadius: '8px',
                                                                        marginBottom: '0.5rem',
                                                                    }}>
                                                                        {new Date(session.scheduledAt).toLocaleString()} ({session.duration} min)
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {connection.status === 'pending' && !isMentor && (
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await connectionsAPI.updateConnection(connection._id, 'accepted');
                                                                        fetchConnections();
                                                                    } catch (error) {
                                                                        console.error('Error updating connection:', error);
                                                                    }
                                                                }}
                                                                className="btn btn-primary"
                                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    try {
                                                                        await connectionsAPI.updateConnection(connection._id, 'rejected');
                                                                        fetchConnections();
                                                                    } catch (error) {
                                                                        console.error('Error updating connection:', error);
                                                                    }
                                                                }}
                                                                className="btn btn-glass"
                                                                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
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
