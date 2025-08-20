const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  sender: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  senderName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  senderAvatar: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  
  recipient: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  group: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file', 'voice', 'video', 'system'),
    allowNull: false,
    defaultValue: 'text',
  },
  
  status: {
    type: DataTypes.ENUM('sending', 'sent', 'delivered', 'read'),
    allowNull: false,
    defaultValue: 'sent',
  },
  
  mediaUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  fileSize: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  
  fileName: {
    type: DataTypes.STRING(255),
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
  
  readBy: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  reactions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  replyTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id'
    }
  },
  
  isEdited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  editedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  originalContent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'messages',
  timestamps: true,
  indexes: [
    {
      fields: ['group', 'createdAt']
    },
    {
      fields: ['sender', 'createdAt']
    },
    {
      fields: ['isDeleted']
    },
    {
      fields: ['recipient']
    },
    {
      fields: ['replyTo']
    }
  ]
});

// Virtual for formatted timestamp
Message.prototype.getFormattedTime = function() {
  return this.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Static method to get group messages
Message.getGroupMessages = function(groupId, limit = 50, offset = 0) {
  return this.findAll({
    where: {
      group: groupId,
      isDeleted: false
    },
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
};

// Static method to get message count for group
Message.getGroupMessageCount = function(groupId) {
  return this.count({
    where: {
      group: groupId,
      isDeleted: false
    }
  });
};

// Instance method to mark as read by user
Message.prototype.markAsRead = function(userId) {
  const readBy = this.readBy || [];
  if (!readBy.includes(userId)) {
    readBy.push(userId);
    this.readBy = readBy;
    if (this.status !== 'read') {
      this.status = 'read';
    }
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to add reaction
Message.prototype.addReaction = function(emoji, userId) {
  const reactions = this.reactions || [];
  const existingReaction = reactions.find(r => r.emoji === emoji);
  
  if (existingReaction) {
    if (!existingReaction.users.includes(userId)) {
      existingReaction.users.push(userId);
    }
  } else {
    reactions.push({
      emoji,
      users: [userId]
    });
  }
  
  this.reactions = reactions;
  return this.save();
};

// Instance method to remove reaction
Message.prototype.removeReaction = function(emoji, userId) {
  const reactions = this.reactions || [];
  const reactionIndex = reactions.findIndex(r => r.emoji === emoji);
  
  if (reactionIndex > -1) {
    const userIndex = reactions[reactionIndex].users.indexOf(userId);
    if (userIndex > -1) {
      reactions[reactionIndex].users.splice(userIndex, 1);
      if (reactions[reactionIndex].users.length === 0) {
        reactions.splice(reactionIndex, 1);
      }
    }
  }
  
  this.reactions = reactions;
  return this.save();
};

module.exports = Message;