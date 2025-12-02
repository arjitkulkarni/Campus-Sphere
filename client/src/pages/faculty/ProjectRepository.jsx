import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Card from '../../components/atoms/Card';

const ProjectRepository = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('projects');

    const stats = [
        { label: 'Total Projects', value: '342', icon: '🔬', color: 'rgba(150, 100, 255, 0.2)' },
        { label: 'Research Papers', value: '156', icon: '📄', color: 'rgba(112, 0, 255, 0.2)' },
        { label: 'Active Research', value: '89', icon: '⚗️', color: 'rgba(0, 240, 255, 0.2)' },
        { label: 'Publications', value: '234', icon: '📚', color: 'rgba(0, 255, 150, 0.2)' },
    ];

    const projects = [
        { 
            id: 'PROJ-001', 
            title: 'Machine Learning for Climate Prediction', 
            lead: 'Dr. Priya Sharma',
            students: 5,
            status: 'Active',
            progress: 75,
            category: 'AI/ML',
            startDate: '2024-09-01'
        },
        { 
            id: 'PROJ-002', 
            title: 'Blockchain-Based Voting System', 
            lead: 'Prof. Rohan Kumar',
            students: 4,
            status: 'Active',
            progress: 60,
            category: 'Blockchain',
            startDate: '2024-10-15'
        },
        { 
            id: 'PROJ-003', 
            title: 'Renewable Energy Optimization', 
            lead: 'Dr. Ananya Reddy',
            students: 6,
            status: 'Active',
            progress: 45,
            category: 'Energy',
            startDate: '2024-11-01'
        },
        { 
            id: 'PROJ-004', 
            title: 'IoT Smart Campus Initiative', 
            lead: 'Prof. Vikram Singh',
            students: 8,
            status: 'Planning',
            progress: 20,
            category: 'IoT',
            startDate: '2025-01-01'
        },
    ];

    const researchPapers = [
        { 
            title: 'Deep Learning Applications in Medical Imaging',
            authors: ['Dr. Priya Sharma', 'Arjun Sharma', 'Kavya Nair'],
            journal: 'IEEE Transactions on Medical Imaging',
            year: 2024,
            status: 'Published',
            citations: 23
        },
        { 
            title: 'Quantum Computing Algorithms for Optimization',
            authors: ['Prof. Rohan Kumar', 'Rahul Desai', 'Ananya Reddy'],
            journal: 'Nature Quantum Information',
            year: 2024,
            status: 'Published',
            citations: 45
        },
        { 
            title: 'Sustainable Energy Solutions for Urban Areas',
            authors: ['Dr. Ananya Reddy', 'Vikram Singh', 'Meera Iyer'],
            journal: 'Renewable Energy Journal',
            year: 2024,
            status: 'Under Review',
            citations: 0
        },
    ];

    const repositories = [
        { name: 'Computer Science Projects', projects: 89, lastUpdate: '2 days ago' },
        { name: 'Engineering Research', projects: 67, lastUpdate: '1 week ago' },
        { name: 'Data Science Repository', projects: 45, lastUpdate: '3 days ago' },
        { name: 'Biotechnology Studies', projects: 34, lastUpdate: '5 days ago' },
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
                    background: 'radial-gradient(circle, rgba(150, 100, 255, 0.2), rgba(112, 0, 255, 0.1), transparent 70%)',
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
                                Project & Research Repository
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                Manage student projects, research papers, and academic repositories
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
                            {['projects', 'research', 'repositories'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        background: activeTab === tab ? 'rgba(150, 100, 255, 0.1)' : 'transparent',
                                        border: 'none',
                                        borderBottom: activeTab === tab ? '2px solid rgba(150, 100, 255, 0.8)' : '2px solid transparent',
                                        color: activeTab === tab ? 'rgba(150, 100, 255, 0.9)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        fontWeight: activeTab === tab ? '600' : '400',
                                        textTransform: 'capitalize',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'projects' && (
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Active Projects
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '10px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                                                        {project.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                        👨‍🏫 {project.lead} • 👥 {project.students} students • 🏷️ {project.category}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                        Started: {project.startDate} • ID: {project.id}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '8px',
                                                    background: project.status === 'Active' 
                                                        ? 'rgba(0, 255, 150, 0.2)' 
                                                        : 'rgba(255, 200, 0, 0.2)',
                                                    color: project.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 600,
                                                }}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <div style={{ marginTop: '0.75rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                                                    <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{project.progress}%</span>
                                                </div>
                                                <div style={{
                                                    width: '100%',
                                                    height: '8px',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden',
                                                }}>
                                                    <div style={{
                                                        width: `${project.progress}%`,
                                                        height: '100%',
                                                        background: 'linear-gradient(90deg, rgba(150, 100, 255, 0.8), rgba(112, 0, 255, 0.8))',
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'research' && (
                            <Card>
                                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                                    Research Papers
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {researchPapers.map((paper, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '1rem',
                                                borderRadius: '10px',
                                                background: 'rgba(255, 255, 255, 0.03)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                            }}
                                        >
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                                {paper.title}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                👥 {paper.authors.join(', ')}
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    📚 {paper.journal} • {paper.year}
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '12px',
                                                        background: paper.status === 'Published' 
                                                            ? 'rgba(0, 255, 150, 0.2)' 
                                                            : 'rgba(255, 200, 0, 0.2)',
                                                        color: paper.status === 'Published' ? 'var(--success)' : 'var(--warning)',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                    }}>
                                                        {paper.status}
                                                    </span>
                                                    {paper.citations > 0 && (
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                                                            📊 {paper.citations} citations
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'repositories' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                {repositories.map((repo, idx) => (
                                    <Card key={idx} style={{
                                        padding: '1.5rem',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                    }}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>📁</div>
                                        <h3 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                            {repo.name}
                                        </h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                            {repo.projects} projects
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            Last updated: {repo.lastUpdate}
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

export default ProjectRepository;
