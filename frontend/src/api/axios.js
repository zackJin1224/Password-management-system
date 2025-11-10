import axios from 'axios';

// create axios instance
const axiosInstance = axios.create({
  baseURL: '/api', // All requests will be prefixed with this prefix.
  timeout: 10000, // Request timeout: 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add Token Before Sending Request
axiosInstance.interceptors.request.use(
  config => {
    // get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized Error Handling
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // If a 401 error (Unauthorized) occurs, clear the token and redirect to the login page.
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

