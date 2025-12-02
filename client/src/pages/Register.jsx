import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
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
                ctx.fillStyle = `rgba(112, 0, 255, ${particle.opacity})`;
                ctx.fill();

                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(112, 0, 255, ${0.08 * (1 - distance / 120)})`;
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        
        try {
            await register(name, email, password, role);
            navigate('/onboarding');
        } catch (err) {
            console.error('Registration error:', err);
            // Use error message from AuthContext (which handles API URL dynamically)
            // If no message, fall back to checking response/request
            let errorMessage = err.message || 'Registration failed';
            
            // If error has response data, prefer that message
            if (err.response?.data?.message || err.response?.data?.error) {
                errorMessage = err.response.data.message || err.response.data.error;
            }
            
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page" style={{
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

            {/* Register Card */}
            <div className="auth-card" style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '500px',
                width: '100%',
                animation: 'fadeInUp 0.6s ease-out'
            }}>
                <div className="auth-card-inner">
                    {/* Logo/Brand */}
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
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                            Create your account and start your journey
                        </p>
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

                    {/* Register Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input"
                                    placeholder="John Doe"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="you@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="At least 6 characters"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={loading}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="Re-enter your password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">I am a...</label>
                            <div className="role-selection-grid">
                                <button
                                    type="button"
                                    onClick={() => setRole('student')}
                                    className={`role-btn ${role === 'student' ? 'role-btn-active' : ''}`}
                                    disabled={loading}
                                >
                                    <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎓</span>
                                    <span>Student</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('alumni')}
                                    className={`role-btn ${role === 'alumni' ? 'role-btn-active' : ''}`}
                                    disabled={loading}
                                >
                                    <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💼</span>
                                    <span>Alumni</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('faculty')}
                                    className={`role-btn ${role === 'faculty' ? 'role-btn-active' : ''}`}
                                    disabled={loading}
                                >
                                    <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👨‍🏫</span>
                                    <span>Faculty</span>
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary btn-interactive btn-auth"
                            disabled={loading}
                            style={{ width: '100%', position: 'relative', overflow: 'hidden', marginTop: '0.5rem' }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="spinner"></span>
                                    Creating account...
                                </span>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <span className="btn-shine"></span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        margin: '2rem 0',
                        color: 'var(--text-secondary)'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        <span style={{ fontSize: '0.875rem' }}>or</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    </div>

                    {/* Login Link */}
                    <p style={{ 
                        textAlign: 'center', 
                        color: 'var(--text-secondary)',
                        fontSize: '0.9375rem'
                    }}>
                        Already have an account?{' '}
                        <Link 
                            to="/login" 
                            style={{ 
                                color: 'var(--primary)',
                                textDecoration: 'none',
                                fontWeight: 600,
                                transition: 'var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => e.target.style.textShadow = '0 0 10px var(--primary-glow)'}
                            onMouseLeave={(e) => e.target.style.textShadow = 'none'}
                        >
                            Sign in
                        </Link>
                    </p>

                    {/* Quick Links */}
                    <div style={{ 
                        marginTop: '2rem', 
                        paddingTop: '2rem',
                        borderTop: '1px solid var(--glass-border)',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1.5rem',
                        flexWrap: 'wrap'
                    }}>
                        <Link 
                            to="/" 
                            style={{ 
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                transition: 'var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
