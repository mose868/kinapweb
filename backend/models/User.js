const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true, // Optional for Google OAuth users
  },
  displayName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  avatar: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  course: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  year: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  experienceLevel: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  languages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  portfolio: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  role: {
    type: DataTypes.ENUM('student', 'mentor', 'admin'),
    allowNull: false,
    defaultValue: 'student',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  // Google OAuth fields
  googleId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
  },
  googleEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  authProvider: {
    type: DataTypes.ENUM('local', 'google'),
    allowNull: false,
    defaultValue: 'local',
  },
  
  // Biometric Authentication Fields
  biometricEnabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  biometricCredentials: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Biometric authentication history
  biometricAuthHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Login history for security monitoring
  loginHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Password reset fields
  resetPasswordToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Verification code fields
  verificationCode: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  verificationCodeExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Session activity tracking
  lastActivity: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sessionExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Additional profile fields
  idNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  ajiraGoals: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  interests: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  linkedinProfile: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['googleId'],
      where: {
        googleId: {
          [sequelize.Sequelize.Op.ne]: null
        }
      }
    },
    {
      fields: ['role']
    },
    {
      fields: ['isVerified']
    },
    {
      fields: ['authProvider']
    }
  ]
});

// Instance methods
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  
  // Don't expose sensitive information
  delete values.password;
  delete values.resetPasswordToken;
  delete values.verificationCode;
  delete values.biometricCredentials;
  
  return values;
};

// Add method to add login history entry
User.prototype.addLoginHistory = function(loginData) {
  const history = this.loginHistory || [];
  history.push({
    timestamp: new Date(),
    ...loginData
  });
  
  // Keep only last 10 entries
  if (history.length > 10) {
    history.splice(0, history.length - 10);
  }
  
  this.loginHistory = history;
  return this.save();
};

// Add method to add biometric auth history entry
User.prototype.addBiometricAuthHistory = function(authData) {
  const history = this.biometricAuthHistory || [];
  history.push({
    timestamp: new Date(),
    ...authData
  });
  
  // Keep only last 20 entries
  if (history.length > 20) {
    history.splice(0, history.length - 20);
  }
  
  this.biometricAuthHistory = history;
  return this.save();
};

// Static methods
User.findByEmail = function(email) {
  return this.findOne({
    where: {
      email: email
    }
  });
};

User.findByUsername = function(username) {
  return this.findOne({
    where: {
      username: username
    }
  });
};

User.findByGoogleId = function(googleId) {
  return this.findOne({
    where: {
      googleId: googleId
    }
  });
};

module.exports = User;