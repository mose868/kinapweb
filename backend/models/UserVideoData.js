const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  id: String,
  title: String,
  thumbnail: String,
  videoUrl: String,
  duration: String,
  views: String,
  uploadDate: String,
  channel: {
    name: String,
    avatar: String,
    subscribers: String,
    verified: Boolean,
    verificationBadge: String
  },
  description: String,
  category: String,
  tags: [String],
  likes: Number,
  dislikes: Number,
  isLive: Boolean,
  quality: String,
  isPremium: Boolean,
  isSponsored: Boolean
}, { _id: false });

const playlistSchema = new mongoose.Schema({
  name: String,
  videos: [videoSchema]
}, { _id: false });

const userVideoDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  watchLater: [videoSchema],
  likedVideos: [videoSchema],
  playlists: [playlistSchema],
  history: [videoSchema],
  subscriptions: [String] // channel names or IDs
});

module.exports = mongoose.model('UserVideoData', userVideoDataSchema); 