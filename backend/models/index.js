const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const ChatMessage = require('./ChatMessage');
const Gig = require('./Gig');
const Group = require('./Group');
const Order = require('./Order');
const Student = require('./Student');
const AboutUs = require('./AboutUs');
const Message = require('./Message');
const Contact = require('./Contact');
const FAQ = require('./FAQ');
const Video = require('./Video');
const Team = require('./Team');
const ClubUpdate = require('./ClubUpdate');
const FileUpload = require('./FileUpload');
const Content = require('./Content');
const Review = require('./Review');
const HomePage = require('./HomePage');
const Event = require('./Event');
const Training = require('./Training');
const UserVideoData = require('./UserVideoData');
const Mentor = require('./Mentor');
const MentorApplication = require('./MentorApplication');
const SellerApplication = require('./SellerApplication');
const AmbassadorApplication = require('./AmbassadorApplication');
const ShowcaseProfile = require('./ShowcaseProfile');
const SuccessStory = require('./SuccessStory');
const MentorSession = require('./MentorSession');
const MentorshipRequest = require('./MentorshipRequest');
const Mentorship = require('./Mentorship');
const SellerProfile = require('./SellerProfile');
const Booking = require('./Booking');

// Define associations
User.hasMany(Gig, {
  foreignKey: 'sellerId',
  as: 'gigs'
});

Gig.belongsTo(User, {
  foreignKey: 'sellerId',
  as: 'seller'
});

// Seller Profile associations
User.hasOne(SellerProfile, {
  foreignKey: 'sellerId',
  as: 'sellerProfile'
});

SellerProfile.belongsTo(User, {
  foreignKey: 'sellerId',
  as: 'user'
});

// Booking associations
User.hasMany(Booking, {
  foreignKey: 'clientId',
  as: 'clientBookings'
});

User.hasMany(Booking, {
  foreignKey: 'sellerId',
  as: 'sellerBookings'
});

Booking.belongsTo(User, {
  foreignKey: 'clientId',
  as: 'client'
});

Booking.belongsTo(User, {
  foreignKey: 'sellerId',
  as: 'seller'
});

SellerProfile.hasMany(Booking, {
  foreignKey: 'sellerId',
  as: 'profileBookings'
});

Booking.belongsTo(SellerProfile, {
  foreignKey: 'sellerId',
  as: 'sellerProfile'
});

User.hasMany(Order, {
  foreignKey: 'buyerId',
  as: 'purchases'
});

User.hasMany(Order, {
  foreignKey: 'sellerId',
  as: 'sales'
});

Order.belongsTo(User, {
  foreignKey: 'buyerId',
  as: 'buyer'
});

Order.belongsTo(User, {
  foreignKey: 'sellerId',
  as: 'seller'
});

Order.belongsTo(Gig, {
  foreignKey: 'gigId',
  as: 'gig'
});

Gig.hasMany(Order, {
  foreignKey: 'gigId',
  as: 'orders'
});

Group.belongsTo(User, {
  foreignKey: 'createdById',
  as: 'creator'
});

User.hasMany(Group, {
  foreignKey: 'createdById',
  as: 'createdGroups'
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  ChatMessage,
  Gig,
  Group,
  Order,
  Student,
  AboutUs,
  Message,
  Contact,
  FAQ,
  Video,
  Team,
  ClubUpdate,
  FileUpload,
  Content,
  Review,
  HomePage,
  Event,
  Training,
  UserVideoData,
  Mentor,
  MentorApplication,
  SellerApplication,
  AmbassadorApplication,
  ShowcaseProfile,
  SuccessStory,
  MentorSession,
  MentorshipRequest,
  Mentorship,
  SellerProfile,
  Booking
};
