import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth()

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/auth" replace />
  }

  if (adminOnly && !isAdmin) {
    // Not admin, redirect to home page
    return <Navigate to="/" replace />
  }

  // Authorized, render component
  return children
}

export default ProtectedRoute 