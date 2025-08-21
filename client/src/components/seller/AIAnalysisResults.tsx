import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Lightbulb,
  Star,
  Shield,
  Award,
  Target,
} from 'lucide-react';

interface AIAnalysisResultsProps {
  aiScore: number;
  contentQuality: number;
  recommendations: string[];
  strengths: string[];
  marketplaceReadiness: boolean;
  analyzing?: boolean;
}

const AIAnalysisResults: React.FC<AIAnalysisResultsProps> = ({
  aiScore,
  contentQuality,
  recommendations,
  strengths,
  marketplaceReadiness,
  analyzing = false,
}) => {
  if (analyzing) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-ajira-primary to-ajira-accent rounded-full mb-6 animate-spin">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analyzing Your Profile...
        </h3>
        <p className="text-gray-600">
          Our AI is reviewing your content, portfolio, and overall profile quality
        </p>
      </div>
    );
  }

  if (aiScore === 0) {
    return (
      <div className="text-center py-8">
        <button
          className="bg-gradient-to-r from-ajira-primary to-ajira-accent text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity font-medium text-lg flex items-center gap-3 mx-auto"
        >
          <Sparkles className="w-6 h-6" />
          Analyze My Profile with AI
        </button>
        <p className="text-gray-500 mt-4">
          This will take a few seconds to analyze your content quality
        </p>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 80) return 'from-ajira-primary to-ajira-accent';
    if (score >= 70) return 'from-yellow-500 to-amber-500';
    if (score >= 60) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return Award;
    if (score >= 80) return Star;
    if (score >= 70) return Target;
    return TrendingUp;
  };

  const ScoreIcon = getScoreIcon(aiScore);

  return (
    <div className="space-y-6">
      {/* AI Score Display */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`bg-gradient-to-r ${getScoreBgColor(aiScore)} p-6 rounded-2xl text-white`}
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <ScoreIcon className="w-8 h-8" />
          </div>
          <div className="text-4xl font-bold mb-2">
            {aiScore}/100
          </div>
          <p className="text-white/90">AI Profile Score</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Content Quality</span>
              <span>{contentQuality}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                className="bg-white h-3 rounded-full transition-all duration-1000"
                initial={{ width: 0 }}
                animate={{ width: `${contentQuality}%` }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Marketplace Readiness</span>
              <span>{marketplaceReadiness ? '100%' : '70%'}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                className="bg-white h-3 rounded-full transition-all duration-1000"
                initial={{ width: 0 }}
                animate={{ width: marketplaceReadiness ? '100%' : '70%' }}
                transition={{ delay: 0.7, duration: 1 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Strengths Section */}
      {strengths.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-green-50 p-6 rounded-2xl border border-green-200"
        >
          <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5" />
            Your Profile Strengths
          </h4>
          <ul className="space-y-3">
            {strengths.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-3 text-green-800"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 p-6 rounded-2xl border border-blue-200"
        >
          <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Recommendations
          </h4>
          <ul className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <motion.li
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-3 text-blue-800"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Marketplace Status */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className={`p-6 rounded-2xl ${
          marketplaceReadiness 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          {marketplaceReadiness ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          )}
          <h4 className={`font-semibold ${
            marketplaceReadiness ? 'text-green-900' : 'text-yellow-900'
          }`}>
            {marketplaceReadiness 
              ? '🚀 Ready for Marketplace' 
              : '⚡ Needs Improvement'
            }
          </h4>
        </div>
        <p className={`text-sm ${
          marketplaceReadiness ? 'text-green-800' : 'text-yellow-800'
        }`}>
          {marketplaceReadiness
            ? 'Excellent! Your profile meets our marketplace standards and will be approved automatically. You\'re ready to start attracting clients!'
            : 'Your profile has good potential but needs some improvements before it can go live. Follow the recommendations above to boost your score.'
          }
        </p>
        
        {marketplaceReadiness && (
          <div className="mt-4 flex items-center gap-2 text-green-700">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Auto-approved for marketplace</span>
          </div>
        )}
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="bg-gray-50 p-6 rounded-2xl"
      >
        <h4 className="font-semibold text-gray-900 mb-4">Score Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${getScoreColor(aiScore)}`}>
              {aiScore}
            </div>
            <div className="text-xs text-gray-600">Overall Score</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${getScoreColor(contentQuality)}`}>
              {contentQuality}
            </div>
            <div className="text-xs text-gray-600">Content Quality</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {strengths.length}
            </div>
            <div className="text-xs text-gray-600">Strengths</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {recommendations.length}
            </div>
            <div className="text-xs text-gray-600">Improvements</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIAnalysisResults;

