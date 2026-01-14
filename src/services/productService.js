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
    console.log('🔍 updateProduct called with:');
    console.log('ID:', id);
    console.log('Data:', productData);
    console.log('URL being called:', `/products/${id}`);
    
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
  getProductWithInventory(id) {
    return Promise.all([
      this.getProductById(id),
      this.getProductInventory(id)
    ]).then(([product, inventory]) => ({
      ...product,
      inventory: inventory || []
    }));
  },

  // Get product inventory separately
  getProductInventory(productId) {
    return api.get(`/inventory/product/${productId}`)
      .then(response => response.data?.data || response.data || [])
      .catch(error => {
        console.error('Error fetching inventory:', error);
        return [];
      });
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