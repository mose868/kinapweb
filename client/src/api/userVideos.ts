import { api } from './http';

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: string;
  uploadDate: string;
  channel: {
    name: string;
    avatar: string;
    subscribers: string;
    verified: boolean;
    verificationBadge: string;
  };
  description: string;
  category: string;
  tags: string[];
  likes: number;
  dislikes: number;
  isLive: boolean;
  quality: string;
  isPremium: boolean;
  isSponsored: boolean;
}

export interface UserVideoData {
  userId: string;
  watchLater: VideoData[];
  likedVideos: VideoData[];
  playlists: any[];
  history: VideoData[];
  subscriptions: string[];
  likes: { [videoId: string]: boolean };
  dislikes: { [videoId: string]: boolean };
  comments: { [videoId: string]: string[] };
}

// Get user's video data
export const getUserVideoData = async (
  userId: string
): Promise<UserVideoData> => {
  const response = await api.get(`/user-videos/${userId}`);
  return response.data;
};

// Get playlists (missing function)
export const getPlaylists = async () => {
  try {
    const response = await api.get('/user-videos/playlists');
    return response.data;
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
};

// Add playlist (missing function)
export const addPlaylist = async (playlistData: {
  name: string;
  videos: any[];
}) => {
  try {
    const response = await api.post('/user-videos/playlists', playlistData);
    return response.data;
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
};

// Update video likes/dislikes
export const updateVideoReaction = async (
  userId: string,
  videoId: string,
  action: 'like' | 'unlike' | 'dislike' | 'undislike'
) => {
  const response = await api.post(`/user-videos/${userId}/likes`, {
    videoId,
    action,
  });
  return response.data;
};

// Add comment to video
export const addVideoComment = async (
  userId: string,
  videoId: string,
  comment: string
) => {
  const response = await api.post(`/user-videos/${userId}/comments`, {
    videoId,
    comment,
  });
  return response.data;
};

// Add video to watch history
export const addToHistory = async (userId: string, video: VideoData) => {
  const response = await api.post(`/user-videos/${userId}/history`, { video });
  return response.data;
};

// Add video to watch later
export const addToWatchLater = async (userId: string, video: VideoData) => {
  const response = await api.post(`/user-videos/${userId}/watch-later`, {
    video,
  });
  return response.data;
};

// Remove video from watch later
export const removeFromWatchLater = async (userId: string, videoId: string) => {
  const response = await api.delete(
    `/user-videos/${userId}/watch-later/${videoId}`
  );
  return response.data;
};

// Create playlist
export const createPlaylist = async (
  userId: string,
  name: string,
  description?: string
) => {
  const response = await api.post(`/user-videos/${userId}/playlists`, {
    name,
    description,
  });
  return response.data;
};

// Add video to playlist
export const addToPlaylist = async (
  userId: string,
  playlistId: string,
  video: VideoData
) => {
  const response = await api.post(
    `/user-videos/${userId}/playlists/${playlistId}/videos`,
    {
      video,
    }
  );
  return response.data;
};

// Clear watch history
export const clearHistory = async (userId: string) => {
  const response = await api.delete(`/user-videos/${userId}/history`);
  return response.data;
};

// Get subscriptions (missing function)
export const getSubscriptions = async () => {
  try {
    const response = await api.get('/user-videos/subscriptions');
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }
};

// Get watch later videos (missing function)
export const getWatchLater = async () => {
  try {
    const response = await api.get('/user-videos/watch-later');
    return response.data;
  } catch (error) {
    console.error('Error fetching watch later videos:', error);
    return [];
  }
};

// Get history (proactive)
export const getHistory = async () => {
  try {
    const response = await api.get('/user-videos/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
};

// Get liked videos (proactive)
export const getLikedVideos = async () => {
  try {
    const response = await api.get('/user-videos/liked');
    return response.data;
  } catch (error) {
    console.error('Error fetching liked videos:', error);
    return [];
  }
};

// Get user playlists (proactive, in case of alternate naming)
export const getUserPlaylists = async () => {
  try {
    const response = await api.get('/user-videos/playlists');
    return response.data;
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    return [];
  }
};

// Remove from watch later (missing function)
export const removeWatchLater = async (video: any) => {
  try {
    const response = await api.delete(`/user-videos/watch-later/${video.id}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from watch later:', error);
    throw error;
  }
};

// Remove liked video (missing function)
export const removeLikedVideo = async (video: any) => {
  try {
    const response = await api.delete(`/user-videos/liked/${video.id}`);
    return response.data;
  } catch (error) {
    console.error('Error removing liked video:', error);
    throw error;
  }
};
