const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { validateRegistration, validateLogin, validateResult } = require('../middleware/validate');
const User = require('../models/User');

const router = express.Router();

// Register new user
router.post('/register', validateRegistration, validateResult, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Login user
router.post('/login', validateLogin, validateResult, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Set token in session
    req.session.token = token;

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Set token in session
      req.session.token = token;

      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
    } catch (error) {
      res.redirect('/login');
    }
  }
);

// Logout
router.get('/logout', (req, res) => {
  // Clear session
  req.session.destroy();
  
  // Clear cookies
  res.clearCookie('connect.sid');
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.session.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User no longer exists'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token or session expired'
    });
  }
});

module.exports = router; 