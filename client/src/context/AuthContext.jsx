import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Validate token and get user data
            authAPI.getMe()
                .then((response) => setUser(response.data))
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const data = response.data;
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data);
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const response = await authAPI.register(name, email, password, role);
            const data = response.data;
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data);
            return data;
        } catch (error) {
            // Preserve the full error object so Register component can access response details
            console.error('Registration API error:', error);
            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || error.response.data?.error || 'Registration failed';
                const customError = new Error(errorMessage);
                customError.response = error.response;
                throw customError;
            } else if (error.request) {
                // Request was made but no response received
                throw new Error('Unable to connect to server. Please check if the backend is running on http://localhost:5000');
            } else {
                // Error in setting up the request
                throw new Error(error.message || 'Registration failed');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            const data = response.data;
            setUser(data);
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Update failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
