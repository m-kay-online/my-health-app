import axios from 'axios';

const api = axios.create({
    baseURL: `http://${import.meta.env.VITE_DB_HOST}:${import.meta.env.VITE_PORT}` || 'http://localhost:5000',
});

export default api;