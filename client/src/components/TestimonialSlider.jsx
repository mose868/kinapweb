import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "Sarah Wanjiru",
      role: "Freelance Web Developer",
      location: "Kiambu",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "Ajira Digital completely transformed my life. I went from unemployment to earning over Ksh 120,000 monthly as a freelance developer. The training was comprehensive and the support from instructors was exceptional.",
      achievement: "Earning 120K+/month"
    },
    {
      id: 2,
      name: "Michael Kariuki",
      role: "Digital Marketing Specialist",
      location: "Nairobi",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "The digital marketing course opened doors I never knew existed. I now run my own agency with 20+ clients and have created employment for 5 other young people. Ajira Digital is a game-changer!",
      achievement: "Agency Owner"
    },
    {
      id: 3,
      name: "Grace Nyawira",
      role: "Data Analyst",
      location: "Thika",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "From basic computer skills to advanced data analysis - the journey has been incredible. I now work remotely for an international company and support my family comfortably. Thank you, Ajira Digital!",
      achievement: "International Remote Work"
    },
    {
      id: 4,
      name: "Peter Mwangi",
      role: "Content Creator",
      location: "Kiambu",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      content: "The content creation and social media management training gave me skills to build my personal brand. I now have over 100K followers and work with major brands. Dreams do come true at Ajira Digital!",
      achievement: "100K+ Followers"
    }
  ]

  // Auto-slide every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 8000)

    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <div className="relative">
      {/* Main Testimonial */}
      <div className="relative h-[500px] md:h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-ajira">
                {/* Quote Icon */}
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 bg-gradient-ajira rounded-full flex items-center justify-center">
                    <Quote className="text-white" size={32} />
                  </div>
                </div>

                {/* Content */}
                <blockquote className="text-xl md:text-2xl text-ajira-gray mb-8 leading-relaxed italic">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                {/* Rating */}
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-ajira-gold fill-current"
                      size={24}
                    />
                  ))}
                </div>

                {/* Author Info */}
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-ajira-blue/10"
                  />
                  <div className="text-center md:text-left">
                    <h4 className="text-xl font-bold text-ajira-blue">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-ajira-gray">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-sm text-ajira-gray/80">
                      {testimonials[currentIndex].location}
                    </p>
                    <div className="mt-2">
                      <span className="bg-ajira-blue/10 text-ajira-blue px-3 py-1 rounded-full text-sm font-medium">
                        {testimonials[currentIndex].achievement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-ajira flex items-center justify-center text-ajira-gray hover:text-ajira-blue hover:shadow-ajira-lg transition-all"
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-ajira flex items-center justify-center text-ajira-gray hover:text-ajira-blue hover:shadow-ajira-lg transition-all"
        aria-label="Next testimonial"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-3 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-ajira-blue' : 'bg-ajira-gray/30'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Testimonial Grid (Mobile Alternative) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 md:hidden">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="card"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-ajira-blue/10"
              />
              <div>
                <h4 className="font-semibold text-ajira-blue">{testimonial.name}</h4>
                <p className="text-sm text-ajira-gray">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="text-ajira-gold fill-current"
                  size={16}
                />
              ))}
            </div>
            <p className="text-ajira-gray text-sm mb-3">
              "{testimonial.content.substring(0, 100)}..."
            </p>
            <span className="bg-ajira-blue/10 text-ajira-blue px-2 py-1 rounded-full text-xs font-medium">
              {testimonial.achievement}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialSlider 