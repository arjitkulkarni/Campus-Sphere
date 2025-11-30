import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { opportunitiesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OpportunityCard from '../components/molecules/OpportunityCard';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';

const Opportunities = () => {
    const { user } = useAuth();
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: '', isActive: 'true' });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newOpportunity, setNewOpportunity] = useState({
        title: '',
        description: '',
        type: 'job',
        company: '',
        location: 'Remote',
        skills: '',
        applicationLink: '',
        deadline: '',
    });

    useEffect(() => {
        fetchOpportunities();
    }, [filter]);

    const fetchOpportunities = async () => {
        try {
            const response = await opportunitiesAPI.getAll(filter);
            setOpportunities(response.data);
        } catch (error) {
            console.error('Error fetching opportunities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOpportunity = async (e) => {
        e.preventDefault();
        if (!newOpportunity.title || !newOpportunity.description || !newOpportunity.company) {
            alert('Please fill all required fields');
            return;
        }

        try {
            const skillsArray = newOpportunity.skills
                ? newOpportunity.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
                : [];

            await opportunitiesAPI.create({
                ...newOpportunity,
                skills: skillsArray,
                deadline: newOpportunity.deadline || undefined,
            });

            setNewOpportunity({
                title: '',
                description: '',
                type: 'job',
                company: '',
                location: 'Remote',
                skills: '',
                applicationLink: '',
                deadline: '',
            });
            setShowCreateForm(false);
            fetchOpportunities();
        } catch (error) {
            console.error('Error creating opportunity:', error);
            alert(error.response?.data?.message || 'Failed to create opportunity');
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h1>Opportunities</h1>
                            {(user?.role === 'alumni' || user?.role === 'faculty') && (
                                <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                                    {showCreateForm ? 'Cancel' : '+ Post Opportunity'}
                                </Button>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                            <select
                                value={filter.type}
                                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                                style={{
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(15, 15, 25, 0.95)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    outline: 'none',
                                }}
                            >
                                <option value="">All Types</option>
                                <option value="job">Jobs</option>
                                <option value="internship">Internships</option>
                                <option value="referral">Referrals</option>
                                <option value="research">Research</option>
                                <option value="volunteer">Volunteer</option>
                            </select>
                        </div>

                        {showCreateForm && (
                            <Card style={{ marginBottom: '2rem' }}>
                                <h2 style={{ marginBottom: '1.5rem' }}>Post New Opportunity</h2>
                                <form onSubmit={handleCreateOpportunity}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                                Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={newOpportunity.title}
                                                onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                                Type *
                                            </label>
                                            <select
                                                value={newOpportunity.type}
                                                onChange={(e) => setNewOpportunity({ ...newOpportunity, type: e.target.value })}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'rgba(15, 15, 25, 0.95)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '8px',
                                                    color: 'var(--text-primary)',
                                                    outline: 'none',
                                                }}
                                            >
                                                <option value="job">Job</option>
                                                <option value="internship">Internship</option>
                                                <option value="referral">Referral</option>
                                                <option value="research">Research</option>
                                                <option value="volunteer">Volunteer</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                            Description *
                                        </label>
                                        <textarea
                                            value={newOpportunity.description}
                                            onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                                            rows="4"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '8px',
                                                color: 'white',
                                                outline: 'none',
                                                resize: 'none',
                                            }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                                Company *
                                            </label>
                                            <input
                                                type="text"
                                                value={newOpportunity.company}
                                                onChange={(e) => setNewOpportunity({ ...newOpportunity, company: e.target.value })}
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                value={newOpportunity.location}
                                                onChange={(e) => setNewOpportunity({ ...newOpportunity, location: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                                Deadline
                                            </label>
                                            <input
                                                type="date"
                                                value={newOpportunity.deadline}
                                                onChange={(e) => setNewOpportunity({ ...newOpportunity, deadline: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                                Skills (comma separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={newOpportunity.skills}
                                                onChange={(e) => setNewOpportunity({ ...newOpportunity, skills: e.target.value })}
                                                placeholder="React, Node.js, Python"
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                                Application Link
                                            </label>
                                            <input
                                                type="url"
                                                value={newOpportunity.applicationLink}
                                                onChange={(e) => setNewOpportunity({ ...newOpportunity, applicationLink: e.target.value })}
                                                placeholder="https://..."
                                                style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '8px',
                                                    color: 'white',
                                                    outline: 'none',
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" variant="primary" style={{ width: '100%' }}>
                                        Post Opportunity
                                    </Button>
                                </form>
                            </Card>
                        )}

                        {opportunities.length === 0 ? (
                            <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    No opportunities found. Check back later!
                                </p>
                            </Card>
                        ) : (
                            opportunities.map((opportunity) => (
                                <OpportunityCard key={opportunity._id} opportunity={opportunity} onUpdate={fetchOpportunities} />
                            ))
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Opportunities;
