import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ArrowRight, User, Target, Users } from 'lucide-react';
import { checkProfileRequirements, getFieldDisplayName, type ProfileData } from '../../utils/profileCompletion';

interface ProfileCompletionBannerProps {
  profileData: ProfileData;
  feature: 'community' | 'ambassador' | 'marketplace';
  onComplete?: () => void;
}

const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({ 
  profileData, 
  feature, 
  onComplete 
}) => {
  const { allowed, completion, requiredCompletion, missingFields } = checkProfileRequirements(profileData, feature);

  if (allowed) {
    return null; // Don't show banner if requirements are met
  }

  const getFeatureInfo = () => {
    switch (feature) {
      case 'community':
        return {
          title: 'Complete Your Profile to Access Community Hub',
          description: 'Help us understand your interests to match you with the right community groups. Your profile helps create better learning communities.',
          icon: <Users className="w-6 h-6" />,
          color: 'bg-blue-50 border-blue-200 text-blue-800'
        };
      case 'ambassador':
        return {
          title: 'Complete Your Profile to Join Ambassador Program',
          description: 'Represent KiNaP Ajira Club and help other students succeed in their digital journey.',
          icon: <Target className="w-6 h-6" />,
          color: 'bg-purple-50 border-purple-200 text-purple-800'
        };
      case 'marketplace':
        return {
          title: 'Complete Your Profile to Access Marketplace',
          description: 'Start offering services or browse available opportunities.',
          icon: <User className="w-6 h-6" />,
          color: 'bg-green-50 border-green-200 text-green-800'
        };
    }
  };

  const featureInfo = getFeatureInfo();

  return (
    <div className={`border rounded-lg p-6 mb-6 ${featureInfo.color}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {featureInfo.icon}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">
            {featureInfo.title}
          </h3>
          
          <p className="text-sm mb-4 opacity-90">
            {featureInfo.description}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Profile Completion</span>
              <span>{completion}% / {requiredCompletion}%</span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2">
              <div 
                className="bg-current h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(completion, 100)}%` }}
              />
            </div>
          </div>

          {/* Missing Fields */}
          {missingFields.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Missing Required Fields:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {missingFields.slice(0, 6).map((field) => (
                  <div key={field} className="flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span>{getFieldDisplayName(field)}</span>
                  </div>
                ))}
                {missingFields.length > 6 && (
                  <div className="text-sm opacity-75">
                    +{missingFields.length - 6} more fields
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center justify-center px-4 py-2 bg-current text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <User className="w-4 h-4 mr-2" />
              Complete Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            
            {onComplete && (
              <button
                onClick={onComplete}
                className="inline-flex items-center justify-center px-4 py-2 border border-current rounded-lg hover:bg-white/20 transition-colors font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                I'll Complete Later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionBanner; 