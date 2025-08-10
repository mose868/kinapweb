import { useEffect, useRef } from 'react';
import { betterAuthCheckSession, betterAuthSignOut } from '../api/auth';

interface UseSessionOptions {
  onSessionExpired?: () => void;
  checkInterval?: number; // milliseconds
  warningTime?: number; // milliseconds before expiry to show warning
}

export const useSession = (options: UseSessionOptions = {}) => {
  const {
    onSessionExpired,
    checkInterval = 60000, // Check every minute
    warningTime = 300000 // Show warning 5 minutes before expiry
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkSession = async () => {
    try {
      const response = await betterAuthCheckSession();
      
      if (response.success && response.data) {
        const timeRemaining = response.data.timeRemaining;
        
        // Show warning if session is about to expire
        if (timeRemaining < warningTime && timeRemaining > 0) {
          console.log(`⚠️ Session expires in ${Math.round(timeRemaining / 1000 / 60)} minutes`);
          // You can show a notification here
        }
        
        // If session has expired or is about to expire, sign out
        if (timeRemaining <= 0) {
          console.log('🕐 Session expired, signing out...');
          await betterAuthSignOut();
          onSessionExpired?.();
        }
      }
    } catch (error) {
      console.log('Session check failed, signing out...');
      await betterAuthSignOut();
      onSessionExpired?.();
    }
  };

  const startSessionMonitoring = () => {
    // Clear existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Check session immediately
    checkSession();

    // Set up periodic session checks
    intervalRef.current = setInterval(checkSession, checkInterval);
  };

  const stopSessionMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  };

  // Activity detection
  const resetSessionTimer = () => {
    // Reset the session timer on user activity
    checkSession();
  };

  useEffect(() => {
    // Start monitoring when component mounts
    startSessionMonitoring();

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetSessionTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup on unmount
    return () => {
      stopSessionMonitoring();
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  return {
    checkSession,
    startSessionMonitoring,
    stopSessionMonitoring,
    resetSessionTimer
  };
};
