import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/atoms/Card';

const StudentSupport = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('at-risk');

    const stats = [
        { label: 'Students at Risk', value: '47', icon: '⚠️', color: 'rgba(255, 100, 100, 0.2)' },
        { label: 'Interventions Active', value: '23', icon: '🛟', color: 'rgba(255, 200, 0, 0.2)' },
        { label: 'Support Requests', value: '89', icon: '📞', color: 'rgba(0, 240, 255, 0.2)' },
        { label: 'Success Rate', value: '78%', icon: '✅', color: 'rgba(0, 255, 150, 0.2)' },
    ];

    const atRiskStudents = [
        { 
            name: 'Amit Verma', 
            id: 'STU-2024-001', 
            gpa: 5.2, 
            riskLevel: 'High',
            issues: ['Low GPA', 'Missing Assignments', 'Low Attendance'],
            lastContact: '3 days ago',
            advisor: 'Dr. Priya Sharma'
        },
        { 
            name: 'Kavya Nair', 
            id: 'STU-2024-002', 
            gpa: 5.8, 
            riskLevel: 'Medium',
            issues: ['Low GPA', 'Low Attendance'],
            lastContact: '1 week ago',
            advisor: 'Prof. Rohan Kumar'
        },
        { 
            name: 'Rahul Desai', 
            id: 'STU-2024-003', 
            gpa: 6.1, 
            riskLevel: 'Medium',
            issues: ['Missing Assignments'],
            lastContact: '5 days ago',
            advisor: 'Dr. Ananya Reddy'
        },
        { 
            name: 'Meera Iyer', 
            id: 'STU-2024-004', 
            gpa: 5.5, 
            riskLevel: 'High',
            issues: ['Low GPA', 'Missing Assignments', 'Low Attendance', 'Financial Aid'],
            lastContact: '2 days ago',
            advisor: 'Dr. Priya Sharma'
        },
    ];

    const activeInterventions = [
        { student: 'Amit Verma', type: 'Academic Support', status: 'In Progress', startDate: '2024-12-01', progress: 65 },
        { student: 'Meera Iyer', type: 'Financial Counseling', status: 'In Progress', startDate: '2024-12-05', progress: 40 },
        { student: 'Kavya Nair', type: 'Tutoring Program', status: 'In Progress', startDate: '2024-11-28', progress: 80 },
    ];

    const supportRequests = [
        { id: 'REQ-001', student: 'Arjun Sharma', category: 'Academic', priority: 'High', date: '2 hours ago', status: 'Pending' },
        { id: 'REQ-002', student: 'Priya Patel', category: 'Financial', priority: 'Medium', date: '5 hours ago', status: 'In Review' },
        { id: 'REQ-003', student: 'Rohan Kumar', category: 'Mental Health', priority: 'High', date: '1 day ago', status: 'Assigned' },
        { id: 'REQ-004', student: 'Ananya Reddy', category: 'Academic', priority: 'Low', date: '2 days ago', status: 'Pending' },
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
                    background: 'radial-gradient(circle, rgba(255, 100, 100, 0.2), rgba(255, 0, 0, 0.1), transparent 70%)',
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
                                Student Support & Intervention Tools
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Identify at-risk students and provide targeted support
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
                            {['at-risk', 'interventions', 'requests'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: activeTab === tab ? 'rgba(255, 100, 100, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderBottom: activeTab === tab ? '2px solid #ff6464' : '2px solid transparent',
                                        color: activeTab === tab ? '#ff6464' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab ? '600' : '400',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {tab.replace('-', ' ')}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'at-risk' && (
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    At-Risk Students
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
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                        {student.name} ({student.id})
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                        GPA: {student.gpa} • Advisor: {student.advisor}
                                                    </div>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {student.issues.map((issue, i) => (
                                                            <span key={i} style={{
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '6px',
                                                                background: 'rgba(255, 255, 255, 0.1)',
                                                                fontSize: '0.75rem',
                                                                color: 'var(--text-secondary)',
                                                            }}>
                                                                {issue}
                                                            </span>
                                                        ))}
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
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                                Last contact: {student.lastContact}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'interventions' && (
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Active Interventions
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {activeInterventions.map((intervention, idx) => (
                                        <div
                                            key={idx}
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
                                                        {intervention.student}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        {intervention.type} • Started: {intervention.startDate}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    background: 'rgba(0, 255, 150, 0.2)',
                                                    color: 'var(--success)',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                }}>
                                                    {intervention.status}
                                                </span>
                                            </div>
                                            <div style={{ marginTop: '0.75rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                                    <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{intervention.progress}%</span>
                                                </div>
                                                <div style={{
                                                    width: '100%',
                                                    height: '8px',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden',
                                                }}>
                                                    <div style={{
                                                        width: `${intervention.progress}%`,
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

                        {activeTab === 'requests' && (
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Support Requests
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {supportRequests.map((request) => (
                                        <div
                                            key={request.id}
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
                                                        {request.student} • {request.category}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                        Request ID: {request.id} • {request.date}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        background: request.priority === 'High' 
                                                            ? 'rgba(255, 100, 100, 0.2)' 
                                                            : request.priority === 'Medium'
                                                            ? 'rgba(255, 200, 0, 0.2)'
                                                            : 'rgba(0, 240, 255, 0.2)',
                                                        color: request.priority === 'High' 
                                                            ? '#ff6464' 
                                                            : request.priority === 'Medium'
                                                            ? '#ffc800'
                                                            : 'var(--primary)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                    }}>
                                                        {request.priority}
                                                    </span>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        background: 'rgba(0, 240, 255, 0.2)',
                                                        color: 'var(--primary)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                    }}>
                                                        {request.status}
                                                    </span>
                                                </div>
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

export default StudentSupport;
