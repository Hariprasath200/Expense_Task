import axios from 'axios';

// Set the base URL for all requests
axios.defaults.baseURL = 'http://localhost:8000';

// Function to get token from local storage
const getAuthToken = () => localStorage.getItem('authToken');

// Apply default headers
axios.defaults.headers.common['Authorization'] = `Token ${getAuthToken()}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Optional: Interceptor to dynamically set the Authorization header for each request
axios.interceptors.request.use(
    config => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axios;
