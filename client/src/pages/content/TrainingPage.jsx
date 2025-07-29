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
  AlertCircle
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
          <h1 className="text-3xl sm:text-4xl font-bold text-ajira-primary mb-4">Training Programs</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            We are currently preparing exciting training programs to help you enhance your digital skills. Stay tuned for updates!
          </p>
        </div>

        {/* No Training Programs Available */}
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No training programs available</h3>
          <p className="text-gray-600 mb-4">
            Training programs are currently being prepared. Check back soon for exciting learning opportunities!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="bg-ajira-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-ajira-primary/90 transition-colors">
              Subscribe to Updates
            </button>
            <button className="bg-ajira-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-ajira-accent/90 transition-colors">
              Contact Us
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-ajira-primary to-ajira-secondary rounded-lg p-4 sm:p-8 text-center w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Join thousands of students who will transform their careers through our upcoming training programs. 
            Get industry-relevant skills and advance your career in the digital economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
            <button className="bg-white text-ajira-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto">
              Get Notified
            </button>
            <button className="bg-ajira-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-ajira-accent/90 transition-colors w-full sm:w-auto">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingPage 