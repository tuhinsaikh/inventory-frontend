// src/services/authService.js
import api from './api';

// Create the authService object
const authService = {
  setAuthToken(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  clearAuthToken() {
    delete api.defaults.headers.common['Authorization'];
  },

  login(credentials) {
    return api.post('/auth/login', credentials);
  },

  register(userData) {
    return api.post('/auth/register', userData);
  },

  logout(token) {
    return api.post('/auth/logout', null, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  getProfile() {
    return api.get('/users/profile');
  },

  updateProfile(userId, userData) {
    return api.put(`/users/${userId}`, userData);
  },

  changePassword(data) {
    return api.post('/auth/change-password', data);
  }
};

// Export it as default
export default authService;