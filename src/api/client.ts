import axios from 'axios';

// API base URL from environment variables
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create Axios instance with default configuration
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth tokens, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add authentication token when auth is implemented
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TODO: Add global error handling (e.g., redirect to login on 401)
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
