import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWatchLater, removeWatchLater } from '../../api/userVideos';
const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

const WatchLaterPage = () => {
  const [watchLater, setWatchLater] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchWatchLater() {
    setLoading(true);
    const data = await getWatchLater();
    setWatchLater(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchWatchLater();
  }, []);

  async function handleRemove(video) {
    await removeWatchLater(video);
    fetchWatchLater();
  }

  return (
    <div className='min-h-screen bg-white px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900'>Watch Later</h1>
      {loading ? (
        <div className='text-gray-500 text-lg'>Loading...</div>
      ) : watchLater.length === 0 ? (
        <div className='text-gray-500 text-lg'>No videos in Watch Later.</div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {watchLater.map((video) => (
            <div
              key={video.id}
              className='bg-white rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group relative'
            >
              <Link to={`/videos/${video.id}`}>
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
              <button
                onClick={() => handleRemove(video)}
                className='absolute top-2 right-2 bg-white text-gray-700 rounded-full p-1 shadow hover:bg-red-100 hover:text-red-600 transition-colors'
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchLaterPage;
