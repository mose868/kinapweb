import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  Camera, 
  Mic, 
  Eye, 
  Hand, 
  CheckCircle, 
  XCircle, 
  Settings,
  Trash2,
  Shield,
  Smartphone
} from 'lucide-react';
import biometricAuthService, { 
  BiometricSupport, 
  BiometricCredential 
} from '../../services/biometricAuth';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';

interface BiometricAuthProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  mode?: 'register' | 'verify';
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ 
  onSuccess, 
  onCancel, 
  mode = 'register' 
}) => {
  const { user } = useBetterAuthContext();
  const [support, setSupport] = useState<BiometricSupport | null>(null);
  const [credentials, setCredentials] = useState<BiometricCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    checkSupport();
    if (mode === 'verify') {
      loadCredentials();
    }
  }, [mode]);

  const checkSupport = async () => {
    try {
      const biometricSupport = await biometricAuthService.checkSupport();
      setSupport(biometricSupport);
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  const loadCredentials = async () => {
    try {
      const userCredentials = await biometricAuthService.getCredentials();
      setCredentials(userCredentials);
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const handleRegister = async (method: string) => {
    try {
      setLoading(true);
      setError(null);
      setIsRegistering(true);
      setSelectedMethod(method);

      let credentialData;

      switch (method) {
        case 'fingerprint':
          credentialData = await biometricAuthService.registerFingerprint();
          break;
        case 'face-recognition':
          credentialData = await biometricAuthService.registerFaceRecognition();
          break;
        case 'voice-recognition':
          credentialData = await biometricAuthService.registerVoiceRecognition();
          break;
        default:
          throw new Error('Unsupported biometric method');
      }

      // Register with backend
      const credentialId = await biometricAuthService.registerWithBackend(
        method,
        credentialData.publicKey
      );

      setSuccess(`${method.replace('-', ' ')} registered successfully!`);
      
      // Reload credentials
      await loadCredentials();
      
      setTimeout(() => {
        onSuccess?.();
      }, 2000);

    } catch (error: any) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
      setIsRegistering(false);
      setSelectedMethod(null);
    }
  };

  const handleVerify = async (credential: BiometricCredential) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedMethod(credential.type);

      let isVerified = false;

      switch (credential.type) {
        case 'fingerprint':
          isVerified = await biometricAuthService.verifyFingerprint(credential.id);
          break;
        case 'face-recognition':
          isVerified = await biometricAuthService.verifyFaceRecognition(credential.id);
          break;
        case 'voice-recognition':
          isVerified = await biometricAuthService.verifyVoiceRecognition(credential.id);
          break;
        default:
          throw new Error('Unsupported biometric method');
      }

      if (isVerified) {
        setSuccess('Biometric authentication successful!');
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        setError('Biometric verification failed. Please try again.');
      }

    } catch (error: any) {
      setError(error.message || 'Verification failed');
    } finally {
      setLoading(false);
      setSelectedMethod(null);
    }
  };

  const handleRemoveCredential = async (credentialId: string) => {
    try {
      const removed = await biometricAuthService.removeCredential(credentialId);
      if (removed) {
        setSuccess('Biometric credential removed successfully!');
        await loadCredentials();
      } else {
        setError('Failed to remove credential');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to remove credential');
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'fingerprint':
        return <Fingerprint className="w-6 h-6" />;
      case 'face-recognition':
        return <Camera className="w-6 h-6" />;
      case 'voice-recognition':
        return <Mic className="w-6 h-6" />;
      case 'iris-scan':
        return <Eye className="w-6 h-6" />;
      case 'palm-print':
        return <Hand className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const getMethodName = (method: string) => {
    return method.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!support) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ajira-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-ajira-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-ajira-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'register' ? 'Setup Biometric Authentication' : 'Biometric Login'}
        </h2>
        <p className="text-gray-600">
          {mode === 'register' 
            ? 'Choose a biometric method to secure your account'
            : 'Select your preferred biometric method to login'
          }
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      {mode === 'register' ? (
        <div className="space-y-3">
          {Object.entries(support).map(([method, isSupported]) => (
            isSupported && (
              <button
                key={method}
                onClick={() => handleRegister(method)}
                disabled={loading || isRegistering}
                className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                  selectedMethod === method
                    ? 'border-ajira-primary bg-ajira-primary/5'
                    : 'border-gray-200 hover:border-ajira-primary/50 hover:bg-gray-50'
                } ${loading || isRegistering ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-ajira-primary">
                  {getMethodIcon(method)}
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-gray-900">
                    {getMethodName(method)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isRegistering && selectedMethod === method 
                      ? 'Setting up...' 
                      : 'Tap to register'
                    }
                  </div>
                </div>
                {loading && selectedMethod === method && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-ajira-primary"></div>
                )}
              </button>
            )
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {credentials.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No biometric credentials found</p>
              <button
                onClick={() => onCancel?.()}
                className="text-ajira-primary hover:underline"
              >
                Use password instead
              </button>
            </div>
          ) : (
            credentials.map((credential) => (
              <div
                key={credential.id}
                className="p-4 border-2 border-gray-200 rounded-lg flex items-center gap-3"
              >
                <div className="text-ajira-primary">
                  {getMethodIcon(credential.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {getMethodName(credential.type)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Registered {new Date(credential.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(credential)}
                    disabled={loading}
                    className="p-2 text-ajira-primary hover:bg-ajira-primary/10 rounded-lg transition-colors"
                  >
                    {loading && selectedMethod === credential.type ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ajira-primary"></div>
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleRemoveCredential(credential.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex gap-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          {mode === 'verify' && credentials.length > 0 && (
            <button
              onClick={() => onCancel?.()}
              className="flex-1 px-4 py-2 text-ajira-primary border border-ajira-primary rounded-lg hover:bg-ajira-primary/5 transition-colors"
            >
              Use Password
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          🔒 Your biometric data is stored securely on your device and never shared
        </p>
      </div>
    </div>
  );
};

export default BiometricAuth; 