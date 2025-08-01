const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const biometricAuthService = require('../services/biometricAuthService');
const User = require('../models/User');

// Check biometric support
router.get('/support', async (req, res) => {
  try {
    const support = await biometricAuthService.checkBiometricSupport();
    res.json({
      success: true,
      data: support
    });
  } catch (error) {
    console.error('Check biometric support error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check biometric support'
    });
  }
});

// Register biometric credential
router.post('/register', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, publicKey } = req.body;

    if (!type || !publicKey) {
      return res.status(400).json({
        success: false,
        message: 'Biometric type and public key are required'
      });
    }

    const result = await biometricAuthService.registerBiometric(userId, {
      type,
      publicKey
    });

    // Enable biometric authentication for user
    await User.findByIdAndUpdate(userId, {
      biometricEnabled: true
    });

    res.json({
      success: true,
      message: result.message,
      data: {
        credentialId: result.credentialId
      }
    });
  } catch (error) {
    console.error('Biometric registration error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Verify biometric authentication
router.post('/verify', async (req, res) => {
  try {
    const { userId, credentialId, signature, type } = req.body;

    if (!userId || !credentialId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'User ID, credential ID, and signature are required'
      });
    }

    const result = await biometricAuthService.verifyBiometric(userId, {
      credentialId,
      signature,
      type
    });

    // Log the attempt
    await biometricAuthService.logBiometricAttempt(
      userId,
      true,
      type || 'unknown',
      {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    );

    res.json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error('Biometric verification error:', error);
    
    // Log failed attempt if we have userId
    if (req.body.userId) {
      await biometricAuthService.logBiometricAttempt(
        req.body.userId,
        false,
        req.body.type || 'unknown',
        {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        }
      );
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's biometric credentials
router.get('/credentials', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const credentials = await biometricAuthService.getBiometricCredentials(userId);
    
    res.json({
      success: true,
      data: credentials
    });
  } catch (error) {
    console.error('Get biometric credentials error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Remove biometric credential
router.delete('/credentials/:credentialId', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { credentialId } = req.params;

    const result = await biometricAuthService.removeBiometricCredential(userId, credentialId);

    // Check if user has any remaining credentials
    const remainingCredentials = await biometricAuthService.getBiometricCredentials(userId);
    if (remainingCredentials.length === 0) {
      await User.findByIdAndUpdate(userId, {
        biometricEnabled: false
      });
    }

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Remove biometric credential error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Generate authentication challenge
router.post('/challenge', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const challenge = await biometricAuthService.generateAuthChallenge(userId);
    
    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Generate challenge error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get biometric authentication history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 20, page = 1 } = req.query;

    const user = await User.findById(userId).select('biometricAuthHistory');
    const history = user.biometricAuthHistory || [];

    // Sort by timestamp (newest first) and paginate
    const sortedHistory = history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = sortedHistory.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        history: paginatedHistory,
        total: history.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(history.length / limit)
      }
    });
  } catch (error) {
    console.error('Get biometric history error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Enable/disable biometric authentication
router.put('/toggle', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Enabled status is required'
      });
    }

    // Check if user has biometric credentials if enabling
    if (enabled) {
      const credentials = await biometricAuthService.getBiometricCredentials(userId);
      if (credentials.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No biometric credentials found. Please register biometric credentials first.'
        });
      }
    }

    await User.findByIdAndUpdate(userId, {
      biometricEnabled: enabled
    });

    res.json({
      success: true,
      message: `Biometric authentication ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Toggle biometric error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 