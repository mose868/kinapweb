import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMutation } from 'react-query'
import axios from 'axios'
import { Loader2, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import type { UserRole } from '../types/marketplace'
import LoadingState from '../components/common/LoadingState'

const TEMP_MAIL_DOMAINS = [
  'tempmail', 'mailinator', '10minutemail', 'guerrillamail', 'yopmail', 'dispostable', 'maildrop', 'fakeinbox', 'trashmail', 'getnada', 'sharklasers', 'spamgourmet', 'mailnesia', 'mintemail', 'throwawaymail', 'mailcatch', 'spambox', 'mailnull', 'mytempemail', 'tempail', 'moakt', 'emailondeck', 'mail-temp', 'inboxkitten', 'mailsac', 'mailpoof', 'mail.tm', 'temp-mail', 'tempinbox', 'mail7', 'easytrashmail', 'mailbox52', 'spambog', 'spam4.me', 'dropmail', 'mailcatch.com', 'mailnesia.com', 'yopmail.com', 'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'dispostable.com', 'getnada.com', 'sharklasers.com', 'spamgourmet.com', 'maildrop.cc', 'fakeinbox.com', 'trashmail.com', 'mintemail.com', 'throwawaymail.com', 'mytempemail.com', 'moakt.com', 'emailondeck.com', 'mail-temp.com', 'inboxkitten.com', 'mailsac.com', 'mailpoof.com', 'mail.tm', 'temp-mail.org', 'tempinbox.com', 'mail7.io', 'easytrashmail.com', 'mailbox52.com', 'spambog.com', 'spam4.me', 'dropmail.me'
];

const BASEURL='https://a4a6-197-136-138-2.ngrok-free.app/api'

interface FormData {
  email: string
  password: string
  confirmPassword?: string
  displayName: string
  role: UserRole
  idNumber?: string
  phoneNumber?: string
  course?: string
  year?: string
  skills?: string
  ajiraGoals?: string
  experienceLevel?: string
  preferredLearningMode?: string
  otherInfo?: string
}

const AuthPage = () => {
  // ALL HOOKS FIRST - NEVER CHANGE THE ORDER OF HOOKS
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    role: 'buyer',
    idNumber: '',
    phoneNumber: '',
    course: '',
    year: '',
    skills: '',
    ajiraGoals: '',
    experienceLevel: '',
    preferredLearningMode: '',
    otherInfo: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [showResend, setShowResend] = useState(false)

  // Helper function to detect temp mail - MUST BE BEFORE useMutation
  const isTempMail = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase() || ''
    return TEMP_MAIL_DOMAINS.some(temp => domain.includes(temp))
  }

  // Sign up mutation - ALWAYS CALLED IN SAME ORDER
  const signUpMutation = useMutation(async () => {
    if (isTempMail(formData.email)) {
      throw new Error('Temporary/disposable email addresses are not allowed.')
    }
    
    // Build payload exactly matching the backend model
    const studentData = {
      fullname: formData.displayName,
      idNo: formData.idNumber,
      course: formData.course,
      year: formData.year,
      skills: formData.skills || '',
      experience: formData.experienceLevel,
      email: formData.email,
      phone: formData.phoneNumber,
      password: formData.password,
    }

    try {
      const response = await axios.post(`${BASEURL}/students/register-student`, studentData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = response.data
      
      // Save email to localStorage for future use
      localStorage.setItem('userEmail', formData.email)
      
      // Notify of auth update so nav can refresh if we ever auto-login at signup later
      window.dispatchEvent(new Event('authUpdated'))
      
      // Switch to sign in mode after successful registration
      setIsSignUp(false)
      setInfo('Registration successful! Please sign in with your credentials.')
      setError('')
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Registration failed')
    }
  })

  // Sign in mutation - ALWAYS CALLED IN SAME ORDER
  const signInMutation = useMutation(async () => {
    try {
      const response = await axios.post(`${BASEURL}/students/login-student`, {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = response.data
      
      // Persist session details the same way AuthContext expects
      localStorage.setItem('token', data.token)
      
      // Build basic user object; full profile will be fetched on Profile page
      const userToStore = {
        email: formData.email,
        fullname: formData.displayName || formData.email.split('@')[0],
      }
      try {
        localStorage.setItem('userData', JSON.stringify(userToStore))
      } catch (err) {
        console.warn('Unable to stringify user object:', err)
      }
      
      // Fall-back to at least store the email (used elsewhere in the UI)
      localStorage.setItem('userEmail', data.user?.email || formData.email)
      
      // Notify of auth update so nav can refresh if we ever auto-login at signup later
      window.dispatchEvent(new Event('authUpdated'))
      
      // Navigate to profile page after login
      navigate('/')
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Login failed')
    }
  })

  // useEffect hooks - ALWAYS CALLED IN SAME ORDER
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const isRegisterMode = searchParams.get('mode') === 'register'
    if (isRegisterMode) {
      setIsSignUp(true)
    }
  }, [location.search])



  // EARLY RETURNS ONLY AFTER ALL HOOKS

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (isSignUp && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      if (isSignUp) {
        await signUpMutation.mutateAsync()
      } else {
        await signInMutation.mutateAsync()
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.')
    }
  }

  const handlePasswordReset = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('Password reset functionality is not available yet.');
  }

  const handleResendVerification = () => {
    setError('Email verification is not required for this login method.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-kenya-white via-gray-50 to-kenya-green/10 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logo.jpeg" alt="KiNaP Ajira Club" className="h-16 w-auto drop-shadow-lg rounded-lg" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-kenya-black">
          {isSignUp ? 'Join KiNaP Ajira Digital Club' : 'Welcome back to KiNaP Ajira'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isSignUp ? 'Start your digital transformation journey' : 'Continue your digital journey'}{' '}
          <br />
          {isSignUp ? 'Already a member?' : "New to Ajira Digital?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setInfo(''); setShowResend(false) }}
            className="font-medium text-kenya-red hover:text-kenya-green transition-colors"
          >
            {isSignUp ? 'Sign in here' : 'Join the club'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-kenya-green/20 sm:rounded-xl sm:px-10">
          {/* Error/Info Messages */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          {info && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              <p className="text-sm">{info}</p>
            </div>
          )}

          {/* Password Reset Form */}
          {showReset ? (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="resetEmail"
                    name="resetEmail"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-ajira-accent hover:bg-ajira-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent"
                >
                  Send Reset Link
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="w-full text-sm text-ajira-accent hover:text-ajira-accent/80"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sign Up Fields */}
              {isSignUp && (
                <>
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        required
                        value={formData.displayName}
                        onChange={handleChange}
                        className="appearance-none block w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                      ID Number
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="idNumber"
                        name="idNumber"
                        type="text"
                        required
                        value={formData.idNumber}
                        onChange={handleChange}
                        className="appearance-none block w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="appearance-none block w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                      What course are you studying at KiNaP?
                    </label>
                    <select
                      id="course"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent sm:text-sm rounded-lg"
                    >
                      <option value="">Select your course</option>
                      <option value="computer-science">Computer Science</option>
                      <option value="building-tech">Building Tech</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="human-resource">Human Resource</option>
                      <option value="civil-engineering">Civil Engineering</option>
                      <option value="business-management">Business Management</option>
                      <option value="it">IT</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                      Which year/level are you in?
                    </label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent sm:text-sm rounded-lg"
                    >
                      <option value="">Select your year</option>
                      <option value="1st-year">1st Year</option>
                      <option value="2nd-year">2nd Year</option>
                      <option value="3rd-year">3rd Year</option>
                      <option value="4th-year">4th Year</option>
                      <option value="graduate">Graduate</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
                      What is your experience level?
                    </label>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent sm:text-sm rounded-lg"
                    >
                      <option value="">Select experience level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                      Digital Skills & Interests
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="skills"
                        name="skills"
                        type="text"
                        required
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="e.g., Web Development, Graphic Design, Digital Marketing"
                        className="appearance-none block w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </>
              )}

              {/* Common Fields */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ajira-accent"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setShowReset(true)}
                    className="text-xs text-ajira-accent hover:underline mt-1 float-right"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {isSignUp && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={signUpMutation.isLoading || signInMutation.isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-kenya-red to-kenya-green hover:from-kenya-green hover:to-kenya-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kenya-red disabled:opacity-50 transition-all duration-300"
                >
                  {(signUpMutation.isLoading || signInMutation.isLoading) ? (
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
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => { /* Google sign-in logic */ }}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-accent"
            >
              <img
                src="/images/google-logo.svg"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Google
            </button>
          </div>

          {showResend && (
            <div className="mt-6 text-center">
              <button
                onClick={handleResendVerification}
                className="text-sm text-ajira-accent hover:text-ajira-accent/80"
              >
                Resend verification email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage 