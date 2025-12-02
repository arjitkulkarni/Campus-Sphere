import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/atoms/Card';

const OpportunityManagement = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const stats = [
        { label: 'Total Opportunities', value: '342', icon: '💼', color: 'rgba(255, 200, 0, 0.2)' },
        { label: 'Active Postings', value: '287', icon: '✅', color: 'rgba(0, 255, 150, 0.2)' },
        { label: 'Applications', value: '1,234', icon: '📝', color: 'rgba(0, 240, 255, 0.2)' },
        { label: 'Placement Rate', value: '78.5%', icon: '📊', color: 'rgba(112, 0, 255, 0.2)' },
    ];

    const opportunities = [
        { id: 1, title: 'Software Engineer Intern', company: 'Google', type: 'Internship', applications: 45, status: 'active', posted: '2 days ago' },
        { id: 2, title: 'Product Manager', company: 'Microsoft', type: 'Full-time', applications: 32, status: 'active', posted: '5 days ago' },
        { id: 3, title: 'Data Scientist', company: 'Amazon', type: 'Full-time', applications: 28, status: 'active', posted: '1 week ago' },
        { id: 4, title: 'UX Designer', company: 'Apple', type: 'Contract', applications: 19, status: 'active', posted: '1 week ago' },
        { id: 5, title: 'Marketing Analyst', company: 'Meta', type: 'Full-time', applications: 15, status: 'pending', posted: '3 days ago' },
    ];

    const recentApplications = [
        { student: 'Arjun Sharma', opportunity: 'Software Engineer Intern', company: 'Google', status: 'Under Review', date: '2 hours ago' },
        { student: 'Priya Patel', opportunity: 'Product Manager', company: 'Microsoft', status: 'Interview Scheduled', date: '5 hours ago' },
        { student: 'Rohan Kumar', opportunity: 'Data Scientist', company: 'Amazon', status: 'Application Received', date: '1 day ago' },
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
                <div className="feed-gradient-orb feed-orb-1" style={{
                    position: 'absolute',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(255, 200, 0, 0.2), rgba(255, 100, 0, 0.1), transparent 70%)',
                    borderRadius: '50%',
                    top: '-200px',
                    left: '-200px',
                    filter: 'blur(60px)',
                    animation: 'orb-float-1 20s ease-in-out infinite',
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
                                Opportunity Management Panel
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Manage job postings, internships, and career opportunities
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
                            {['all', 'active', 'pending'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: activeTab === tab ? 'rgba(255, 200, 0, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderBottom: activeTab === tab ? '2px solid var(--warning)' : '2px solid transparent',
                                        color: activeTab === tab ? 'var(--warning)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab ? '600' : '400',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                            {/* Opportunities List */}
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    {activeTab === 'all' ? 'All Opportunities' : activeTab === 'active' ? 'Active Opportunities' : 'Pending Review'}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {opportunities
                                        .filter(opp => activeTab === 'all' || opp.status === activeTab)
                                        .map((opp) => (
                                            <div
                                                key={opp.id}
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
                                                            {opp.title}
                                                        </div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                            {opp.company} • {opp.type}
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        background: opp.status === 'active' 
                                                            ? 'rgba(0, 255, 150, 0.2)' 
                                                            : 'rgba(255, 200, 0, 0.2)',
                                                        color: opp.status === 'active' ? 'var(--success)' : 'var(--warning)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize',
                                                    }}>
                                                        {opp.status}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    <span>{opp.applications} applications</span>
                                                    <span>{opp.posted}</span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </Card>

                            {/* Recent Applications */}
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Recent Applications
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {recentApplications.map((app, idx) => (
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
                                                {app.student}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                                {app.opportunity} at {app.company}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '8px',
                                                    background: 'rgba(0, 240, 255, 0.1)',
                                                    color: 'var(--primary)',
                                                }}>
                                                    {app.status}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    {app.date}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OpportunityManagement;
