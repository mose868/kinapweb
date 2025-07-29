const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now }
}, { _id: false });

const successStorySchema = new Schema({
  title: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String },
  content: { type: String, required: true },
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  images: [{ type: String }],
  likes: { type: Number, default: 0 },
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema); 