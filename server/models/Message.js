const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emoji: {
    type: String,
    required: true,
    enum: ['👍', '❤️', '🚀']
  }
}, { _id: false });

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: String,
    default: 'main'
  },
  reactions: [reactionSchema],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: Map,
    of: String,
    default: new Map()
  }
}, {
  timestamps: true
});

// Index for efficient querying
messageSchema.index({ room: 1, createdAt: -1 });
messageSchema.index({ user: 1, createdAt: -1 });

// Virtual for formatted timestamp
messageSchema.virtual('formattedTimestamp').get(function() {
  return this.createdAt.toLocaleString();
});

// Method to check if user can delete message
messageSchema.methods.canDelete = function(userId, userRole) {
  return this.user.toString() === userId.toString() || 
         ['admin', 'moderator'].includes(userRole);
};

// Method to add reaction
messageSchema.methods.toggleReaction = function(userId, emoji) {
  const existingReaction = this.reactions.find(
    r => r.user.toString() === userId.toString() && r.emoji === emoji
  );

  if (existingReaction) {
    this.reactions = this.reactions.filter(
      r => !(r.user.toString() === userId.toString() && r.emoji === emoji)
    );
  } else {
    this.reactions.push({ user: userId, emoji });
  }

  return this.save();
};

// Static method to get recent messages
messageSchema.statics.getRecent = function(room = 'main', limit = 50) {
  return this.find({ room, isDeleted: false })
    .sort('-createdAt')
    .limit(limit)
    .populate('user', 'name profileImage')
    .populate('reactions.user', 'name profileImage');
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 