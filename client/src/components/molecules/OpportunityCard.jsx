import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { opportunitiesAPI } from '../../services/api';
import Card from '../atoms/Card';
import Button from '../atoms/Button';

const OpportunityCard = ({ opportunity, onUpdate }) => {
    const { user } = useAuth();
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
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error applying:', error);
            alert(error.response?.data?.message || 'Failed to apply');
        } finally {
            setIsApplying(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'No deadline';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const typeColors = {
        job: 'var(--primary)',
        internship: 'var(--secondary)',
        referral: 'var(--accent)',
        research: 'var(--success)',
        volunteer: 'var(--warning)',
    };

    return (
        <Card style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0 }}>{opportunity.title}</h3>
                        <span style={{
                            padding: '0.25rem 0.75rem',
                            background: `${typeColors[opportunity.type]}20`,
                            border: `1px solid ${typeColors[opportunity.type]}`,
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            color: typeColors[opportunity.type],
                            textTransform: 'capitalize',
                        }}>
                            {opportunity.type}
                        </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {opportunity.company} • {opportunity.location}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Posted by {opportunity.postedBy?.name || 'Unknown'} • {formatDate(opportunity.deadline)}
                    </div>
                </div>
            </div>

            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {opportunity.description}
            </p>

            {opportunity.skills && opportunity.skills.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {opportunity.skills.map((skill, idx) => (
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

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {opportunity.applicationLink && (
                    <a
                        href={opportunity.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-glass"
                    >
                        View Details
                    </a>
                )}
                <Button
                    variant="primary"
                    onClick={handleApply}
                    disabled={hasApplied || isApplying || !opportunity.isActive}
                >
                    {hasApplied ? 'Applied ✓' : isApplying ? 'Applying...' : 'Apply Now'}
                </Button>
                {opportunity.applicants && opportunity.applicants.length > 0 && (
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {opportunity.applicants.length} applicant{opportunity.applicants.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>
        </Card>
    );
};

export default OpportunityCard;
