import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialNotifications } from '../data/mockData';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    const load = async () => {
      const list = await notificationService.getNotifications();
      setNotifications(list);
    };
    load();
  }, []);

  const markAsRead = async (id) => {
    const updated = await notificationService.markAsRead(id);
    setNotifications(updated);
  };

  const markAllAsRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
}
