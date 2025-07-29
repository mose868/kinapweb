const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  user: { type: String },
  message: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 