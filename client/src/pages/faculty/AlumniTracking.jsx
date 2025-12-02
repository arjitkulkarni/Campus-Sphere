import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/atoms/Card';

const AlumniTracking = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Alumni', value: '12,456', icon: '👥', color: 'rgba(112, 0, 255, 0.2)' },
        { label: 'Active Alumni', value: '8,234', icon: '✅', color: 'rgba(0, 255, 150, 0.2)' },
        { label: 'Avg Salary', value: '$87K', icon: '💰', color: 'rgba(255, 200, 0, 0.2)' },
        { label: 'Employment Rate', value: '96.8%', icon: '📊', color: 'rgba(0, 240, 255, 0.2)' },
    ];

    const topCompanies = [
        { name: 'Google', count: 234, logo: '🔍' },
        { name: 'Microsoft', count: 189, logo: '💻' },
        { name: 'Amazon', count: 156, logo: '📦' },
        { name: 'Apple', count: 142, logo: '🍎' },
        { name: 'Meta', count: 128, logo: '📱' },
    ];

    const recentGraduates = [
        { name: 'Arjun Sharma', company: 'Google', position: 'Software Engineer', year: '2024', salary: '$120K' },
        { name: 'Priya Patel', company: 'Microsoft', position: 'Product Manager', year: '2024', salary: '$115K' },
        { name: 'Rohan Kumar', company: 'Amazon', position: 'Data Scientist', year: '2024', salary: '$110K' },
        { name: 'Ananya Reddy', company: 'Apple', position: 'UX Designer', year: '2024', salary: '$105K' },
    ];

    const careerPaths = [
        { path: 'Software Engineering', percentage: 42, count: 5234 },
        { path: 'Product Management', percentage: 18, count: 2241 },
        { path: 'Data Science', percentage: 15, count: 1868 },
        { path: 'Consulting', percentage: 12, count: 1495 },
        { path: 'Finance', percentage: 8, count: 996 },
        { path: 'Other', percentage: 5, count: 622 },
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
                                Alumni Tracking & Insights
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Monitor alumni career progression and success metrics
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

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            {/* Top Companies */}
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Top Employers
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {topCompanies.map((company, idx) => (
                                        <div
                                            key={idx}
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ fontSize: '1.5rem' }}>{company.logo}</div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                                    {company.name}
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                                                {company.count}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Recent Graduates */}
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Recent Graduates (2024)
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {recentGraduates.map((alumni, idx) => (
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
                                                {alumni.name}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                                                {alumni.position} at {alumni.company}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                                                {alumni.salary} • Class of {alumni.year}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Career Paths */}
                        <Card>
                            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                Career Path Distribution
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {careerPaths.map((path, idx) => (
                                    <div key={idx}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                                {path.path}
                                            </span>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                {path.count} alumni ({path.percentage}%)
                                            </span>
                                        </div>
                                        <div style={{
                                            width: '100%',
                                            height: '10px',
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            borderRadius: '5px',
                                            overflow: 'hidden',
                                        }}>
                                            <div style={{
                                                width: `${path.percentage}%`,
                                                height: '100%',
                                                background: 'linear-gradient(90deg, rgba(112, 0, 255, 0.8), rgba(0, 240, 255, 0.8))',
                                                borderRadius: '5px',
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AlumniTracking;
