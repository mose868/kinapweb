import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Notification } from '../types/marketplace';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Subscribe to notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    // Placeholder for the removed firebase logic
    const newNotifications = [];
    setNotifications(newNotifications);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (notificationId: string) => {
    // Placeholder for the removed firebase logic
    console.error('Error marking notification as read:');
    throw new Error('Mark as read functionality not implemented');
  };

  const markAllAsRead = async () => {
    // Placeholder for the removed firebase logic
    console.error('Error marking all notifications as read:');
    throw new Error('Mark all as read functionality not implemented');
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 