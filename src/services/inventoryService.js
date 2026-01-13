import api from './api';

export const inventoryService = {
  getAllInventory(params = {}) {
    return api.get('/inventory', { params });
  },

  getInventoryByProduct(productId) {
    return api.get(`/inventory/product/${productId}`);
  },

  getInventoryByWarehouse(warehouseId) {
    return api.get(`/inventory/warehouse/${warehouseId}`);
  },

  getInventory(productId, warehouseId) {
    return api.get(`/inventory/product/${productId}/warehouse/${warehouseId}`);
  },

  updateInventory(data) {
    return api.put('/inventory', data);
  },

  adjustInventory(data) {
    return api.post('/inventory/adjust', null, { params: data });
  },

  transferStock(data) {
    return api.post('/inventory/transfer', null, { params: data });
  },

  getLowStockItems() {
    return api.get('/inventory/low-stock');
  },

  getOutOfStockItems() {
    return api.get('/inventory/out-of-stock');
  },

  getTotalStockByProduct(productId) {
    return api.get(`/inventory/product/${productId}/total`);
  },
};