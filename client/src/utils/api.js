const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (name, email, password, role) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  login: (email, password) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiRequest('/auth/me'),

  updateProfile: (profileData) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

// Posts API
export const postsAPI = {
  create: (postData) =>
    apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  getAll: () => apiRequest('/posts'),

  getById: (id) => apiRequest(`/posts/${id}`),

  like: (id) =>
    apiRequest(`/posts/${id}/like`, {
      method: 'PUT',
    }),

  comment: (id, comment) =>
    apiRequest(`/posts/${id}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text: comment }),
    }),

  delete: (id) =>
    apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    }),
};

// Opportunities API
export const opportunitiesAPI = {
  create: (opportunityData) =>
    apiRequest('/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    }),

  getAll: () => apiRequest('/opportunities'),

  getById: (id) => apiRequest(`/opportunities/${id}`),

  apply: (id, applicationData) =>
    apiRequest(`/opportunities/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),

  delete: (id) =>
    apiRequest(`/opportunities/${id}`, {
      method: 'DELETE',
    }),
};

// Connections/Mentorship API
export const connectionsAPI = {
  getMentors: (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/connections/mentors${queryParams ? `?${queryParams}` : ''}`);
  },

  requestConnection: (mentorId, message) =>
    apiRequest('/connections/request', {
      method: 'POST',
      body: JSON.stringify({ mentorId, message }),
    }),

  getConnections: () => apiRequest('/connections'),

  bookSession: (connectionId, sessionData) =>
    apiRequest(`/connections/${connectionId}/session`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    }),

  acceptConnection: (connectionId) =>
    apiRequest(`/connections/${connectionId}/accept`, {
      method: 'PUT',
    }),

  rejectConnection: (connectionId) =>
    apiRequest(`/connections/${connectionId}/reject`, {
      method: 'PUT',
    }),
};

