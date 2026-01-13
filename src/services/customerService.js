import api from './api';

export const customerService = {
  getAllCustomers() {
    return api.get('/customers');
  },

  getCustomerById(id) {
    return api.get(`/customers/${id}`);
  },

  createCustomer(data) {
    return api.post('/customers', data);
  },

  updateCustomer(id, data) {
    return api.put(`/customers/${id}`, data);
  },

  deleteCustomer(id) {
    return api.delete(`/customers/${id}`);
  },

  getActiveCustomers() {
    return api.get('/customers/active');
  },
};