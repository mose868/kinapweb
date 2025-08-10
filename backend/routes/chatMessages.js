const express = require('express');
const mongoose = require('mongoose');
const ChatMessage = require('../models/ChatMessage');
const router = express.Router();

// Get all messages for a specific group
router.get('/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // If DB not connected, return empty list gracefully
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        messages: [],
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: false,
        },
      });
    }

    const messages = await ChatMessage.getGroupMessages(
      groupId,
      parseInt(limit),
      parseInt(offset)
    );
    
    res.json({
      success: true,
      messages: messages,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: messages.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching group messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// Save a new message
router.post('/', async (req, res) => {
  try {
    const {
      messageId,
      groupId,
      userId,
      userName,
      userAvatar,
      message,
      content,
      messageType = 'text',
      status = 'sent',
      mediaUrl,
      fileName,
      fileSize,
      fileType,
      duration,
      replyTo,
      isAIMessage = false,
      userProfile
    } = req.body;

    // Validate required fields
    if (!messageId || !groupId || !userId || !userName || !message || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // If DB not connected, acknowledge receipt without persisting to avoid 500
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: 'Message accepted (offline mode, not persisted)',
        data: {
          messageId,
          groupId,
          userId,
          userName,
          userAvatar: userAvatar || 'https://via.placeholder.com/40',
          message,
          content,
          messageType,
          status,
          mediaUrl,
          fileName,
          fileSize,
          fileType,
          duration,
          replyTo,
          isAIMessage,
          userProfile,
          timestamp: new Date().toISOString(),
        },
      });
    }

    const newMessage = new ChatMessage({
      messageId,
      groupId,
      userId,
      userName,
      userAvatar: userAvatar || 'https://via.placeholder.com/40',
      message,
      content,
      messageType,
      status,
      mediaUrl,
      fileName,
      fileSize,
      fileType,
      duration,
      replyTo,
      isAIMessage,
      userProfile
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      data: savedMessage
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save message',
      error: error.message
    });
  }
});

// Update message status (e.g., mark as read)
router.patch('/:messageId/status', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    const message = await ChatMessage.findOne({ messageId, isDeleted: false });
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.status = status;
    await message.save();

    res.json({
      success: true,
      message: 'Message status updated',
      data: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status',
      error: error.message
    });
  }
});

// Soft delete a message
router.delete('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const message = await ChatMessage.findOne({ messageId, isDeleted: false });
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user can delete this message (sender or admin)
    if (message.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    await message.softDelete(userId);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: error.message
    });
  }
});

// Delete all messages for a group
router.delete('/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    // Check if user has permission to delete group messages
    // This could be enhanced with admin checks
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const result = await ChatMessage.deleteGroupMessages(groupId);

    res.json({
      success: true,
      message: 'All group messages deleted successfully',
      deletedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error deleting group messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete group messages',
      error: error.message
    });
  }
});

// Get recent messages for all groups (for sidebar)
router.get('/recent', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const recentMessages = await ChatMessage.getRecentMessages(parseInt(limit));
    
    res.json({
      success: true,
      messages: recentMessages
    });
  } catch (error) {
    console.error('Error fetching recent messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent messages',
      error: error.message
    });
  }
});

// Get message statistics for a group
router.get('/group/:groupId/stats', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const stats = await ChatMessage.getMessageStats(groupId);
    
    res.json({
      success: true,
      stats: stats[0] || {
        totalMessages: 0,
        aiMessages: 0,
        userMessages: 0,
        firstMessage: null,
        lastMessage: null
      }
    });
  } catch (error) {
    console.error('Error fetching message stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message statistics',
      error: error.message
    });
  }
});

// Search messages in a group
router.get('/group/:groupId/search', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { query, limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const messages = await ChatMessage.find({
      groupId: groupId,
      isDeleted: false,
      $or: [
        { message: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .lean();

    res.json({
      success: true,
      messages: messages,
      query: query
    });
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search messages',
      error: error.message
    });
  }
});

// Add reaction to a message
router.post('/:messageId/reactions', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji, userId } = req.body;

    const message = await ChatMessage.findOne({ messageId, isDeleted: false });
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Find existing reaction
    const existingReaction = message.reactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      // Toggle user in reaction
      const userIndex = existingReaction.users.indexOf(userId);
      if (userIndex > -1) {
        existingReaction.users.splice(userIndex, 1);
        if (existingReaction.users.length === 0) {
          message.reactions = message.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        existingReaction.users.push(userId);
      }
    } else {
      // Add new reaction
      message.reactions.push({ emoji, users: [userId] });
    }

    await message.save();

    res.json({
      success: true,
      message: 'Reaction updated',
      data: message
    });
  } catch (error) {
    console.error('Error updating reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reaction',
      error: error.message
    });
  }
});

module.exports = router; 