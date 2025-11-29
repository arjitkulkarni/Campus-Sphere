import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './atoms/Button';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

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
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ 
                    fontSize: '1.5rem', 
                    background: 'linear-gradient(to right, var(--primary), var(--secondary))', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                    margin: 0
                }}>
                    CampusSphere
                </h1>
            </Link>

            {user && (
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link 
                        to="/feed" 
                        style={{ 
                            color: isActive('/feed') ? 'var(--primary)' : 'var(--text-primary)',
                            textDecoration: 'none',
                            transition: 'var(--transition-fast)',
                            borderBottom: isActive('/feed') ? '2px solid var(--primary)' : '2px solid transparent',
                            paddingBottom: '0.25rem'
                        }}
                    >
                        Feed
                    </Link>
                    <Link 
                        to="/mentorship" 
                        style={{ 
                            color: isActive('/mentorship') ? 'var(--primary)' : 'var(--text-primary)',
                            textDecoration: 'none',
                            transition: 'var(--transition-fast)',
                            borderBottom: isActive('/mentorship') ? '2px solid var(--primary)' : '2px solid transparent',
                            paddingBottom: '0.25rem'
                        }}
                    >
                        Mentorship
                    </Link>
                    <Link 
                        to="/opportunities" 
                        style={{ 
                            color: isActive('/opportunities') ? 'var(--primary)' : 'var(--text-primary)',
                            textDecoration: 'none',
                            transition: 'var(--transition-fast)',
                            borderBottom: isActive('/opportunities') ? '2px solid var(--primary)' : '2px solid transparent',
                            paddingBottom: '0.25rem'
                        }}
                    >
                        Opportunities
                    </Link>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {user.name}
                        </span>
                        <Button variant="glass" onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <Button variant="glass">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary">Join Now</Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
