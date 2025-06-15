const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: { type: String, required: true },
  userRole: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  category: { type: String, default: 'Web Development' },
  impact: { type: String, default: '' },
  projectLink: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Testimonial', TestimonialSchema); 