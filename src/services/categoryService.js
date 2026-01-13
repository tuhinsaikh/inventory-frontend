import api from './api';

export const categoryService = {
  getAllCategories() {
    return api.get('/categories');
  },

  getActiveCategories() {
    return api.get('/categories/active');
  },

  getCategoryById(id) {
    return api.get(`/categories/${id}`);
  },

  createCategory(data) {
    return api.post('/categories', data);
  },

  updateCategory(id, data) {
    return api.put(`/categories/${id}`, data);
  },

  deleteCategory(id) {
    return api.delete(`/categories/${id}`);
  },

  getSubCategories(parentId) {
    return api.get(`/categories/${parentId}/subcategories`);
  },
};