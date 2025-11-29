import React, { useState } from 'react';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { opportunitiesAPI } from '../../utils/api';

const OpportunityForm = ({ onOpportunityCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'job',
        company: '',
        location: 'Remote',
        skills: '',
        requirements: '',
        deadline: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.company) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const requirementsArray = formData.requirements.split(',').map(r => r.trim()).filter(r => r);
            
            await opportunitiesAPI.create({
                ...formData,
                skills: skillsArray,
                requirements: requirementsArray,
                deadline: formData.deadline || undefined,
            });
            
            setFormData({
                title: '',
                description: '',
                type: 'job',
                company: '',
                location: 'Remote',
                skills: '',
                requirements: '',
                deadline: '',
            });
            
            if (onOpportunityCreated) onOpportunityCreated();
        } catch (error) {
            alert(error.message || 'Failed to create opportunity');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Post an Opportunity</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <Input
                        label="Title *"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                            Type *
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                color: 'white',
                                outline: 'none'
                            }}
                            required
                        >
                            <option value="job">Job</option>
                            <option value="internship">Internship</option>
                            <option value="referral">Referral</option>
                            <option value="research">Research</option>
                        </select>
                    </div>
                </div>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the opportunity..."
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
                        marginBottom: '1rem',
                        fontFamily: 'inherit'
                    }}
                    required
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <Input
                        label="Company *"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>

                <Input
                    label="Required Skills (comma separated)"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. React, Node.js, Python"
                />

                <Input
                    label="Requirements (comma separated)"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="e.g. 2+ years experience, Bachelor's degree"
                />

                <Input
                    label="Application Deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                />

                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Opportunity'}
                </Button>
            </form>
        </Card>
    );
};

export default OpportunityForm;

