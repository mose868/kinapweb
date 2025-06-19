import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Grace Wanjiku',
      role: 'Web Developer',
      content: 'Ajira Digital transformed my career completely. From learning basic HTML to building full-stack applications, the program gave me all the tools I needed to succeed as a freelancer.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '2',
      name: 'James Kamau',
      role: 'Digital Marketer',
      content: 'The mentorship and hands-on training at Ajira Digital helped me land a remote job with a US company. I now earn 3x what I used to make locally.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: '3',
      name: 'Mary Njeri',
      role: 'Content Creator',
      content: 'Through Ajira Digital, I learned video editing and content creation. I now run my own YouTube channel with over 50K subscribers and multiple income streams.',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
    },
    {
      id: '4',
      name: 'Peter Ochieng',
      role: 'Mobile App Developer',
      content: 'The React Native training was exceptional. I built my first app within 3 months and now have clients from different countries. Life-changing experience!',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Quote Icon */}
        <div className="flex justify-center mb-8">
          <Quote className="w-12 h-12 text-blue-500" />
        </div>

        {/* Testimonial Content */}
        <div className="text-center">
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
            "{testimonials[currentIndex].content}"
          </p>

          {/* Rating */}
          <div className="flex justify-center mb-6">
            {renderStars(testimonials[currentIndex].rating)}
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-center space-x-4">
            <img
              src={testimonials[currentIndex].avatar}
              alt={testimonials[currentIndex].name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="text-left">
              <h4 className="text-lg font-semibold text-gray-900">
                {testimonials[currentIndex].name}
              </h4>
              <p className="text-gray-600">{testimonials[currentIndex].role}</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={prevTestimonial}
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-gray-600 hover:text-blue-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-gray-600 hover:text-blue-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-500 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider; 