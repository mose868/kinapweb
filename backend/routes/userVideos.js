const express = require('express');
const multer = require('multer');
const path = require('path');
const UserVideoData = require('../models/UserVideoData');
const router = express.Router();

// Multer setup for video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Helper: get or create user data
async function getUserData(userId) {
  let data = await UserVideoData.findOne({ userId });
  if (!data) {
    data = await UserVideoData.create({ userId, watchLater: [], likedVideos: [], playlists: [], history: [], subscriptions: [] });
  }
  return data;
}

// GET all watch later
router.get('/watch-later', async (req, res) => {
  const { userId } = req.query;
  const data = await getUserData(userId);
  res.json(data.watchLater);
});

// POST add/remove watch later
router.post('/watch-later', async (req, res) => {
  const { userId, video, action } = req.body;
  const data = await getUserData(userId);
  if (action === 'add') {
    data.watchLater = data.watchLater.filter(v => v.id !== video.id);
    data.watchLater.unshift(video);
  } else if (action === 'remove') {
    data.watchLater = data.watchLater.filter(v => v.id !== video.id);
  }
  await data.save();
  res.json(data.watchLater);
});

// GET all liked videos
router.get('/liked', async (req, res) => {
  const { userId } = req.query;
  const data = await getUserData(userId);
  res.json(data.likedVideos);
});

// POST add/remove liked video
router.post('/liked', async (req, res) => {
  const { userId, video, action } = req.body;
  const data = await getUserData(userId);
  if (action === 'add') {
    data.likedVideos = data.likedVideos.filter(v => v.id !== video.id);
    data.likedVideos.unshift(video);
  } else if (action === 'remove') {
    data.likedVideos = data.likedVideos.filter(v => v.id !== video.id);
  }
  await data.save();
  res.json(data.likedVideos);
});

// GET all history
router.get('/history', async (req, res) => {
  const { userId } = req.query;
  const data = await getUserData(userId);
  res.json(data.history);
});

// POST add to history
router.post('/history', async (req, res) => {
  const { userId, video } = req.body;
  const data = await getUserData(userId);
  data.history = data.history.filter(v => v.id !== video.id);
  data.history.unshift(video);
  if (data.history.length > 100) data.history = data.history.slice(0, 100);
  await data.save();
  res.json(data.history);
});

// GET all playlists
router.get('/playlists', async (req, res) => {
  const { userId } = req.query;
  const data = await getUserData(userId);
  res.json(data.playlists);
});

// POST create/update/delete playlist
router.post('/playlists', async (req, res) => {
  const { userId, playlist, action } = req.body;
  const data = await getUserData(userId);
  if (action === 'add') {
    data.playlists.push(playlist);
  } else if (action === 'update') {
    data.playlists = data.playlists.map(p => p.name === playlist.name ? playlist : p);
  } else if (action === 'delete') {
    data.playlists = data.playlists.filter(p => p.name !== playlist.name);
  }
  await data.save();
  res.json(data.playlists);
});

// GET all subscriptions
router.get('/subscriptions', async (req, res) => {
  const { userId } = req.query;
  const data = await getUserData(userId);
  res.json(data.subscriptions);
});

// POST add/remove subscription
router.post('/subscriptions', async (req, res) => {
  const { userId, channel, action } = req.body;
  const data = await getUserData(userId);
  if (action === 'add') {
    if (!data.subscriptions.includes(channel)) data.subscriptions.push(channel);
  } else if (action === 'remove') {
    data.subscriptions = data.subscriptions.filter(c => c !== channel);
  }
  await data.save();
  res.json(data.subscriptions);
});

// POST /upload - upload a video file and metadata
router.post('/upload', upload.single('videoFile'), async (req, res) => {
  const { userId, title, description, thumbnail, duration } = req.body;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No video file uploaded' });
  const video = {
    id: file.filename,
    title,
    thumbnail: thumbnail || '',
    videoUrl: `/uploads/${file.filename}`,
    duration: duration || '',
    views: '0',
    uploadDate: new Date().toISOString(),
    channel: {
      name: userId,
      avatar: '',
      subscribers: '',
      verified: false,
      verificationBadge: null
    },
    description,
    category: '',
    tags: [],
    likes: 0,
    dislikes: 0,
    isLive: false,
    quality: 'HD',
    isPremium: false,
    isSponsored: false
  };
  let data = await UserVideoData.findOne({ userId });
  if (!data) {
    data = await UserVideoData.create({ userId, watchLater: [], likedVideos: [], playlists: [], history: [], subscriptions: [], yourVideos: [] });
  }
  // Add to user's videos (for demo, use history for now)
  data.history = data.history || [];
  data.history.unshift(video);
  await data.save();
  res.json(video);
});

module.exports = router; 