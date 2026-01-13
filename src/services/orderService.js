import api from './api';

export const orderService = {
  // Purchase Orders
  getAllPurchaseOrders(params = {}) {
    return api.get('/purchase-orders', { params });
  },

  getPurchaseOrderById(id) {
    return api.get(`/purchase-orders/${id}`);
  },

  createPurchaseOrder(data) {
    return api.post('/purchase-orders', data);
  },

  updatePurchaseOrder(id, data) {
    return api.put(`/purchase-orders/${id}`, data);
  },

  approvePurchaseOrder(id) {
    return api.patch(`/purchase-orders/${id}/approve`);
  },

  receivePurchaseOrder(id) {
    return api.patch(`/purchase-orders/${id}/receive`);
  },

  cancelPurchaseOrder(id) {
    return api.patch(`/purchase-orders/${id}/cancel`);
  },

  getPendingPurchaseOrders() {
    return api.get('/purchase-orders/pending');
  },

  // Sales Orders
  getAllSalesOrders(params = {}) {
    return api.get('/sales-orders', { params });
  },

  getSalesOrderById(id) {
    return api.get(`/sales-orders/${id}`);
  },

  createSalesOrder(data) {
    return api.post('/sales-orders', data);
  },

  updateSalesOrder(id, data) {
    return api.put(`/sales-orders/${id}`, data);
  },

  confirmSalesOrder(id) {
    return api.patch(`/sales-orders/${id}/confirm`);
  },

  shipSalesOrder(id) {
    return api.patch(`/sales-orders/${id}/ship`);
  },

  deliverSalesOrder(id) {
    return api.patch(`/sales-orders/${id}/deliver`);
  },

  cancelSalesOrder(id) {
    return api.patch(`/sales-orders/${id}/cancel`);
  },

  getPendingSalesOrders() {
    return api.get('/sales-orders/pending');
  },
};