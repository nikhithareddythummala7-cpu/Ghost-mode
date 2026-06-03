import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ghostmode_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (payload) => api.post('/auth/login', payload);
export const register = (payload) => api.post('/auth/register', payload);
export const forgotPassword = (payload) => api.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => api.post('/auth/reset-password', payload);
export const updateProfile = (payload) => api.put('/auth/profile', payload);
export const getCapsules = () => api.get('/capsules');
export const createCapsule = (payload) => api.post('/capsules', payload);
export const updateCapsule = (id, payload) => api.put(`/capsules/${id}`, payload);
export const deleteCapsule = (id) => api.delete(`/capsules/${id}`);
export const getMessages = () => api.get('/messages');
export const createMessage = (payload) => api.post('/messages', payload);
export const updateMessage = (id, payload) => api.put(`/messages/${id}`, payload);
export const deleteMessage = (id) => api.delete(`/messages/${id}`);
export const getVault = () => api.get('/vault');
export const uploadVaultItem = (formData) => api.post('/vault', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteVaultItem = (id) => api.delete(`/vault/${id}`);
export const getContacts = () => api.get('/contacts');
export const createContact = (payload) => api.post('/contacts', payload);
export const updateContact = (id, payload) => api.put(`/contacts/${id}`, payload);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminAnalytics = () => api.get('/admin/analytics');
export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const changeUserStatus = (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminCapsules = (params) => api.get('/admin/capsules', { params });
export const deleteAdminCapsule = (id) => api.delete(`/admin/capsules/${id}`);
export const getAdminMessages = (params) => api.get('/admin/messages', { params });
export const reviewAdminMessage = (id, action) => api.put(`/admin/messages/${id}/review`, { action });
export const deleteAdminMessage = (id) => api.delete(`/admin/messages/${id}`);
export const getAdminVault = (params) => api.get('/admin/vault', { params });
export const getAdminVaultOverview = () => api.get('/admin/vault', { params: { overview: true } });
export const deleteAdminVaultItem = (id) => api.delete(`/admin/vault/${id}`);
export const getAdminContacts = (params) => api.get('/admin/contacts', { params });
export const getAdminContactsOverview = () => api.get('/admin/contacts', { params: { overview: true } });
export const deleteAdminContact = (id) => api.delete(`/admin/contacts/${id}`);
export const getAdminSettings = () => api.get('/admin/settings');
export const updateAdminSettings = (payload) => api.put('/admin/settings', payload);
export const getAdminActivity = () => api.get('/admin/activity');
export const toggleCapsuleSuspicious = (id, isSuspicious) => api.put(`/admin/capsules/${id}/suspicious`, { isSuspicious });
