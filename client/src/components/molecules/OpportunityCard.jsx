import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { opportunitiesAPI } from '../../services/api';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const OpportunityCard = ({ opportunity, onUpdate }) => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(
        opportunity.applicants?.some(app => app._id === user?._id || app === user?._id)
    );

    const handleApply = async () => {
        if (isApplying || hasApplied) return;
        setIsApplying(true);
        try {
            await opportunitiesAPI.apply(opportunity._id);
            setHasApplied(true);
            success('Application submitted successfully! 🎉');
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Error applying:', err);
            showError(err.response?.data?.message || 'Failed to apply');
        } finally {
            setIsApplying(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'No deadline';
        const deadline = new Date(date);
        const now = new Date();
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return 'Deadline passed';
        if (diffDays === 0) return 'Due today';
        if (diffDays === 1) return 'Due tomorrow';
        if (diffDays < 7) return `${diffDays} days left`;
        
        return deadline.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: deadline.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    const getTypeConfig = (type) => {
        const configs = {
            job: { 
                icon: '💼', 
                color: 'var(--primary)', 
                label: 'Full-time Job',
                gradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 240, 255, 0.05))'
            },
            internship: { 
                icon: '🎓', 
                color: 'var(--secondary)', 
                label: 'Internship',
                gradient: 'linear-gradient(135deg, rgba(112, 0, 255, 0.15), rgba(112, 0, 255, 0.05))'
            },
            referral: { 
                icon: '🤝', 
                color: 'var(--accent)', 
                label: 'Referral',
                gradient: 'linear-gradient(135deg, rgba(255, 0, 85, 0.15), rgba(255, 0, 85, 0.05))'
            },
            research: { 
                icon: '🔬', 
                color: 'var(--success)', 
                label: 'Research',
                gradient: 'linear-gradient(135deg, rgba(0, 255, 157, 0.15), rgba(0, 255, 157, 0.05))'
            },
            volunteer: { 
                icon: '❤️', 
                color: 'var(--warning)', 
                label: 'Volunteer',
                gradient: 'linear-gradient(135deg, rgba(255, 184, 0, 0.15), rgba(255, 184, 0, 0.05))'
            },
        };
        return configs[type] || configs.job;
    };

    const typeConfig = getTypeConfig(opportunity.type);
    const deadlineInfo = formatDate(opportunity.deadline);
    const isUrgent = deadlineInfo.includes('today') || deadlineInfo.includes('tomorrow');

    return (
        <Card className="opportunity-card-enhanced" style={{ 
            marginBottom: '2rem', 
            position: 'relative',
            background: typeConfig.gradient,
            borderColor: `${typeConfig.color}40`
        }}>
            {/* Urgency Badge */}
            {isUrgent && (
                <div className="opportunity-urgent-badge">
                    ⚡ Urgent
                </div>
            )}

            {/* Header */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '1.25rem',
                gap: '1rem'
            }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem', 
                        marginBottom: '0.75rem',
                        flexWrap: 'wrap'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                            {opportunity.title}
                        </h3>
                        <span className="opportunity-type-badge" style={{
                            padding: '0.375rem 0.875rem',
                            background: `${typeConfig.color}20`,
                            border: `1.5px solid ${typeConfig.color}`,
                            borderRadius: '16px',
                            fontSize: '0.75rem',
                            color: typeConfig.color,
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}>
                            <span>{typeConfig.icon}</span>
                            <span>{typeConfig.label}</span>
                        </span>
                    </div>
                    
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '0.5rem',
                        marginBottom: '0.75rem'
                    }}>
                        <div style={{ 
                            color: 'var(--text-primary)', 
                            fontSize: '1rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>🏢</span>
                            <span>{opportunity.company}</span>
                            <span style={{ color: 'var(--text-secondary)', margin: '0 0.5rem' }}>•</span>
                            <span>📍</span>
                            <span>{opportunity.location}</span>
                        </div>
                        <div style={{ 
                            color: 'var(--text-secondary)', 
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                        }}>
                            <span>👤 Posted by {opportunity.postedBy?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span style={{ 
                                color: isUrgent ? 'var(--warning)' : 'var(--text-secondary)',
                                fontWeight: isUrgent ? 600 : 400
                            }}>
                                ⏰ {deadlineInfo}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <p style={{ 
                marginBottom: '1.25rem', 
                color: 'var(--text-secondary)', 
                lineHeight: '1.7',
                fontSize: '0.9375rem'
            }}>
                {opportunity.description}
            </p>

            {/* Skills */}
            {opportunity.skills && opportunity.skills.length > 0 && (
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0.75rem',
                        fontWeight: 600
                    }}>
                        Required Skills
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {opportunity.skills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="opportunity-skill-chip"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                alignItems: 'center',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--glass-border)',
                flexWrap: 'wrap'
            }}>
                {opportunity.applicationLink && (
                    <a
                        href={opportunity.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-glass btn-interactive"
                        style={{ textDecoration: 'none' }}
                    >
                        View Details
                    </a>
                )}
                <Button
                    variant="primary"
                    onClick={handleApply}
                    disabled={hasApplied || isApplying || !opportunity.isActive}
                    className="btn-interactive"
                    style={{ 
                        flex: 1,
                        minWidth: '140px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {hasApplied ? (
                        <>
                            <span>✓ Applied</span>
                        </>
                    ) : isApplying ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="spinner" style={{ width: '16px', height: '16px' }}></span>
                            Applying...
                        </span>
                    ) : (
                        <>
                            <span>Apply Now</span>
                            <span className="btn-shine"></span>
                        </>
                    )}
                </Button>
                {opportunity.applicants && opportunity.applicants.length > 0 && (
                    <div className="opportunity-applicants-badge">
                        <span>👥</span>
                        <span>{opportunity.applicants.length} applicant{opportunity.applicants.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default OpportunityCard;
