import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, limit, orderBy } from 'firebase/firestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  image?: string;
  rating: number;
  date: any;
}

const TestimonialSlider: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(
          collection(db, 'testimonials'),
          orderBy('date', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const testimonialData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Testimonial[];
        setTestimonials(testimonialData);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

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

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col items-center text-center">
          {testimonials[currentIndex].image && (
            <img
              src={testimonials[currentIndex].image}
              alt={testimonials[currentIndex].name}
              className="w-20 h-20 rounded-full object-cover mb-6"
            />
          )}
          <div className="flex gap-1 mb-6">
            {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-gray-700 text-lg md:text-xl mb-6 italic">
            "{testimonials[currentIndex].message}"
          </p>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {testimonials[currentIndex].name}
          </h3>
          <p className="text-gray-600">{testimonials[currentIndex].role}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>
      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
};

export default TestimonialSlider; 