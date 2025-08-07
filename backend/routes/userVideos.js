const express = require('express');
const router = express.Router();
const UserVideoData = require('../models/UserVideoData');

// Get user's video data (likes, dislikes, comments, history, playlists)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let userVideoData = await UserVideoData.findOne({ userId });
    
    if (!userVideoData) {
      // Create new user video data if it doesn't exist
      userVideoData = await UserVideoData.create({
        userId,
        watchLater: [],
        likedVideos: [],
        playlists: [],
        history: [],
        subscriptions: [],
        likes: {},
        dislikes: {},
        comments: {}
      });
    }
    
    res.json(userVideoData);
  } catch (error) {
    console.error('Get user video data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update video likes/dislikes
router.post('/:userId/likes', async (req, res) => {
  try {
    const { userId } = req.params;
    const { videoId, action } = req.body; // action: 'like', 'unlike', 'dislike', 'undislike'
    
    let userVideoData = await UserVideoData.findOne({ userId });
    if (!userVideoData) {
      userVideoData = await UserVideoData.create({ userId, likes: {}, dislikes: {} });
    }
    
    if (!userVideoData.likes) userVideoData.likes = {};
    if (!userVideoData.dislikes) userVideoData.dislikes = {};
    
    switch (action) {
      case 'like':
        userVideoData.likes[videoId] = true;
        userVideoData.dislikes[videoId] = false;
        break;
      case 'unlike':
        userVideoData.likes[videoId] = false;
        break;
      case 'dislike':
        userVideoData.dislikes[videoId] = true;
        userVideoData.likes[videoId] = false;
        break;
      case 'undislike':
        userVideoData.dislikes[videoId] = false;
        break;
    }
    
    await userVideoData.save();
    res.json({ success: true, likes: userVideoData.likes, dislikes: userVideoData.dislikes });
  } catch (error) {
    console.error('Update likes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to video
router.post('/:userId/comments', async (req, res) => {
  try {
    const { userId } = req.params;
    const { videoId, comment } = req.body;
    
    let userVideoData = await UserVideoData.findOne({ userId });
    if (!userVideoData) {
      userVideoData = await UserVideoData.create({ userId, comments: {} });
    }
    
    if (!userVideoData.comments) userVideoData.comments = {};
    if (!userVideoData.comments[videoId]) userVideoData.comments[videoId] = [];
    
    userVideoData.comments[videoId].push({
      text: comment,
      timestamp: new Date(),
      userId: userId
    });
    
    await userVideoData.save();
    res.json({ success: true, comments: userVideoData.comments[videoId] });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add video to watch history
router.post('/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;
    const { video } = req.body;
    
    let userVideoData = await UserVideoData.findOne({ userId });
    if (!userVideoData) {
      userVideoData = await UserVideoData.create({ userId, history: [] });
    }
    
    // Remove if already exists to avoid duplicates
    userVideoData.history = userVideoData.history.filter(v => v.id !== video.id);
    
    // Add to beginning of history
    userVideoData.history.unshift({
      ...video,
      watchedAt: new Date()
    });
    
    // Keep only last 100 videos in history
    if (userVideoData.history.length > 100) {
      userVideoData.history = userVideoData.history.slice(0, 100);
    }
    
    await userVideoData.save();
    res.json({ success: true, history: userVideoData.history });
  } catch (error) {
    console.error('Add to history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add video to watch later
router.post('/:userId/watch-later', async (req, res) => {
  try {
    const { userId } = req.params;
    const { video } = req.body;
    
    let userVideoData = await UserVideoData.findOne({ userId });
    if (!userVideoData) {
      userVideoData = await UserVideoData.create({ userId, watchLater: [] });
    }
    
    // Check if video already exists
    const exists = userVideoData.watchLater.find(v => v.id === video.id);
    if (!exists) {
      userVideoData.watchLater.push({
        ...video,
        addedAt: new Date()
      });
      await userVideoData.save();
    }
    
    res.json({ success: true, watchLater: userVideoData.watchLater });
  } catch (error) {
    console.error('Add to watch later error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove video from watch later
router.delete('/:userId/watch-later/:videoId', async (req, res) => {
  try {
    const { userId, videoId } = req.params;
    
    let userVideoData = await UserVideoData.findOne({ userId });
    if (userVideoData) {
      userVideoData.watchLater = userVideoData.watchLater.filter(v => v.id !== videoId);
      await userVideoData.save();
    }
    
    res.json({ success: true, watchLater: userVideoData?.watchLater || [] });
  } catch (error) {
    console.error('Remove from watch later error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create playlist
router.post('/:userId/playlists', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, description = '' } = req.body;
    
    let userVideoData = await UserVideoData.findOne({ userId });
    if (!userVideoData) {
      userVideoData = await UserVideoData.create({ userId, playlists: [] });
    }
    
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      description,
      videos: [],
      createdAt: new Date()
    };
    
    userVideoData.playlists.push(newPlaylist);
    await userVideoData.save();
    
    res.json({ success: true, playlist: newPlaylist });
  } catch (error) {
    console.error('Create playlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add video to playlist
router.post('/:userId/playlists/:playlistId/videos', async (req, res) => {
  try {
    const { userId, playlistId } = req.params;
    const { video } = req.body;
    
    let userVideoData = await UserVideoData.findOne({ userId });
    if (userVideoData) {
      const playlist = userVideoData.playlists.find(p => p.id === playlistId);
      if (playlist) {
        // Check if video already exists in playlist
        const exists = playlist.videos.find(v => v.id === video.id);
        if (!exists) {
          playlist.videos.push({
            ...video,
            addedAt: new Date()
          });
          await userVideoData.save();
        }
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Add to playlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Clear watch history
router.delete('/:userId/history', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let userVideoData = await UserVideoData.findOne({ userId });
    if (userVideoData) {
      userVideoData.history = [];
      await userVideoData.save();
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Clear history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 