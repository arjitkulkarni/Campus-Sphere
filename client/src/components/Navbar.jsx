import React from 'react';

const Navbar = () => {
    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    CampusSphere
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <a href="#" style={{ color: 'var(--text-primary)' }}>Feed</a>
                <a href="#" style={{ color: 'var(--text-primary)' }}>Mentorship</a>
                <a href="#" style={{ color: 'var(--text-primary)' }}>Opportunities</a>
                <a href="#" style={{ color: 'var(--text-primary)' }}>Events</a>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-glass">Login</button>
                <button className="btn btn-primary">Join Now</button>
            </div>
        </nav>
    );
};

export default Navbar;
