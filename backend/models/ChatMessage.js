const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  // Message identification
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Group/Conversation identification
  groupId: {
    type: String,
    required: true
  },
  
  conversationId: {
    type: String,
    required: false
  },
  
  // Message type
  messageType: {
    type: String,
    required: true,
    index: true
  },
  // User information
  userId: {
    type: String,
    required: false, // Optional for anonymous chats
    index: true
  },
  
  userName: {
    type: String,
    required: false
  },
  
  userAvatar: {
    type: String,
    default: 'https://via.placeholder.com/40'
  },
  
  role: {
    type: String,
    enum: ['user', 'assistant', 'model'],
    required: false
  },
  
  // Message content
  message: {
    type: String,
    required: true
  },
  
  content: {
    type: String,
    required: true
  },
  // Message metadata
  contentType: {
    type: String,
    enum: ['text', 'image', 'file', 'voice', 'video', 'audio', 'system', 'chatbot', 'kinap-ai'],
    default: 'text'
  },
  
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read'],
    default: 'sent'
  },
  
  // Media information (if applicable)
  mediaUrl: String,
  fileName: String,
  fileSize: String,
  fileType: String,
  duration: String,
  
  // Message metadata
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Reply functionality
  replyTo: {
    type: String,
    default: null
  },
  
  // Message editing
  isEdited: {
    type: Boolean,
    default: false
  },
  
  editedAt: Date,
  
  // Reactions
  reactions: [{
    emoji: String,
    users: [String]
  }],
  
  // Soft delete functionality
  isDeleted: {
    type: Boolean,
    default: false
  },
  
  deletedBy: [String],
  deletedAt: Date,
  
  // AI message flag
  isAIMessage: {
    type: Boolean,
    default: false
  },
  
  // User profile context (for AI messages)
  userProfile: {
    name: String,
    course: String,
    year: String,
    skills: [String]
  },
  
  metadata: {
    source: String, // 'gemini-ai', 'contextual-ai', 'fallback', etc.
    confidence: String, // 'high', 'medium', 'low'
    responseTime: Number,
    model: String // 'gemini-1.5-flash', 'contextual-ai', etc.
  }
}, {
  timestamps: true
});

// Index for efficient querying
chatMessageSchema.index({ conversationId: 1, timestamp: 1 });
chatMessageSchema.index({ userId: 1, contentType: 1 });
chatMessageSchema.index({ contentType: 1, timestamp: -1 });
chatMessageSchema.index({ groupId: 1, timestamp: 1 });

// Indexes for better query performance
chatMessageSchema.index({ groupId: 1, timestamp: -1 });
chatMessageSchema.index({ userId: 1, timestamp: -1 });
chatMessageSchema.index({ isDeleted: 1 });

// Virtual for formatted timestamp
chatMessageSchema.virtual('formattedTime').get(function() {
  return this.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Method to soft delete message
chatMessageSchema.methods.softDelete = function(userId) {
  this.isDeleted = true;
  if (!this.deletedBy.includes(userId)) {
    this.deletedBy.push(userId);
  }
  this.deletedAt = new Date();
  return this.save();
};

// Method to restore message
chatMessageSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedBy = [];
  this.deletedAt = null;
  return this.save();
};

// Static method to get messages for a group
chatMessageSchema.statics.getGroupMessages = function(groupId, limit = 50, offset = 0) {
  return this.find({
    groupId: groupId,
    isDeleted: false
  })
  .sort({ timestamp: 1 })
  .limit(limit)
  .skip(offset)
  .lean();
};

// Static method to get recent messages for all groups
chatMessageSchema.statics.getRecentMessages = function(limit = 20) {
  return this.aggregate([
    { $match: { isDeleted: false } },
    { $sort: { timestamp: -1 } },
    { $group: { 
      _id: '$groupId', 
      lastMessage: { $first: '$$ROOT' }
    }},
    { $sort: { 'lastMessage.timestamp': -1 } },
    { $limit: limit }
  ]);
};

// Static method to delete all messages for a group
chatMessageSchema.statics.deleteGroupMessages = function(groupId) {
  return this.updateMany(
    { groupId: groupId },
    { 
      isDeleted: true,
      deletedAt: new Date()
    }
  );
};

// Static method to get message statistics
chatMessageSchema.statics.getMessageStats = function(groupId) {
  return this.aggregate([
    { $match: { groupId: groupId, isDeleted: false } },
    { $group: {
      _id: null,
      totalMessages: { $sum: 1 },
      aiMessages: { $sum: { $cond: ['$isAIMessage', 1, 0] } },
      userMessages: { $sum: { $cond: ['$isAIMessage', 0, 1] } },
      firstMessage: { $min: '$timestamp' },
      lastMessage: { $max: '$timestamp' }
    }}
  ]);
};

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 