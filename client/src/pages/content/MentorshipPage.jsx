import React from 'react'
import { Users, Target, Calendar, MessageSquare } from 'lucide-react'

const MentorshipPage = () => {
  const mentorshipPrograms = [
    {
      title: "One-on-One Mentoring",
      description: "Get personalized guidance from experienced professionals in your field of interest.",
      icon: <Users className="w-8 h-8 text-ajira-primary" />,
      duration: "3 months"
    },
    {
      title: "Group Mentoring",
      description: "Join a small group of peers and learn together under the guidance of an industry expert.",
      icon: <Target className="w-8 h-8 text-ajira-primary" />,
      duration: "6 months"
    },
    {
      title: "Career Development",
      description: "Get guidance on career planning, skill development, and professional growth.",
      icon: <Calendar className="w-8 h-8 text-ajira-primary" />,
      duration: "Ongoing"
    },
    {
      title: "Project Mentoring",
      description: "Receive guidance and feedback on your personal or professional projects.",
      icon: <MessageSquare className="w-8 h-8 text-ajira-primary" />,
      duration: "Project-based"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ajira-primary mb-4">Mentorship Programs</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with experienced mentors who can guide you on your journey to success in the digital economy.
          </p>
        </div>

        {/* Mentorship Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {mentorshipPrograms.map((program, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {program.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ajira-primary font-medium">
                      Duration: {program.duration}
                    </span>
                    <button className="bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary-dark transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become a Mentor Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-ajira-primary mb-4">
            Become a Mentor
          </h2>
          <p className="text-gray-600 mb-6">
            Share your expertise and help shape the next generation of digital professionals. Join our mentorship program as a mentor.
          </p>
          <button className="bg-ajira-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-ajira-primary-dark transition-colors">
            Apply as Mentor
          </button>
        </div>

        {/* Call to Action */}
        <div className="bg-ajira-primary rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Take the first step towards achieving your goals with our mentorship programs.
          </p>
          <button className="bg-white text-ajira-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Find a Mentor
          </button>
        </div>
      </div>
    </div>
  )
}

export default MentorshipPage 