import api from './axios';

// Products API
export const productService = {
  getProducts: (params = {}) =>
    api.get('/api/products', { params }),

  getProduct: (id) =>
    api.get(`/api/products/${id}`),

  getCategories: () =>
    api.get('/api/products/categories'),

  createProduct: (data) =>
    api.post('/api/products', data),

  updateProduct: (id, data) =>
    api.put(`/api/products/${id}`, data),

  deleteProduct: (id) =>
    api.delete(`/api/products/${id}`),

  addReview: (id, data) =>
    api.post(`/api/products/${id}/reviews`, data),
};

// Auth API
export const authService = {
  register: (data) =>
    api.post('/api/auth/register', data),

  login: (data) =>
    api.post('/api/auth/login', data),

  getProfile: () =>
    api.get('/api/auth/me'),

  updateProfile: (data) =>
    api.put('/api/auth/profile', data),
};

// Orders API
export const orderService = {
  createOrder: (data) =>
    api.post('/api/orders', data),

  getMyOrders: () =>
    api.get('/api/orders/mine'),

  getOrder: (id) =>
    api.get(`/api/orders/${id}`),

  getAllOrders: () =>
    api.get('/api/orders'),
};
