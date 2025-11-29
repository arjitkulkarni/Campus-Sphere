import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/atoms/Button';

const Onboarding = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        college: '',
        graduationYear: '',
        isEmployed: false,
        company: '',
        jobTitle: '',
        isMentor: false,
        bio: '',
        skills: ''
    });
    const [skillInput, setSkillInput] = useState('');
    const [skillChips, setSkillChips] = useState([]);
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);

    // Animated particle background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = particlesRef.current;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const createParticles = () => {
            const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 20000);
            particles.length = 0;
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    opacity: Math.random() * 0.4 + 0.2,
                });
            }
        };

        createParticles();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, i) => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 157, ${particle.opacity})`;
                ctx.fill();

                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(0, 255, 157, ${0.08 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // Handle skill input
    const handleSkillKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill();
        }
    };

    const addSkill = () => {
        const skill = skillInput.trim();
        if (skill && !skillChips.includes(skill)) {
            setSkillChips([...skillChips, skill]);
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkillChips(skillChips.filter(skill => skill !== skillToRemove));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const canProceed = () => {
        if (currentStep === 1) {
            return formData.college && formData.graduationYear;
        }
        if (currentStep === 2 && user.role === 'alumni') {
            if (formData.isEmployed) {
                return formData.company && formData.jobTitle;
            }
            return true;
        }
        if (currentStep === 2 && user.role !== 'alumni') {
            return true;
        }
        if (currentStep === 3) {
            return skillChips.length > 0 || formData.bio;
        }
        return true;
    };

    const handleNext = () => {
        if (canProceed() && currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canProceed()) return;

        setLoading(true);
        setError('');
        
        try {
            await updateProfile({
                ...formData,
                skills: skillChips.length > 0 ? skillChips : (formData.skills ? formData.skills.split(',').map(s => s.trim()) : [])
            });
            navigate('/feed');
        } catch (err) {
            console.error('Onboarding error:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
            setLoading(false);
        }
    };

    if (!user) return null;

    const totalSteps = user.role === 'alumni' ? 3 : 3;
    const stepProgress = (currentStep / totalSteps) * 100;

    return (
        <div className="onboarding-page" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '2rem'
        }}>
            {/* Animated Background Canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />

            {/* Floating Shapes */}
            <div className="auth-shapes">
                <div className="auth-shape auth-shape-1"></div>
                <div className="auth-shape auth-shape-2"></div>
            </div>

            {/* Gradient Orbs */}
            <div className="auth-orb auth-orb-1"></div>
            <div className="auth-orb auth-orb-2"></div>

            {/* Onboarding Card */}
            <div className="onboarding-card" style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '700px',
                width: '100%',
                animation: 'fadeInUp 0.6s ease-out'
            }}>
                <div className="auth-card-inner">
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <h1 style={{
                                fontSize: '2rem',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '0.5rem'
                            }}>
                                CampusSphere
                            </h1>
                        </Link>
                        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
                            Complete Your Profile
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                            Let's set up your profile to get the best experience
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-container" style={{ marginBottom: '2rem' }}>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ width: `${stepProgress}%` }}
                            ></div>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginTop: '0.5rem',
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)'
                        }}>
                            <span className={currentStep >= 1 ? 'step-active' : ''}>Basic Info</span>
                            <span className={currentStep >= 2 ? 'step-active' : ''}>
                                {user.role === 'alumni' ? 'Professional' : 'Details'}
                            </span>
                            <span className={currentStep >= 3 ? 'step-active' : ''}>About You</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="auth-error" style={{
                            background: 'rgba(255, 0, 85, 0.1)',
                            color: 'var(--error)',
                            padding: '1rem 1.25rem',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(255, 0, 85, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            animation: 'shake 0.5s ease-in-out'
                        }}>
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form Steps */}
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="onboarding-step" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                                <div className="step-header">
                                    <div className="step-icon">🎓</div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Basic Information</h3>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        Tell us about your academic background
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">🏫</span>
                                        College / University
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            name="college"
                                            value={formData.college}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Enter your college or university"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">📅</span>
                                        Graduation Year
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            type="number"
                                            name="graduationYear"
                                            value={formData.graduationYear}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="e.g. 2024"
                                            min="1950"
                                            max="2100"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Professional Info (Alumni) or Details */}
                        {currentStep === 2 && (
                            <div className="onboarding-step" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                                {user.role === 'alumni' ? (
                                    <>
                                        <div className="step-header">
                                            <div className="step-icon">💼</div>
                                            <h3 style={{ margin: '0 0 0.5rem 0' }}>Professional Information</h3>
                                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                Share your professional experience
                                            </p>
                                        </div>

                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="isEmployed"
                                                    checked={formData.isEmployed}
                                                    onChange={handleChange}
                                                    className="custom-checkbox"
                                                    disabled={loading}
                                                />
                                                <span className="checkbox-custom"></span>
                                                <span>I am currently employed</span>
                                            </label>
                                        </div>

                                        {formData.isEmployed && (
                                            <div style={{ animation: 'slideDown 0.3s ease-out' }}>
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <span className="label-icon">🏢</span>
                                                        Company
                                                    </label>
                                                    <div className="input-wrapper">
                                                        <input
                                                            type="text"
                                                            name="company"
                                                            value={formData.company}
                                                            onChange={handleChange}
                                                            className="form-input"
                                                            placeholder="Enter company name"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label">
                                                        <span className="label-icon">💼</span>
                                                        Job Title
                                                    </label>
                                                    <div className="input-wrapper">
                                                        <input
                                                            type="text"
                                                            name="jobTitle"
                                                            value={formData.jobTitle}
                                                            onChange={handleChange}
                                                            className="form-input"
                                                            placeholder="Enter your job title"
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="isMentor"
                                                    checked={formData.isMentor}
                                                    onChange={handleChange}
                                                    className="custom-checkbox"
                                                    disabled={loading}
                                                />
                                                <span className="checkbox-custom"></span>
                                                <span>I am open to mentoring students</span>
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="step-header">
                                            <div className="step-icon">📝</div>
                                            <h3 style={{ margin: '0 0 0.5rem 0' }}>Additional Details</h3>
                                            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                Tell us more about yourself
                                            </p>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">
                                                <span className="label-icon">✍️</span>
                                                Bio
                                            </label>
                                            <div className="input-wrapper">
                                                <textarea
                                                    name="bio"
                                                    value={formData.bio}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    rows="5"
                                                    placeholder="Write a short bio about yourself..."
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Step 3: Skills & Bio */}
                        {currentStep === 3 && (
                            <div className="onboarding-step" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
                                <div className="step-header">
                                    <div className="step-icon">🚀</div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Skills & About You</h3>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        Showcase your skills and tell us about yourself
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <span className="label-icon">⚡</span>
                                        Skills
                                    </label>
                                    <div className="input-wrapper">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyPress={handleSkillKeyPress}
                                            onBlur={addSkill}
                                            className="form-input"
                                            placeholder="Type a skill and press Enter (e.g. React, Python, Design)"
                                            disabled={loading}
                                        />
                                    </div>
                                    {skillChips.length > 0 && (
                                        <div className="skill-chips" style={{ marginTop: '1rem' }}>
                                            {skillChips.map((skill, idx) => (
                                                <span key={idx} className="skill-chip">
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                        className="skill-chip-remove"
                                                        disabled={loading}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {user.role !== 'alumni' && (
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-icon">✍️</span>
                                            Bio
                                        </label>
                                        <div className="input-wrapper">
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                className="form-input"
                                                rows="5"
                                                placeholder="Write a short bio about yourself..."
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="onboarding-actions" style={{
                            display: 'flex',
                            gap: '1rem',
                            marginTop: '2rem',
                            justifyContent: 'space-between'
                        }}>
                            {currentStep > 1 ? (
                                <Button
                                    type="button"
                                    variant="glass"
                                    onClick={handleBack}
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                >
                                    ← Back
                                </Button>
                            ) : (
                                <div style={{ flex: 1 }}></div>
                            )}
                            
                            {currentStep < totalSteps ? (
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={handleNext}
                                    disabled={!canProceed() || loading}
                                    className="btn-interactive"
                                    style={{ flex: 1 }}
                                >
                                    Next →
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={!canProceed() || loading}
                                    className="btn-interactive"
                                    style={{ flex: 1, position: 'relative', overflow: 'hidden' }}
                                >
                                    {loading ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="spinner"></span>
                                            Completing...
                                        </span>
                                    ) : (
                                        <>
                                            <span>Complete Profile</span>
                                            <span className="btn-shine"></span>
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
