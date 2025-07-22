const express = require('express');
const multer = require('multer');
const path = require('path');
const Video = require('../models/Video');

const router = express.Router();

// ========= Multer setup for direct uploads =========
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads', 'videos'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ================= PUBLIC ROUTES =================

// GET   /api/videos?search=&category=&limit=&skip=
router.get('/', async (req, res) => {
  try {
    const { search, category, limit = 20, skip = 0 } = req.query;
    let query = { status: 'Published' };
    if (category && category !== 'all') query.category = category;

    if (search) query.$text = { $search: search };

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Video.countDocuments(query);

    res.json({
      videos,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/videos/:id (or slug)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let video;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      video = await Video.findById(id);
    } else {
      video = await Video.findOne({ slug: id });
    }
    if (!video) return res.status(404).json({ message: 'Video not found' });

    // increment views
    await video.incrementViews();

    res.json(video);
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================= ADMIN ROUTES =================
// NOTE: Replace the dummy isAdmin check with real authentication/authorization middleware.
const isAdmin = (req, res, next) => {
  // TODO: integrate proper auth
  next();
};

// POST /api/videos  (youtube link or uploaded file)
router.post('/', isAdmin, upload.single('videoFile'), async (req, res) => {
  try {
    const {
      title,
      description,
      videoType = 'youtube',
      youtubeUrl,
      category,
      tags = []
    } = req.body;

    let newVideo = new Video({
      title,
      description,
      videoType,
      youtubeUrl: videoType === 'youtube' ? youtubeUrl : undefined,
      videoUrl: videoType === 'upload' && req.file ? `/uploads/videos/${req.file.filename}` : undefined,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()),
      uploadedBy: req.user ? req.user.email : 'admin' // adjust accordingly
    });

    await newVideo.save();
    res.status(201).json({ message: 'Video created', video: newVideo });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/videos/:id
router.put('/:id', isAdmin, upload.single('videoFile'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      updates.videoType = 'upload';
      updates.videoUrl = `/uploads/videos/${req.file.filename}`;
    }

    const updatedVideo = await Video.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedVideo) return res.status(404).json({ message: 'Video not found' });

    res.json({ message: 'Video updated', video: updatedVideo });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/videos/:id
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video deleted' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 