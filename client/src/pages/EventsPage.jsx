import React from 'react'
import { Calendar, MapPin, Clock, Users, Star, TrendingUp, Palette } from 'lucide-react'

const EventsPage = () => {
  const events = [
    {
      title: "Financial Markets & Trading Fundamentals",
      description: "Master the basics of financial markets, forex trading, cryptocurrency, and investment strategies. Learn how to analyze market trends and make informed trading decisions.",
      date: "February 15-16, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "KiNaP Finance Lab",
      capacity: "40 participants",
      category: "Finance",
      featured: true,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Graphic Design Mastery Workshop",
      description: "Comprehensive 2-day workshop covering Adobe Creative Suite, brand identity design, logo creation, and digital illustration. Perfect for aspiring graphic designers.",
      date: "March 8-9, 2025",
      time: "10:00 AM - 6:00 PM",
      location: "KiNaP Design Studio",
      capacity: "35 participants",
      category: "Design",
      featured: true,
      icon: <Palette className="w-6 h-6" />,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Freelancing Success Workshop",
      description: "Learn how to build a successful freelancing career with insights from top Kenyan freelancers who are earning $1000+ monthly.",
      date: "March 22, 2025",
      time: "2:00 PM - 6:00 PM",
      location: "KiNaP Auditorium",
      capacity: "100 participants",
      category: "Business"
    },
    {
      title: "AI & Automation in Digital Work - 2025 Trends",
      description: "Discover how artificial intelligence and automation are reshaping digital work opportunities and how to leverage these tools.",
      date: "April 12, 2025",
      time: "10:00 AM - 3:00 PM",
      location: "KiNaP Innovation Hub",
      capacity: "75 participants",
      category: "Technology"
    },
    {
      title: "Women in Tech Networking Event",
      description: "Empowering women in technology through networking, mentorship, and skill-sharing sessions with successful female tech entrepreneurs.",
      date: "May 18, 2025",
      time: "1:00 PM - 5:00 PM",
      location: "KiNaP Conference Room",
      capacity: "80 participants",
      category: "Networking"
    },
    {
      title: "Digital Marketing Masterclass 2025",
      description: "Advanced strategies for social media marketing, SEO, content creation, and influencer marketing in the current digital landscape.",
      date: "June 14, 2025",
      time: "9:00 AM - 4:00 PM",
      location: "KiNaP Media Center",
      capacity: "60 participants",
      category: "Marketing"
    },
    {
      title: "Youth Digital Entrepreneurship Expo 2025",
      description: "Showcase your digital business ideas, network with investors, and learn from successful young entrepreneurs in Kenya.",
      date: "October 3, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "KiNaP Main Hall",
      capacity: "200 participants"
    }
  ]

  const getCategoryColor = (category) => {
    const colors = {
      Finance: "bg-green-100 text-green-800",
      Design: "bg-purple-100 text-purple-800",
      Business: "bg-blue-100 text-blue-800",
      Technology: "bg-gray-100 text-gray-800",
      Networking: "bg-pink-100 text-pink-800",
      Marketing: "bg-orange-100 text-orange-800"
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-ajira-primary mb-4">Upcoming Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our specialized workshops and events to advance your digital skills and career.
          </p>
        </div>

        {/* Featured Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            Featured Events
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {events.filter(event => event.featured).map((event, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${event.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${event.color} text-white mr-3`}>
                        {event.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-green-500" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="text-sm">{event.capacity}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className={`flex-1 bg-gradient-to-r ${event.color} text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200`}>
                      Register Now
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Events */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Events</h2>
          <div className="space-y-4">
            {events.filter(event => !event.featured).map((event, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0 flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 mr-3">
                        {event.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.capacity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 md:ml-6">
                    <button className="bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary-dark transition-colors">
                      Register Now
                    </button>
                    <button className="border border-ajira-primary text-ajira-primary px-6 py-2 rounded-lg hover:bg-ajira-primary hover:text-white transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Events Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold text-ajira-primary mb-4">
            Past Events
          </h2>
          <p className="text-gray-600 mb-6">
            Check out recordings and resources from our previous events.
          </p>
          <button className="bg-ajira-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-ajira-primary-dark transition-colors">
            View Archive
          </button>
        </div>

        {/* Call to Action */}
        <div className="bg-ajira-primary rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Want to Host an Event?
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Share your knowledge and expertise with our community. Propose an event or workshop.
          </p>
          <button className="bg-white text-ajira-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Submit Proposal
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventsPage 