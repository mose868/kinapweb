const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MentorApplication = sequelize.define('MentorApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(50) },
  expertise: { type: DataTypes.JSON, defaultValue: [] },
  experience: { type: DataTypes.TEXT },
  motivation: { type: DataTypes.TEXT },
  availability: { type: DataTypes.JSON, defaultValue: {} },
  status: { type: DataTypes.STRING(50), defaultValue: 'Pending' },
  reviewedBy: { type: DataTypes.STRING(255) },
  reviewNotes: { type: DataTypes.TEXT }
}, {
  tableName: 'mentor_applications',
  timestamps: true
});

module.exports = MentorApplication;