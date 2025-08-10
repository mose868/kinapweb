import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Loader2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Fingerprint,
} from 'lucide-react';
import type { UserRole } from '../types/marketplace';
import LoadingState from '../components/common/LoadingState';
import { useBetterAuthContext } from '../contexts/BetterAuthContext';
import BiometricAuth from '../components/auth/BiometricAuth';
import ForgotPassword from '../components/auth/ForgotPassword';
import VerificationCode from '../components/auth/VerificationCode';
import toast from 'react-hot-toast';

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName: string;
  // role: UserRole // Remove role
  phoneNumber?: string;
  course?: string;
  year?: string;
  skills?: string;
  ajiraGoals?: string;
  experienceLevel?: string;
  preferredLearningMode?: string;
  otherInfo?: string;
  interests?: string[];
}

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  console.log('🔍 AuthPage - from path:', from);

  const {
    user,
    isLoading,
    error: authError,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    verifyCode,
    resendCode,
  } = useBetterAuthContext();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [biometricMode, setBiometricMode] = useState<'register' | 'verify'>(
    'register'
  );
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationMode, setVerificationMode] = useState<'signin' | 'signup'>('signin');

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    // role: 'student', // Remove role
    phoneNumber: '',
    course: '',
    year: '',
    skills: '',
    ajiraGoals: '',
    experienceLevel: '',
    preferredLearningMode: '',
    otherInfo: '',
    interests: [],
  });

  // Redirect if already authenticated
  useEffect(() => {
    console.log('🔍 AuthPage useEffect triggered - isAuthenticated:', isAuthenticated, 'user:', user, 'from:', from);
    if (isAuthenticated && user) {
      console.log('✅ User is authenticated, navigating to:', from);
      navigate(from, { replace: true });
    } else {
      console.log('❌ User not authenticated or no user data');
    }
  }, [isAuthenticated, user, navigate, from]);

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      // Handle different error formats
      let errorMessage = 'Authentication failed';

      if (typeof authError === 'string') {
        errorMessage = authError;
      } else if (authError && typeof authError === 'object') {
        errorMessage =
          authError.message || authError.statusText || 'Authentication failed';
      }

      toast.error(`❌ ${errorMessage}`);
    }
  }, [authError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          toast.error('❌ Passwords do not match');
          return;
        }

        // Sign up with Better Auth
        console.log('Attempting sign up with:', formData.email);
        const result = await signUp(formData.email, formData.password, {
          displayName: formData.displayName,
          // role: formData.role, // Remove role
          phoneNumber: formData.phoneNumber,
          course: formData.course,
          year: formData.year,
          skills: formData.skills,
          ajiraGoals: formData.ajiraGoals,
          experienceLevel: formData.experienceLevel,
          preferredLearningMode: formData.preferredLearningMode,
          otherInfo: formData.otherInfo,
          interests: formData.interests,
        });

        console.log('Sign up result:', result);

        if (result?.requiresVerification) {
          console.log('✅ Sign up requires verification - showing modal');
          // Show verification code screen
          setVerificationEmail(formData.email);
          setVerificationMode('signup');
          setShowVerification(true);
          toast.success(`📧 ${result.message || 'Verification code sent to your email'}`);
        } else if (result?.error) {
          console.log('❌ Sign up error:', result.error);
          toast.error(`❌ ${result.error}`);
        } else {
          console.log('✅ Sign up successful - redirecting');
          toast.success('✅ Account created successfully! Redirecting...');
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 2000);
        }
      } else {
        // Sign in with Better Auth
        console.log('Attempting sign in with:', formData.email);
        const result = await signIn(formData.email, formData.password);

        console.log('Sign in result:', result);

        if (result?.requiresVerification) {
          console.log('✅ Sign in requires verification - showing modal');
          // Show verification code screen
          setVerificationEmail(formData.email);
          setVerificationMode('signin');
          setShowVerification(true);
          toast.success(`📧 ${result.message || 'Verification code sent to your email'}`);
        } else if (result?.error) {
          console.log('❌ Sign in error:', result.error);
          toast.error(`❌ ${result.error}`);
        } else {
          console.log('✅ Sign in successful - redirecting');
          toast.success('✅ Signed in successfully! Redirecting...');
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(`❌ ${error.message || 'Authentication failed'}`);
    }
  };

  const handleVerificationSuccess = () => {
    console.log('✅ handleVerificationSuccess called, navigating to:', from);
    console.log('🔍 Current auth state - isAuthenticated:', isAuthenticated, 'user:', user);
    setShowVerification(false);
    
    // Force a small delay to ensure state is updated
    setTimeout(() => {
      console.log('🔍 After delay - isAuthenticated:', isAuthenticated, 'user:', user);
      navigate(from, { replace: true });
    }, 100);
  };

  const handleVerificationBack = () => {
    setShowVerification(false);
    setVerificationEmail('');
  };

  const handleResendCode = async (email: string) => {
    try {
      const result = await resendCode(email);
      if (result?.message) {
        toast.success(`📧 ${result.message}`);
      } else {
        toast.success('📧 New verification code sent to your email');
      }
    } catch (error: any) {
      toast.error(`❌ ${error.message || 'Failed to resend code'}`);
    }
  };

  // Biometric authentication handlers
  const handleBiometricRegister = () => {
    setBiometricMode('register');
    setShowBiometric(true);
  };

  const handleBiometricVerify = () => {
    setBiometricMode('verify');
    setShowBiometric(true);
  };

  const handleBiometricSuccess = () => {
    setShowBiometric(false);
    navigate(from, { replace: true });
  };

  const handleBiometricCancel = () => {
    setShowBiometric(false);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-ajira-primary mx-auto mb-4' />
          <p className='text-gray-600'>Loading authentication...</p>
        </div>
      </div>
    );
  }

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
            {isSignUp
              ? 'Join KiNaP Ajira Digital Club'
              : 'Welcome back to KiNaP Ajira'}
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            {isSignUp ? 'Already a member?' : 'New to Ajira Digital?'}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className='font-medium text-ajira-accent hover:text-ajira-accent/80 transition-colors'
            >
              {isSignUp ? 'Sign in here' : 'Sign up here'}
            </button>
          </p>
        </div>



        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Email Field */}
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email Address
            </label>
            <div className='relative mt-1'>
              <input
                type='email'
                id='email'
                name='email'
                required
                value={formData.email}
                onChange={handleChange}
                className='appearance-none block w-full px-4 py-2 pl-10 pr-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent'
                placeholder='Enter your email'
              />
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-ajira-primary hover:text-ajira-primary/80 font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className='relative mt-1'>
              <input
                type={showPassword ? 'text' : 'password'}
                id='password'
                name='password'
                required
                value={formData.password}
                onChange={handleChange}
                className='appearance-none block w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent'
                placeholder='Enter your password'
              />
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {isSignUp && (
            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700'
              >
                Confirm Password
              </label>
              <div className='relative mt-1'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  name='confirmPassword'
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='appearance-none block w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent'
                  placeholder='Confirm your password'
                />
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Additional Fields for Sign Up */}
          {isSignUp && (
            <>
              <div>
                <label
                  htmlFor='displayName'
                  className='block text-sm font-medium text-gray-700'
                >
                  Full Name
                </label>
                <div className='relative mt-1'>
                  <input
                    type='text'
                    id='displayName'
                    name='displayName'
                    required
                    value={formData.displayName}
                    onChange={handleChange}
                    className='appearance-none block w-full px-4 py-2 pl-10 pr-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent'
                    placeholder='Enter your full name'
                  />
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                </div>
              </div>

              <div>
                <label
                  htmlFor='phoneNumber'
                  className='block text-sm font-medium text-gray-700'
                >
                  Phone Number
                </label>
                <input
                  type='tel'
                  id='phoneNumber'
                  name='phoneNumber'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent'
                  placeholder='+254 700 000 000'
                />
              </div>

              {/* Role Field */}
              {/* <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                >
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div> */}
            </>
          )}

          {/* Alternative Authentication Methods */}
          <div className='mt-4'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-4 space-y-3'>
              {/* Biometric Authentication Button */}
              <button
                type='button'
                onClick={
                  isSignUp ? handleBiometricRegister : handleBiometricVerify
                }
                className='w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent transition-all duration-300'
              >
                <Fingerprint className='w-5 h-5 mr-2 text-ajira-primary' />
                {isSignUp ? 'Setup Biometric Auth' : 'Use Biometric Login'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-kenya-red to-kenya-green hover:from-kenya-green hover:to-kenya-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kenya-red disabled:opacity-50 transition-all duration-300'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-5 h-5 animate-spin mr-2' />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Biometric Authentication Modal */}
      {showBiometric && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <BiometricAuth
              mode={biometricMode}
              onSuccess={handleBiometricSuccess}
              onCancel={handleBiometricCancel}
            />
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <ForgotPassword
              onBack={() => setShowForgotPassword(false)}
              onSuccess={() => setShowForgotPassword(false)}
            />
          </div>
        </div>
      )}

             {/* Verification Code Modal */}
       {showVerification && (
         <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
           <div className='bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6'>
             <VerificationCode
               email={verificationEmail}
               onBack={handleVerificationBack}
               onSuccess={handleVerificationSuccess}
               onVerify={verifyCode}
               onResendCode={handleResendCode}
               title={verificationMode === 'signin' ? 'Verify Your Sign In' : 'Verify Your Account'}
               message={verificationMode === 'signin' 
                 ? 'We\'ve sent a verification code to your email address to complete your sign in.'
                 : 'We\'ve sent a verification code to your email address to verify your account.'
               }
             />
           </div>
         </div>
       )}
    </div>
  );
};

export default AuthPage;
