import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Target, Users, Book, Globe, ArrowRight } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: <Target className="w-8 h-8 text-ajira-orange" />,
      title: 'Our Mission',
      description: 'To cultivate digital skills excellence and showcase successful online work opportunities among our club members.'
    },
    {
      icon: <Users className="w-8 h-8 text-ajira-blue" />,
      title: 'Who We Are',
      description: 'A vibrant student club dedicated to developing digital skills and exploring online work opportunities under the Ajira Digital program.'
    },
    {
      icon: <Book className="w-8 h-8 text-ajira-gold" />,
      title: 'What We Do',
      description: 'We organize training sessions, workshops, and collaborative projects in web development, digital marketing, and content creation.'
    },
    {
      icon: <Globe className="w-8 h-8 text-ajira-lightBlue" />,
      title: 'Our Impact',
      description: 'Our members have completed numerous successful projects and secured various online work opportunities through skills gained in the club.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-ajira py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About Ajira Digital Club at Kiambu National Polytechnic
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Showcasing our journey in digital skills development and online work achievements.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-ajira-lightGray rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ajira-blue mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-ajira-gray">
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
      <section className="py-16 bg-ajira-lightGray">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="section-title">Our Vision</h2>
              <p className="section-subtitle">
                To be the leading digital skills training hub in Kenya, creating a pathway to sustainable online work opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card"
              >
                <h3 className="text-3xl font-bold text-ajira-blue mb-2">1000+</h3>
                <p className="text-ajira-gray">Students Trained</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card"
              >
                <h3 className="text-3xl font-bold text-ajira-orange mb-2">25+</h3>
                <p className="text-ajira-gray">Training Programs</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="card"
              >
                <h3 className="text-3xl font-bold text-ajira-gold mb-2">95%</h3>
                <p className="text-ajira-gray">Success Rate</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-ajira rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your Digital Journey?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Join our community of digital professionals and unlock endless opportunities in the digital economy.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/auth"
                  className="bg-white text-ajira-blue hover:bg-ajira-lightGray px-8 py-3 rounded-md font-semibold transition-colors inline-flex items-center"
                >
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="bg-ajira-orange hover:bg-opacity-90 text-white px-8 py-3 rounded-md font-semibold transition-colors"
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