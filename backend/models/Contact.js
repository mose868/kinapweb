const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['General Inquiry', 'Technical Support', 'Partnership', 'Training', 'Complaint', 'Suggestion', 'Other'],
      default: 'General Inquiry'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Responded', 'Resolved', 'Closed'],
      default: 'New'
    },
    source: {
      type: String,
      enum: ['Website', 'WhatsApp', 'Email', 'Phone', 'Social Media'],
      default: 'Website'
    },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },
    responseNotes: { type: String }, // Admin notes for response
    assignedTo: { type: String }, // Admin email who handles this
    followUpDate: { type: Date },
    isRead: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    attachments: [{ 
      name: { type: String },
      url: { type: String },
      type: { type: String }
    }],
    metadata: {
      userAgent: { type: String },
      ipAddress: { type: String },
      referrer: { type: String }
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ category: 1, priority: 1 });
contactSchema.index({ isRead: 1, isArchived: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

// Virtual for formatting created date
contactSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Static method to get unread messages count
contactSchema.statics.getUnreadCount = function() {
  return this.countDocuments({ isRead: false, isArchived: false });
};

// Static method to get messages by status
contactSchema.statics.getByStatus = function(status, limit = 50) {
  return this.find({ status, isArchived: false })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Method to mark as read
contactSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Method to update status
contactSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  if (notes) {
    this.responseNotes = notes;
  }
  return this.save();
};

// Pre-save middleware to set emailSentAt when emailSent is true
contactSchema.pre('save', function(next) {
  if (this.isModified('emailSent') && this.emailSent && !this.emailSentAt) {
    this.emailSentAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Contact', contactSchema); 