const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AmbassadorApplication = sequelize.define('AmbassadorApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(50) },
  university: { type: DataTypes.STRING(255) },
  course: { type: DataTypes.STRING(255) },
  year: { type: DataTypes.STRING(10) },
  motivation: { type: DataTypes.TEXT },
  experience: { type: DataTypes.TEXT },
  socialMedia: { type: DataTypes.JSON, defaultValue: {} },
  status: { type: DataTypes.STRING(50), defaultValue: 'Pending' },
  reviewedBy: { type: DataTypes.STRING(255) },
  reviewNotes: { type: DataTypes.TEXT }
}, {
  tableName: 'ambassador_applications',
  timestamps: true
});

module.exports = AmbassadorApplication;