import React from 'react';

const Button = ({ children, variant = 'primary', className = '', disabled, ...props }) => {
    const baseClasses = 'btn';
    const variantClasses = {
        primary: 'btn-primary',
        glass: 'btn-glass',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            disabled={disabled}
            style={{
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                ...props.style,
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
