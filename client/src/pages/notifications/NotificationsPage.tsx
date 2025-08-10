import { useState } from 'react';
import { NotificationsList } from '../../components/notifications';
import { Bell } from 'lucide-react';

type NotificationFilter =
  | 'all'
  | 'unread'
  | 'message'
  | 'order'
  | 'review'
  | 'payment'
  | 'system';

const NotificationsPage = () => {
  const [filter, setFilter] = useState<NotificationFilter>('all');

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center gap-3'>
          <Bell className='w-8 h-8 text-ajira-primary' />
          <h1 className='text-2xl font-bold text-gray-900'>Notifications</h1>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all'
                ? 'bg-ajira-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'unread'
                ? 'bg-ajira-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('message')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'message'
                ? 'bg-ajira-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setFilter('order')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'order'
                ? 'bg-ajira-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setFilter('review')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'review'
                ? 'bg-ajira-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setFilter('payment')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'payment'
                ? 'bg-ajira-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'system'
                ? 'bg-ajira-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <NotificationsList />
      </div>
    </div>
  );
};

export default NotificationsPage;
