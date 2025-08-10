import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubscriptions } from '../../api/userVideos';

// Mock data for subscriptions (smaller than the large JSON file)
const mockVideos = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    thumbnail: 'https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Web+Dev',
    duration: '15:30',
    views: '1.2K',
    uploadDate: '2 days ago',
    channel: {
      name: 'Web Development Pro',
      avatar: 'https://ui-avatars.com/api/?name=Web+Dev&background=4F46E5&color=fff'
    }
  },
  {
    id: '2',
    title: 'AI and Machine Learning Basics',
    thumbnail: 'https://via.placeholder.com/320x180/10B981/FFFFFF?text=AI+ML',
    duration: '22:15',
    views: '3.4K',
    uploadDate: '1 week ago',
    channel: {
      name: 'AI Learning Hub',
      avatar: 'https://ui-avatars.com/api/?name=AI+Hub&background=10B981&color=fff'
    }
  },
  {
    id: '3',
    title: 'Project Management Fundamentals',
    thumbnail: 'https://via.placeholder.com/320x180/F59E0B/FFFFFF?text=PM+Fundamentals',
    duration: '18:45',
    views: '856',
    uploadDate: '3 days ago',
    channel: {
      name: 'Project Management Pro',
      avatar: 'https://ui-avatars.com/api/?name=PM+Pro&background=F59E0B&color=fff'
    }
  }
];

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchSubscriptions() {
    setLoading(true);
    try {
      const data = await getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      // Fallback to mock subscriptions if API fails
      setSubscriptions(['Web Development Pro', 'AI Learning Hub']);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Get all videos from subscribed channels
  const subscribedVideos = mockVideos.filter((video) =>
    subscriptions.includes(video.channel.name)
  );

  return (
    <div className='min-h-screen bg-white px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900'>Subscriptions</h1>
      {loading ? (
        <div className='text-gray-500 text-lg'>Loading...</div>
      ) : subscriptions.length === 0 ? (
        <div className='text-gray-500 text-lg'>
          You have not subscribed to any channels yet.
        </div>
      ) : (
        <>
          <div className='mb-6 flex flex-wrap gap-4'>
            {subscriptions.map((channel) => (
              <div
                key={channel}
                className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full'
              >
                <img
                  src={
                    mockVideos.find((v) => v.channel.name === channel)
                      ?.channel.avatar || DEFAULT_AVATAR
                  }
                  alt={channel}
                  className='w-6 h-6 rounded-full'
                />
                <span className='text-sm font-medium text-gray-800'>
                  {channel}
                </span>
              </div>
            ))}
          </div>
          {subscribedVideos.length === 0 ? (
            <div className='text-gray-400'>
              No videos from your subscriptions yet.
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {subscribedVideos.map((video) => (
                <Link
                  to={`/videos/${video.id}`}
                  key={video.id}
                  className='bg-white rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group'
                >
                  <div className='relative aspect-video w-full bg-gray-200'>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                    />
                    <span className='absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded'>
                      {video.duration}
                    </span>
                  </div>
                  <div className='p-4'>
                    <h3 className='font-semibold text-gray-900 text-base mb-1 line-clamp-2'>
                      {video.title}
                    </h3>
                    <div className='flex items-center gap-2 mb-1'>
                      <img
                        src={video.channel.avatar || DEFAULT_AVATAR}
                        alt={video.channel.name}
                        className='w-6 h-6 rounded-full'
                      />
                      <span className='text-xs text-gray-700 font-medium'>
                        {video.channel.name}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-xs text-gray-500'>
                      <span>{video.views}</span>
                      <span>•</span>
                      <span>{video.uploadDate}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubscriptionsPage;
