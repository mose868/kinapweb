import React from 'react'
import { BookOpen, Video, Award, Users } from 'lucide-react'

const TrainingPage = () => {
  const trainingPrograms = [
    {
      title: "Web Development",
      description: "Learn modern web development using React, Node.js, and other cutting-edge technologies.",
      icon: <BookOpen className="w-8 h-8 text-ajira-accent" />,
      duration: "12 weeks"
    },
    {
      title: "Digital Marketing",
      description: "Master social media marketing, SEO, content marketing, and digital advertising strategies.",
      icon: <Video className="w-8 h-8 text-ajira-accent" />,
      duration: "8 weeks"
    },
    {
      title: "Freelancing Skills",
      description: "Develop essential skills for successful freelancing including client communication and project management.",
      icon: <Award className="w-8 h-8 text-ajira-accent" />,
      duration: "6 weeks"
    },
    {
      title: "Graphic Design",
      description: "Learn professional graphic design using industry-standard tools and techniques.",
      icon: <Users className="w-8 h-8 text-ajira-accent" />,
      duration: "10 weeks"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ajira-primary mb-4">Training Programs</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enhance your digital skills with our comprehensive training programs designed for the modern digital economy.
          </p>
        </div>

        {/* Training Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {trainingPrograms.map((program, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 bg-ajira-primary/5 p-3 rounded-lg">
                  {program.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-ajira-primary mb-2">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ajira-accent font-medium">
                      Duration: {program.duration}
                    </span>
                    <button className="bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-ajira-primary rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join our training programs and gain the skills needed to succeed in the digital economy.
          </p>
          <button className="bg-ajira-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-ajira-accent/90 transition-colors">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default TrainingPage 