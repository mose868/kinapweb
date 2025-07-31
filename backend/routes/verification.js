const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  sendWelcomeEmail, 
  generateVerificationCode,
  testAllProviders 
} = require('../services/emailService');

// Rate limiting for verification requests
const verificationAttempts = new Map();
const MAX_ATTEMPTS = 5;
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Check rate limit
const checkRateLimit = (email) => {
  const now = Date.now();
  const attempts = verificationAttempts.get(email) || [];
  
  // Remove old attempts
  const recentAttempts = attempts.filter(timestamp => now - timestamp < ATTEMPT_WINDOW);
  
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return false;
  }
  
  recentAttempts.push(now);
  verificationAttempts.set(email, recentAttempts);
  return true;
};

// Send verification code
router.post('/send-code', async (req, res) => {
  try {
    const { email, type = 'registration' } = req.body;
    
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }
    
    // Check rate limit
    if (!checkRateLimit(email)) {
      return res.status(429).json({
        success: false,
        message: 'Too many verification attempts. Please wait 15 minutes before trying again.'
      });
    }
    
    // Check if user exists
    let user = await User.findOne({ email });
    let student = await Student.findOne({ email });
    
    if (type === 'registration') {
      if (user || student) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }
    } else if (type === 'password-reset') {
      if (!user && !student) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address'
        });
      }
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Save verification code to user/student
    if (user) {
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = expiresAt;
      await user.save();
    } else if (student) {
      student.verificationCode = verificationCode;
      student.verificationCodeExpires = expiresAt;
      await student.save();
    } else {
      // For new registrations, create a temporary record
      const tempUser = new User({
        email,
        verificationCode,
        verificationCodeExpires: expiresAt,
        isVerified: false
      });
      await tempUser.save();
    }
    
    // Send verification email
    const userName = user?.displayName || student?.fullname || email.split('@')[0];
    
    if (type === 'password-reset') {
      await sendPasswordResetEmail(email, verificationCode, userName);
    } else {
      await sendVerificationEmail(email, verificationCode, userName);
    }
    
    console.log(`✅ Verification code sent to ${email}: ${verificationCode}`);
    
    res.json({
      success: true,
      message: `Verification code sent to ${email}`,
      expiresIn: '10 minutes'
    });
    
  } catch (error) {
    console.error('❌ Send verification code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send verification code. Please try again.'
    });
  }
});

// Verify code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code, type = 'registration' } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }
    
    // Find user or student
    let user = await User.findOne({ email });
    let student = await Student.findOne({ email });
    let targetUser = user || student;
    
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }
    
    // Check if code is valid and not expired
    if (!targetUser.verificationCode || targetUser.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }
    
    if (targetUser.verificationCodeExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.'
      });
    }
    
    // Mark as verified
    targetUser.isVerified = true;
    targetUser.verificationCode = null;
    targetUser.verificationCodeExpires = null;
    await targetUser.save();
    
    // Send welcome email for new registrations
    if (type === 'registration' && !targetUser.lastLoginAt) {
      try {
        const userName = targetUser.displayName || targetUser.fullname || email.split('@')[0];
        await sendWelcomeEmail(email, userName);
      } catch (emailError) {
        console.error('❌ Welcome email error:', emailError);
        // Don't fail the verification if welcome email fails
      }
    }
    
    console.log(`✅ Email verified for ${email}`);
    
    res.json({
      success: true,
      message: 'Email verified successfully!',
      user: {
        id: targetUser._id,
        email: targetUser.email,
        isVerified: targetUser.isVerified,
        displayName: targetUser.displayName || targetUser.fullname
      }
    });
    
  } catch (error) {
    console.error('❌ Verify code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify code. Please try again.'
    });
  }
});

// Resend verification code
router.post('/resend-code', async (req, res) => {
  try {
    const { email, type = 'registration' } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }
    
    // Check rate limit
    if (!checkRateLimit(email)) {
      return res.status(429).json({
        success: false,
        message: 'Too many verification attempts. Please wait 15 minutes before trying again.'
      });
    }
    
    // Find user or student
    let user = await User.findOne({ email });
    let student = await Student.findOne({ email });
    let targetUser = user || student;
    
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }
    
    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Update verification code
    targetUser.verificationCode = verificationCode;
    targetUser.verificationCodeExpires = expiresAt;
    await targetUser.save();
    
    // Send verification email
    const userName = targetUser.displayName || targetUser.fullname || email.split('@')[0];
    
    if (type === 'password-reset') {
      await sendPasswordResetEmail(email, verificationCode, userName);
    } else {
      await sendVerificationEmail(email, verificationCode, userName);
    }
    
    console.log(`✅ Verification code resent to ${email}: ${verificationCode}`);
    
    res.json({
      success: true,
      message: `New verification code sent to ${email}`,
      expiresIn: '10 minutes'
    });
    
  } catch (error) {
    console.error('❌ Resend verification code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification code. Please try again.'
    });
  }
});

// Test email providers
router.get('/test-email-providers', async (req, res) => {
  try {
    const results = await testAllProviders();
    
    res.json({
      success: true,
      providers: results,
      summary: {
        total: results.length,
        configured: results.filter(r => r.configured).length,
        working: results.filter(r => r.working).length
      }
    });
    
  } catch (error) {
    console.error('❌ Test email providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test email providers'
    });
  }
});

// Get verification status
router.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }
    
    // Find user or student
    let user = await User.findOne({ email });
    let student = await Student.findOne({ email });
    let targetUser = user || student;
    
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }
    
    res.json({
      success: true,
      isVerified: targetUser.isVerified,
      hasVerificationCode: !!targetUser.verificationCode,
      codeExpiresAt: targetUser.verificationCodeExpires,
      isExpired: targetUser.verificationCodeExpires ? targetUser.verificationCodeExpires < new Date() : false
    });
    
  } catch (error) {
    console.error('❌ Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verification status'
    });
  }
});

module.exports = router; 