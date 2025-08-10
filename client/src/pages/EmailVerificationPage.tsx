import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Mail, ArrowLeft, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailFromParams = searchParams.get('email');
    const emailFromStorage = localStorage.getItem('pendingVerificationEmail');
    
    if (emailFromParams) {
      setEmail(emailFromParams);
      localStorage.setItem('pendingVerificationEmail', emailFromParams);
    } else if (emailFromStorage) {
      setEmail(emailFromStorage);
    } else {
      // No email found, redirect to login
      navigate('/auth');
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    // Start countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/better-auth/verify-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess('Email verified successfully! Redirecting...');
        localStorage.removeItem('pendingVerificationEmail');
        
        // Store user data and token for automatic login
        if (data.data) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('userData', JSON.stringify(data.data.user));
        }
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/better-auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('New verification code sent! Check your email.');
        setCountdown(60); // 60 second cooldown
      } else {
        setError(data.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/auth');
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-ajira-primary/5 via-white to-ajira-secondary/5 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <img
            src='/logo.jpeg'
            alt='KiNaP Ajira Club'
            className='h-16 w-auto drop-shadow-lg rounded-lg mx-auto mb-4'
          />
          <h2 className='text-3xl font-bold text-gray-900'>
            Verify Your Email
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            We've sent a verification code to
          </p>
          <p className='text-sm font-medium text-ajira-primary'>
            {email}
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <AlertCircle className='h-5 w-5 text-red-400' />
              </div>
              <div className='ml-3'>
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <CheckCircle className='h-5 w-5 text-green-400' />
              </div>
              <div className='ml-3'>
                <p className='text-sm text-green-800'>{success}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleVerification} className='space-y-6'>
          <div>
            <label
              htmlFor='verificationCode'
              className='block text-sm font-medium text-gray-700'
            >
              Verification Code
            </label>
            <div className='relative mt-1'>
              <input
                type='text'
                id='verificationCode'
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className='appearance-none block w-full px-4 py-2 pl-10 pr-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent'
                placeholder='Enter 6-digit code'
                maxLength={6}
                required
              />
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            </div>
          </div>

          <div className='space-y-4'>
            <button
              type='submit'
              disabled={isLoading || !verificationCode.trim()}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-ajira-primary to-ajira-secondary hover:from-ajira-secondary hover:to-ajira-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent disabled:opacity-50 transition-all duration-300'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin mr-2' />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>

            <button
              type='button'
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className='w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent disabled:opacity-50 transition-all duration-300'
            >
              {isResending ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin mr-2' />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                <>
                  <RefreshCw className='w-5 h-5 mr-2' />
                  Resend Code
                </>
              )}
            </button>

            <button
              type='button'
              onClick={handleBackToLogin}
              className='w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent transition-all duration-300'
            >
              <ArrowLeft className='w-5 h-5 mr-2' />
              Back to Login
            </button>
          </div>
        </form>

        <div className='text-center'>
          <p className='text-xs text-gray-500'>
            Didn't receive the code? Check your spam folder or{' '}
            <button
              type='button'
              onClick={handleResendCode}
              disabled={countdown > 0}
              className='text-ajira-primary hover:text-ajira-primary/80 font-medium disabled:opacity-50'
            >
              request a new one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
