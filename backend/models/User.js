const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
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
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 