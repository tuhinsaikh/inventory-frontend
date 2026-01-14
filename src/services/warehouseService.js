import api from './api';

export const warehouseService = {
  getAllWarehouses() {
    return api.get('/warehouses');
  },

  getActiveWarehouses() {
    return api.get('/warehouses/active');
  },

  getWarehouseById(id) {
    return api.get(`/warehouses/${id}`);
  },

  createWarehouse(warehouseData) {
    return api.post('/warehouses', warehouseData);
  },

  updateWarehouse(id, warehouseData) {
    return api.put(`/warehouses/${id}`, warehouseData);
  },

  deleteWarehouse(id) {
    return api.delete(`/warehouses/${id}`);
  }
};