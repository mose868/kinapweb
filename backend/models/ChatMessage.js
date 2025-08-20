const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  // Message identification
  messageId: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  
  // Group/Conversation identification
  groupId: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  conversationId: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  // Message type
  messageType: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  
  // User information
  userId: {
    type: DataTypes.STRING(255),
    allowNull: true, // Optional for anonymous chats
  },
  
  userName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  userAvatar: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: 'https://via.placeholder.com/40',
  },
  
  role: {
    type: DataTypes.ENUM('user', 'assistant', 'model'),
    allowNull: true,
  },
  
  // Message content
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  // Message metadata
  contentType: {
    type: DataTypes.ENUM('text', 'image', 'file', 'voice', 'video', 'audio', 'system', 'chatbot', 'kinap-ai'),
    allowNull: false,
    defaultValue: 'text',
  },
  
  status: {
    type: DataTypes.ENUM('sending', 'sent', 'delivered', 'read'),
    allowNull: false,
    defaultValue: 'sent',
  },
  
  // Media information (if applicable)
  mediaUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fileName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  fileType: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  
  // Message metadata
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  
  // Reply functionality
  replyTo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  // Message editing
  isEdited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Reactions
  reactions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Soft delete functionality
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  deletedBy: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // AI message flag
  isAIMessage: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  // User profile context (for AI messages)
  userProfile: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
}, {
  tableName: 'chat_messages',
  timestamps: true,
  indexes: [
    {
      fields: ['conversationId', 'timestamp']
    },
    {
      fields: ['userId', 'contentType']
    },
    {
      fields: ['contentType', 'timestamp']
    },
    {
      fields: ['groupId', 'timestamp']
    },
    {
      fields: ['groupId', 'timestamp']
    },
    {
      fields: ['userId', 'timestamp']
    },
    {
      fields: ['isDeleted']
    },
    {
      fields: ['messageType']
    },
    {
      unique: true,
      fields: ['messageId']
    }
  ]
});

// Virtual for formatted timestamp
ChatMessage.prototype.getFormattedTime = function() {
  return this.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Method to soft delete message
ChatMessage.prototype.softDelete = function(userId) {
  const deletedBy = this.deletedBy || [];
  if (!deletedBy.includes(userId)) {
    deletedBy.push(userId);
  }
  
  this.isDeleted = true;
  this.deletedBy = deletedBy;
  this.deletedAt = new Date();
  
  return this.save();
};

// Method to restore message
ChatMessage.prototype.restore = function() {
  this.isDeleted = false;
  this.deletedBy = [];
  this.deletedAt = null;
  return this.save();
};

// Static method to get messages for a group
ChatMessage.getGroupMessages = function(groupId, limit = 50, offset = 0) {
  return this.findAll({
    where: {
      groupId: groupId,
      isDeleted: false
    },
    order: [['timestamp', 'ASC']],
    limit: limit,
    offset: offset,
    raw: true
  });
};

// Static method to get recent messages for all groups
ChatMessage.getRecentMessages = function(limit = 20) {
  return sequelize.query(`
    SELECT DISTINCT ON (groupId) 
      *, 
      ROW_NUMBER() OVER (PARTITION BY groupId ORDER BY timestamp DESC) as rn
    FROM chat_messages 
    WHERE isDeleted = false 
    ORDER BY groupId, timestamp DESC
    LIMIT ?
  `, {
    replacements: [limit],
    type: sequelize.QueryTypes.SELECT
  });
};

// Static method to delete all messages for a group
ChatMessage.deleteGroupMessages = function(groupId) {
  return this.update(
    { 
      isDeleted: true,
      deletedAt: new Date()
    },
    {
      where: {
        groupId: groupId
      }
    }
  );
};

// Static method to get message statistics
ChatMessage.getMessageStats = function(groupId) {
  return sequelize.query(`
    SELECT 
      COUNT(*) as totalMessages,
      SUM(CASE WHEN isAIMessage = true THEN 1 ELSE 0 END) as aiMessages,
      SUM(CASE WHEN isAIMessage = false THEN 1 ELSE 0 END) as userMessages,
      MIN(timestamp) as firstMessage,
      MAX(timestamp) as lastMessage
    FROM chat_messages 
    WHERE groupId = ? AND isDeleted = false
  `, {
    replacements: [groupId],
    type: sequelize.QueryTypes.SELECT
  });
};

module.exports = ChatMessage;