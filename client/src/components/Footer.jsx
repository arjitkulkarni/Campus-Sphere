import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '4rem 2rem',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--glass-border)',
            marginTop: 'auto',
            textAlign: 'center',
            color: 'var(--text-secondary)'
        }}>
            <p>&copy; 2025 CampusSphere. All rights reserved.</p>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <a href="#" style={{ color: 'var(--text-secondary)' }}>Privacy</a>
                <a href="#" style={{ color: 'var(--text-secondary)' }}>Terms</a>
                <a href="#" style={{ color: 'var(--text-secondary)' }}>Contact</a>
            </div>
        </footer>
    );
};

export default Footer;
