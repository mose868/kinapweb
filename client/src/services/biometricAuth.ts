// Simplified Biometric Authentication Service for Frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface BiometricCredential {
  id: string;
  type: 'fingerprint' | 'face-recognition' | 'voice-recognition';
  publicKey: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface BiometricSupport {
  fingerprint: boolean;
  face: boolean;
  voice: boolean;
}

export interface BiometricAuthData {
  credentialId: string;
  signature: string;
  type: string;
}

class BiometricAuthService {
  // Check if device supports biometric authentication
  async checkSupport(): Promise<BiometricSupport> {
    try {
      // Check WebAuthn support for fingerprint
      const fingerprintSupported = 
        typeof window !== 'undefined' && 
        window.PublicKeyCredential && 
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

      // Check camera support for face recognition
      const faceSupported = 
        typeof window !== 'undefined' && 
        navigator.mediaDevices && 
        navigator.mediaDevices.getUserMedia;

      // Check microphone support for voice recognition
      const voiceSupported = 
        typeof window !== 'undefined' && 
        navigator.mediaDevices && 
        navigator.mediaDevices.getUserMedia;

      return {
        fingerprint: fingerprintSupported,
        face: faceSupported,
        voice: voiceSupported,
      };
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return {
        fingerprint: false,
        face: false,
        voice: false,
      };
    }
  }

  // Register fingerprint using WebAuthn
  async registerFingerprint(): Promise<{
    credentialId: string;
    publicKey: string;
  }> {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      // Check if platform authenticator is available
      const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!isAvailable) {
        throw new Error('Fingerprint authentication is not available on this device');
      }

      // Generate challenge
      const challenge = this.generateChallenge();

      // Create credential
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: this.base64ToArrayBuffer(challenge),
          rp: {
            name: 'Ajira Digital KiNaP Club',
            id: window.location.hostname,
          },
          user: {
            id: this.stringToArrayBuffer('user-id'),
            name: 'user@example.com',
            displayName: 'User',
          },
          pubKeyCredParams: [
            {
              type: 'public-key',
              alg: -7, // ES256
            },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
        },
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create biometric credential');
      }

      const publicKey = this.arrayBufferToBase64(credential.response.clientDataJSON);

      return {
        credentialId: credential.id,
        publicKey,
      };
    } catch (error) {
      console.error('Fingerprint registration error:', error);
      throw error;
    }
  }

  // Verify fingerprint
  async verifyFingerprint(credentialId: string): Promise<boolean> {
    try {
      // Create assertion
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: this.generateChallenge(),
          rpId: window.location.hostname,
          allowCredentials: [
            {
              type: 'public-key',
              id: this.base64ToArrayBuffer(credentialId),
            },
          ],
          userVerification: 'required',
          timeout: 60000,
        },
      }) as PublicKeyCredential;

      if (!assertion) {
        throw new Error('Fingerprint verification failed');
      }

      return true;
    } catch (error) {
      console.error('Fingerprint verification error:', error);
      return false;
    }
  }

  // Register with backend
  async registerWithBackend(type: string, publicKey: string): Promise<string> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/biometric/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          publicKey,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data.credentialId;
    } catch (error) {
      console.error('Backend registration error:', error);
      throw error;
    }
  }

  // Verify with backend
  async verifyWithBackend(
    userId: string,
    credentialId: string,
    signature: string,
    type: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/biometric/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          credentialId,
          signature,
          type,
        }),
      });

      const result = await response.json();

      return result.success;
    } catch (error) {
      console.error('Backend verification error:', error);
      return false;
    }
  }

  // Get user credentials
  async getCredentials(): Promise<BiometricCredential[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return [];
      }

      const response = await fetch(`${API_BASE_URL}/api/biometric/credentials`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Get credentials error:', error);
      return [];
    }
  }

  // Remove credential
  async removeCredential(credentialId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/biometric/credentials/${credentialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      return result.success;
    } catch (error) {
      console.error('Remove credential error:', error);
      return false;
    }
  }

  // Helper methods
  private generateChallenge(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.arrayBufferToBase64(array);
  }

  private generateCredentialId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return this.arrayBufferToBase64(array);
  }

  private hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    return crypto.subtle.digest('SHA-256', dataBuffer).then(hash => {
      return this.arrayBufferToBase64(hash);
    });
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  private stringToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
  }
}

// Export singleton instance
const biometricAuthService = new BiometricAuthService();
export default biometricAuthService;
