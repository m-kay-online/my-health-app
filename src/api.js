import axios from 'axios';

const api = axios.create({
    baseURL: `http://${import.meta.env.VITE_DB_HOST}:${import.meta.env.VITE_PORT}` || 'http://localhost:5000',
});

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

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            // Token has expired or is invalid
            localStorage.removeItem('token');
            window.location.href = '/'; // Redirect to login page
        }
        return Promise.reject(error);
    }
);

export default api;