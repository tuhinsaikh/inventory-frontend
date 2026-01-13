import api from './api';

export const aiService = {
  intelligentSearch(query) {
    return api.get('/ai/search', { params: { query } });
  },

  getProductRecommendations(productId) {
    return api.get(`/ai/recommendations/${productId}`);
  },

  naturalLanguageQuery(question) {
    return api.get('/ai/query', { params: { question } });
  },

  forecastDemand(productId, days = 30) {
    return api.get(`/ai/forecast/${productId}`, { params: { days } });
  },

  getReorderRecommendations() {
    return api.get('/ai/reorder-recommendations');
  },
};