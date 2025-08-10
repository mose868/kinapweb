import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import biometricAuthService from '../../services/biometricAuth';

const BiometricTest: React.FC = () => {
  const [support, setSupport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<any[]>([]);

  useEffect(() => {
    checkSupport();
    loadCredentials();
  }, []);

  const checkSupport = async () => {
    try {
      const biometricSupport = await biometricAuthService.checkSupport();
      setSupport(biometricSupport);
      console.log('Biometric support:', biometricSupport);
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setError('Failed to check biometric support');
    }
  };

  const loadCredentials = async () => {
    try {
      const userCredentials = await biometricAuthService.getCredentials();
      setCredentials(userCredentials);
      console.log('User credentials:', userCredentials);
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const testFingerprintRegistration = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      console.log('Starting fingerprint registration...');
      
      // Test registration
      const credentialData = await biometricAuthService.registerFingerprint();
      console.log('Fingerprint registration result:', credentialData);

      setSuccess('Fingerprint registration successful!');
      
      // Reload credentials
      await loadCredentials();
    } catch (error: any) {
      console.error('Fingerprint registration error:', error);
      setError(error.message || 'Fingerprint registration failed');
    } finally {
      setLoading(false);
    }
  };

  const testFingerprintVerification = async () => {
    if (credentials.length === 0) {
      setError('No credentials available for verification');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const credential = credentials[0]; // Use first credential
      console.log('Testing verification with credential:', credential);

      const isVerified = await biometricAuthService.verifyFingerprint(credential.id);
      console.log('Verification result:', isVerified);

      if (isVerified) {
        setSuccess('Fingerprint verification successful!');
      } else {
        setError('Fingerprint verification failed');
      }
    } catch (error: any) {
      console.error('Fingerprint verification error:', error);
      setError(error.message || 'Fingerprint verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Biometric Authentication Test</h2>
      
      {/* Support Status */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Device Support</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Fingerprint:</span>
            {support?.fingerprint ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Face Recognition:</span>
            {support?.face ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Voice Recognition:</span>
            {support?.voice ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Credentials */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Registered Credentials</h3>
        {credentials.length > 0 ? (
          <div className="space-y-2">
            {credentials.map((credential, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Fingerprint className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700">
                    {credential.type} - {credential.id.substring(0, 8)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No credentials registered</p>
        )}
      </div>

      {/* Test Buttons */}
      <div className="space-y-3">
        <button
          onClick={testFingerprintRegistration}
          disabled={loading || !support?.fingerprint}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Fingerprint className="w-4 h-4 mr-2" />
          )}
          Test Fingerprint Registration
        </button>

        <button
          onClick={testFingerprintVerification}
          disabled={loading || credentials.length === 0}
          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="w-4 h-4 mr-2" />
          )}
          Test Fingerprint Verification
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Debug Information</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>WebAuthn Supported: {typeof window !== 'undefined' && window.PublicKeyCredential ? 'Yes' : 'No'}</div>
          <div>Platform Authenticator: {typeof window !== 'undefined' && window.PublicKeyCredential ? 'Checking...' : 'N/A'}</div>
          <div>HTTPS: {window.location.protocol === 'https:' ? 'Yes' : 'No'}</div>
          <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
        </div>
      </div>
    </div>
  );
};

export default BiometricTest;
