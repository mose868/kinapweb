const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth users
  displayName: { type: String },
  avatar: { type: String },
  phoneNumber: { type: String },
  course: { type: String },
  year: { type: String },
  experienceLevel: { type: String },
  skills: [{ type: String }],
  bio: { type: String },
  rating: { type: Number, default: 0 },
  location: {
    country: { type: String },
    city: { type: String }
  },
  languages: [{ type: String }],
  portfolio: [{
    title: { type: String },
    description: { type: String },
    image: { type: String },
    url: { type: String }
  }],
  role: { type: String, enum: ['student', 'mentor', 'admin'], default: 'student' },
  isVerified: { type: Boolean, default: false },
  mentors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  mentees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  groups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  
  // Google OAuth fields
  googleId: { type: String, unique: true, sparse: true },
  googleEmail: { type: String },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  
  // Biometric Authentication Fields
  biometricEnabled: { type: Boolean, default: false },
  biometricCredentials: [{
    id: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['fingerprint', 'face-recognition', 'voice-recognition', 'iris-scan', 'palm-print'],
      required: true 
    },
    publicKey: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastUsed: { type: Date },
    isActive: { type: Boolean, default: true }
  }],
  
  // Biometric authentication history
  biometricAuthHistory: [{
    timestamp: { type: Date, default: Date.now },
    method: { 
      type: String, 
      enum: ['fingerprint', 'face-recognition', 'voice-recognition', 'iris-scan', 'palm-print'] 
    },
    success: { type: Boolean },
    ipAddress: { type: String },
    userAgent: { type: String },
    location: { type: String },
    details: { type: Schema.Types.Mixed }
  }],
  
  // Login history for security monitoring
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
    location: { type: String },
    success: { type: Boolean },
    method: { type: String, enum: ['password', 'google', 'biometric', 'verification'] }
  }],
  
  // Password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  
  // Verification code fields
  verificationCode: { type: String },
  verificationCodeExpires: { type: Date },
  
  // Session activity tracking
  lastActivity: { type: Date },
  sessionExpiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 