import React from 'react';

const Input = ({ label, error, ...props }) => {
    return (
        <div style={{ marginBottom: '1.5rem' }}>
            {label && (
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    {label}
                </label>
            )}
            <input
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: error ? '1px solid var(--error)' : '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'white',
                    outline: 'none',
                    transition: 'var(--transition-fast)',
                }}
                {...props}
            />
            {error && (
                <span style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '0.5rem', display: 'block' }}>
                    {error}
                </span>
            )}
        </div>
    );
};

export default Input;
