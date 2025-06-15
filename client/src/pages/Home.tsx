import { Link } from 'react-router-dom'
import { ArrowRight, Play, Users, Award, TrendingUp, Globe } from 'lucide-react'
import StoryOfTheDay from '../components/StoryOfTheDay'
import TestimonialSlider from '../components/TestimonialSlider'
import ImpactMetrics from '../components/ImpactMetrics'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          {/* Gradient Background (always present as fallback) */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
          
          {/* Video Element (will fallback to gradient if video not available) */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-70"
            poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            onError={(e) => {
              // Hide video if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
          </video>
          
          {/* Additional Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-purple-900/80 to-blue-900/90"></div>
          
          {/* Animated Particles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
          </div>
          
          {/* Floating geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/6 w-16 h-16 border border-blue-400/30 rotate-45 animate-float"></div>
            <div className="absolute bottom-1/4 right-1/6 w-12 h-12 border border-purple-400/30 rotate-12 animate-float animation-delay-400"></div>
            <div className="absolute top-1/2 right-1/4 w-8 h-8 border border-cyan-400/30 rotate-45 animate-float animation-delay-800"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container-custom text-center px-4">
          <div className="max-w-4xl mx-auto">
            {/* Logo Animation */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">A</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-slide-up">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ajira Digital
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-200 mb-8 animate-slide-up animation-delay-200">
              Kiambu National Polytechnic Hub
            </h2>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-400">
              Empowering the next generation of digital professionals through cutting-edge training, 
              innovative opportunities, and transformative technology solutions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up animation-delay-600">
              <Link
                to="/auth"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Your Journey
              </Link>
              
              <a
                href="https://ajiradigital.go.ke/register"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Official Portal
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up animation-delay-800">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-2">500+</div>
                <div className="text-white/80 text-sm">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">50+</div>
                <div className="text-white/80 text-sm">Success Stories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">25+</div>
                <div className="text-white/80 text-sm">Skills Programs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">100%</div>
                <div className="text-white/80 text-sm">Digital Focus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ajira Digital?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the comprehensive ecosystem designed to transform your digital career
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Driven",
                description: "Join a thriving community of digital professionals and learners",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Certified Training",
                description: "Industry-recognized certifications and skill development programs",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Career Growth",
                description: "Track your progress and unlock new opportunities",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Reach",
                description: "Connect with international markets and opportunities",
                color: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Story Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Ajira Digital is transforming lives at Kiambu National Polytechnic
            </p>
          </div>
          <StoryOfTheDay />
        </div>
      </section>

      {/* Impact Metrics Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Impact</h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Making a difference in the digital economy through training and opportunities
            </p>
          </div>
          <ImpactMetrics />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students and professionals who have transformed their careers through Ajira Digital
            </p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-white/5 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your Digital Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                Join Ajira Digital at Kiambu National Polytechnic and unlock your potential in the digital economy.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started Today
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home