import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            document.querySelectorAll('.card').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

        // Create particles
        const createParticles = () => {
            const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
            particles.length = 0;
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 2 + 0.5,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2,
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
                ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
                ctx.fill();

                // Draw connections
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - distance / 150)})`;
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

    // Counter animation
    useEffect(() => {
        const counters = document.querySelectorAll('.counter');
        let hasAnimated = false;

        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        counters.forEach(animateCounter);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const statsCard = document.querySelector('.stats-card');
        if (statsCard) {
            observer.observe(statsCard);
        }

        return () => {
            if (statsCard) {
                observer.unobserve(statsCard);
            }
        };
    }, []);

    // Scroll animations for feature cards
    useEffect(() => {
        const featureCards = document.querySelectorAll('.feature-card');
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                    }
                });
            },
            { threshold: 0.2 }
        );

        featureCards.forEach((card) => {
            observer.observe(card);
        });

        return () => {
            featureCards.forEach((card) => {
                observer.unobserve(card);
            });
        };
    }, []);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
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

            {/* Floating Geometric Shapes */}
            <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
            </div>

            <Navbar />

            <main style={{ flex: 1, paddingTop: '80px', position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <section style={{
                    padding: '8rem 2rem',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="container animate-fade-in" style={{ position: 'relative', zIndex: 2 }}>
                        {/* Animated Gradient Orbs */}
                        <div className="gradient-orb orb-1"></div>
                        <div className="gradient-orb orb-2"></div>
                        <div className="gradient-orb orb-3"></div>

                        <h1 style={{ 
                            marginBottom: '1.5rem',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            Connect. Mentor. <span className="text-gradient-primary animate-gradient">Evolve.</span>
                        </h1>

                        <p style={{
                            maxWidth: '600px',
                            margin: '0 auto 3rem',
                            fontSize: '1.25rem',
                            lineHeight: '1.8',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            The next-generation platform for campus networking, mentorship, and career growth.
                            Join a thriving community of students, alumni, and faculty.
                        </p>

                        <div style={{ 
                            display: 'flex', 
                            gap: '1.5rem', 
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            {user ? (
                                <>
                                    <Link to="/feed" className="btn btn-primary btn-interactive">
                                        <span>Go to Feed</span>
                                        <span className="btn-shine"></span>
                                    </Link>
                                    <Link to="/mentorship" className="btn btn-glass btn-interactive">
                                        <span>Find Mentors</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="btn btn-primary btn-interactive">
                                        <span>Get Started</span>
                                        <span className="btn-shine"></span>
                                    </Link>
                                    <Link to="/login" className="btn btn-glass btn-interactive">
                                        <span>Login</span>
                                    </Link>
                                </>
                            )}
                        </div>

                        <div className="animate-float stats-container" style={{ marginTop: '4rem', position: 'relative', zIndex: 2 }}>
                            <div className="stats-card">
                                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="stat-item" style={{ textAlign: 'center' }}>
                                        <div className="stat-number">
                                            <span className="counter" data-target="500">0</span>+
                                        </div>
                                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Active Mentors</p>
                                    </div>
                                    <div className="stat-divider" />
                                    <div className="stat-item" style={{ textAlign: 'center' }}>
                                        <div className="stat-number">
                                            <span className="counter" data-target="1000">0</span>+
                                        </div>
                                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Opportunities</p>
                                    </div>
                                    <div className="stat-divider" />
                                    <div className="stat-item" style={{ textAlign: 'center' }}>
                                        <div className="stat-number">
                                            <span className="counter" data-target="50">0</span>+
                                        </div>
                                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Partner Companies</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section style={{ padding: '6rem 2rem', position: 'relative', zIndex: 2 }}>
                    <div className="container">
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="fade-in-up">
                            <h2 style={{ marginBottom: '1rem' }}>Why CampusSphere?</h2>
                            <p>Everything you need to accelerate your career journey</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>

                            <div className="card feature-card" style={{ animationDelay: '0.1s' }}>
                                <div className="card-icon" style={{ color: 'var(--primary)' }}>
                                    <div className="icon-wrapper">🤖</div>
                                </div>
                                <h3 style={{ marginBottom: '1rem' }}>AI Matchmaking</h3>
                                <p>
                                    Smart algorithms connect you with the perfect alumni mentors based on your skills, interests, and career goals.
                                </p>
                                <div className="card-glow"></div>
                            </div>

                            <div className="card feature-card" style={{ animationDelay: '0.2s' }}>
                                <div className="card-icon" style={{ color: 'var(--secondary)' }}>
                                    <div className="icon-wrapper">🚀</div>
                                </div>
                                <h3 style={{ marginBottom: '1rem' }}>Opportunity Exchange</h3>
                                <p>
                                    Access exclusive job openings, internships, and research projects posted directly by alumni and faculty members.
                                </p>
                                <div className="card-glow"></div>
                            </div>

                            <div className="card feature-card" style={{ animationDelay: '0.3s' }}>
                                <div className="card-icon" style={{ color: 'var(--accent)' }}>
                                    <div className="icon-wrapper">🏆</div>
                                </div>
                                <h3 style={{ marginBottom: '1rem' }}>Skill Passport</h3>
                                <p>
                                    Showcase your verified skills, certificates, and achievements in a modern, shareable digital portfolio.
                                </p>
                                <div className="card-glow"></div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section style={{ padding: '6rem 2rem', position: 'relative', zIndex: 2 }}>
                    <div className="container">
                        <div className="cta-card">
                            <div className="cta-content">
                                <h2 style={{ marginBottom: '1.5rem' }}>Ready to Launch Your Career?</h2>
                                <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                                    Join thousands of students and alumni who are already shaping the future of campus networking.
                                </p>
                                {user ? (
                                    <Link to="/feed" className="btn btn-primary btn-interactive btn-large">
                                        <span>Go to Feed</span>
                                        <span className="btn-shine"></span>
                                    </Link>
                                ) : (
                                    <Link to="/register" className="btn btn-primary btn-interactive btn-large">
                                        <span>Join CampusSphere Now</span>
                                        <span className="btn-shine"></span>
                                    </Link>
                                )}
                            </div>
                            <div className="cta-particles"></div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Home;
