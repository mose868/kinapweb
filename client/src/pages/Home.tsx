import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ArrowRight, Play, Users, Award, TrendingUp, Globe, Sparkles, Shield, Zap } from 'lucide-react'
import StoryOfTheDay from '../components/common/StoryOfTheDay'
import TestimonialSlider from '../components/common/TestimonialSlider'
import ImpactMetrics from '../components/common/ImpactMetrics'

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await axios.get('/api/homepage');
        setHomeData(res.data);
      } catch (e) {
        setHomeData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, []);
  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  return (
    <div className="min-h-screen bg-ajira-white w-full overflow-x-hidden">
      {/* Gaming-style Hero Section with Enhanced Background Video */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden w-full">
        {/* Enhanced Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
            poster="/images/hero-poster.jpg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.style.background = 'linear-gradient(135deg, #000000 0%, #CE1126 35%, #006B3F 70%, #000000 100%)';
              }
            }}
            onLoadedData={() => {
              console.log('Background video loaded successfully');
            }}
          >
            <source src="/videos/digital-transformation.mp4" type="video/mp4" />
            <source src="/videos/kinap-promo.webm" type="video/webm" />
            <source src="/videos/ajira-background.mov" type="video/quicktime" />
            Your browser does not support the video tag.
          </video>
          
          {/* Professional Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-kenya-black/90 via-kenya-green/80 to-kenya-red/85"></div>
          
          {/* Dynamic Particles Overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            {/* Enhanced floating particles */}
            <div className="absolute top-20 left-20 w-8 h-8 bg-kenya-red rounded-full animate-bounce-slow opacity-70"></div>
            <div className="absolute top-40 right-32 w-6 h-6 bg-kenya-white rounded-full animate-float opacity-60"></div>
            <div className="absolute bottom-40 left-1/4 w-7 h-7 bg-kenya-green rounded-full animate-pulse opacity-80"></div>
            <div className="absolute top-60 left-1/3 w-5 h-5 bg-kenya-red rounded-full animate-bounce opacity-50"></div>
            <div className="absolute bottom-60 right-1/4 w-6 h-6 bg-kenya-white rounded-full animate-float opacity-40"></div>
            
            {/* Professional grid pattern */}
            <div className="absolute inset-0 opacity-15">
              <div className="grid grid-cols-16 grid-rows-10 h-full w-full gap-2">
                {Array.from({ length: 160 }).map((_, i) => (
                  <div
                    key={i}
                    className={`border border-kenya-green/30 rounded-sm ${
                      Math.random() > 0.85 ? 'bg-kenya-red/20 animate-pulse' : ''
                    }`}
                    style={{
                      animationDelay: `${Math.random() * 4}s`,
                      animationDuration: `${3 + Math.random() * 3}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Geometric design elements */}
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-kenya-red/60 rounded-full animate-spin-slow"></div>
            <div className="absolute top-32 right-20 w-20 h-20 border-2 border-kenya-white/50 rounded-lg rotate-45 animate-pulse"></div>
            <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-kenya-green/40 rounded-full animate-bounce-slow"></div>
            <div className="absolute bottom-32 right-1/3 w-28 h-28 border-2 border-kenya-green/60 rounded-full animate-pulse"></div>
            
            {/* Professional tech lines */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-kenya-red/30 to-transparent"></div>
            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-kenya-green/30 to-transparent"></div>
          </div>
        </div>
        
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-2 sm:px-4 py-20">
          <div className="mb-8 flex justify-center">
            <img src={homeData?.heroImage || "/logo.jpeg"} alt="KiNaP Ajira Club Logo" className="h-20 w-auto drop-shadow-lg rounded-lg" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg break-words">
            {homeData?.heroTitle || "Empowering Kenya's Digital Generation"}
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-kenya-white mb-8 drop-shadow-md">
            {homeData?.heroSubtitle || "KiNaP Ajira Digital Club - Innovation & Excellence"}
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 w-full">
            {homeData?.ctaButtons?.map((btn, i) =>
              btn.url.startsWith('http') ? (
                <a
                  key={i}
                  href={btn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-kenya-black hover:bg-kenya-white text-white hover:text-kenya-black text-lg font-bold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-kenya-white w-full sm:w-auto"
                >
                  {btn.label}
                </a>
              ) : (
                <Link
                  key={i}
                  to={btn.url}
                  className="bg-gradient-to-r from-kenya-red to-kenya-green hover:from-kenya-green hover:to-kenya-red text-white text-lg font-bold px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-kenya-white w-full sm:w-auto"
                >
                  {btn.label}
                </Link>
              )
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-8 w-full">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-kenya-red drop-shadow-lg">{homeData?.stats?.studentsTrained ?? 0}+</div>
              <div className="text-white/80 text-xs sm:text-base">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-kenya-green drop-shadow-lg">{homeData?.stats?.successStories ?? 0}+</div>
              <div className="text-white/80 text-xs sm:text-base">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-kenya-white drop-shadow-lg">{homeData?.stats?.skillsPrograms ?? 0}+</div>
              <div className="text-white/80 text-xs sm:text-base">Skills Programs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{homeData?.stats?.digitalExcellence ?? 0}%</div>
              <div className="text-white/80 text-xs sm:text-base">Digital Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-12 sm:py-24 bg-gradient-to-br from-ajira-light to-white w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-ajira-primary/10 text-ajira-primary px-6 py-3 rounded-full text-base sm:text-lg font-semibold mb-8">
              <Sparkles className="w-5 h-5" />
              Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-ajira-text-primary mb-8">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-ajira-accent to-ajira-secondary">Ajira Digital?</span>
            </h2>
            <p className="text-base sm:text-2xl text-ajira-text-muted max-w-4xl mx-auto">
              Discover the comprehensive ecosystem designed to transform your digital career in Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 w-full">
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
              <div key={index} className="group card-ajira-hover p-10 w-full">
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
      <section className="py-12 sm:py-24 bg-white w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-ajira-secondary/10 text-ajira-secondary px-6 py-3 rounded-full text-base sm:text-lg font-semibold mb-8">
              <Award className="w-5 h-5" />
              Success Stories
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-ajira-text-primary mb-8">Transforming Lives</h2>
            <p className="text-base sm:text-2xl text-ajira-text-muted max-w-4xl mx-auto">
              Discover how Ajira Digital is creating opportunities and changing lives at Kiambu National Polytechnic
            </p>
          </div>
          <StoryOfTheDay />
        </div>
      </section>

      {/* Enhanced Impact Metrics Section */}
      <section className="py-12 sm:py-24 bg-gradient-to-br from-ajira-primary/5 to-ajira-secondary/5 w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-ajira-accent/10 text-ajira-accent px-6 py-3 rounded-full text-base sm:text-lg font-semibold mb-8">
              <TrendingUp className="w-5 h-5" />
              Our Impact
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-ajira-text-primary mb-8">Making a Difference</h2>
            <p className="text-base sm:text-2xl text-ajira-text-muted max-w-4xl mx-auto">
              See the real impact we're making in digital skills development across Kenya
            </p>
          </div>
          <ImpactMetrics />
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-12 sm:py-24 bg-white w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-ajira-primary/10 text-ajira-primary px-6 py-3 rounded-full text-base sm:text-lg font-semibold mb-8">
              <Users className="w-5 h-5" />
              Student Voices
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-ajira-text-primary mb-8">What Students Say</h2>
            <p className="text-base sm:text-2xl text-ajira-text-muted max-w-4xl mx-auto">
              Real experiences from students who have transformed their careers through our programs
            </p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* Enhanced Call to Action Section */}
      <section className="py-12 sm:py-24 bg-gradient-ajira text-white relative overflow-hidden w-full">
            {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-ajira-orange-300 rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-ajira-green-300 rounded-full"></div>
          <div className="absolute bottom-20 right-1/4 w-36 h-36 border-2 border-ajira-blue-300 rounded-full"></div>
        </div>

        <div className="container-custom text-center relative z-10 px-2 sm:px-4 w-full">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
                <Zap className="w-12 h-12 text-ajira-orange-200" />
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-8">
              Ready to Transform Your Future?
              </h2>
            
            <p className="text-base sm:text-2xl text-ajira-blue-200 mb-12 max-w-3xl mx-auto">
              Join thousands of students who have already started their digital transformation journey with Ajira Digital
              </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center w-full">
                <Link
                  to="/auth"
                className="bg-white text-ajira-primary px-10 py-5 rounded-2xl text-xl font-bold hover:bg-ajira-gray-100 transition-all duration-200 hover:scale-105 shadow-ajira-xl w-full sm:w-auto"
                >
                Join Us Today
                </Link>
              
                <Link
                to="/marketplace"
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-white/30 transition-all duration-200 hover:scale-105 w-full sm:w-auto"
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