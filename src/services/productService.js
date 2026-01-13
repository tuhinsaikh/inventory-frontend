import api from './api';

export const productService = {
  getAllProducts(params = {}) {
    return api.get('/products', { params });
  },

  getActiveProducts() {
    return api.get('/products/active');
  },

  getProductById(id) {
    return api.get(`/products/${id}`);
  },

  createProduct(productData) {
    return api.post('/products', productData);
  },

  updateProduct(id, productData) {
    return api.put(`/products/${id}`, productData);
  },

  deleteProduct(id) {
    return api.delete(`/products/${id}`);
  },

  deactivateProduct(id) {
    return api.patch(`/products/${id}/deactivate`);
  },

  searchProducts(keyword) {
    return api.get('/products/search', { params: { keyword } });
  },

  getProductsByCategory(categoryId) {
    return api.get(`/products/category/${categoryId}`);
  },

  uploadProductImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};