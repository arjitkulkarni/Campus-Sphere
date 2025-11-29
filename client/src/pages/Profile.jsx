import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../atoms/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';

const Profile = () => {
    const { user, loading: authLoading, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        headline: '',
        bio: '',
        skills: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return;
        }
        if (user) {
            setFormData({
                headline: user.headline || '',
                bio: user.bio || '',
                skills: user.skills?.join(', ') || '',
            });
        }
    }, [user, authLoading, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            await updateProfile({
                headline: formData.headline,
                bio: formData.bio,
                skills: skillsArray,
            });
            setEditing(false);
        } catch (error) {
            alert(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, paddingTop: '80px', paddingBottom: '2rem' }}>
                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                    <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>

                    <Card>
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '3rem',
                                flexShrink: 0
                            }}>
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>{user.name}</h2>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    {user.email} • {user.role}
                                </p>
                                {user.headline && (
                                    <p style={{ margin: '0.5rem 0', color: 'var(--text-primary)', fontWeight: 500 }}>
                                        {user.headline}
                                    </p>
                                )}
                                {user.karma > 0 && (
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(0, 255, 157, 0.1)',
                                        border: '1px solid var(--success)',
                                        borderRadius: '12px',
                                        fontSize: '0.875rem',
                                        color: 'var(--success)',
                                        marginTop: '0.5rem'
                                    }}>
                                        ⭐ {user.karma} Karma Points
                                    </div>
                                )}
                            </div>
                        </div>

                        {user.bio && !editing && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>Bio</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>{user.bio}</p>
                            </div>
                        )}

                        {user.skills && user.skills.length > 0 && !editing && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>Skills</h3>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {user.skills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                background: 'rgba(0, 240, 255, 0.1)',
                                                border: '1px solid var(--primary)',
                                                borderRadius: '12px',
                                                fontSize: '0.875rem',
                                                color: 'var(--primary)'
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {user.role === 'alumni' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>Professional Info</h3>
                                {user.company && (
                                    <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                        Company: {user.company}
                                    </p>
                                )}
                                {user.jobTitle && (
                                    <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                        Title: {user.jobTitle}
                                    </p>
                                )}
                                {user.college && (
                                    <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                        College: {user.college}
                                    </p>
                                )}
                                {user.graduationYear && (
                                    <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0' }}>
                                        Graduated: {user.graduationYear}
                                    </p>
                                )}
                            </div>
                        )}

                        {editing ? (
                            <form onSubmit={handleSubmit}>
                                <Input
                                    label="Headline"
                                    name="headline"
                                    value={formData.headline}
                                    onChange={handleChange}
                                    placeholder="Your professional headline"
                                />
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="4"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            outline: 'none',
                                            resize: 'none',
                                            fontFamily: 'inherit'
                                        }}
                                    />
                                </div>
                                <Input
                                    label="Skills (comma separated)"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="e.g. React, Python, Design"
                                />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Button type="submit" variant="primary" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button type="button" variant="glass" onClick={() => setEditing(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <Button variant="primary" onClick={() => setEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Profile;

