const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: false, // Optional for anonymous chats
    index: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'model'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['chatbot', 'kinap-ai'],
    default: 'chatbot'
  },
  metadata: {
    source: String, // 'gemini-ai', 'contextual-ai', 'fallback', etc.
    confidence: String, // 'high', 'medium', 'low'
    responseTime: Number,
    model: String // 'gemini-1.5-flash', 'contextual-ai', etc.
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient querying
chatMessageSchema.index({ conversationId: 1, timestamp: 1 });
chatMessageSchema.index({ userId: 1, messageType: 1 });
chatMessageSchema.index({ messageType: 1, timestamp: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 