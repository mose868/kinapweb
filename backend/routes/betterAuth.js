const express = require('express');
const { auth } = require('../betterAuth');
const router = express.Router();

// Better Auth API routes - handle each method separately
router.post('/api/better-auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // For now, return a simple response
    res.json({ 
      success: true, 
      message: 'Sign in endpoint ready',
      data: { email }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Sign in failed' 
    });
  }
});

router.post('/api/better-auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // For now, return a simple response
    res.json({ 
      success: true, 
      message: 'Sign up endpoint ready',
      data: { email, name }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Sign up failed' 
    });
  }
});

router.post('/api/better-auth/signout', async (req, res) => {
  try {
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

router.get('/api/better-auth/session', async (req, res) => {
  try {
    res.json({ 
      success: true, 
      session: null,
      message: 'Session endpoint ready' 
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to get session' 
    });
  }
});

router.get('/api/better-auth/providers', async (req, res) => {
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
router.get('/api/better-auth/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Better Auth is working!',
    timestamp: new Date().toISOString()
  });
});

// Health check route
router.get('/api/better-auth/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy',
    version: '1.0.0'
  });
});

module.exports = router; 