import React, { useState, useEffect } from 'react';
import { CheckCircle2, X, Trophy, Target, User, Briefcase, Users, ArrowRight } from 'lucide-react';

interface SuccessNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'complete';
  completionPercentage?: number;
  completedFields?: Array<{
    name: string;
    completed: boolean;
    icon?: React.ReactNode;
  }>;
  hasInterests?: boolean;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
  isVisible,
  onClose,
  title,
  message,
  type = 'success',
  completionPercentage,
  completedFields = [],
  hasInterests = false
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      // Auto-close after 5 seconds for regular success, 8 seconds for complete
      const timeout = setTimeout(() => {
        handleClose();
      }, type === 'complete' ? 8000 : 5000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, type]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  const isComplete = type === 'complete' && completionPercentage === 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`
        transform transition-all duration-300 ease-out
        ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100
      `}>
        {/* Header */}
        <div className={`
          relative p-6 rounded-t-2xl
          ${isComplete 
            ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
            : 'bg-gradient-to-br from-ajira-primary to-blue-600'
          }
        `}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {isComplete ? (
                <Trophy className="w-8 h-8 text-white" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              {completionPercentage !== undefined && (
                <p className="text-white/90 text-sm font-medium">
                  {completionPercentage}% Complete
                </p>
              )}
            </div>
          </div>

          {/* Progress bar for non-complete states */}
          {!isComplete && completionPercentage !== undefined && (
            <div className="mt-4">
              <div className="bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 leading-relaxed mb-4">{message}</p>

          {/* Completed Fields */}
          {completedFields.length > 0 && (
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-gray-800 text-sm">Updated Fields:</h4>
              <div className="space-y-1">
                {completedFields.map((field, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className={`
                      w-4 h-4 rounded-full flex items-center justify-center
                      ${field.completed ? 'bg-green-100' : 'bg-gray-100'}
                    `}>
                      {field.completed ? (
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                      )}
                    </div>
                    <span className={field.completed ? 'text-green-700' : 'text-gray-500'}>
                      {field.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Community Groups Message */}
          {hasInterests && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Auto-Added to Groups!</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                You've been automatically added to relevant groups based on your interests and skills.
              </p>
              <div className="flex items-center justify-between bg-blue-100 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-blue-800 font-medium">Visit Community Hub</span>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Check out your new groups, connect with like-minded members, and start collaborating!
              </p>
            </div>
          )}

          {/* Special complete message */}
          {isComplete && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">You're all set!</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Access all community features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>Apply for ambassador roles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Use the marketplace</span>
                </div>
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleClose}
            className={`
              w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200
              ${isComplete
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                : 'bg-gradient-to-r from-ajira-primary to-blue-600 hover:from-ajira-primary/90 hover:to-blue-700 text-white'
              }
              transform hover:scale-[1.02] active:scale-[0.98]
            `}
          >
            {isComplete ? '🎉 Awesome!' : 'Great!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;
