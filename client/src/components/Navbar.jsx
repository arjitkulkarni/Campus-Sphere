import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './atoms/Button';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`navbar-enhanced ${scrolled ? 'navbar-scrolled' : ''}`}>
            <Link to={user ? '/feed' : '/'} className="navbar-logo">
                <div className="logo-icon">⚡</div>
                <h1 className="logo-text">CampusSphere</h1>
            </Link>

            {user && (
                <div className="navbar-links">
                    <Link 
                        to="/feed" 
                        className={`navbar-link ${isActive('/feed') ? 'navbar-link-active' : ''}`}
                    >
                        <span className="link-icon">📰</span>
                        <span className="link-text">Feed</span>
                        {isActive('/feed') && <span className="link-indicator"></span>}
                    </Link>
                    <Link 
                        to="/mentorship" 
                        className={`navbar-link ${isActive('/mentorship') ? 'navbar-link-active' : ''}`}
                    >
                        <span className="link-icon">🤝</span>
                        <span className="link-text">Mentorship</span>
                        {isActive('/mentorship') && <span className="link-indicator"></span>}
                    </Link>
                    <Link 
                        to="/opportunities" 
                        className={`navbar-link ${isActive('/opportunities') ? 'navbar-link-active' : ''}`}
                    >
                        <span className="link-icon">💼</span>
                        <span className="link-text">Opportunities</span>
                        {isActive('/opportunities') && <span className="link-indicator"></span>}
                    </Link>
                </div>
            )}

            <div className="navbar-actions">
                {user ? (
                    <>
                        <div className="navbar-user">
                            <div className="user-avatar-small">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="user-name">{user.name}</span>
                        </div>
                        <Button variant="glass" onClick={handleLogout} className="logout-btn">
                            <span>Logout</span>
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <Button variant="glass">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" className="join-btn">
                                <span>Join Now</span>
                                <span className="btn-shine"></span>
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
