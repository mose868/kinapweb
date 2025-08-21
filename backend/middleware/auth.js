const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    // Verify token using Better Auth secret
    const decoded = jwt.verify(token, process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-this-in-production');
    
    // Get user from database using userId from token
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication required. Please log in again.' });
  }
};

// Optional auth middleware (doesn't require token but adds user if available)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-this-in-production');
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without user if token is invalid
    next();
  }
};

// Admin auth middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.BETTER_AUTH_SECRET || 'your-secret-key-change-this-in-production');
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(401).json({ error: 'Authentication required. Please log in again.' });
  }
};

module.exports = { auth, optionalAuth, adminAuth }; 