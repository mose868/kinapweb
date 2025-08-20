const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mentorship = sequelize.define('Mentorship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mentorId: { type: DataTypes.INTEGER, allowNull: false },
  menteeId: { type: DataTypes.INTEGER, allowNull: false },
  program: { type: DataTypes.STRING(255) },
  goals: { type: DataTypes.JSON, defaultValue: [] },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING(50), defaultValue: 'Active' },
  progress: { type: DataTypes.JSON, defaultValue: {} },
  sessions: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalHours: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
  rating: { type: DataTypes.DECIMAL(3,2) },
  feedback: { type: DataTypes.TEXT }
}, {
  tableName: 'mentorships',
  timestamps: true
});

module.exports = Mentorship;