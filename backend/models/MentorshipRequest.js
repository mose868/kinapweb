const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MentorshipRequest = sequelize.define('MentorshipRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mentorId: { type: DataTypes.INTEGER, allowNull: false },
  requesterId: { type: DataTypes.INTEGER, allowNull: false },
  subject: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  requestedDate: { type: DataTypes.DATE },
  preferredDuration: { type: DataTypes.INTEGER },
  topics: { type: DataTypes.JSON, defaultValue: [] },
  status: { type: DataTypes.STRING(50), defaultValue: 'Pending' },
  mentorResponse: { type: DataTypes.TEXT },
  responseDate: { type: DataTypes.DATE }
}, {
  tableName: 'mentorship_requests',
  timestamps: true
});

module.exports = MentorshipRequest;