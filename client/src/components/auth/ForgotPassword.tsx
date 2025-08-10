import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { betterAuthForgotPassword, betterAuthResetPassword } from '../../api/auth';

interface ForgotPasswordProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Start countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'email') {
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Use Better Auth forgot password function
        await betterAuthForgotPassword(email.trim());
        
        setSuccess('Verification code sent to your email.');
        setStep('verify');
        
      } catch (error: any) {
        setError(error.message || 'Failed to send verification code');
      } finally {
        setLoading(false);
      }
    } else if (step === 'verify') {
      if (!verificationCode.trim()) {
        setError('Please enter the verification code');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Verify the code (this will be handled in the reset step)
        setStep('reset');
        setSuccess('Code verified. Please enter your new password.');
        
      } catch (error: any) {
        setError(error.message || 'Failed to verify code');
      } finally {
        setLoading(false);
      }
    } else if (step === 'reset') {
      if (!newPassword.trim()) {
        setError('Please enter a new password');
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Reset password with verification code
        await betterAuthResetPassword(email.trim(), verificationCode.trim(), newPassword);
        
        setSuccess('Password reset successfully! Redirecting...');
        
        // Auto-success after showing message
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
        
      } catch (error: any) {
        setError(error.message || 'Failed to reset password');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    try {
      setLoading(true);
      setError(null);

      await betterAuthForgotPassword(email.trim());
      
      setSuccess('New verification code sent to your email.');
      setCountdown(60); // 60 second cooldown
      
    } catch (error: any) {
      setError(error.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-ajira-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-ajira-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {step === 'email' && 'Forgot Password?'}
          {step === 'verify' && 'Verify Your Email'}
          {step === 'reset' && 'Reset Your Password'}
        </h2>
        <p className="text-gray-600">
          {step === 'email' && 'Enter your email address and we\'ll send you a verification code to reset your password.'}
          {step === 'verify' && `We've sent a verification code to ${email}`}
          {step === 'reset' && 'Enter your new password below.'}
        </p>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-ajira-primary hover:text-ajira-primary/80 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Sign In
      </button>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 'email' && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
              disabled={loading}
            />
          </div>
        )}

        {step === 'verify' && (
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading || countdown > 0}
              className="mt-2 text-sm text-ajira-primary hover:text-ajira-primary/80 disabled:opacity-50"
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </button>
          </div>
        )}

        {step === 'reset' && (
          <>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-ajira-primary to-ajira-secondary hover:from-ajira-secondary hover:to-ajira-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent disabled:opacity-50 transition-all duration-300"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              {step === 'email' && 'Sending...'}
              {step === 'verify' && 'Verifying...'}
              {step === 'reset' && 'Resetting...'}
            </>
          ) : (
            <>
              {step === 'email' && 'Send Verification Code'}
              {step === 'verify' && 'Verify Code'}
              {step === 'reset' && 'Reset Password'}
            </>
          )}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onBack}
            className="text-ajira-primary hover:text-ajira-primary/80 font-medium"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
