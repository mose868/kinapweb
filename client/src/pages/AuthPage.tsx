import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Loader2, Mail, Lock, User, Eye, EyeOff, AlertCircle, Fingerprint } from 'lucide-react'
import type { UserRole } from '../types/marketplace'
import LoadingState from '../components/common/LoadingState'
import { useBetterAuthContext } from '../contexts/BetterAuthContext'
import BiometricAuth from '../components/auth/BiometricAuth'

interface FormData {
  email: string
  password: string
  confirmPassword?: string
  displayName: string
  role: UserRole
  phoneNumber?: string
  course?: string
  year?: string
  skills?: string
  ajiraGoals?: string
  experienceLevel?: string
  preferredLearningMode?: string
  otherInfo?: string
  interests?: string[]
}

const AuthPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  
  const {
    user,
    isLoading,
    error: authError,
    isAuthenticated,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  } = useBetterAuthContext()

  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showBiometric, setShowBiometric] = useState(false)
  const [biometricMode, setBiometricMode] = useState<'register' | 'verify'>('register')

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    role: 'student',
    phoneNumber: '',
    course: '',
    year: '',
    skills: '',
    ajiraGoals: '',
    experienceLevel: '',
    preferredLearningMode: '',
    otherInfo: '',
    interests: []
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, user, navigate, from])

  // Handle auth errors
  useEffect(() => {
    if (authError) {
      setError(authError.message || 'Authentication failed')
    }
  }, [authError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      if (isSignUp) {
        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return
        }

        // Sign up with Better Auth
        const result = await signUp(formData.email, formData.password, {
          displayName: formData.displayName,
          role: formData.role,
          phoneNumber: formData.phoneNumber,
          course: formData.course,
          year: formData.year,
          skills: formData.skills,
          ajiraGoals: formData.ajiraGoals,
          experienceLevel: formData.experienceLevel,
          preferredLearningMode: formData.preferredLearningMode,
          otherInfo: formData.otherInfo,
          interests: formData.interests
        })

        if (result?.error) {
          setError(result.error)
        } else {
          setSuccess('Account created successfully! Redirecting...')
          setTimeout(() => {
            navigate(from, { replace: true })
          }, 2000)
        }
      } else {
        // Sign in with Better Auth
        const result = await signIn(formData.email, formData.password)
        
        if (result?.error) {
          setError(result.error)
        } else {
          setSuccess('Signed in successfully! Redirecting...')
          setTimeout(() => {
            navigate(from, { replace: true })
          }, 2000)
        }
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError(null)
      const result = await signInWithGoogle()
      
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess('Google sign-in successful! Redirecting...')
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 2000)
      }
    } catch (error: any) {
      setError(error.message || 'Google sign-in failed')
    }
  }

  // Biometric authentication handlers
  const handleBiometricRegister = () => {
    setBiometricMode('register')
    setShowBiometric(true)
  }

  const handleBiometricVerify = () => {
    setBiometricMode('verify')
    setShowBiometric(true)
  }

  const handleBiometricSuccess = () => {
    setShowBiometric(false)
    navigate(from, { replace: true })
  }

  const handleBiometricCancel = () => {
    setShowBiometric(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-ajira-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ajira-primary/5 via-white to-ajira-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img src="/logo.jpeg" alt="KiNaP Ajira Club" className="h-16 w-auto drop-shadow-lg rounded-lg mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">
            {isSignUp ? 'Join KiNaP Ajira Digital Club' : 'Welcome back to KiNaP Ajira'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp ? 'Already a member?' : "New to Ajira Digital?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-ajira-accent hover:text-ajira-accent/80 transition-colors"
            >
              {isSignUp ? 'Sign in here' : 'Sign up here'}
            </button>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-2 pl-10 pr-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                placeholder="Enter your email"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                placeholder="Enter your password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Additional Fields for Sign Up */}
          {isSignUp && (
            <>
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    required
                    value={formData.displayName}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-2 pl-10 pr-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div>
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
              </div>
            </>
          )}

          {/* Alternative Authentication Methods */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent transition-all duration-300"
              >
                <img 
                  src="/images/google-logo.svg" 
                  alt="Google" 
                  className="w-5 h-5 mr-2"
                />
                {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
              </button>

              {/* Biometric Authentication Button */}
              <button
                type="button"
                onClick={isSignUp ? handleBiometricRegister : handleBiometricVerify}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent transition-all duration-300"
              >
                <Fingerprint className="w-5 h-5 mr-2 text-ajira-primary" />
                {isSignUp ? 'Setup Biometric Auth' : 'Use Biometric Login'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-kenya-red to-kenya-green hover:from-kenya-green hover:to-kenya-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kenya-red disabled:opacity-50 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Biometric Authentication Modal */}
      {showBiometric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <BiometricAuth
              mode={biometricMode}
              onSuccess={handleBiometricSuccess}
              onCancel={handleBiometricCancel}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthPage 