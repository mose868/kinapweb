// Biometric Authentication Service for Frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface BiometricCredential {
  id: string;
  type: 'fingerprint' | 'face-recognition' | 'voice-recognition' | 'iris-scan' | 'palm-print';
  publicKey: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface BiometricSupport {
  fingerprint: boolean;
  face: boolean;
  voice: boolean;
  iris: boolean;
  palm: boolean;
}

export interface BiometricAuthData {
  credentialId: string;
  signature: string;
  type: string;
}

class BiometricAuthService {
  private videoStream: MediaStream | null = null;
  private audioStream: MediaStream | null = null;

  // Check if device supports biometric authentication
  async checkSupport(): Promise<BiometricSupport> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/biometric/support`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      }
      
      throw new Error(result.message);
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return {
        fingerprint: false,
        face: false,
        voice: false,
        iris: false,
        palm: false
      };
    }
  }

  // Register fingerprint using WebAuthn
  async registerFingerprint(): Promise<{ credentialId: string; publicKey: string }> {
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
            id: window.location.hostname
          },
          user: {
            id: this.stringToArrayBuffer('user-id'),
            name: 'user@example.com',
            displayName: 'User'
          },
          pubKeyCredParams: [
            {
              type: 'public-key',
              alg: -7 // ES256
            }
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required'
          },
          timeout: 60000
        }
      }) as PublicKeyCredential;

      if (!credential) {
        throw new Error('Failed to create biometric credential');
      }

      const publicKey = this.arrayBufferToBase64(credential.response.clientDataJSON);
      
      return {
        credentialId: credential.id,
        publicKey
      };
    } catch (error) {
      console.error('Fingerprint registration error:', error);
      throw error;
    }
  }

  // Register face recognition
  async registerFaceRecognition(): Promise<{ credentialId: string; publicKey: string }> {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not available');
      }

      // Get camera stream
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      // Create video element for face capture
      const video = document.createElement('video');
      video.srcObject = this.videoStream;
      video.play();

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      // Capture face data (simplified - in real implementation, use face detection API)
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(video, 0, 0);
      const faceData = canvas.toDataURL('image/jpeg', 0.8);

      // Stop video stream
      this.stopVideoStream();

      // Generate credential
      const credentialId = this.generateCredentialId();
      const publicKey = this.hashData(faceData);

      return {
        credentialId,
        publicKey
      };
    } catch (error) {
      console.error('Face recognition registration error:', error);
      this.stopVideoStream();
      throw error;
    }
  }

  // Register voice recognition
  async registerVoiceRecognition(): Promise<{ credentialId: string; publicKey: string }> {
    try {
      // Check if speech recognition is available
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition is not supported in this browser');
      }

      // Get microphone stream
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Create audio context for voice capture
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(this.audioStream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      const voiceData: number[] = [];

      return new Promise((resolve, reject) => {
        processor.onaudioprocess = (event) => {
          const inputData = event.inputBuffer.getChannelData(0);
          voiceData.push(...Array.from(inputData));
        };

        processor.onended = () => {
          // Stop audio stream
          this.stopAudioStream();
          
          // Generate credential from voice data
          const credentialId = this.generateCredentialId();
          const publicKey = this.hashData(voiceData.join(','));

          resolve({
            credentialId,
            publicKey
          });
        };

        source.connect(processor);
        processor.connect(audioContext.destination);

        // Stop recording after 5 seconds
        setTimeout(() => {
          processor.disconnect();
          source.disconnect();
        }, 5000);
      });
    } catch (error) {
      console.error('Voice recognition registration error:', error);
      this.stopAudioStream();
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
          allowCredentials: [{
            type: 'public-key',
            id: this.base64ToArrayBuffer(credentialId)
          }],
          userVerification: 'required',
          timeout: 60000
        }
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

  // Verify face recognition
  async verifyFaceRecognition(credentialId: string): Promise<boolean> {
    try {
      // Get camera stream
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      // Create video element for face capture
      const video = document.createElement('video');
      video.srcObject = this.videoStream;
      video.play();

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      // Capture face data
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(video, 0, 0);
      const faceData = canvas.toDataURL('image/jpeg', 0.8);

      // Stop video stream
      this.stopVideoStream();

      // In a real implementation, you would compare the captured face data
      // with the stored face data using face recognition algorithms
      // For now, we'll return true (simplified)
      return true;
    } catch (error) {
      console.error('Face recognition verification error:', error);
      this.stopVideoStream();
      return false;
    }
  }

  // Verify voice recognition
  async verifyVoiceRecognition(credentialId: string): Promise<boolean> {
    try {
      // Get microphone stream
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Create audio context for voice capture
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(this.audioStream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      const voiceData: number[] = [];

      return new Promise((resolve) => {
        processor.onaudioprocess = (event) => {
          const inputData = event.inputBuffer.getChannelData(0);
          voiceData.push(...Array.from(inputData));
        };

        processor.onended = () => {
          // Stop audio stream
          this.stopAudioStream();
          
          // In a real implementation, you would compare the captured voice data
          // with the stored voice data using voice recognition algorithms
          // For now, we'll return true (simplified)
          resolve(true);
        };

        source.connect(processor);
        processor.connect(audioContext.destination);

        // Stop recording after 3 seconds
        setTimeout(() => {
          processor.disconnect();
          source.disconnect();
        }, 3000);
      });
    } catch (error) {
      console.error('Voice recognition verification error:', error);
      this.stopAudioStream();
      return false;
    }
  }

  // Register biometric credential with backend
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
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          publicKey
        })
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

  // Verify biometric with backend
  async verifyWithBackend(userId: string, credentialId: string, signature: string, type: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/biometric/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          credentialId,
          signature,
          type
        })
      });

      const result = await response.json();
      
      return result.success;
    } catch (error) {
      console.error('Backend verification error:', error);
      return false;
    }
  }

  // Get user's biometric credentials
  async getCredentials(): Promise<BiometricCredential[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/biometric/credentials`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message);
      }

      return result.data;
    } catch (error) {
      console.error('Get credentials error:', error);
      return [];
    }
  }

  // Remove biometric credential
  async removeCredential(credentialId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/api/biometric/credentials/${credentialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      return result.success;
    } catch (error) {
      console.error('Remove credential error:', error);
      return false;
    }
  }

  // Utility methods
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

  private hashData(data: string): string {
    // Simple hash function - in production, use proper cryptographic hashing
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
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

  private stopVideoStream(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
  }

  private stopAudioStream(): void {
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
  }
}

export default new BiometricAuthService(); 