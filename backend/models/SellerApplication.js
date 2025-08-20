const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SellerApplication = sequelize.define('SellerApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(50) },
  skills: { type: DataTypes.JSON, defaultValue: [] },
  experience: { type: DataTypes.TEXT },
  portfolio: { type: DataTypes.TEXT },
  expectedEarnings: { type: DataTypes.DECIMAL(10,2) },
  status: { type: DataTypes.STRING(50), defaultValue: 'Pending' },
  reviewedBy: { type: DataTypes.STRING(255) },
  reviewNotes: { type: DataTypes.TEXT }
}, {
  tableName: 'seller_applications',
  timestamps: true
});

module.exports = SellerApplication;