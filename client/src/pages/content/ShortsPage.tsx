import React from 'react';
import onlineWorkVideos from '../../../../online_work_videos.json';
const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

function isShort(video) {
  // Shorts are videos with duration less than 1 minute (format: mm:ss or ss)
  if (!video.duration) return false;
  const parts = video.duration.split(':').map(Number);
  if (parts.length === 1) return parts[0] < 60;
  if (parts.length === 2) return parts[0] === 0 && parts[1] < 60;
  return false;
}

const shorts = onlineWorkVideos.filter(isShort);

const ShortsPage = () => (
  <div className='min-h-screen bg-white px-4 py-8'>
    <h1 className='text-3xl font-bold mb-6 text-gray-900'>Shorts</h1>
    {shorts.length === 0 ? (
      <div className='text-gray-500 text-lg'>No shorts found.</div>
    ) : (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
        {shorts.map((video) => (
          <div
            key={video.id}
            className='bg-white rounded-xl shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group'
          >
            <div className='relative aspect-[9/16] w-full bg-gray-200'>
              <img
                src={video.thumbnail}
                alt={video.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform'
              />
              <span className='absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded'>
                {video.duration}
              </span>
            </div>
            <div className='p-2'>
              <h3 className='font-semibold text-gray-900 text-sm mb-1 line-clamp-2'>
                {video.title}
              </h3>
              <div className='flex items-center gap-2 mb-1'>
                <img
                  src={video.channel.avatar || DEFAULT_AVATAR}
                  alt={video.channel.name}
                  className='w-5 h-5 rounded-full'
                />
                <span className='text-xs text-gray-700 font-medium'>
                  {video.channel.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ShortsPage;
