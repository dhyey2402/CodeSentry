const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

const getHeaders = (isFormData = false) => {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
};

const handleResponse = async (res) => {
  if (res.status === 401 || res.status === 403) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Authentication expired. Please log in again.');
  }
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API request failed');
  }
  return res.json();
};

export const api = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });
    return handleResponse(res);
  },
  
  register: async (fullName, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: fullName, email, password })
    });
    return handleResponse(res);
  },

  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/projects/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    return handleResponse(res);
  },
  
  analyzePylint: async (projectId) => {
    const res = await fetch(`${API_URL}/reviews/analyze/${projectId}`, { method: 'POST', headers: getHeaders() });
    return handleResponse(res);
  },
  
  analyzeSecurity: async (projectId) => {
    const res = await fetch(`${API_URL}/reviews/security/${projectId}`, { method: 'POST', headers: getHeaders() });
    return handleResponse(res);
  },
  
  analyzeComplexity: async (projectId) => {
    const res = await fetch(`${API_URL}/reviews/complexity/${projectId}`, { method: 'POST', headers: getHeaders() });
    return handleResponse(res);
  },
  
  analyzeAI: async (projectId) => {
    const res = await fetch(`${API_URL}/reviews/ai/${projectId}`, { method: 'POST', headers: getHeaders() });
    return handleResponse(res);
  },

  getProjects: async () => {
    const res = await fetch(`${API_URL}/projects`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getReviews: async () => {
    const res = await fetch(`${API_URL}/reviews/history`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getReview: async (id) => {
    const res = await fetch(`${API_URL}/reviews/${id}`, { headers: getHeaders() });
    return handleResponse(res);
  },

  deleteReview: async (id) => {
    const res = await fetch(`${API_URL}/reviews/${id}`, { 
      method: 'DELETE', 
      headers: getHeaders() 
    });
    return handleResponse(res);
  },

  getStats: async () => {
    const res = await fetch(`${API_URL}/reviews/statistics`, { headers: getHeaders() });
    return handleResponse(res);
  },

  getCurrentUser: async () => {
    const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
    return handleResponse(res);
  },

  updatePreferences: async (preferences) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ preferences })
    });
    return handleResponse(res);
  },

  updateProfile: async (data) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  getRawCode: async (projectId) => {
    const res = await fetch(`${API_URL}/projects/${projectId}/code`, { headers: getHeaders() });
    return handleResponse(res);
  },

  chatWithReview: async (reviewId, message) => {
    const res = await fetch(`${API_URL}/chat/${reviewId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message })
    });
    return handleResponse(res);
  }
};
