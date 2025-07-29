import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Target, Users, Book, Globe, ArrowRight } from 'lucide-react'
import axios from 'axios'
import LoadingState from '../../components/common/LoadingState'

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const About = () => {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(`${BASEURL}/about-us`)
        setAboutData(response.data)
      } catch (err) {
        console.error('Error fetching about data:', err)
        setError('Failed to load about information')
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  if (loading) {
    return <LoadingState message="Loading about information" />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      icon: <Target className="w-8 h-8 text-ajira-orange" />,
      title: 'Our Mission',
      description: aboutData?.mission || 'To cultivate digital skills excellence and showcase successful online work opportunities among our club members.'
    },
    {
      icon: <Users className="w-8 h-8 text-ajira-blue" />,
      title: 'Who We Are',
      description: aboutData?.teamDescription || 'A vibrant student club dedicated to developing digital skills and exploring online work opportunities under the Ajira Digital program.'
    },
    {
      icon: <Book className="w-8 h-8 text-ajira-gold" />,
      title: 'Our Vision',
      description: aboutData?.vision || 'A digitally empowered generation of skilled professionals.'
    },
    {
      icon: <Globe className="w-8 h-8 text-ajira-lightBlue" />,
      title: 'Our Impact',
      description: aboutData?.history || 'Our members have completed numerous successful projects and secured various online work opportunities through skills gained in the club.'
    }
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-ajira py-16 sm:py-20 w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="max-w-3xl mx-auto text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 break-words">
                {aboutData?.title || 'About Ajira Digital Club at Kiambu National Polytechnic'}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8">
                {aboutData?.description || 'Showcasing our journey in digital skills development and online work achievements.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {aboutData?.stats && (
        <section className="py-10 sm:py-16 bg-gray-50 w-full">
          <div className="container-custom px-2 sm:px-4 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-ajira-primary mb-1 sm:mb-2">
                  {aboutData.stats.membersCount}+
                </div>
                <div className="text-xs sm:text-base text-gray-600">Active Members</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-ajira-accent mb-1 sm:mb-2">
                  {aboutData.stats.projectsCompleted}+
                </div>
                <div className="text-xs sm:text-base text-gray-600">Projects Completed</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-ajira-secondary mb-1 sm:mb-2">
                  {aboutData.stats.skillsOffered}+
                </div>
                <div className="text-xs sm:text-base text-gray-600">Skills Offered</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-xl sm:text-3xl md:text-4xl font-bold text-ajira-gold mb-1 sm:mb-2">
                  {aboutData.stats.successStories}+
                </div>
                <div className="text-xs sm:text-base text-gray-600">Success Stories</div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-10 sm:py-16 w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 break-words">
              {aboutData?.values && aboutData.values.length > 0 ? 'Our Values & Vision' : 'What Drives Us'}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {aboutData?.values ? aboutData.values.join(' • ') : 'Our commitment to excellence in digital skills development and community building'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card w-full"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-ajira-lightGray rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-ajira-blue mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-ajira-gray text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-10 sm:py-16 bg-ajira-lightGray w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="section-title text-2xl sm:text-3xl md:text-4xl">Our Vision</h2>
              <p className="section-subtitle text-base sm:text-lg">
                To be the leading digital skills training hub in Kenya, creating a pathway to sustainable online work opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card w-full"
              >
                <h3 className="text-xl sm:text-3xl font-bold text-ajira-blue mb-1 sm:mb-2">1000+</h3>
                <p className="text-ajira-gray text-xs sm:text-base">Students Trained</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card w-full"
              >
                <h3 className="text-xl sm:text-3xl font-bold text-ajira-orange mb-1 sm:mb-2">25+</h3>
                <p className="text-ajira-gray text-xs sm:text-base">Training Programs</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card w-full"
              >
                <h3 className="text-xl sm:text-3xl font-bold text-ajira-gold mb-1 sm:mb-2">95%</h3>
                <p className="text-ajira-gray text-xs sm:text-base">Success Rate</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 bg-white w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="bg-gradient-ajira rounded-2xl p-4 sm:p-8 md:p-12 w-full">
            <div className="max-w-3xl mx-auto text-center w-full">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 break-words">
                Ready to Start Your Digital Journey?
              </h2>
              <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8">
                Join our community of digital professionals and unlock endless opportunities in the digital economy.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 w-full">
                <Link
                  to="/auth"
                  className="bg-white text-ajira-blue hover:bg-ajira-lightGray px-6 sm:px-8 py-3 rounded-md font-semibold transition-colors inline-flex items-center justify-center w-full sm:w-auto"
                >
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="bg-ajira-orange hover:bg-opacity-90 text-white px-6 sm:px-8 py-3 rounded-md font-semibold transition-colors w-full sm:w-auto text-center"
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

export default About 