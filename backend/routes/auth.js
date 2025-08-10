const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { auth: betterAuth } = require('../auth');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      displayName,
      phoneNumber,
      course,
      year,
      experienceLevel,
      skills,
      bio,
      location,
      languages
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const userData = {
      username,
      email,
      password: hashedPassword,
      displayName: displayName || username,
      phoneNumber,
      course,
      year,
      experienceLevel,
      skills: skills || [],
      bio,
      location,
      languages: languages || ['English'],
      role: 'student',
      isVerified: false,
      rating: 0
    };

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `${field} already exists` 
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      message: 'Registration failed',
      error: error.message 
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({ 
      $or: [{ email }, { username: email }] 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user has password (not Google OAuth only)
    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({ 
        message: 'This account was created with Google. Please use Google Sign-In.' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Log login attempt
    const loginEntry = {
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      location: 'Unknown',
      success: true,
      method: 'password'
    };

    await User.findByIdAndUpdate(user._id, {
      $push: { loginHistory: loginEntry }
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Google OAuth routes
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, displayName, avatar, googleEmail } = req.body;

    if (!googleId || !email) {
      return res.status(400).json({ message: 'Google ID and email are required' });
    }

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [{ googleId }, { email }] 
    });

    if (user) {
      // User exists, update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        user.googleEmail = googleEmail;
        if (!user.avatar && avatar) {
          user.avatar = avatar;
        }
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Log login attempt
      const loginEntry = {
        timestamp: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        location: 'Unknown',
        success: true,
        method: 'google'
      };

      await User.findByIdAndUpdate(user._id, {
        $push: { loginHistory: loginEntry }
      });

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
        message: 'Google login successful',
        user: userResponse,
        token
      });
    } else {
      // Create new user
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
      
      const userData = {
        username,
        email,
        displayName: displayName || email.split('@')[0],
        avatar,
        googleId,
        googleEmail,
        authProvider: 'google',
        role: 'student',
        isVerified: true, // Google accounts are pre-verified
        languages: ['English']
      };

      user = new User(userData);
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Log signup attempt
      const loginEntry = {
        timestamp: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        location: 'Unknown',
        success: true,
        method: 'google'
      };

      await User.findByIdAndUpdate(user._id, {
        $push: { loginHistory: loginEntry }
      });

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        message: 'Google signup successful',
        user: userResponse,
        token
      });
    }

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      displayName,
      phoneNumber,
      course,
      year,
      experienceLevel,
      skills,
      bio,
      location,
      languages,
      avatar
    } = req.body;

    const updateData = {
      displayName,
      phoneNumber,
      course,
      year,
      experienceLevel,
      skills,
      bio,
      location,
      languages,
      avatar
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Verify token
router.get('/verify', auth, async (req, res) => {
  try {
    res.json({ valid: true, user: req.user });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

// Logout user
router.post('/logout', auth, async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    // For now, we'll just return success
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

// Forgot Password - Use Better Auth
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Use Better Auth's forgot password functionality
    const result = await betterAuth.forgotPassword(email);

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request'
    });
  }
});

// Reset Password - Use Better Auth
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    // Use Better Auth's reset password functionality
    const result = await betterAuth.resetPassword(token, password);

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// Verify reset token - Use Better Auth
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Use Better Auth's token verification
    const result = await betterAuth.verifyResetToken(token);

    res.json({
      success: true,
      message: 'Token is valid'
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify token'
    });
  }
});

module.exports = router; 