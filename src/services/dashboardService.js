import api from './api';

export const dashboardService = {
  getDashboardStats(timeRange = 'week') {
    return api.get('/dashboard', { params: { range: timeRange } });
  },

  getSalesData(startDate, endDate) {
    return api.get('/dashboard/sales', { params: { startDate, endDate } });
  },

  getRecentTransactions() {
    return api.get('/dashboard/transactions');
  },

  getLowStockAlerts() {
    return api.get('/dashboard/low-stock');
  },
};