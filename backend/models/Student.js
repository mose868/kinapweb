const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    idNo: { type: String },
    course: { type: String },
    year: { type: String },
    skills: { type: String },
    experience: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    // Additional profile fields (not collected during signup)
    bio: { type: String },
    location: { type: String },
    ajiraGoals: { type: String },
    linkedinProfile: { type: String },
    photoURL: { type: String },
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema); 