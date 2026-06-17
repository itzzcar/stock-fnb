import { api } from './apiClient';

// Funciones CRUD que hablan con /api/products.
export const productService = {
  list: () => api.get('/api/products'),
  get: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  adjustStock: (id, delta) => api.patch(`/api/products/${id}/stock`, { delta }),
  remove: (id) => api.del(`/api/products/${id}`),
};
