const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const Client = require('../models/Client');

// Upload a new video
router.post('/upload', async (req, res) => {
  try {
    const { title, description, url, thumbnail, uploadedBy } = req.body;
    if (!title || !url || !uploadedBy) {
      return res.status(400).json({ message: 'Title, video URL, and uploader are required.' });
    }
    // Optionally, check if uploadedBy is a valid client
    const client = await Client.findById(uploadedBy);
    if (!client) {
      return res.status(404).json({ message: 'Uploader not found.' });
    }
    const video = new Video({ title, description, url, thumbnail, uploadedBy });
    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully.', video });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get all videos (YouTube-style feed)
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get a single video by ID and increment view count
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('uploadedBy', 'name email');
    if (!video) {
      return res.status(404).json({ message: 'Video not found.' });
    }
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 