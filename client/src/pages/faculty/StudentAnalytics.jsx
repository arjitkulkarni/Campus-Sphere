import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/atoms/Card';

const StudentAnalytics = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Students', value: '2,847', icon: '👥', color: 'rgba(0, 240, 255, 0.2)' },
        { label: 'Active Students', value: '2,234', icon: '✅', color: 'rgba(0, 255, 150, 0.2)' },
        { label: 'Avg GPA', value: '8.5', icon: '📈', color: 'rgba(112, 0, 255, 0.2)' },
        { label: 'Graduation Rate', value: '94.2%', icon: '🎓', color: 'rgba(255, 200, 0, 0.2)' },
    ];

    const topPerformers = [
        { name: 'Arjun Sharma', gpa: 9.8, major: 'Computer Science', year: 'Senior' },
        { name: 'Priya Patel', gpa: 9.6, major: 'Engineering', year: 'Junior' },
        { name: 'Rohan Kumar', gpa: 9.5, major: 'Business', year: 'Senior' },
        { name: 'Ananya Reddy', gpa: 9.4, major: 'Mathematics', year: 'Sophomore' },
        { name: 'Vikram Singh', gpa: 9.3, major: 'Biology', year: 'Junior' },
    ];

    const engagementMetrics = [
        { category: 'Course Completion', percentage: 87, trend: '+5%' },
        { category: 'Assignment Submission', percentage: 92, trend: '+3%' },
        { category: 'Participation Rate', percentage: 78, trend: '+8%' },
        { category: 'Library Usage', percentage: 65, trend: '+12%' },
    ];

    const atRiskStudents = [
        { name: 'Amit Verma', gpa: 5.2, riskLevel: 'High', courses: 3 },
        { name: 'Kavya Nair', gpa: 5.8, riskLevel: 'Medium', courses: 2 },
        { name: 'Rahul Desai', gpa: 6.1, riskLevel: 'Medium', courses: 2 },
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
                    background: 'radial-gradient(circle, rgba(0, 240, 255, 0.2), rgba(112, 0, 255, 0.1), transparent 70%)',
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
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
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
                                    Student Analytics Dashboard
                                </h1>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    Comprehensive insights into student performance and engagement
                                </p>
                            </div>
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

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                            {/* Top Performers */}
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Top Performers
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {topPerformers.map((student, idx) => (
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
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                    {student.name}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {student.major} • {student.year}
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '1.25rem',
                                                fontWeight: 700,
                                                color: 'var(--primary)',
                                            }}>
                                                {student.gpa}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Engagement Metrics */}
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Engagement Metrics
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {engagementMetrics.map((metric, idx) => (
                                        <div key={idx}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                    {metric.category}
                                                </span>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--success)', fontWeight: 600 }}>
                                                    {metric.trend}
                                                </span>
                                            </div>
                                            <div style={{
                                                width: '100%',
                                                height: '8px',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                            }}>
                                                <div style={{
                                                    width: `${metric.percentage}%`,
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                                                    borderRadius: '4px',
                                                }} />
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                {metric.percentage}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* At-Risk Students */}
                        <Card style={{ marginTop: '1.5rem' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                At-Risk Students Requiring Attention
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {atRiskStudents.map((student, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            background: student.riskLevel === 'High' 
                                                ? 'rgba(255, 100, 100, 0.1)' 
                                                : 'rgba(255, 200, 0, 0.1)',
                                            border: `1px solid ${student.riskLevel === 'High' 
                                                ? 'rgba(255, 100, 100, 0.3)' 
                                                : 'rgba(255, 200, 0, 0.3)'}`,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                {student.name}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                GPA: {student.gpa} • {student.courses} courses below threshold
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            background: student.riskLevel === 'High' 
                                                ? 'rgba(255, 100, 100, 0.2)' 
                                                : 'rgba(255, 200, 0, 0.2)',
                                            color: student.riskLevel === 'High' ? '#ff6464' : '#ffc800',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                        }}>
                                            {student.riskLevel} Risk
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

export default StudentAnalytics;
