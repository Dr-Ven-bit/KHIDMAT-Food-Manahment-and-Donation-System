// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Your backend base URL

const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data; // Contains token and user info (including role)
};

export default {
    login,
};
