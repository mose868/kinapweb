import { useState, useEffect, useCallback } from 'react'
import { getCurrentUser, logout as apiLogout } from '../api/auth'
import type { UserProfile } from '../types/marketplace'

interface AuthState {
  user: UserProfile | null
  loading: boolean
  error: Error | null
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setState({ user: null, loading: false, error: null })
        return
      }
      const { data } = await getCurrentUser()
      const user = data.data.user
      // Map to existing shape expected in UI (uid instead of _id)
      setState({
        user: {
          uid: user._id,
          email: user.email,
          ...user,
        } as UserProfile,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('Auth error:', error)
      setState({ user: null, loading: false, error: error as Error })
    }
  }, [])

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const signOut = async () => {
    try {
      await apiLogout()
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('token')
      setState({ user: null, loading: false, error: null })
    }
  }

  return { ...state, signOut }
}

export default useAuth 