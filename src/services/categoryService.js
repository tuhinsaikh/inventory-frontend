import api from './api';

export const categoryService = {
  // getAllCategories() {
  //   return api.get('/categories');
  // },

  getAllCategories: async () => {
    try {
      const response = await api.get('/categories');
      // If your API returns { data: [], message: 'success' } structure
      return response.data.data; // or just response.data depending on your API
    } catch (error) {
      throw error;
    }
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