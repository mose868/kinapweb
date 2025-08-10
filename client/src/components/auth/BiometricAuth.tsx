import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  Camera,
  Mic,
  CheckCircle,
  XCircle,
  Settings,
  Trash2,
  Shield,
  Smartphone,
  Loader2,
} from 'lucide-react';
import biometricAuthService, {
  BiometricSupport,
  BiometricCredential,
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
  mode = 'register',
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
        default:
          throw new Error('Only fingerprint authentication is currently supported');
      }

      // Register with backend
      const credentialId = await biometricAuthService.registerWithBackend(
        method,
        credentialData.publicKey
      );

      setSuccess(`${method.replace('-', ' ')} registered successfully!`);

      // Reload credentials
      await loadCredentials();

      // Auto-success after registration
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
          isVerified = await biometricAuthService.verifyFingerprint(
            credential.id
          );
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
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'fingerprint':
        return 'Fingerprint';
      case 'face-recognition':
        return 'Face Recognition';
      case 'voice-recognition':
        return 'Voice Recognition';
      default:
        return method;
    }
  };

  if (loading && !isRegistering) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-ajira-primary mx-auto mb-4" />
        <p className="text-gray-600">Processing...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {mode === 'register' ? 'Setup Biometric Authentication' : 'Biometric Login'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {mode === 'register' 
              ? 'Choose a biometric method to secure your account'
              : 'Select your preferred authentication method'
            }
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <XCircle className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        </div>
      )}

      {mode === 'register' ? (
        /* Registration Mode */
        <div>
          {/* Available Methods */}
          <div className="space-y-3">
            {support?.fingerprint && (
              <button
                onClick={() => handleRegister('fingerprint')}
                disabled={loading}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <Fingerprint className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">Fingerprint</h3>
                    <p className="text-sm text-gray-600">Use your device's fingerprint sensor</p>
                  </div>
                </div>
                {selectedMethod === 'fingerprint' && loading && (
                  <Loader2 className="w-5 h-5 animate-spin text-ajira-primary" />
                )}
              </button>
            )}

            {!support?.fingerprint && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <Fingerprint className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-500">Fingerprint</h3>
                    <p className="text-sm text-gray-500">Not available on this device</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Security Note</p>
                <p>Your biometric data is stored securely on your device and is never shared with our servers.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Verification Mode */
        <div>
          {credentials.length > 0 ? (
            <div className="space-y-3">
              {credentials.map((credential) => (
                <button
                  key={credential.id}
                  onClick={() => handleVerify(credential)}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      {getMethodIcon(credential.type)}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">
                        {getMethodName(credential.type)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Registered on {new Date(credential.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedMethod === credential.type && loading && (
                      <Loader2 className="w-5 h-5 animate-spin text-ajira-primary" />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCredential(credential.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title="Remove credential"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Biometric Credentials</h3>
              <p className="text-gray-600 mb-4">
                You haven't set up any biometric authentication methods yet.
              </p>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors"
              >
                Set Up Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BiometricAuth;
