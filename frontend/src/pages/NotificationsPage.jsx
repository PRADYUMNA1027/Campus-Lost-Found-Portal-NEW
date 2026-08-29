import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import NotificationCard from '../components/notifications/NotificationCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiBell, FiCheckCircle } from 'react-icons/fi';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unreadList = notifications.filter((n) => !n.read_status);
      await Promise.all(unreadList.map((n) => notificationService.markAsRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read_status: true })));
    } catch (err) {
      console.error('Error marking all notifications read:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read_status).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Updates on submitted claims, found item matches, and return receipts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-xl"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchNotifications} />}

      {/* Notifications List */}
      {loading ? (
        <LoadingSpinner message="Fetching user notifications..." />
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-500 text-sm">
          No notifications yet.
        </div>
      )}

    </div>
  );
};

export default NotificationsPage;
