import { mockApiCall } from './apiClient';
import { initialNotifications } from '../data/mockData';

export const notificationService = {
  async getNotifications() {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_notifs_data');
      return stored ? JSON.parse(stored) : initialNotifications;
    });
  },

  async markAsRead(id) {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_notifs_data');
      let list = stored ? JSON.parse(stored) : [...initialNotifications];
      list = list.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem('dropout_notifs_data', JSON.stringify(list));
      return list;
    });
  },

  async markAllAsRead() {
    return mockApiCall(() => {
      const stored = localStorage.getItem('dropout_notifs_data');
      let list = stored ? JSON.parse(stored) : [...initialNotifications];
      list = list.map(n => ({ ...n, read: true }));
      localStorage.setItem('dropout_notifs_data', JSON.stringify(list));
      return list;
    });
  }
};
