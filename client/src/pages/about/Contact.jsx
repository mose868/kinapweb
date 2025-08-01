import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react'
import { MessageCircle } from 'lucide-react'
import axios from 'axios'

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'General Inquiry',
    priority: 'Medium'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [whatsappLink, setWhatsappLink] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    try {
      const response = await axios.post(`${BASEURL}/contact/submit`, formData)
      
      setSuccess(true)
      setWhatsappLink(response.data.whatsappLink)
      setFormData({ 
        name: '', 
        email: '', 
        phone: '',
        subject: '', 
        message: '',
        category: 'General Inquiry',
        priority: 'Medium'
      })
      
      // Reset success message after 10 seconds
      setTimeout(() => {
        setSuccess(false)
        setWhatsappLink('')
      }, 10000)
    } catch (err) {
      console.error('Contact form error:', err)
      setError(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const openWhatsApp = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank')
    } else {
      // Default WhatsApp link
      const message = 'Hi, I would like to get in touch with Ajira Digital KiNaP Club.'
      const url = `https://wa.me/254792343958?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
    }
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
        'kinapajira@gmail.com',
        'info@kinapajira.com'
      ]
    },
    {
      icon: <Phone className="w-6 h-6 text-ajira-gold" />,
      title: 'Call Us',
      details: [
        '+254 792 343 958',
        'WhatsApp Available'
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
                Get in Touch
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90">
                Have questions about our programs? We're here to help you succeed in your digital journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="py-10 sm:py-16 bg-white w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 w-full">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center w-full"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-ajira-lightGray rounded-lg">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-ajira-blue mb-2 sm:mb-4">
                  {info.title}
                </h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-ajira-gray text-sm sm:text-base mb-1">
                    {detail}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Contact Actions */}
      <section className="py-8 sm:py-12 bg-ajira-primary w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="text-center w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Need Immediate Help?</h3>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
              <button
                onClick={openWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center transition-colors w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </button>
              <a
                href="mailto:kinapajira@gmail.com"
                className="bg-white hover:bg-gray-100 text-ajira-primary px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center transition-colors w-full sm:w-auto"
              >
                <Mail className="w-5 h-5 mr-2" />
                Send Email
              </a>
              <a
                href="tel:+254792343958"
                className="bg-ajira-orange hover:bg-ajira-orange/90 text-white px-4 sm:px-6 py-3 rounded-lg flex items-center justify-center transition-colors w-full sm:w-auto"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-10 sm:py-16 bg-ajira-lightGray w-full">
        <div className="container-custom px-2 sm:px-4 w-full">
          <div className="max-w-3xl mx-auto w-full">
            <div className="card w-full">
              <div className="text-center mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-ajira-blue mb-2">
                  Send Us a Message
                </h2>
                <p className="text-ajira-gray text-sm sm:text-base">
                  Fill out the form below and we'll get back to you within 24 hours. Your message will be sent directly to our team.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                  <div className="text-center mb-4">
                    <strong>✅ Message sent successfully!</strong>
                  </div>
                  <p className="text-sm mb-4">
                    Thank you for contacting us! Your message has been sent to kinapajira@gmail.com and we'll get back to you soon.
                  </p>
                  {whatsappLink && (
                    <div className="text-center">
                      <button
                        onClick={openWhatsApp}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center mx-auto"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Continue on WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ajira-gray mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ajira-gray mb-2">
                      Email Address *
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-ajira-gray mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                      placeholder="e.g., +254 700 123 456"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-ajira-gray mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Training">Training</option>
                      <option value="Complaint">Complaint</option>
                      <option value="Suggestion">Suggestion</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-ajira-gray mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-ajira-gray mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent resize-none"
                    placeholder="Please provide details about your inquiry..."
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
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="ml-2">Sending Message...</span>
                    </>
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
      <section className="w-full bg-ajira-lightGray">
        <div className="w-full h-64 sm:h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0167324021055!2d36.8307!3d-1.1722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTAnMTkuMiJTIDM2wrA0OSc1MC41IkU!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kiambu National Polytechnic Location"
            className="w-full h-64 sm:h-[400px]"
          />
        </div>
      </section>
    </div>
  )
}

export default Contact 