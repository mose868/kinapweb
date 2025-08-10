import React from 'react';
import { Link } from 'react-router-dom';

// Mock data for user's videos (smaller than the large JSON file)
const mockUserVideos = [
  {
    id: '1',
    title: 'How to Build a React App from Scratch',
    thumbnail: 'https://via.placeholder.com/320x180/3B82F6/FFFFFF?text=React+Tutorial',
    duration: '25:15',
    views: '2.1K',
    uploadDate: '1 week ago',
    channel: {
      name: 'Kinap Hub',
      avatar: 'https://ui-avatars.com/api/?name=Kinap+Hub&background=3B82F6&color=fff'
    }
  },
  {
    id: '2',
    title: 'Advanced JavaScript Concepts',
    thumbnail: 'https://via.placeholder.com/320x180/F59E0B/FFFFFF?text=JavaScript+Advanced',
    duration: '32:45',
    views: '1.8K',
    uploadDate: '2 weeks ago',
    channel: {
      name: 'Kinap Hub',
      avatar: 'https://ui-avatars.com/api/?name=Kinap+Hub&background=3B82F6&color=fff'
    }
  },
  {
    id: '3',
    title: 'CSS Grid Layout Masterclass',
    thumbnail: 'https://via.placeholder.com/320x180/10B981/FFFFFF?text=CSS+Grid',
    duration: '18:30',
    views: '956',
    uploadDate: '3 weeks ago',
    channel: {
      name: 'Kinap Hub',
      avatar: 'https://ui-avatars.com/api/?name=Kinap+Hub&background=3B82F6&color=fff'
    }
  }
];

const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

// For demo, show videos where channel.name is 'Kinap Hub' (replace with real user channel in production)
const myChannelName = 'Kinap Hub';
const myVideos = mockUserVideos.filter(
  (video) => video.channel.name === myChannelName
);

const YourVideosPage = () => (
  <div className='min-h-screen bg-white px-4 py-8'>
    <h1 className='text-3xl font-bold mb-6 text-gray-900'>Your Videos</h1>
    {myVideos.length === 0 ? (
      <div className='text-gray-500 text-lg'>
        You have not uploaded any videos yet.
      </div>
    ) : (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {myVideos.map((video) => (
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
  </div>
);

export default YourVideosPage;
