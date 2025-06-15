const express = require('express');
const { protect } = require('../middleware/auth');
const chatController = require('../controllers/chatController');
const { validateMessage } = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Protect all routes
router.use(protect);

// Apply rate limiting to all routes
router.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Get recent messages
router.get('/messages', chatController.getRecentMessages);

// Delete message
router.delete('/messages/:messageId', chatController.deleteMessage);

// Toggle reaction on message
router.post('/messages/:messageId/react', 
  validateMessage.reaction,
  chatController.toggleReaction
);

// Get chat statistics
router.get('/stats', chatController.getStats);

module.exports = router; 