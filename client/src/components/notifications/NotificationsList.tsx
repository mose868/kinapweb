import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  MessageSquare,
  Package,
  Star,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import type { Notification } from '../../types/marketplace';

const ITEMS_PER_PAGE = 10;

const NotificationsList = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter] = useState<Notification['type'] | 'all' | 'unread'>('all');

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNotifications = filteredNotifications.slice(
    startIndex,
    endIndex
  );

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className='w-5 h-5 text-red-500' />;
      case 'order':
        return <Package className='w-5 h-5 text-green-500' />;
      case 'review':
        return <Star className='w-5 h-5 text-yellow-500' />;
      case 'payment':
        return <DollarSign className='w-5 h-5 text-emerald-500' />;
      case 'system':
        return <AlertCircle className='w-5 h-5 text-red-500' />;
    }
  };

  return (
    <div>
      {/* Actions */}
      <div className='flex justify-between items-center mb-6'>
        <div className='text-sm text-gray-600'>
          {filteredNotifications.length} notifications
        </div>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={() => markAllAsRead()}
            className='text-sm text-ajira-primary hover:text-ajira-primary-dark'
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className='space-y-4'>
        {currentNotifications.length === 0 ? (
          <div className='text-center py-8 text-gray-600'>
            No notifications found
          </div>
        ) : (
          currentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg border p-4 transition-colors ${
                !notification.isRead ? 'bg-red-50' : ''
              }`}
            >
              <div className='flex items-start gap-3'>
                {getNotificationIcon(notification.type)}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='font-medium text-gray-900'>
                        {notification.title}
                      </p>
                      <p className='text-gray-600 mt-1'>
                        {notification.message}
                      </p>
                    </div>
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className={`text-sm ${
                        notification.isRead
                          ? 'text-gray-400'
                          : 'text-ajira-primary hover:text-ajira-primary-dark'
                      }`}
                    >
                      {notification.isRead ? 'Read' : 'Mark as read'}
                    </button>
                  </div>
                  <div className='flex items-center justify-between mt-2'>
                    <p className='text-sm text-gray-500'>
                      {formatDistanceToNow(notification.createdAt.toDate(), {
                        addSuffix: true,
                      })}
                    </p>
                    {notification.link && (
                      <Link
                        to={notification.link}
                        className='text-sm text-ajira-primary hover:text-ajira-primary-dark'
                      >
                        View details
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-8 gap-2'>
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className='px-3 py-1 rounded border text-sm disabled:opacity-50'
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === page
                  ? 'bg-ajira-primary text-white'
                  : 'border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
            className='px-3 py-1 rounded border text-sm disabled:opacity-50'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
