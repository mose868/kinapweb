const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  bookingId: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  
  clientId: {
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
  
  serviceId: {
    type: DataTypes.STRING(100),
    allowNull: false, // References service package ID from seller profile
  },
  
  // Booking Details
  projectTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  projectDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Timeline
  expectedDelivery: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
  actualDelivery: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Pricing
  agreedPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD',
  },
  
  paymentMethod: {
    type: DataTypes.ENUM('mpesa', 'bank-transfer', 'paypal', 'stripe', 'crypto'),
    allowNull: true,
  },
  
  // Status Management
  status: {
    type: DataTypes.ENUM(
      'pending',        // Waiting for seller acceptance
      'accepted',       // Seller accepted, waiting for payment
      'paid',          // Payment received, work can start
      'in-progress',   // Work is ongoing
      'delivered',     // Work delivered, waiting for client approval
      'revision',      // Client requested revisions
      'completed',     // Project completed and approved
      'cancelled',     // Booking cancelled
      'disputed',      // Dispute raised
      'refunded'       // Payment refunded
    ),
    allowNull: false,
    defaultValue: 'pending',
  },
  
  // Communication
  messages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  conversationId: {
    type: DataTypes.STRING(255),
    allowNull: true, // Links to community hub conversation
  },
  
  // Deliverables
  deliverables: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  revisionRequests: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  maxRevisions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
  },
  
  revisionsUsed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  // Review & Rating
  clientRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  
  clientReview: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  sellerRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  
  sellerReview: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // Payment Tracking
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'held', 'released', 'refunded'),
    allowNull: false,
    defaultValue: 'pending',
  },
  
  paymentReference: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  escrowAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  
  platformFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  
  sellerEarning: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  
  // Metadata
  urgency: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'medium',
  },
  
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  milestones: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Cancellation
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  cancelledBy: {
    type: DataTypes.ENUM('client', 'seller', 'admin'),
    allowNull: true,
  },
  
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Dispute
  disputeReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  disputeStatus: {
    type: DataTypes.ENUM('open', 'investigating', 'resolved', 'escalated'),
    allowNull: true,
  },
  
  disputeResolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  indexes: [
    {
      fields: ['bookingId']
    },
    {
      fields: ['clientId', 'status']
    },
    {
      fields: ['sellerId', 'status']
    },
    {
      fields: ['status', 'createdAt']
    },
    {
      fields: ['paymentStatus']
    },
    {
      fields: ['expectedDelivery']
    },
    {
      fields: ['conversationId']
    }
  ]
});

// Instance methods
Booking.prototype.generateBookingId = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  this.bookingId = `BK_${timestamp}_${random}`.toUpperCase();
  return this.bookingId;
};

Booking.prototype.updateStatus = function(newStatus, updatedBy = null) {
  const previousStatus = this.status;
  this.status = newStatus;
  
  // Add status change to messages
  const statusMessage = {
    id: Date.now().toString(),
    type: 'status_change',
    content: `Booking status changed from ${previousStatus} to ${newStatus}`,
    timestamp: new Date(),
    updatedBy: updatedBy
  };
  
  this.messages = [...(this.messages || []), statusMessage];
  
  // Auto-update dates based on status
  if (newStatus === 'in-progress' && !this.startDate) {
    this.startDate = new Date();
  }
  
  if (newStatus === 'delivered' && !this.actualDelivery) {
    this.actualDelivery = new Date();
  }
  
  return this.save();
};

Booking.prototype.addMessage = function(message) {
  const newMessage = {
    id: Date.now().toString(),
    ...message,
    timestamp: new Date()
  };
  
  this.messages = [...(this.messages || []), newMessage];
  return this.save();
};

Booking.prototype.addDeliverable = function(deliverable) {
  const newDeliverable = {
    id: Date.now().toString(),
    ...deliverable,
    uploadedAt: new Date()
  };
  
  this.deliverables = [...(this.deliverables || []), newDeliverable];
  return this.save();
};

Booking.prototype.requestRevision = function(revisionDetails) {
  if (this.revisionsUsed >= this.maxRevisions) {
    throw new Error('Maximum revisions exceeded');
  }
  
  const revision = {
    id: Date.now().toString(),
    ...revisionDetails,
    requestedAt: new Date(),
    status: 'pending'
  };
  
  this.revisionRequests = [...(this.revisionRequests || []), revision];
  this.revisionsUsed += 1;
  this.status = 'revision';
  
  return this.save();
};

Booking.prototype.calculatePlatformFee = function() {
  const feePercentage = 0.05; // 5% platform fee
  this.platformFee = this.agreedPrice * feePercentage;
  this.sellerEarning = this.agreedPrice - this.platformFee;
  return this.save();
};

Booking.prototype.canCancel = function() {
  const cancellableStatuses = ['pending', 'accepted', 'paid'];
  return cancellableStatuses.includes(this.status);
};

Booking.prototype.canDispute = function() {
  const disputeableStatuses = ['in-progress', 'delivered', 'revision'];
  return disputeableStatuses.includes(this.status);
};

// Static methods
Booking.getBookingsByClient = function(clientId, status = null) {
  const whereClause = { clientId };
  if (status) whereClause.status = status;
  
  return this.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']]
  });
};

Booking.getBookingsBySeller = function(sellerId, status = null) {
  const whereClause = { sellerId };
  if (status) whereClause.status = status;
  
  return this.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']]
  });
};

Booking.getPendingBookings = function(sellerId) {
  return this.findAll({
    where: {
      sellerId,
      status: 'pending'
    },
    order: [['createdAt', 'ASC']]
  });
};

Booking.getActiveBookings = function(sellerId) {
  return this.findAll({
    where: {
      sellerId,
      status: ['accepted', 'paid', 'in-progress', 'revision']
    },
    order: [['expectedDelivery', 'ASC']]
  });
};

Booking.getOverdueBookings = function() {
  return this.findAll({
    where: {
      status: ['in-progress', 'revision'],
      expectedDelivery: {
        [require('sequelize').Op.lt]: new Date()
      }
    },
    order: [['expectedDelivery', 'ASC']]
  });
};

Booking.getBookingStats = function(sellerId, dateRange = null) {
  const whereClause = { sellerId };
  
  if (dateRange) {
    whereClause.createdAt = {
      [require('sequelize').Op.between]: [dateRange.start, dateRange.end]
    };
  }
  
  return this.findAll({
    where: whereClause,
    attributes: [
      'status',
      [require('sequelize').fn('COUNT', '*'), 'count'],
      [require('sequelize').fn('SUM', require('sequelize').col('agreedPrice')), 'totalValue'],
      [require('sequelize').fn('AVG', require('sequelize').col('clientRating')), 'avgRating']
    ],
    group: ['status'],
    raw: true
  });
};

module.exports = Booking;
