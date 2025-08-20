const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MentorSession = sequelize.define('MentorSession', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mentorId: { type: DataTypes.INTEGER, allowNull: false },
  menteeId: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  duration: { type: DataTypes.INTEGER, defaultValue: 60 },
  meetingLink: { type: DataTypes.STRING(500) },
  status: { type: DataTypes.STRING(50), defaultValue: 'Scheduled' }
}, {
  tableName: 'mentor_sessions',
  timestamps: true
});

module.exports = MentorSession;
