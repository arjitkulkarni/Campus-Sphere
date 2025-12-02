import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/atoms/Card';

const FacultyTools = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const tools = [
        {
            id: 'student-analytics',
            title: 'Student Analytics Dashboard',
            icon: '📊',
            description: 'Comprehensive analytics and insights on student performance, engagement, and progress.',
            color: 'rgba(0, 240, 255, 0.1)',
            borderColor: 'rgba(0, 240, 255, 0.3)',
        },
        {
            id: 'alumni-tracking',
            title: 'Alumni Tracking & Insights',
            icon: '👥',
            description: 'Track alumni career progression, engagement, and success metrics.',
            color: 'rgba(112, 0, 255, 0.1)',
            borderColor: 'rgba(112, 0, 255, 0.3)',
        },
        {
            id: 'opportunity-management',
            title: 'Opportunity Management Panel',
            icon: '💼',
            description: 'Manage job postings, internships, and career opportunities for students.',
            color: 'rgba(255, 200, 0, 0.1)',
            borderColor: 'rgba(255, 200, 0, 0.3)',
        },
        {
            id: 'event-management',
            title: 'Event & Workshop Management',
            icon: '📅',
            description: 'Create, manage, and track campus events, workshops, and seminars.',
            color: 'rgba(0, 255, 150, 0.1)',
            borderColor: 'rgba(0, 255, 150, 0.3)',
        },
        {
            id: 'student-support',
            title: 'Student Support & Intervention Tools',
            icon: '🛟',
            description: 'Identify at-risk students and provide targeted support and interventions.',
            color: 'rgba(255, 100, 100, 0.1)',
            borderColor: 'rgba(255, 100, 100, 0.3)',
        },
        {
            id: 'project-repository',
            title: 'Project & Research Repository',
            icon: '🔬',
            description: 'Manage student projects, research papers, and academic repositories.',
            color: 'rgba(150, 100, 255, 0.1)',
            borderColor: 'rgba(150, 100, 255, 0.3)',
        },
    ];

    if (!user || user.role !== 'faculty') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
                <Navbar />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <Card style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
                        <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Access Restricted</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>This page is only available to faculty members.</p>
                    </Card>
                </div>
            </div>
        );
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
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <h1 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '2.5rem', fontWeight: 700 }}>
                                Faculty Tools
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                                Access comprehensive management tools and analytics for campus administration.
                            </p>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: '1.5rem',
                        }}>
                            {tools.map((tool) => (
                                <Card
                                    key={tool.id}
                                    onClick={() => navigate(`/faculty-tools/${tool.id}`)}
                                    style={{
                                        padding: '2rem',
                                        background: tool.color,
                                        border: `1px solid ${tool.borderColor}`,
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 240, 255, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem' }}>
                                        <div style={{
                                            fontSize: '3rem',
                                            lineHeight: 1,
                                        }}>
                                            {tool.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{
                                                color: 'var(--text-primary)',
                                                fontSize: '1.25rem',
                                                fontWeight: 600,
                                                marginBottom: '0.75rem',
                                            }}>
                                                {tool.title}
                                            </h3>
                                            <p style={{
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.9rem',
                                                lineHeight: 1.6,
                                                marginBottom: '1rem',
                                            }}>
                                                {tool.description}
                                            </p>
                                            <div style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: 'var(--primary)',
                                                fontSize: '0.9rem',
                                                fontWeight: 500,
                                            }}>
                                                <span>Access Dashboard</span>
                                                <span>→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FacultyTools;
