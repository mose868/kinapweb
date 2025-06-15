const mongoose = require('mongoose');

const ambassadorSubmissionSchema = new mongoose.Schema({
  ambassador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambassador',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AmbassadorTask',
    required: true
  },
  proofUrl: {
    type: String,
    required: true
  },
  proofType: {
    type: String,
    enum: ['image', 'video', 'link'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  feedback: {
    type: String,
    maxlength: 500
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AmbassadorSubmission = mongoose.model('AmbassadorSubmission', ambassadorSubmissionSchema);
module.exports = AmbassadorSubmission; 