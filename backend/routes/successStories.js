const express = require('express');
const router = express.Router();
const SuccessStory = require('../models/SuccessStory');

// GET all stories
router.get('/', async (req, res) => {
  try {
    const { tag, featured, search } = req.query;
    let filter = {};
    if (tag) filter.tags = tag;
    if (featured) filter.featured = featured === 'true';
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { authorName: { $regex: search, $options: 'i' } }
    ];
    const stories = await SuccessStory.find(filter).sort({ date: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const story = await SuccessStory.findById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const story = await SuccessStory.create(req.body);
    res.status(201).json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!story) return res.status(404).json({ error: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST like
router.post('/:id/like', async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    if (!story) return res.status(404).json({ error: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST comment
router.post('/:id/comment', async (req, res) => {
  try {
    const { user, comment } = req.body;
    if (!user || !comment) return res.status(400).json({ error: 'User and comment required' });
    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user, comment } } },
      { new: true }
    );
    if (!story) return res.status(404).json({ error: 'Not found' });
    res.json(story);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 