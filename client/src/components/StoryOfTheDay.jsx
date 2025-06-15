import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, User, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const StoryOfTheDay = () => {
  const [currentStory, setCurrentStory] = useState(0)

  // Sample stories - in real app, this would come from API
  const stories = [
    {
      id: 1,
      title: "From Student to Freelance Web Developer - 2025 Journey",
      author: "Grace Wanjiku",
      location: "Kiambu",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face",
      excerpt: "After completing the web development course at Ajira Digital, I landed my first freelance project worth Ksh 50,000. Now I'm earning over Ksh 150,000 monthly working with international clients in 2025.",
      date: "2 days ago",
      category: "Web Development",
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "Digital Marketing Success: My 2025 Journey to Financial Freedom",
      author: "John Kimani",
      location: "Nairobi",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
      excerpt: "Starting with zero knowledge in digital marketing, Ajira Digital equipped me with skills that changed my life. I now manage social media for 20+ businesses and run my own agency with 5 employees.",
      date: "1 week ago",
      category: "Digital Marketing",
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "Data Entry to AI Data Analysis: My 2025 Career Transformation",
      author: "Mary Njeri",
      location: "Thika",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face",
      excerpt: "What started as simple data entry work evolved into advanced AI-powered data analysis projects. Thanks to Ajira Digital's 2025 training programs, I now work with international companies as a senior data scientist.",
      date: "3 days ago",
      category: "Data Analysis",
      readTime: "5 min read"
    },
    {
      id: 4,
      title: "Content Creator to Brand Ambassador - 2025 Success",
      author: "Peter Mwangi",
      location: "Nakuru",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face",
      excerpt: "Through Ajira Digital's content creation program, I built a YouTube channel with 50K+ subscribers and now work as a brand ambassador for major tech companies.",
      date: "5 days ago",
      category: "Content Creation",
      readTime: "4 min read"
    }
  ]

  // Auto-rotate stories every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [stories.length])

  const story = stories[currentStory]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        key={story.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl overflow-hidden shadow-ajira"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-64 lg:h-auto">
            <img
              src={story.image}
              alt={story.author}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-ajira-blue text-white px-3 py-1 rounded-full text-sm font-medium">
                {story.category}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center space-x-4 text-sm text-ajira-gray mb-4">
              <div className="flex items-center space-x-1">
                <Clock size={16} />
                <span>{story.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>•</span>
                <span>{story.readTime}</span>
              </div>
            </div>

            <h3 className="text-2xl lg:text-3xl font-bold text-ajira-blue mb-4">
              {story.title}
            </h3>

            <p className="text-ajira-gray text-lg mb-6 leading-relaxed">
              {story.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-ajira-blue/10 rounded-full flex items-center justify-center">
                  <User size={20} className="text-ajira-blue" />
                </div>
                <div>
                  <p className="font-semibold text-ajira-blue">{story.author}</p>
                  <div className="flex items-center space-x-1 text-sm text-ajira-gray">
                    <MapPin size={14} />
                    <span>{story.location}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/media-upload"
                className="inline-flex items-center text-ajira-blue hover:text-ajira-lightBlue font-semibold transition-colors"
              >
                Share Your Story
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Story Navigation Dots */}
      <div className="flex justify-center space-x-3 mt-8">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStory(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentStory ? 'bg-ajira-blue' : 'bg-ajira-gray/30'
            }`}
          />
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Link
          to="/media-upload"
          className="btn-primary inline-flex items-center text-lg"
        >
          Submit Your Success Story
          <ArrowRight className="ml-2" size={20} />
        </Link>
      </div>
    </div>
  )
}

export default StoryOfTheDay 