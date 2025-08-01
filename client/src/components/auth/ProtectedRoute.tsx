import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useBetterAuthContext } from '../../contexts/BetterAuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'buyer' | 'seller' | 'admin'
}

// Simple redirect tracking to prevent rapid auth redirects only
let lastAuthRedirectTime = 0
const AUTH_REDIRECT_THROTTLE_MS = 2000 // 2 seconds

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useBetterAuthContext()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-ajira-accent animate-spin" />
      </div>
    )
  }

  if (!user) {
    const now = Date.now()
    // Only throttle auth redirects, not normal navigation
    if (now - lastAuthRedirectTime < AUTH_REDIRECT_THROTTLE_MS) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-ajira-accent animate-spin" />
        </div>
      )
    }
    lastAuthRedirectTime = now
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute 