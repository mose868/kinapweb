const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  package: {
    name: {
      type: String,
      required: true,
      enum: ['basic', 'standard', 'premium']
    },
    title: String,
    price: {
      type: Number,
      required: true
    },
    deliveryTime: {
      type: Number,
      required: true
    },
    revisions: {
      type: Number,
      default: 0
    },
    features: [String]
  },
  requirements: [{
    question: String,
    answer: String,
    files: [{
      name: String,
      url: String
    }]
  }],
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'in-progress',
      'delivered',
      'revision-requested',
      'completed',
      'cancelled',
      'disputed'
    ],
    default: 'pending'
  },
  payment: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'KES',
      enum: ['KES', 'USD', 'EUR']
    },
    method: {
      type: String,
      enum: ['mpesa', 'card', 'bank', 'paypal'],
      required: true
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  delivery: {
    dueDate: {
      type: Date,
      required: true
    },
    deliveredAt: Date,
    files: [{
      name: String,
      url: String,
      description: String
    }],
    message: String
  },
  revision: {
    requestedAt: Date,
    reason: String,
    deadline: Date,
    completedAt: Date
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    attachments: [{
      name: String,
      url: String
    }],
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    ratedAt: Date
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  cancellation: {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    requestedAt: Date,
    approvedAt: Date,
    refundAmount: Number
  },
  dispute: {
    openedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    description: String,
    openedAt: Date,
    resolvedAt: Date,
    resolution: String
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ seller: 1, status: 1 });
orderSchema.index({ gig: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order total
orderSchema.virtual('total').get(function() {
  return this.payment.amount;
});

// Virtual for days remaining
orderSchema.virtual('daysRemaining').get(function() {
  if (this.status === 'in-progress' && this.delivery.dueDate) {
    const now = new Date();
    const due = new Date(this.delivery.dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
  return null;
});

// Method to add timeline event
orderSchema.methods.addTimelineEvent = function(status, note = '') {
  this.timeline.push({ status, note });
  return this.save();
};

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  this.addTimelineEvent(newStatus, note);
  return this.save();
};

// Method to add message
orderSchema.methods.addMessage = function(senderId, message, attachments = []) {
  this.messages.push({
    sender: senderId,
    message,
    attachments
  });
  return this.save();
};

// Static method to get orders by user
orderSchema.statics.getByUser = function(userId, role = 'buyer', status = null) {
  const query = role === 'buyer' ? { buyer: userId } : { seller: userId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('buyer', 'displayName avatar')
    .populate('seller', 'displayName avatar')
    .populate('gig', 'title images')
    .sort({ createdAt: -1 });
};

// Static method to get order statistics
orderSchema.statics.getStats = function(userId, role = 'buyer') {
  const query = role === 'buyer' ? { buyer: userId } : { seller: userId };
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$payment.amount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema); 