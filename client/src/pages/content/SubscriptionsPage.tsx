import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubscriptions } from '../../api/userVideos';
import onlineWorkVideos from '../../../../online_work_videos.json';
const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchSubscriptions() {
    setLoading(true);
    const data = await getSubscriptions();
    setSubscriptions(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Get all videos from subscribed channels
  const subscribedVideos = onlineWorkVideos.filter((video) =>
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
                    onlineWorkVideos.find((v) => v.channel.name === channel)
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
