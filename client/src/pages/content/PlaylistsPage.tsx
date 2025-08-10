import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlaylists, addPlaylist } from '../../api/userVideos';
const DEFAULT_AVATAR =
  'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

const PlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  async function fetchPlaylists() {
    setLoading(true);
    const data = await getPlaylists();
    setPlaylists(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchPlaylists();
  }, []);

  async function handleCreatePlaylist() {
    if (!newPlaylistName.trim()) return;
    await addPlaylist({ name: newPlaylistName, videos: [] });
    setNewPlaylistName('');
    fetchPlaylists();
  }

  return (
    <div className='min-h-screen bg-white px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-gray-900'>Playlists</h1>
      <div className='mb-6 flex gap-2'>
        <input
          type='text'
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          placeholder='New playlist name'
          className='px-4 py-2 border border-gray-300 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900'
        />
        <button
          onClick={handleCreatePlaylist}
          className='px-6 py-2 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 transition-colors'
        >
          Create
        </button>
      </div>
      {loading ? (
        <div className='text-gray-500 text-lg'>Loading...</div>
      ) : playlists.length === 0 ? (
        <div className='text-gray-500 text-lg'>
          No playlists yet. Create one above!
        </div>
      ) : (
        <div className='space-y-8'>
          {playlists.map((playlist) => (
            <div key={playlist.name}>
              <h2 className='text-xl font-bold text-gray-800 mb-3'>
                {playlist.name}
              </h2>
              {playlist.videos.length === 0 ? (
                <div className='text-gray-400 mb-6'>
                  No videos in this playlist.
                </div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6'>
                  {playlist.videos.map((video) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;
