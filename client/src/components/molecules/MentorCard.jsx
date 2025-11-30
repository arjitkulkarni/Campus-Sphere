import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { connectionsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const MentorCard = ({ mentor, onUpdate }) => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const [isRequesting, setIsRequesting] = useState(false);
    const [showFullBio, setShowFullBio] = useState(false);
    const [requested, setRequested] = useState(false);

    const handleRequestConnection = async () => {
        if (isRequesting || requested) return;
        setIsRequesting(true);
        try {
            await connectionsAPI.requestConnection(mentor._id);
            setRequested(true);
            success('Mentorship request sent successfully! 🎉');
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Error requesting connection:', err);
            showError(err.response?.data?.message || 'Failed to send request');
        } finally {
            setIsRequesting(false);
        }
    };

    const bioPreview = mentor.bio?.substring(0, 120);
    const shouldTruncate = mentor.bio && mentor.bio.length > 120;

    return (
        <Card className="mentor-card-enhanced" style={{ marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
            {/* Card Glow Effect */}
            <div className="mentor-card-glow"></div>
            
            <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                {/* Avatar Section */}
                <div className="mentor-avatar-section">
                    <div className="mentor-avatar-large">
                        {mentor.name?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div className="mentor-status-badge">
                        <div className="status-dot"></div>
                        <span>Available</span>
                    </div>
                    {mentor.karma !== undefined && (
                        <div className="mentor-karma-badge">
                            <span>⭐</span>
                            <span>{mentor.karma}</span>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Header */}
                    <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ 
                            margin: '0 0 0.5rem 0', 
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            background: mentor.karma > 100 
                                ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                                : 'none',
                            WebkitBackgroundClip: mentor.karma > 100 ? 'text' : 'none',
                            WebkitTextFillColor: mentor.karma > 100 ? 'transparent' : 'var(--text-primary)',
                        }}>
                            {mentor.name}
                        </h3>
                        <div style={{ 
                            color: 'var(--primary)', 
                            marginBottom: '0.5rem',
                            fontSize: '0.9375rem',
                            fontWeight: 500
                        }}>
                            {mentor.headline || mentor.role || ''}
                        </div>
                        {mentor.company && mentor.jobTitle && (
                            <div style={{ 
                                color: 'var(--text-secondary)', 
                                fontSize: '0.875rem', 
                                marginBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>💼</span>
                                <span>{mentor.jobTitle} at {mentor.company}</span>
                            </div>
                        )}
                        {mentor.college && (
                            <div style={{ 
                                color: 'var(--text-secondary)', 
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>🎓</span>
                                <span>{mentor.college} {mentor.graduationYear ? `'${mentor.graduationYear.toString().slice(-2)}` : ''}</span>
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    {mentor.bio && (
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ 
                                color: 'var(--text-secondary)', 
                                fontSize: '0.9375rem', 
                                lineHeight: '1.7',
                                margin: 0
                            }}>
                                {showFullBio ? mentor.bio : (shouldTruncate ? `${bioPreview}...` : mentor.bio)}
                            </p>
                            {shouldTruncate && (
                                <button
                                    onClick={() => setShowFullBio(!showFullBio)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--primary)',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        marginTop: '0.5rem',
                                        padding: 0,
                                        textDecoration: 'underline'
                                    }}
                                >
                                    {showFullBio ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Skills */}
                    {mentor.skills && mentor.skills.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '0.75rem',
                                fontWeight: 600
                            }}>
                                Expertise
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {mentor.skills.slice(0, 6).map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="mentor-skill-chip"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {mentor.skills.length > 6 && (
                                    <span className="mentor-skill-chip mentor-skill-chip-more">
                                        +{mentor.skills.length - 6} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <Button
                            variant={requested ? "success" : "primary"}
                            onClick={handleRequestConnection}
                            disabled={isRequesting || requested}
                            className="btn-interactive"
                            style={{ minWidth: '160px', position: 'relative', overflow: 'hidden' }}
                        >
                            {isRequesting ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                                    Requesting...
                                </span>
                            ) : requested ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>✓</span>
                                    <span>Request Sent</span>
                                </span>
                            ) : (
                                <>
                                    <span>Request Mentorship</span>
                                    <span className="btn-shine"></span>
                                </>
                            )}
                        </Button>
                        <button
                            className="mentor-view-profile-btn"
                            onClick={() => window.location.href = `/profile`}
                        >
                            View Profile →
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default MentorCard;
