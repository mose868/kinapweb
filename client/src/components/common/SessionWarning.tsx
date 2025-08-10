import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, LogOut } from 'lucide-react';
import { betterAuthExtendSession, betterAuthSignOut } from '../../api/auth';

interface SessionWarningProps {
  timeRemaining: number; // milliseconds
  onExtend?: () => void;
  onSignOut?: () => void;
}

const SessionWarning: React.FC<SessionWarningProps> = ({ 
  timeRemaining, 
  onExtend, 
  onSignOut 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeRemaining);

  useEffect(() => {
    // Show warning when less than 5 minutes remaining
    if (timeRemaining < 5 * 60 * 1000 && timeRemaining > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [timeRemaining]);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1000;
          if (newTime <= 0) {
            clearInterval(interval);
            handleSignOut();
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleExtend = async () => {
    try {
      await betterAuthExtendSession();
      setIsVisible(false);
      onExtend?.();
    } catch (error) {
      console.error('Failed to extend session:', error);
      handleSignOut();
    }
  };

  const handleSignOut = async () => {
    try {
      await betterAuthSignOut();
      onSignOut?.();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 1000 / 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">
              Session Expiring Soon
            </h3>
            <p className="text-sm text-yellow-700 mb-3">
              Your session will expire in{' '}
              <span className="font-mono font-bold text-yellow-800">
                {formatTime(timeLeft)}
              </span>
              . Please extend your session to continue.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleExtend}
                className="flex items-center px-3 py-1.5 text-xs font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors"
              >
                <Clock className="w-3 h-3 mr-1" />
                Extend Session
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
              >
                <LogOut className="w-3 h-3 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;
