const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  gigId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'gigs',
      key: 'id'
    }
  },
  
  package: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  status: {
    type: DataTypes.ENUM(
      'pending',
      'confirmed',
      'in-progress',
      'delivered',
      'revision-requested',
      'completed',
      'cancelled',
      'disputed'
    ),
    allowNull: false,
    defaultValue: 'pending',
  },
  
  payment: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  
  delivery: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  revision: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  messages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  rating: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  timeline: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  cancellation: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  dispute: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
}, {
  tableName: 'orders',
  timestamps: true,
  indexes: [
    {
      fields: ['buyerId', 'status']
    },
    {
      fields: ['sellerId', 'status']
    },
    {
      fields: ['gigId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Virtual for order total
Order.prototype.getTotal = function() {
  return this.payment?.amount || 0;
};

// Virtual for days remaining
Order.prototype.getDaysRemaining = function() {
  if (this.status === 'in-progress' && this.delivery?.dueDate) {
    const now = new Date();
    const due = new Date(this.delivery.dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
  return null;
};

// Method to add timeline event
Order.prototype.addTimelineEvent = function(status, note = '') {
  const timeline = this.timeline || [];
  timeline.push({ 
    status, 
    note, 
    timestamp: new Date() 
  });
  this.timeline = timeline;
  return this.save();
};

// Method to update status
Order.prototype.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  return this.addTimelineEvent(newStatus, note);
};

// Method to add message
Order.prototype.addMessage = function(senderId, message, attachments = []) {
  const messages = this.messages || [];
  messages.push({
    sender: senderId,
    message,
    attachments,
    timestamp: new Date()
  });
  this.messages = messages;
  return this.save();
};

// Static method to get orders by user
Order.getByUser = function(userId, role = 'buyer', status = null) {
  const whereClause = role === 'buyer' 
    ? { buyerId: userId } 
    : { sellerId: userId };
  
  if (status) {
    whereClause.status = status;
  }
  
  return this.findAll({
    where: whereClause,
    include: [
      {
        model: sequelize.models.User,
        as: 'buyer',
        attributes: ['id', 'displayName', 'avatar']
      },
      {
        model: sequelize.models.User,
        as: 'seller',
        attributes: ['id', 'displayName', 'avatar']
      },
      {
        model: sequelize.models.Gig,
        as: 'gig',
        attributes: ['id', 'title', 'images']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

// Static method to get order statistics
Order.getStats = function(userId, role = 'buyer') {
  const roleField = role === 'buyer' ? 'buyerId' : 'sellerId';
  
  return sequelize.query(`
    SELECT 
      status,
      COUNT(*) as count,
      SUM(JSON_EXTRACT(payment, '$.amount')) as totalAmount
    FROM orders 
    WHERE ${roleField} = ?
    GROUP BY status
  `, {
    replacements: [userId],
    type: sequelize.QueryTypes.SELECT
  });
};

// Static method to get recent orders
Order.getRecent = function(limit = 10) {
  return this.findAll({
    include: [
      {
        model: sequelize.models.User,
        as: 'buyer',
        attributes: ['id', 'displayName', 'avatar']
      },
      {
        model: sequelize.models.User,
        as: 'seller',
        attributes: ['id', 'displayName', 'avatar']
      },
      {
        model: sequelize.models.Gig,
        as: 'gig',
        attributes: ['id', 'title', 'images']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: limit
  });
};

module.exports = Order;