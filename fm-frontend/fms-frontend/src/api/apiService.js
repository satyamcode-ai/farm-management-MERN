// src/api/apiService.js

import axios from 'axios';

// Update this if your backend runs on a different port/host
// Changed to 8080 to match the new Node.js server default
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token to headers
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

/** * --- Auth Endpoints --- */
export const loginUser = (userData) => api.post('/auth/login', userData);
export const signupUser = (userData) => api.post('/auth/signup', userData);

/** * --- Dashboard Endpoints --- */
export const fetchDashboardSummary = () => api.get('/dashboard');

/** * --- Livestock Endpoints --- */
export const fetchCattle = () => api.get('/livestock');
export const createCattle = (cattleData) => api.post('/livestock', cattleData);
export const deleteCattle = (cattleId) => api.delete(`/livestock/${cattleId}`);

/** * --- Finance Endpoints --- */
export const fetchFinancialRecords = () => api.get('/finance');
export const createFinancialRecord = (recordData) => api.post('/finance', recordData);
export const deleteFinancialRecord = (recordId) => api.delete(`/finance/${recordId}`);

/** * --- DL Model Integration Endpoint --- */
// Calls the Spring Boot proxy endpoint to initiate breed analysis
export const analyzeBreed = (cattleId, formData) => {
    return api.post(`/dl/analyze-breed/${cattleId}`, formData, {
        headers: {
            // Let axios handle multipart/form-data boundary
            'Content-Type': 'multipart/form-data'
        }
    });
};

// --- DL Model Studio Endpoint (Handles File Upload) ---
export const runStudioAnalysis = (formData) => {
    // Note: We use the default axios instance, but specify Content-Type in headers
    // to ensure it is set to 'multipart/form-data' by the browser/axios when sending FormData.
    // We send this to a dedicated endpoint that returns results, rather than updating DB.
    return api.post('/dl/studio-analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export default api;