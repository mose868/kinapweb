const express = require('express');
const { protect } = require('../middleware/auth');
const communityController = require('../controllers/communityController');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Public route to fetch posts
router.get('/', communityController.getPosts);

// Protect all routes below
router.use(protect);
router.use(rateLimiter());

// Create post
router.post('/', communityController.createPost);

// Toggle like
router.post('/:postId/like', communityController.toggleLike);

// Add comment
router.post('/:postId/comment', communityController.addComment);

module.exports = router; 