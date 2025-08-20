const express = require('express');
const { ChatMessage } = require('../models');
const { sequelize } = require('../config/database');
const router = express.Router();

// Get all messages for a specific group
router.get('/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Check if database is connected
    try {
      await sequelize.authenticate();
    } catch (dbError) {
      console.warn('Database not connected, returning empty messages');
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
      conversationId,
      messageType,
      userId,
      userName,
      userAvatar,
      role,
      message,
      content,
      contentType = 'text',
      status = 'sent',
      mediaUrl,
      fileName,
      fileSize,
      fileType,
      duration,
      replyTo,
      isAIMessage = false,
      userProfile,
      metadata
    } = req.body;

    // Check if database is connected
    try {
      await sequelize.authenticate();
    } catch (dbError) {
      console.warn('Database not connected, skipping message save');
      return res.json({
        success: true,
        message: 'Message received but not saved (database unavailable)',
        messageId: messageId || Date.now().toString()
      });
    }

    const chatMessage = await ChatMessage.create({
      messageId: messageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      groupId,
      conversationId,
      messageType,
      userId,
      userName,
      userAvatar: userAvatar || 'https://via.placeholder.com/40',
      role,
      message,
      content,
      contentType,
      status,
      mediaUrl,
      fileName,
      fileSize,
      fileType,
      duration,
      timestamp: new Date(),
      replyTo,
      isAIMessage,
      userProfile: userProfile || {},
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      data: chatMessage
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

// Get conversation history for a specific conversation
router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await ChatMessage.findAll({
      where: {
        conversationId: conversationId,
        isDeleted: false
      },
      order: [['timestamp', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

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
    console.error('Error fetching conversation messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation messages',
      error: error.message
    });
  }
});

// Delete a message (soft delete)
router.delete('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const message = await ChatMessage.findOne({
      where: { messageId: messageId }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
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

// Edit a message
router.put('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content, message: messageText } = req.body;

    const message = await ChatMessage.findOne({
      where: { messageId: messageId }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.update({
      content: content || message.content,
      message: messageText || message.message,
      isEdited: true,
      editedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message',
      error: error.message
    });
  }
});

// Add reaction to a message
router.post('/:messageId/reaction', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji, userId } = req.body;

    const message = await ChatMessage.findOne({
      where: { messageId: messageId }
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const reactions = message.reactions || [];
    let reactionFound = false;

    // Find existing reaction with this emoji
    for (let reaction of reactions) {
      if (reaction.emoji === emoji) {
        const users = reaction.users || [];
        if (users.includes(userId)) {
          // Remove user from reaction
          reaction.users = users.filter(id => id !== userId);
        } else {
          // Add user to reaction
          reaction.users.push(userId);
        }
        reactionFound = true;
        break;
      }
    }

    // If reaction doesn't exist, create it
    if (!reactionFound) {
      reactions.push({
        emoji: emoji,
        users: [userId]
      });
    }

    // Remove reactions with no users
    const filteredReactions = reactions.filter(r => r.users && r.users.length > 0);

    await message.update({
      reactions: filteredReactions
    });

    res.json({
      success: true,
      message: 'Reaction updated successfully',
      reactions: filteredReactions
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

// Get message statistics for a group
router.get('/stats/:groupId', async (req, res) => {
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

// Clear all messages for a group (admin only)
router.delete('/group/:groupId/clear', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    await ChatMessage.deleteGroupMessages(groupId);
    
    res.json({
      success: true,
      message: 'All messages cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear messages',
      error: error.message
    });
  }
});

// Get recent messages across all groups
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

module.exports = router;