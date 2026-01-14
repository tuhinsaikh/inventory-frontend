import api from './api';

export const inventoryService = {
  // Get all inventory
  getAllInventory(params = {}) {
    return api.get('/inventory', { params })
      .then(response => response.data?.data || response.data || []);
  },

  // Get inventory by product ID
  getInventoryByProductId(productId) {
    return api.get(`/inventory/product/${productId}`)
      .then(response => response.data?.data || response.data || []);
  },

  // Get inventory by warehouse ID
  getInventoryByWarehouseId(warehouseId) {
    return api.get(`/inventory/warehouse/${warehouseId}`)
      .then(response => response.data?.data || response.data || []);
  },

  // Get low stock items
  getLowStockItems() {
    return api.get('/inventory/low-stock')
      .then(response => response.data?.data || response.data || []);
  },

  // Get out of stock items
  getOutOfStockItems() {
    return api.get('/inventory/out-of-stock')
      .then(response => response.data?.data || response.data || []);
  },

  // Get specific inventory by product and warehouse
  getInventory(productId, warehouseId) {
    return api.get(`/inventory/product/${productId}/warehouse/${warehouseId}`)
      .then(response => response.data?.data || response.data || {});
  },

  // Update inventory
  updateInventory(requestData) {
    return api.put('/inventory', requestData)
      .then(response => response.data?.data || response.data || {});
  },

  // Adjust inventory
  adjustInventory(productId, warehouseId, quantity, reason = '') {
    return api.post('/inventory/adjust', null, {
      params: { productId, warehouseId, quantity, reason }
    })
    .then(response => response.data?.data || response.data || {});
  },

  // Transfer stock
  transferStock(productId, fromWarehouseId, toWarehouseId, quantity) {
    return api.post('/inventory/transfer', null, {
      params: { productId, fromWarehouseId, toWarehouseId, quantity }
    })
    .then(response => response.data?.data || response.data || {});
  },

  // Get total stock by product
  getTotalStockByProduct(productId) {
    return api.get(`/inventory/product/${productId}/total`)
      .then(response => response.data?.data || 0);
  },

  // Batch update inventory (custom endpoint if needed)
  batchUpdateInventory(updates) {
    return api.post('/inventory/batch-update', updates)
      .then(response => response.data?.data || response.data || []);
  }
};