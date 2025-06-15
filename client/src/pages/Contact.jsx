import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSuccess(true)
    setLoading(false)
    setFormData({ name: '', email: '', subject: '', message: '' })
    
    // Reset success message after 5 seconds
    setTimeout(() => setSuccess(false), 5000)
  }

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-ajira-blue" />,
      title: 'Visit Us',
      details: [
        'Kiambu National Polytechnic',
        'P.O. Box 414-00900',
        'Kiambu, Kenya'
      ]
    },
    {
      icon: <Mail className="w-6 h-6 text-ajira-orange" />,
      title: 'Email Us',
      details: [
        'info@kiambuajira.ac.ke',
        'support@kiambuajira.ac.ke'
      ]
    },
    {
      icon: <Phone className="w-6 h-6 text-ajira-gold" />,
      title: 'Call Us',
      details: [
        '+254 700 000 000',
        '+254 800 000 000'
      ]
    },
    {
      icon: <Clock className="w-6 h-6 text-ajira-lightBlue" />,
      title: 'Working Hours',
      details: [
        'Monday - Friday: 8:00 AM - 5:00 PM',
        'Saturday: 8:00 AM - 1:00 PM'
      ]
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
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Have questions about our programs? We're here to help.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-ajira-lightGray rounded-lg">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-ajira-blue mb-4">
                  {info.title}
                </h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-ajira-gray">
                    {detail}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-ajira-lightGray">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="card">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-ajira-blue mb-2">
                  Send Us a Message
                </h2>
                <p className="text-ajira-gray">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 text-center">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ajira-gray mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ajira-gray mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-ajira-gray mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ajira-gray mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent resize-none"
                    placeholder="Enter your message"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-primary w-full flex items-center justify-center ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-ajira-lightGray">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0167324021055!2d36.8307!3d-1.1722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTAnMTkuMiJTIDM2wrA0OSc1MC41IkU!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Kiambu National Polytechnic Location"
        />
      </section>
    </div>
  )
}

export default Contact 