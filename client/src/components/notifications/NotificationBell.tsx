import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import { Bell, MessageSquare, Package, Star, DollarSign, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'order' | 'review' | 'payment' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: any;
}

const NotificationBell = () => {
  const { user } = useBetterAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock notifications data
  const { data: notifications } = useQuery(
    ['notifications', user?.id],
    async () => {
      if (!user) return [];

      // Return mock notifications for now
      return [
        {
          id: '1',
          userId: user.id,
          type: 'message' as const,
          title: 'New message from Sarah',
          message: 'Hey! I loved your portfolio work. Can we discuss a project?',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
        },
        {
          id: '2',
          userId: user.id,
          type: 'order' as const,
          title: 'Order completed',
          message: 'Your graphic design project has been delivered successfully.',
          isRead: false,
          createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
        },
        {
          id: '3',
          userId: user.id,
          type: 'review' as const,
          title: 'New review received',
          message: 'Michael gave you a 5-star review for web development.',
          isRead: true,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
        }
      ];
    },
    {
      enabled: !!user,
      refetchInterval: 120000, // Refetch every 2 minutes instead of 30 seconds
      staleTime: 60000, // Consider data fresh for 1 minute
      cacheTime: 300000, // Keep in cache for 5 minutes
    }
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-red-500" />;
      case 'order':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'review':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'system':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications?.length || 0;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            {notifications?.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-600">
                No new notifications
              </div>
            ) : (
              notifications?.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.link || '/notifications'}
                  onClick={() => setIsOpen(false)}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm font-medium text-ajira-primary hover:text-ajira-primary-dark"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell; 