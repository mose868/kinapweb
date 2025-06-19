import { Link } from 'react-router-dom'
import { ArrowRight, Play, Users, Award, TrendingUp, Globe, Sparkles, Shield, Zap } from 'lucide-react'
import StoryOfTheDay from '../components/common/StoryOfTheDay'
import TestimonialSlider from '../components/common/TestimonialSlider'
import ImpactMetrics from '../components/common/ImpactMetrics'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section with Ajira Colors */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          {/* Enhanced Gradient Background with Ajira colors */}
          <div className="absolute inset-0 bg-gradient-ajira"></div>
          
          {/* Video Element */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-60"
            poster="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
          </video>
          
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-ajira-primary/90 via-ajira-secondary/80 to-ajira-primary/90"></div>
          
          {/* Enhanced Animated Particles with Ajira colors */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-ajira-accent rounded-full animate-pulse-glow"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-ajira-green-300 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-ajira-orange-300 rounded-full animate-bounce-slow"></div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-ajira-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-ajira-orange-200 rounded-full animate-ping"></div>
            <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-ajira-green-200 rounded-full animate-bounce"></div>
          </div>
          
          {/* Enhanced Floating shapes with Ajira colors */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/6 w-20 h-20 border-2 border-ajira-accent/30 rounded-xl rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-1/4 right-1/6 w-16 h-16 border-2 border-ajira-secondary/30 rounded-full rotate-12 animate-bounce-slow"></div>
            <div className="absolute top-1/2 right-1/4 w-12 h-12 border-2 border-ajira-blue-300/30 rounded-lg rotate-45 animate-pulse"></div>
          </div>
        </div>

        {/* Enhanced Hero Content */}
        <div className="relative z-10 container-custom text-center px-4">
          <div className="max-w-5xl mx-auto">
            {/* Enhanced Logo Animation */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-ajira-accent to-ajira-orange-600 rounded-3xl mb-6 shadow-ajira-xl transform hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Enhanced Main Heading */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-tight animate-slide-up">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ajira-orange-200 via-ajira-green-200 to-ajira-blue-200">
                Ajira Digital
              </span>
            </h1>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-ajira-blue-200 mb-8 animate-slide-up animation-delay-200">
              KiNaP Digital Skills Hub
            </h2>

            {/* Enhanced Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up animation-delay-400">
              Empowering the next generation of digital professionals through cutting-edge training, 
              innovative opportunities, and transformative technology solutions in Kenya.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up animation-delay-600">
              <Link
                to="/auth"
                className="group bg-gradient-to-r from-ajira-accent to-ajira-orange-600 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:shadow-ajira-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 animate-pulse-glow"
              >
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Start Your Journey
              </Link>
              
              <a
                href="https://ajiradigital.go.ke/register"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/15 backdrop-blur-sm text-white border-2 border-white/40 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Official Portal
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-slide-up animation-delay-800">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold text-ajira-orange-200 mb-2">1000+</div>
                <div className="text-white/80 text-lg">Students Trained</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold text-ajira-green-200 mb-2">150+</div>
                <div className="text-white/80 text-lg">Success Stories</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold text-ajira-blue-200 mb-2">50+</div>
                <div className="text-white/80 text-lg">Skills Programs</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl md:text-5xl font-bold text-ajira-orange-200 mb-2">100%</div>
                <div className="text-white/80 text-lg">Digital Focus</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <div className="w-8 h-12 border-2 border-ajira-orange-200/60 rounded-full flex justify-center">
              <div className="w-2 h-4 bg-ajira-orange-200/80 rounded-full mt-3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-24 bg-gradient-to-br from-ajira-light to-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-ajira-primary/10 text-ajira-primary px-6 py-3 rounded-full text-lg font-semibold mb-8">
              <Sparkles className="w-5 h-5" />
              Why Choose Us
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-ajira-text-primary mb-8">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-ajira-accent to-ajira-secondary">Ajira Digital?</span>
            </h2>
            <p className="text-2xl text-ajira-text-muted max-w-4xl mx-auto">
              Discover the comprehensive ecosystem designed to transform your digital career in Kenya
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                icon: <Users className="w-10 h-10" />,
                title: "Community Driven",
                description: "Join a thriving community of digital professionals and learners across Kenya",
                color: "from-ajira-primary to-ajira-blue-600",
                bgColor: "bg-ajira-primary/10"
              },
              {
                icon: <Award className="w-10 h-10" />,
                title: "Certified Training",
                description: "Industry-recognized certifications and skill development programs",
                color: "from-ajira-secondary to-ajira-green-600",
                bgColor: "bg-ajira-secondary/10"
              },
              {
                icon: <TrendingUp className="w-10 h-10" />,
                title: "Career Growth",
                description: "Track your progress and unlock new opportunities in the digital economy",
                color: "from-ajira-accent to-ajira-orange-600",
                bgColor: "bg-ajira-accent/10"
              },
              {
                icon: <Globe className="w-10 h-10" />,
                title: "Global Reach",
                description: "Connect with international markets and opportunities worldwide",
                color: "from-ajira-info to-ajira-blue-500",
                bgColor: "bg-ajira-info/10"
              }
            ].map((feature, index) => (
              <div key={index} className="group card-ajira-hover p-10">
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl text-white mb-8 group-hover:scale-110 transition-transform shadow-ajira-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-ajira-text-primary mb-6 group-hover:text-ajira-primary transition-colors">{feature.title}</h3>
                <p className="text-ajira-text-muted leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Success Stories Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-ajira-secondary/10 text-ajira-secondary px-6 py-3 rounded-full text-lg font-semibold mb-8">
              <Award className="w-5 h-5" />
              Success Stories
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-ajira-text-primary mb-8">Transforming Lives</h2>
            <p className="text-2xl text-ajira-text-muted max-w-4xl mx-auto">
              Discover how Ajira Digital is creating opportunities and changing lives at Kiambu National Polytechnic
            </p>
          </div>
          <StoryOfTheDay />
        </div>
      </section>

      {/* Enhanced Impact Metrics Section */}
      <section className="py-24 bg-gradient-to-br from-ajira-primary/5 to-ajira-secondary/5">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-ajira-accent/10 text-ajira-accent px-6 py-3 rounded-full text-lg font-semibold mb-8">
              <TrendingUp className="w-5 h-5" />
              Our Impact
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-ajira-text-primary mb-8">Making a Difference</h2>
            <p className="text-2xl text-ajira-text-muted max-w-4xl mx-auto">
              See the real impact we're making in digital skills development across Kenya
            </p>
          </div>
          <ImpactMetrics />
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-ajira-primary/10 text-ajira-primary px-6 py-3 rounded-full text-lg font-semibold mb-8">
              <Users className="w-5 h-5" />
              Student Voices
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-ajira-text-primary mb-8">What Students Say</h2>
            <p className="text-2xl text-ajira-text-muted max-w-4xl mx-auto">
              Real experiences from students who have transformed their careers through our programs
            </p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
      <section className="py-24 bg-gradient-ajira text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-ajira-orange-300 rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-ajira-green-300 rounded-full"></div>
          <div className="absolute bottom-20 right-1/4 w-36 h-36 border-2 border-ajira-blue-300 rounded-full"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
                <Zap className="w-12 h-12 text-ajira-orange-200" />
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to Transform Your Future?
            </h2>
            
            <p className="text-2xl text-ajira-blue-200 mb-12 max-w-3xl mx-auto">
              Join thousands of students who have already started their digital transformation journey with Ajira Digital
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/auth"
                className="bg-white text-ajira-primary px-10 py-5 rounded-2xl text-xl font-bold hover:bg-ajira-gray-100 transition-all duration-200 hover:scale-105 shadow-ajira-xl"
              >
                Join Us Today
              </Link>
              
              <Link
                to="/marketplace"
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white/30 transition-all duration-200 hover:scale-105"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home