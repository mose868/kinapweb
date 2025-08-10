const crypto = require('crypto');
const User = require('../models/User');

class BiometricAuthService {
  constructor() {
    this.supportedMethods = {
      face: 'face-recognition',
      fingerprint: 'fingerprint',
      voice: 'voice-recognition',
      iris: 'iris-scan',
      palm: 'palm-print'
    };
  }

  // Generate challenge for biometric registration
  generateChallenge() {
    return crypto.randomBytes(32).toString('base64');
  }

  // Register biometric credentials
  async registerBiometric(userId, biometricData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const credentialId = crypto.randomBytes(32).toString('hex');
      const publicKey = biometricData.publicKey;
      const biometricType = biometricData.type || 'fingerprint';

      // Store biometric credential
      const credential = {
        id: credentialId,
        type: biometricType,
        publicKey: publicKey,
        createdAt: new Date(),
        lastUsed: null,
        isActive: true
      };

      // Add to user's biometric credentials
      if (!user.biometricCredentials) {
        user.biometricCredentials = [];
      }

      user.biometricCredentials.push(credential);
      await user.save();

      return {
        success: true,
        credentialId,
        message: `${biometricType} registered successfully`
      };
    } catch (error) {
      console.error('Biometric registration error:', error);
      throw error;
    }
  }

  // Verify biometric authentication
  async verifyBiometric(userId, biometricData) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.biometricCredentials) {
        throw new Error('No biometric credentials found');
      }

      const { credentialId, signature, type } = biometricData;
      
      // Find the credential
      const credential = user.biometricCredentials.find(
        cred => cred.id === credentialId && cred.isActive
      );

      if (!credential) {
        throw new Error('Invalid biometric credential');
      }

      // Verify the signature (simplified - in real implementation, use proper cryptographic verification)
      const isValid = await this.verifySignature(credential.publicKey, signature);
      
      if (!isValid) {
        throw new Error('Biometric verification failed');
      }

      // Update last used timestamp
      credential.lastUsed = new Date();
      await user.save();

      return {
        success: true,
        method: credential.type,
        message: 'Biometric authentication successful'
      };
    } catch (error) {
      console.error('Biometric verification error:', error);
      throw error;
    }
  }

  // Verify signature (placeholder - implement proper cryptographic verification)
  async verifySignature(publicKey, signature) {
    // In a real implementation, this would use proper cryptographic verification
    // For now, we'll use a simplified check
    return signature && signature.length > 0;
  }

  // Get user's biometric credentials
  async getBiometricCredentials(userId) {
    try {
      const user = await User.findById(userId).select('biometricCredentials');
      if (!user) {
        throw new Error('User not found');
      }

      return user.biometricCredentials || [];
    } catch (error) {
      console.error('Get biometric credentials error:', error);
      throw error;
    }
  }

  // Remove biometric credential
  async removeBiometricCredential(userId, credentialId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.biometricCredentials) {
        throw new Error('No biometric credentials found');
      }

      const credentialIndex = user.biometricCredentials.findIndex(
        cred => cred.id === credentialId
      );

      if (credentialIndex === -1) {
        throw new Error('Credential not found');
      }

      user.biometricCredentials.splice(credentialIndex, 1);
      await user.save();

      return {
        success: true,
        message: 'Biometric credential removed successfully'
      };
    } catch (error) {
      console.error('Remove biometric credential error:', error);
      throw error;
    }
  }

  // Check if device supports biometric authentication
  async checkBiometricSupport() {
    // Since this is a backend service, we'll return basic support info
    // The actual device capability check should be done on the frontend
    const support = {
      fingerprint: true, // WebAuthn is widely supported
      face: true, // Most devices have cameras
      voice: true, // Most devices have microphones
      iris: false, // Not widely supported
      palm: false  // Not widely supported
    };

    return support;
  }

  // Generate biometric challenge for authentication
  async generateAuthChallenge(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.biometricCredentials || user.biometricCredentials.length === 0) {
        throw new Error('No biometric credentials available');
      }

      const challenge = this.generateChallenge();
      const availableMethods = user.biometricCredentials
        .filter(cred => cred.isActive)
        .map(cred => cred.type);

      return {
        challenge,
        availableMethods,
        timeout: 60000 // 60 seconds
      };
    } catch (error) {
      console.error('Generate auth challenge error:', error);
      throw error;
    }
  }

  // Log biometric authentication attempt
  async logBiometricAttempt(userId, success, method, details = {}) {
    try {
      const logEntry = {
        timestamp: new Date(),
        method,
        success,
        ipAddress: details.ipAddress || 'Unknown',
        userAgent: details.userAgent || 'Unknown',
        location: details.location || 'Unknown',
        details
      };

      await User.findByIdAndUpdate(userId, {
        $push: { biometricAuthHistory: logEntry }
      });
    } catch (error) {
      console.error('Log biometric attempt error:', error);
    }
  }
}

module.exports = new BiometricAuthService(); 