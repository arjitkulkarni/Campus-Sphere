import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const typeStyles = {
        success: {
            background: 'linear-gradient(135deg, rgba(0, 255, 157, 0.2), rgba(0, 255, 157, 0.1))',
            borderColor: 'var(--success)',
            icon: '✓',
        },
        error: {
            background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.2), rgba(255, 0, 85, 0.1))',
            borderColor: 'var(--accent)',
            icon: '✕',
        },
        info: {
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(0, 240, 255, 0.1))',
            borderColor: 'var(--primary)',
            icon: 'ℹ',
        },
    };

    const style = typeStyles[type] || typeStyles.info;

    return (
        <div 
            className="toast-container"
            style={{
                position: 'fixed',
                top: '100px',
                right: '2rem',
                zIndex: 10000,
                animation: 'slideInRight 0.3s ease-out',
            }}
        >
            <div 
                className="toast"
                style={{
                    padding: '1rem 1.5rem',
                    background: style.background,
                    border: `1px solid ${style.borderColor}`,
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    minWidth: '300px',
                    maxWidth: '400px',
                }}
            >
                <div 
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: style.borderColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--bg-primary)',
                        fontWeight: 700,
                        flexShrink: 0,
                    }}
                >
                    {style.icon}
                </div>
                <div style={{ flex: 1, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                    {message}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        padding: 0,
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'none';
                        e.target.style.color = 'var(--text-secondary)';
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast;


