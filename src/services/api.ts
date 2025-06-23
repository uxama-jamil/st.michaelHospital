import type { ApiError } from '@/types/common';
import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Read from .env
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 50000, // optional: 10 seconds timeout
});

// Request Interceptor (optional, e.g. to attach tokens)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor (optional: centralized error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiry, redirect, etc.
      console.warn('Unauthorized! Logging out...');
    }
    return Promise.reject(error);
  },
);

export const handleApiError = (error: any): never => {
  if (error.response && error.response.data) {
    throw error.response.data as ApiError;
  }
  throw { message: error.message || 'Unknown error' } as ApiError;
};

export default api;


