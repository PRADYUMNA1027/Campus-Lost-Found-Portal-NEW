import api from './api';

export const notificationService = {
  // Fetch notifications for currently logged in user
  async getNotifications() {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (err) {
      console.error('GET /notifications failed:', err);
      throw err;
    }
  },

  // Mark notification as read (PUT /api/notifications/{id}/read)
  async markAsRead(id) {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (err) {
      console.error(`PUT /notifications/${id}/read failed:`, err);
      throw err;
    }
  }
};
