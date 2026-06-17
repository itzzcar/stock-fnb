import { api, tokenStorage } from './apiClient';

// Funciones de auth que hablan con /api/auth.
export const authService = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }, { auth: false }),

  register: (name, email, password) =>
    api.post('/api/auth/register', { name, email, password }, { auth: false }),

  me: () => api.get('/api/auth/me'),

  logout: () => tokenStorage.clear(),
};
