const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { type: String, required: true },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileSizeFormatted: { type: String, required: true },
  
  // Storage information
  storagePath: { type: String, required: true },
  downloadUrl: { type: String, required: true },
  thumbnailUrl: { type: String }, // For images/videos
  
  // Upload context
  uploadedBy: { type: String, required: true },
  uploadContext: { 
    type: String, 
    enum: ['chat', 'profile', 'marketplace', 'general'], 
    default: 'general' 
  },
  relatedId: { type: String }, // ID of related entity (message, user, etc.)
  
  // File metadata
  duration: { type: Number }, // For audio/video files in seconds
  dimensions: {
    width: { type: Number },
    height: { type: Number }
  },
  
  // Security and access
  isPublic: { type: Boolean, default: true },
  accessToken: { type: String },
  expiresAt: { type: Date },
  
  // Status
  status: { 
    type: String, 
    enum: ['uploading', 'processing', 'completed', 'failed', 'deleted'], 
    default: 'uploading' 
  },
  
  // Processing info
  processingError: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
fileUploadSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
fileUploadSchema.index({ uploadedBy: 1, uploadContext: 1 });
fileUploadSchema.index({ relatedId: 1 });
fileUploadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('FileUpload', fileUploadSchema); 