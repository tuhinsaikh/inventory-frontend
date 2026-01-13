import api from './api';

export const supplierService = {
  getAllSuppliers() {
    return api.get('/suppliers');
  },

  getSupplierById(id) {
    return api.get(`/suppliers/${id}`);
  },

  createSupplier(data) {
    return api.post('/suppliers', data);
  },

  updateSupplier(id, data) {
    return api.put(`/suppliers/${id}`, data);
  },

  deleteSupplier(id) {
    return api.delete(`/suppliers/${id}`);
  },

  getActiveSuppliers() {
    return api.get('/suppliers/active');
  },
};