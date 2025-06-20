import React from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
    
    // Log specific hook errors for debugging
    if (error.message.includes('hook') || error.message.includes('render')) {
      console.error('React Hooks Error Details:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    // Reload the page to ensure fresh state
    window.location.reload()
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isHooksError = this.state.error?.message.includes('hook') || 
                          this.state.error?.message.includes('render')

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-kenya-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-kenya-red" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {isHooksError ? 'Application Error' : 'Something went wrong'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {isHooksError 
                ? 'There was an issue with the application. This usually happens when navigating between pages. Please try refreshing the page.'
                : 'An unexpected error occurred. Our team has been notified and we\'re working on a fix.'
              }
            </p>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Error Details:</h3>
                <code className="text-xs text-gray-600 break-all">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-kenya-red to-kenya-green hover:from-kenya-green hover:to-kenya-red text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </button>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">
                  If this error persists, please contact support:
                </p>
                <a 
                  href="mailto:support@kinap-ajira.com" 
                  className="text-kenya-red hover:text-kenya-green text-sm font-medium flex items-center justify-center gap-1"
                >
                  <Mail className="w-4 h-4" />
                  support@kinap-ajira.com
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary 