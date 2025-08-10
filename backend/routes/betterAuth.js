const express = require('express');
const { auth } = require('../auth'); // Changed from '../betterAuth' to '../auth'
const { sendEmail } = require('../config/email');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();

// Session activity middleware - check and update user activity
const updateUserActivity = async (req, res, next) => {
  try {
    // Only check for authenticated routes
    if (req.path === '/signin' || req.path === '/signup' || req.path === '/ping' || req.path === '/health') {
      return next();
    }
    
    // Get user from session/token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.substring(7);
    
    // Verify token and get user
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.BETTER_AUTH_SECRET || 'your-secret-key');
    
    if (!decoded || !decoded.userId) {
      return next();
    }
    
    // Find user and check session
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next();
    }
    
    // Check if session has expired
    if (user.sessionExpiresAt && user.sessionExpiresAt < new Date()) {
      console.log('🕐 Session expired for user:', user.email);
      return res.status(401).json({
        success: false,
        message: 'Session expired due to inactivity. Please sign in again.',
        sessionExpired: true
      });
    }
    
    // Update last activity
    user.lastActivity = new Date();
    user.sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    await user.save();
    
    next();
  } catch (error) {
    console.error('Session activity check error:', error);
    next();
  }
};

// Apply session activity middleware to all routes
router.use(updateUserActivity);

// Simple test route to verify server is working
router.get('/ping', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Better Auth server is responding!',
    timestamp: new Date().toISOString(),
    auth: auth ? 'Loaded' : 'Not loaded'
  });
});

// Test Better Auth email functionality
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    console.log('Testing Better Auth email functionality...');
    console.log('Email configuration:', {
      from: auth.email?.from,
      transport: auth.email?.transport ? 'Configured' : 'Not configured',
      templates: auth.email?.templates ? 'Available' : 'Not available'
    });
    
    // Test if Better Auth has email functionality
    if (!auth.email || !auth.email.transport) {
      return res.status(500).json({
        success: false,
        message: 'Better Auth email configuration is missing'
      });
    }
    
    // Test if forgotPassword method exists
    if (typeof auth.forgotPassword !== 'function') {
      return res.status(500).json({
        success: false,
        message: 'Better Auth forgotPassword method is not available'
      });
    }
    
    res.json({
      success: true,
      message: 'Better Auth email configuration looks good',
      email: email,
      hasEmailConfig: !!auth.email,
      hasTransport: !!auth.email?.transport,
      hasTemplates: !!auth.email?.templates,
      hasForgotPassword: typeof auth.forgotPassword === 'function'
    });
    
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed: ' + error.message
    });
  }
});

// Direct email test route
router.post('/test-direct-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    console.log('Testing direct email service...');
    
    // Test direct email service
    await sendEmail(
      email,
      'Test Email - Ajira Digital KiNaP Club',
      '<h1>Test Email</h1><p>This is a test email from the direct email service.</p>',
      'Test Email\n\nThis is a test email from the direct email service.'
    );
    
    res.json({
      success: true,
      message: 'Direct email test sent successfully',
      email: email
    });
    
  } catch (error) {
    console.error('Direct email test error:', error);
    res.status(500).json({
      success: false,
      message: 'Direct email test failed: ' + error.message
    });
  }
});

// Better Auth API routes - handle each method separately
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Processing signin for email:', email);
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if user is verified - if not, send verification code for sign-in
    if (!user.isVerified) {
      // Generate verification code for sign-in (6 digits)
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      console.log('🔑 Generated verification code for unverified signin:', verificationCode);
      
      // Save verification code to user
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = verificationCodeExpiry;
      await user.save();
      
      // Send verification code email
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
            <p style="margin: 10px 0 0 0;">Account Verification Required</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello, ${user.displayName || 'there'}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Your account needs to be verified before you can sign in. Please use the verification code below 
              to complete your account verification.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #1B4F72;">
                <h3 style="color: #1B4F72; margin: 0 0 10px 0;">Your Verification Code</h3>
                <div style="font-size: 32px; font-weight: bold; color: #1B4F72; letter-spacing: 5px; font-family: monospace;">
                  ${verificationCode}
                </div>
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Enter this code in the verification form to complete your account verification.
            </p>
            
            <p style="color: #999; font-size: 14px; margin-top: 30px;">
              This verification code will expire in 10 minutes.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you didn't request this verification, please ignore this email.
            </p>
          </div>
        </div>
      `;
      
      const emailText = `
        Ajira Digital KiNaP Club - Account Verification Required
        
        Hello, ${user.displayName || 'there'}!
        
        Your account needs to be verified before you can sign in. Please use the verification code below 
        to complete your account verification:
        
        Verification Code: ${verificationCode}
        
        Enter this code in the verification form to complete your account verification.
        
        This verification code will expire in 10 minutes.
        
        If you didn't request this verification, please ignore this email.
      `;
      
      try {
        await sendEmail(email, 'Account Verification Required - Ajira Digital KiNaP Club', emailHtml, emailText);
        console.log('✅ Verification code email sent for unverified signin:', email);
      } catch (emailError) {
        console.error('❌ Failed to send verification email for unverified signin:', emailError);
        return res.status(500).json({
        success: false,
          message: 'Failed to send verification code. Please try again.'
        });
      }
      
      console.log('✅ Verification code sent for unverified signin:', email);
      console.log('📤 Sending response with requiresVerification: true for unverified user');
      
      return res.json({ 
        success: true, 
        requiresVerification: true,
        message: 'Account verification required. Please check your email for the verification code.',
        email: email
      });
    }
    
    // Verify password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate verification code for sign-in (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    console.log('🔑 Generated verification code for signin:', verificationCode);
    
    // Save verification code to user
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpiry;
    await user.save();
    
    // Send verification code email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
          <p style="margin: 10px 0 0 0;">Sign In Verification</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello, ${user.displayName || 'there'}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We received a sign-in request for your account. To complete the sign-in process, 
            please use the verification code below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #1B4F72;">
              <h3 style="color: #1B4F72; margin: 0 0 10px 0;">Your Verification Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #1B4F72; letter-spacing: 5px; font-family: monospace;">
                ${verificationCode}
              </div>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Enter this code in the verification form to complete your sign-in.
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            This verification code will expire in 10 minutes.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you didn't request this sign-in, please ignore this email.
          </p>
        </div>
      </div>
    `;
    
    const emailText = `
      Ajira Digital KiNaP Club - Sign In Verification
      
      Hello, ${user.displayName || 'there'}!
      
      We received a sign-in request for your account. To complete the sign-in process, 
      please use the verification code below:
      
      Verification Code: ${verificationCode}
      
      Enter this code in the verification form to complete your sign-in.
      
      This verification code will expire in 10 minutes.
      
      If you didn't request this sign-in, please ignore this email.
    `;
    
    try {
      await sendEmail(email, 'Sign In Verification - Ajira Digital KiNaP Club', emailHtml, emailText);
      console.log('✅ Verification code email sent for signin:', email);
    } catch (emailError) {
      console.error('❌ Failed to send verification email for signin:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification code. Please try again.'
      });
    }
    
          console.log('✅ Verification code sent for signin:', email);
      console.log('📤 Sending response with requiresVerification: true');
    
    res.json({ 
      success: true, 
        requiresVerification: true,
        message: 'Verification code sent to your email. Please check your inbox and enter the code to complete sign-in.',
        email: email
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Sign in failed' 
    });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { email, password, displayName, ...otherFields } = req.body;
    
    console.log('📝 Processing signup for email:', email);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }
    
    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    console.log('🔑 Generated verification code for signup:', verificationCode);
    
    // Hash password
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user with verification code
    const newUser = new User({
      email,
      password: hashedPassword,
      displayName,
      verificationCode,
      verificationCodeExpires: verificationCodeExpiry,
      isVerified: false,
      ...otherFields
    });
    
    await newUser.save();
    console.log('💾 New user created with verification code:', email);
    
    // Send verification code email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
          <p style="margin: 10px 0 0 0;">Welcome to Our Community!</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${displayName || 'there'}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Thank you for joining the Ajira Digital KiNaP Club! To complete your registration, 
            please use the verification code below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #1B4F72;">
              <h3 style="color: #1B4F72; margin: 0 0 10px 0;">Your Verification Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #1B4F72; letter-spacing: 5px; font-family: monospace;">
                ${verificationCode}
              </div>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Enter this code in the verification form to complete your registration.
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            This verification code will expire in 10 minutes.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            Welcome to the Ajira Digital KiNaP Club community!
          </p>
        </div>
      </div>
    `;
    
    const emailText = `
      Ajira Digital KiNaP Club - Welcome!
      
      Welcome, ${displayName || 'there'}!
      
      Thank you for joining the Ajira Digital KiNaP Club! To complete your registration, 
      please use the verification code below:
      
      Verification Code: ${verificationCode}
      
      Enter this code in the verification form to complete your registration.
      
      This verification code will expire in 10 minutes.
      
      Welcome to the Ajira Digital KiNaP Club community!
    `;
    
    await sendEmail(
      email,
      'Welcome to Ajira Digital KiNaP Club - Verification Code',
      emailHtml,
      emailText
    );
    
    console.log('✅ Verification code sent for signup:', email);
    console.log('📤 Sending response with requiresVerification: true');
    
    res.json({ 
      success: true, 
      requiresVerification: true,
      message: 'Account created successfully. Please check your email for the verification code.',
      data: { email, displayName }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Sign up failed' 
    });
  }
});

router.post('/signout', async (req, res) => {
  try {
    // Use Better Auth's signOut method
    await auth.signOut();
    
    res.json({ 
      success: true, 
      message: 'Sign out successful' 
    });
  } catch (error) {
    console.error('Sign out error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Sign out failed' 
    });
  }
});

router.get('/session', async (req, res) => {
  try {
    // Use Better Auth's getSession method
    const session = await auth.getSession();
    
    res.json({ 
      success: true, 
      session,
      message: 'Session retrieved successfully' 
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to get session' 
    });
  }
});

// Forgot Password - Use verification code instead of reset link
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    console.log('Processing forgot password request for:', email);
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      console.log('No user found with email:', email);
      return res.json({
        success: true,
        message: 'If an account with that email exists, a verification code has been sent.'
      });
    }
    
    // Generate verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    console.log('🔑 Generated verification code:', verificationCode);
    console.log('🔑 Code expiry:', verificationCodeExpiry);
    console.log('🔑 Current time:', new Date().toISOString());
    
    // Save verification code to user
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpiry;
    await user.save();
    
    console.log('💾 Verification code saved to database for user:', user.email);
    
    // Send verification code email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
          <p style="margin: 10px 0 0 0;">Password Reset Verification</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.displayName || 'there'}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You recently requested to reset your password for your Ajira Digital KiNaP Club account. 
            Use the verification code below to reset your password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #1B4F72;">
              <h3 style="color: #1B4F72; margin: 0 0 10px 0;">Your Verification Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #1B4F72; letter-spacing: 5px; font-family: monospace;">
                ${verificationCode}
              </div>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Enter this code in the password reset form to complete the process.
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            This verification code will expire in 10 minutes.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
      </div>
    `;
    
    const emailText = `
      Ajira Digital KiNaP Club - Password Reset Verification
      
      Hello ${user.displayName || 'there'}!
      
      You recently requested to reset your password for your Ajira Digital KiNaP Club account. 
      Use the verification code below to reset your password:
      
      Verification Code: ${verificationCode}
      
      Enter this code in the password reset form to complete the process.
      
      This verification code will expire in 10 minutes.
      
      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    `;
    
    await sendEmail(
      user.email,
      'Password Reset Verification Code - Ajira Digital KiNaP Club',
      emailHtml,
      emailText
    );
    
    console.log('Password reset verification code sent successfully to:', email);
    
    res.json({
      success: true,
      message: 'If an account with that email exists, a verification code has been sent.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request: ' + error.message
    });
  }
});

// Reset Password - Use verification code
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, password } = req.body;
    
    if (!email || !code || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, verification code, and new password are required'
      });
    }
    
    console.log('🔍 Resetting password for email:', email);
    console.log('🔍 Verification code:', code);
    
    // Find user by email and verification code
    const user = await User.findOne({
      email: email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      console.log('❌ Invalid or expired verification code for email:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }
    
    console.log('✅ Valid verification code found for user:', user.email);
    
    // Hash new password
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Update user password and clear verification code
    user.password = hashedPassword;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    
    console.log('✅ Password reset successfully for user:', user.email);
    
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

// Verify verification code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }
    
    console.log('🔍 Verifying code for email:', email);
    console.log('🔍 Code:', code);
    console.log('🔍 Current time:', new Date().toISOString());
    
    // Find user by email and verification code
    const user = await User.findOne({
      email: email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    });
    
    console.log('🔍 User found:', !!user);
    if (user) {
      console.log('🔍 User email:', user.email);
      console.log('🔍 Code expiry:', user.verificationCodeExpires);
      console.log('🔍 Time until expiry:', user.verificationCodeExpires - Date.now(), 'ms');
    }
    
    const isValid = !!user;
    
    res.json({
      success: true,
      isValid,
      message: isValid ? 'Verification code is valid' : 'Verification code is invalid or expired',
      debug: {
        email: email,
        codeLength: code.length,
        currentTime: new Date().toISOString(),
        userFound: !!user,
        expiryTime: user ? user.verificationCodeExpires : null,
        timeUntilExpiry: user ? user.verificationCodeExpires - Date.now() : null
      }
    });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify code'
    });
  }
});

// Verify account and create session (handles both sign-in and sign-up verification)
router.post('/verify-account', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and verification code are required'
      });
    }
    
    console.log('🔍 Verifying account for email:', email);
    console.log('🔍 Code provided:', code);
    
    // Find user by email and verification code
    const user = await User.findOne({
      email: email,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      console.log('❌ Invalid or expired verification code for email:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }
    
    console.log('✅ Valid verification code found for user:', user.email);
    
    // Clear verification code
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.lastActivity = new Date();
    user.sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    // If user was not verified before, mark as verified (for sign-up)
    const wasNewUser = !user.isVerified;
    if (wasNewUser) {
      user.isVerified = true;
    }
    
    // Add to login history
    if (!user.loginHistory) {
      user.loginHistory = [];
    }
    user.loginHistory.push({
      timestamp: new Date(),
      ipAddress: req.ip || 'Unknown',
      userAgent: req.get('User-Agent') || 'Unknown',
      success: true,
      method: 'verification'
    });
    
    // Keep only last 10 login entries
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(-10);
    }
    
    await user.save();
    
    console.log('✅ Verification successful for user:', email, wasNewUser ? '(new user)' : '(existing user)');
    
    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        sessionExpiresAt: user.sessionExpiresAt
      },
      process.env.BETTER_AUTH_SECRET || 'your-secret-key',
      { expiresIn: '30m' } // 30 minutes
    );
    
    const responseData = {
      success: true,
      message: wasNewUser ? 'Account verified successfully' : 'Sign in successful',
      data: {
      user: {
          id: user._id,
        email: user.email,
        displayName: user.displayName,
          role: user.role,
        isVerified: user.isVerified
        },
        token,
        sessionExpiresAt: user.sessionExpiresAt
      }
    };
    
    console.log('📤 Sending verification response:', JSON.stringify(responseData, null, 2));
    
    res.json(responseData);
  } catch (error) {
    console.error('Verify account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify account'
    });
  }
});

// Resend verification code (handles both sign-in and sign-up)
router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    console.log('📧 Resending verification code for email:', email);
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }
    
    // Generate new verification code (6 digits)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    console.log('🔑 Generated new verification code:', verificationCode);
    
    // Update user with new verification code
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpiry;
    await user.save();
    
    // Send verification code email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1B4F72 0%, #2E8B57 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
          <p style="margin: 10px 0 0 0;">Verification Code</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${user.displayName || 'there'}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            You requested a new verification code for your Ajira Digital KiNaP Club account. 
            Use the verification code below to complete your registration.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: white; padding: 20px; border-radius: 8px; border: 2px solid #1B4F72;">
              <h3 style="color: #1B4F72; margin: 0 0 10px 0;">Your Verification Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #1B4F72; letter-spacing: 5px; font-family: monospace;">
                ${verificationCode}
              </div>
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Enter this code in the verification form to complete your registration.
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            This verification code will expire in 10 minutes.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      </div>
    `;
    
    const emailText = `
      Ajira Digital KiNaP Club - Verification Code
      
      Hello ${user.displayName || 'there'}!
      
      You requested a new verification code for your Ajira Digital KiNaP Club account. 
      Use the verification code below to complete your registration:
      
      Verification Code: ${verificationCode}
      
      Enter this code in the verification form to complete your registration.
      
      This verification code will expire in 10 minutes.
      
      If you didn't request this code, please ignore this email.
    `;
    
    await sendEmail(
      user.email,
      'Verification Code - Ajira Digital KiNaP Club',
      emailHtml,
      emailText
    );
    
    console.log('✅ New verification code sent successfully to:', email);
    
    res.json({
      success: true,
      message: 'New verification code sent successfully'
    });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification code'
    });
  }
});



router.get('/providers', async (req, res) => {
  try {
    res.json({ 
      success: true, 
      providers: {
        email: true,
        google: true
      }
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to get providers' 
    });
  }
});

// Simple test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Better Auth is working!',
    timestamp: new Date().toISOString()
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy',
    version: '1.0.0'
  });
});

// Check session status
router.get('/check-session', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No valid session found',
        sessionExpired: true
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.BETTER_AUTH_SECRET || 'your-secret-key');
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session',
        sessionExpired: true
      });
    }
    
    // Find user and check session
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
        sessionExpired: true
      });
    }
    
    // Check if session has expired
    if (user.sessionExpiresAt && user.sessionExpiresAt < new Date()) {
      console.log('🕐 Session expired for user:', user.email);
      return res.status(401).json({
        success: false,
        message: 'Session expired due to inactivity',
        sessionExpired: true
      });
    }
    
    // Update last activity
    user.lastActivity = new Date();
    user.sessionExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    await user.save();
    
    res.json({
      success: true,
      message: 'Session is valid',
      data: {
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          isVerified: user.isVerified
        },
        sessionExpiresAt: user.sessionExpiresAt,
        timeRemaining: user.sessionExpiresAt - Date.now()
      }
    });
  } catch (error) {
    console.error('Check session error:', error);
    res.status(401).json({
      success: false,
      message: 'Session check failed',
      sessionExpired: true
    });
  }
});

module.exports = router; 