import api from './api';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

export const notificationService = {
  // Fetch notifications for currently logged in user
  async getNotifications() {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (err) {
      console.warn('GET /notifications failed or unauthenticated, fallback to mock:', err);
      return MOCK_NOTIFICATIONS;
    }
  },

  // Mark notification as read (PUT /api/notifications/{id}/read)
  async markAsRead(id) {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (err) {
      console.warn(`PUT /notifications/${id}/read failed, handling locally:`, err);
      return { id, read_status: true };
    }
  }
};
