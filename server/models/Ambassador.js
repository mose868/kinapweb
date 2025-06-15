const mongoose = require('mongoose');

const ambassadorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  ajiraIdUrl: {
    type: String,
    required: true
  },
  schoolIdUrl: {
    type: String,
    required: true
  },
  statement: {
    type: String,
    required: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  points: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Ambassador = mongoose.model('Ambassador', ambassadorSchema);
module.exports = Ambassador; 