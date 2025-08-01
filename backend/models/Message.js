const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String, default: '' },
  recipient: { type: Schema.Types.ObjectId, ref: 'User' }, // for private chat
  group: { type: String, required: true }, // group ID for community groups
  content: { type: String, required: true },
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'file', 'voice', 'video', 'system'], 
    default: 'text' 
  },
  status: { 
    type: String, 
    enum: ['sending', 'sent', 'delivered', 'read'], 
    default: 'sent' 
  },
  mediaUrl: { type: String },
  fileSize: { type: String },
  fileName: { type: String },
  fileType: { type: String },
  duration: { type: String },
  isDeleted: { type: Boolean, default: false },
  deletedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  deletedAt: { type: Date },
  readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  reactions: [{
    emoji: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }],
  replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
  isEdited: { type: Boolean, default: false },
  editedAt: { type: Date },
  originalContent: { type: String }, // for edited messages
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
MessageSchema.index({ group: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, createdAt: -1 });
MessageSchema.index({ isDeleted: 1 });

// Virtual for formatted timestamp
MessageSchema.virtual('formattedTime').get(function() {
  return this.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

module.exports = mongoose.model('Message', MessageSchema); 