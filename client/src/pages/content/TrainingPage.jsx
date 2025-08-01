import React, { useState } from 'react'
import { 
  BookOpen, 
  Video, 
  Award, 
  Users, 
  Clock, 
  DollarSign, 
  Star, 
  Eye,
  Calendar,
  MapPin,
  Search,
  Filter,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  Globe,
  Shield,
  Headphones,
  Code,
  Palette,
  BarChart3
} from 'lucide-react'

const TrainingPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [showFreeOnly, setShowFreeOnly] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 w-full overflow-x-hidden">
      <div className="container-custom px-2 sm:px-4 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-ajira-primary mb-4">
            🎓 Digital Skills Academy
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Transform your career with cutting-edge digital skills training designed for the modern workforce
          </p>
        </div>

        {/* Enhanced Coming Soon Section */}
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-5xl mx-auto">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ajira-primary mb-4">
              Your Digital Transformation Journey Starts Here!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              We're building a comprehensive digital skills academy that will revolutionize how you learn, grow, and succeed in the digital economy. Get ready for:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-left">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Video className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Interactive Learning</h3>
                  <p className="text-gray-600 text-sm">Engage with video tutorials, hands-on projects, and real-world case studies</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Expert Mentorship</h3>
                  <p className="text-gray-600 text-sm">Learn from industry professionals and successful digital entrepreneurs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Career-Focused</h3>
                  <p className="text-gray-600 text-sm">Skills that directly translate to job opportunities and career advancement</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Flexible Learning</h3>
                  <p className="text-gray-600 text-sm">Learn at your own pace with 24/7 access to course materials</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Certification</h3>
                  <p className="text-gray-600 text-sm">Earn recognized certificates to boost your professional credibility</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Global Network</h3>
                  <p className="text-gray-600 text-sm">Connect with learners worldwide and build your professional network</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-ajira-primary/10 via-ajira-accent/10 to-ajira-secondary/10 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-ajira-primary mb-4">Upcoming Course Categories:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Web Development</span>
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Digital Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">Data Analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-700">Digital Marketing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700">Content Creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span className="text-gray-700">Cybersecurity</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">E-commerce</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Freelancing</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-ajira-primary/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-ajira-primary mb-1">50+</div>
                <div className="text-sm text-gray-600">Expert Instructors</div>
              </div>
              <div className="bg-ajira-accent/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-ajira-accent mb-1">200+</div>
                <div className="text-sm text-gray-600">Course Modules</div>
              </div>
              <div className="bg-ajira-secondary/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-ajira-secondary mb-1">24/7</div>
                <div className="text-sm text-gray-600">Learning Access</div>
              </div>
            </div>
            
            <div className="bg-ajira-primary/5 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-ajira-primary mb-2">Why Choose Our Training Academy?</h3>
              <p className="text-gray-700 text-sm mb-4">
                Our training programs are specifically designed for the African digital economy, combining global best practices with local market insights. 
                We focus on practical, job-ready skills that employers actually need.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Industry-aligned curriculum</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Hands-on project experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Job placement support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Lifetime access to updates</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm">
              We're finalizing our curriculum and assembling our expert instructor team. Get ready to accelerate your digital career! 🚀
            </p>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="bg-gradient-to-r from-ajira-primary to-ajira-secondary rounded-2xl p-6 sm:p-8 text-center w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of learners who will master in-demand digital skills and advance their careers. 
            Be among the first to access our comprehensive training programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
            <button className="bg-white text-ajira-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Get Early Access
            </button>
            <button className="bg-ajira-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-ajira-accent/90 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Join Waitlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingPage 