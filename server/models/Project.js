const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  technologies: [{
    type: String,
    required: true
  }],
  imageUrl: {
    type: String
  },
  demoUrl: {
    type: String
  },
  githubUrl: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile App', 'UI/UX Design', 'Digital Marketing', 'Content Creation', 'Other']
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'On Hold'],
    default: 'In Progress'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for better search performance
projectSchema.index({ title: 'text', description: 'text' });

// Middleware to populate user and collaborators
projectSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email profileImage'
  }).populate({
    path: 'collaborators',
    select: 'name email profileImage'
  });
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 