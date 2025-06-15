const Message = require('../models/Message');
const logger = require('../utils/logger');
const { sanitizeMessage } = require('../utils/sanitizer');

// Get recent messages
exports.getRecentMessages = async (req, res) => {
  try {
    const { room = 'main', limit = 50 } = req.query;
    const messages = await Message.getRecent(room, parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { messages }
    });
  } catch (error) {
    logger.error('Error fetching recent messages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch messages'
    });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    // Check if user has permission to delete
    if (!message.canDelete(req.user._id, req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this message'
      });
    }

    // Soft delete
    message.isDeleted = true;
    message.deletedBy = req.user._id;
    await message.save();

    // Notify connected clients through socket
    const io = require('../services/socket').getIO();
    io.to('main').emit('message:deleted', { messageId });

    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting message:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete message'
    });
  }
};

// Add reaction to message
exports.toggleReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    // Validate emoji
    if (!['👍', '❤️', '🚀'].includes(emoji)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid reaction emoji'
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    await message.toggleReaction(req.user._id, emoji);

    // Notify connected clients
    const io = require('../services/socket').getIO();
    io.to('main').emit('message:reaction', {
      messageId,
      reactions: message.reactions
    });

    res.status(200).json({
      status: 'success',
      data: { reactions: message.reactions }
    });
  } catch (error) {
    logger.error('Error toggling reaction:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to toggle reaction'
    });
  }
};

// Get message statistics
exports.getStats = async (req, res) => {
  try {
    const stats = await Message.aggregate([
      {
        $match: { isDeleted: false }
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          totalReactions: { $sum: { $size: '$reactions' } },
          uniqueUsers: { $addToSet: '$user' }
        }
      },
      {
        $project: {
          _id: 0,
          totalMessages: 1,
          totalReactions: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: stats[0] || {
        totalMessages: 0,
        totalReactions: 0,
        uniqueUsers: 0
      }
    });
  } catch (error) {
    logger.error('Error fetching chat statistics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch chat statistics'
    });
  }
}; 