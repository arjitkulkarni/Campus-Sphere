import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
// In production, set VITE_API_URL in your deployment platform's environment variables
const API_URL = import.meta.env.VITE_API_URL || 
                 (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// Log API URL for debugging (always log in production to help troubleshoot)
console.log('[CampusSphere API Config]', {
    baseURL: API_URL,
    environment: import.meta.env.MODE,
    viteApiUrl: import.meta.env.VITE_API_URL || 'not set (using fallback)',
    isProduction: import.meta.env.PROD
});

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log error details for debugging
        if (error.response) {
            // Server responded with error
            console.error('API Error Response:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config?.url,
                baseURL: error.config?.baseURL
            });
        } else if (error.request) {
            // Request was made but no response received
            console.error('API Network Error:', {
                message: error.message,
                url: error.config?.url,
                baseURL: error.config?.baseURL,
                fullURL: error.config?.baseURL + error.config?.url
            });
        } else {
            // Error in setting up the request
            console.error('API Request Setup Error:', error.message);
        }

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API methods
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
    getMe: () => api.get('/auth/me'),
    getUserById: (userId) => api.get(`/auth/user/${userId}`),
    updateProfile: (data) => api.put('/auth/profile', data),
};

export const postsAPI = {
    getAll: () => api.get('/posts'),
    getMine: () => api.get('/posts/me'),
    getByUserId: (userId) => api.get(`/posts/user/${userId}`),
    getOne: (id) => api.get(`/posts/${id}`),
    create: (data) => api.post('/posts', data),
    update: (id, data) => api.put(`/posts/${id}`, data),
    delete: (id) => api.delete(`/posts/${id}`),
    like: (id) => api.put(`/posts/${id}/like`),
    comment: (id, content) => api.post(`/posts/${id}/comment`, { content }),
};

export const opportunitiesAPI = {
    getAll: (params) => api.get('/opportunities', { params }),
    getOne: (id) => api.get(`/opportunities/${id}`),
    create: (data) => api.post('/opportunities', data),
    update: (id, data) => api.put(`/opportunities/${id}`, data),
    delete: (id) => api.delete(`/opportunities/${id}`),
    apply: (id) => api.put(`/opportunities/${id}/apply`),
};

export const connectionsAPI = {
    getMentors: () => api.get('/connections/mentors'),
    getConnections: () => api.get('/connections'),
    requestConnection: (mentorId) => api.post('/connections', { mentorId }),
    updateConnection: (id, status) => api.put(`/connections/${id}`, { status }),
    scheduleSession: (id, data) => api.post(`/connections/${id}/sessions`, data),
};

export default api;

