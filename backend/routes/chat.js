const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const FileUpload = require('../models/FileUpload');

const router = express.Router();

// Get chat messages
router.get('/messages', async (req, res) => {
  try {
    const { chatType, groupId, limit = 50, offset = 0 } = req.query;
    
    const query = {};
    if (chatType) query.chatType = chatType;
    if (groupId) query.groupId = groupId;

    const messages = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .populate('replyTo');

    const total = await ChatMessage.countDocuments(query);

    res.json({
      messages: messages.reverse(), // Return in chronological order
      total,
      hasMore: total > parseInt(offset) + messages.length
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to get messages' });
  }
});

// Send a message
router.post('/send', async (req, res) => {
  try {
    const {
      userId,
      userName,
      userAvatar,
      message,
      messageType = 'text',
      groupId,
      chatType = 'bot',
      replyTo,
      mediaUrl,
      fileName,
      fileSize,
      fileType
    } = req.body;

    if (!userId || !userName || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const chatMessage = new ChatMessage({
      userId,
      userName,
      userAvatar,
      message,
      messageType,
      groupId,
      chatType,
      replyTo,
      mediaUrl,
      fileName,
      fileSize,
      fileType,
      status: 'sent',
      timestamp: new Date()
    });

    await chatMessage.save();

    // Populate replyTo if it exists
    if (replyTo) {
      await chatMessage.populate('replyTo');
    }

    res.json({
      message: 'Message sent successfully',
      chatMessage
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Update message status
router.patch('/message/:messageId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { messageId } = req.params;

    if (!['sending', 'sent', 'delivered', 'read'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      message: 'Message status updated',
      chatMessage: updatedMessage
    });

  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({ message: 'Failed to update message status' });
  }
});

// Add reaction to message
router.post('/message/:messageId/reaction', async (req, res) => {
  try {
    const { emoji, userId } = req.body;
    const { messageId } = req.params;

    if (!emoji || !userId) {
      return res.status(400).json({ message: 'Emoji and userId are required' });
    }

    const chatMessage = await ChatMessage.findById(messageId);
    if (!chatMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if reaction already exists
    const existingReaction = chatMessage.reactions.find(r => r.emoji === emoji);
    
    if (existingReaction) {
      // Toggle user in reaction
      const userIndex = existingReaction.users.indexOf(userId);
      if (userIndex > -1) {
        existingReaction.users.splice(userIndex, 1);
        if (existingReaction.users.length === 0) {
          chatMessage.reactions = chatMessage.reactions.filter(r => r.emoji !== emoji);
        }
      } else {
        existingReaction.users.push(userId);
      }
    } else {
      // Add new reaction
      chatMessage.reactions.push({ emoji, users: [userId] });
    }

    await chatMessage.save();

    res.json({
      message: 'Reaction updated',
      chatMessage
    });

  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ message: 'Failed to add reaction' });
  }
});

// Edit message
router.patch('/message/:messageId/edit', async (req, res) => {
  try {
    const { message } = req.body;
    const { messageId } = req.params;

    if (!message) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      messageId,
      { 
        message, 
        isEdited: true, 
        editedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      message: 'Message edited successfully',
      chatMessage: updatedMessage
    });

  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Failed to edit message' });
  }
});

// Delete message
router.delete('/message/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;

    const deletedMessage = await ChatMessage.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // If message has media, delete the file too
    if (deletedMessage.mediaUrl) {
      try {
        await FileUpload.findOneAndDelete({ downloadUrl: deletedMessage.mediaUrl });
      } catch (fileError) {
        console.error('Failed to delete associated file:', fileError);
      }
    }

    res.json({
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

// Get chat statistics
router.get('/stats', async (req, res) => {
  try {
    const { chatType, groupId, userId } = req.query;
    
    const query = {};
    if (chatType) query.chatType = chatType;
    if (groupId) query.groupId = groupId;
    if (userId) query.userId = userId;

    const totalMessages = await ChatMessage.countDocuments(query);
    const totalFiles = await ChatMessage.countDocuments({ ...query, messageType: { $in: ['image', 'file', 'video', 'audio'] } });
    const totalReactions = await ChatMessage.aggregate([
      { $match: query },
      { $unwind: '$reactions' },
      { $group: { _id: null, totalReactions: { $sum: { $size: '$reactions.users' } } } }
    ]);

    res.json({
      totalMessages,
      totalFiles,
      totalReactions: totalReactions[0]?.totalReactions || 0
    });

  } catch (error) {
    console.error('Get chat stats error:', error);
    res.status(500).json({ message: 'Failed to get chat statistics' });
  }
});

// Search messages
router.get('/search', async (req, res) => {
  try {
    const { query, chatType, groupId, limit = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchQuery = {
      message: { $regex: query, $options: 'i' }
    };
    
    if (chatType) searchQuery.chatType = chatType;
    if (groupId) searchQuery.groupId = groupId;

    const messages = await ChatMessage.find(searchQuery)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('replyTo');

    res.json({
      messages,
      total: messages.length
    });

  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({ message: 'Failed to search messages' });
  }
});

module.exports = router; 