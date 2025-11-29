import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { connectionsAPI } from '../../services/api';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const MentorCard = ({ mentor, onUpdate }) => {
    const { user } = useAuth();
    const [isRequesting, setIsRequesting] = React.useState(false);

    const handleRequestConnection = async () => {
        if (isRequesting) return;
        setIsRequesting(true);
        try {
            await connectionsAPI.requestConnection(mentor._id);
            alert('Connection request sent!');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error requesting connection:', error);
            alert(error.response?.data?.message || 'Failed to send request');
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <Card style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                }}>
                    {mentor.name?.charAt(0).toUpperCase() || 'M'}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{mentor.name}</h3>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {mentor.headline || mentor.role || ''}
                    </div>
                    {mentor.company && mentor.jobTitle && (
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                            {mentor.jobTitle} at {mentor.company}
                        </div>
                    )}
                    {mentor.bio && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                            {mentor.bio}
                        </p>
                    )}
                    {mentor.skills && mentor.skills.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            {mentor.skills.slice(0, 5).map((skill, idx) => (
                                <span
                                    key={idx}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        background: 'rgba(0, 240, 255, 0.1)',
                                        border: '1px solid var(--primary)',
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        color: 'var(--primary)',
                                    }}
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Button
                            variant="primary"
                            onClick={handleRequestConnection}
                            disabled={isRequesting}
                        >
                            {isRequesting ? 'Requesting...' : 'Request Mentorship'}
                        </Button>
                        {mentor.karma !== undefined && (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                ⭐ {mentor.karma} Karma
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default MentorCard;
