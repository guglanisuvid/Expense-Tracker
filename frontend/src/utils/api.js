// API utility functions for JWT token handling

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Set token in localStorage
const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
    localStorage.removeItem('token');
};

// API wrapper that includes JWT token in headers
const apiRequest = async (url, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        return response;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

export { getToken, setToken, removeToken, apiRequest };
