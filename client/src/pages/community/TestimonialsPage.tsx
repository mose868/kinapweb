import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Star, Quote, Filter, Search } from 'lucide-react'
import LoadingState from '../../components/common/LoadingState'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface Testimonial {
  id: string
  userId: string
  userName: string
  userRole: string
  content: string
  rating: number
  category: string
  impact: string
  projectLink?: string
  createdAt: any
}

const CATEGORIES = [
  'Web Development',
  'Digital Marketing',
  'Content Creation',
  'Data Analysis',
  'Graphic Design',
  'Virtual Assistance',
  'Other'
]

const TestimonialsPage = () => {
  const { user } = useAuth()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [formData, setFormData] = useState({
    content: '',
    rating: 5,
    userRole: '',
    category: 'Web Development',
    impact: '',
    projectLink: ''
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState({
    category: 'all',
    rating: 0,
    searchQuery: ''
  })

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        let q = query(
          collection(db, 'testimonials'),
          orderBy('createdAt', 'desc')
        )

        // Apply category filter
        if (filter.category !== 'all') {
          q = query(q, where('category', '==', filter.category))
        }

        const snapshot = await getDocs(q)
        let data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Testimonial[]

        // Apply rating filter
        if (filter.rating > 0) {
          data = data.filter(t => t.rating >= filter.rating)
        }

        // Apply search filter
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase()
          data = data.filter(t =>
            t.content.toLowerCase().includes(query) ||
            t.userName.toLowerCase().includes(query) ||
            t.userRole.toLowerCase().includes(query)
          )
        }

        setTestimonials(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [filter])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'testimonials'), {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userRole: formData.userRole,
        content: formData.content,
        rating: formData.rating,
        category: formData.category,
        impact: formData.impact,
        projectLink: formData.projectLink,
        createdAt: serverTimestamp()
      })

      // Reset form
      setFormData({
        content: '',
        rating: 5,
        userRole: '',
        category: 'Web Development',
        impact: '',
        projectLink: ''
      })

      // Refresh testimonials
      const q = query(
        collection(db, 'testimonials'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimonial[]
      setTestimonials(data)
    } catch (error) {
      console.error('Error submitting testimonial:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return ''
    const d = date.toDate()
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(d)
  }

  if (loading) {
    return <LoadingState message="Loading testimonials" description="Please wait while we fetch the testimonials" />
  }

  // If no testimonials, show coming soon message
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-ajira-primary/10 via-ajira-accent/10 to-ajira-secondary/10 rounded-3xl p-12 shadow-2xl">
          <div className="text-7xl mb-8">🌟</div>
          <h1 className="text-4xl md:text-6xl font-bold text-ajira-primary mb-6">
            Success Stories & Testimonials
          </h1>
          <div className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed">
            <p className="mb-6">
              <span className="font-bold text-ajira-accent">Incredible transformations are about to unfold!</span>
            </p>
            <p className="text-lg text-gray-600">
              We're building a powerful platform where success stories will inspire and motivate the next generation of digital professionals.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12 text-left">
            <div className="bg-white/90 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">💫</div>
              <h3 className="text-xl font-bold text-ajira-primary mb-3">Share Your Journey</h3>
              <p className="text-gray-600 leading-relaxed">Inspire others by sharing your transformation story, achievements, and the impact Ajira Digital had on your career.</p>
            </div>
            
            <div className="bg-white/90 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold text-ajira-primary mb-3">Discover Inspiration</h3>
              <p className="text-gray-600 leading-relaxed">Read authentic success stories from real professionals who transformed their lives through digital skills and opportunities.</p>
            </div>
            
            <div className="bg-white/90 rounded-2xl p-8 shadow-xl transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-ajira-primary mb-3">Build Community</h3>
              <p className="text-gray-600 leading-relaxed">Connect with like-minded professionals, celebrate achievements, and be part of a supportive network of digital innovators.</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-ajira-primary/20 to-ajira-accent/20 rounded-3xl p-10 border-2 border-ajira-primary/30">
            <p className="text-2xl font-bold text-ajira-primary mb-6">
              🎊 Coming Soon - Get Ready to Be Inspired!
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our team is crafting an extraordinary testimonials platform that will showcase the incredible journeys of our community members. 
              Prepare to be amazed by the stories of transformation, growth, and success that will soon grace these pages!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-ajira-accent to-ajira-accent/80 text-white px-10 py-4 rounded-2xl font-bold text-xl hover:from-ajira-accent/90 hover:to-ajira-accent/70 transition-all transform hover:scale-105 shadow-2xl">
                Join the Waitlist
              </button>
              <button className="bg-gradient-to-r from-ajira-primary to-ajira-primary/80 text-white px-10 py-4 rounded-2xl font-bold text-xl hover:from-ajira-primary/90 hover:to-ajira-primary/70 transition-all transform hover:scale-105 shadow-2xl">
                Explore More
              </button>
            </div>
          </div>
          
          <div className="mt-12 bg-white/80 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-ajira-primary mb-4">What's Coming?</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-ajira-accent mb-2">✨ Interactive Storytelling</h4>
                <p className="text-gray-600">Rich multimedia testimonials with videos, images, and detailed success journeys.</p>
              </div>
              <div>
                <h4 className="font-semibold text-ajira-accent mb-2">🏆 Achievement Showcase</h4>
                <p className="text-gray-600">Highlight specific milestones, income growth, and career transformations.</p>
              </div>
              <div>
                <h4 className="font-semibold text-ajira-accent mb-2">🤝 Community Engagement</h4>
                <p className="text-gray-600">Like, comment, and connect with success stories that inspire you.</p>
              </div>
              <div>
                <h4 className="font-semibold text-ajira-accent mb-2">📊 Impact Analytics</h4>
                <p className="text-gray-600">Track and visualize the real impact of Ajira Digital on careers and lives.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-12 w-full overflow-x-hidden">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-ajira-primary mb-4">
          Success Stories & Testimonials
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Discover how Ajira Digital has transformed careers and lives. Read inspiring stories from our community members and share your own journey.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8 w-full">
        <div className="flex flex-wrap gap-4 items-center w-full">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filter.searchQuery}
                onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Search testimonials..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent text-base sm:text-lg"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent text-base sm:text-lg"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filter.rating}
              onChange={(e) => setFilter(prev => ({ ...prev, rating: Number(e.target.value) }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent text-base sm:text-lg"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={3}>3+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Testimonial Form */}
      {user && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-12 w-full">
          <h2 className="text-2xl font-semibold text-ajira-primary mb-6">
            Share Your Success Story
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Role
                </label>
                <input
                  type="text"
                  value={formData.userRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, userRole: e.target.value }))}
                  placeholder="e.g., Web Developer, Digital Marketer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent text-base sm:text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent text-base sm:text-lg"
                  required
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Story
              </label>
              <ReactQuill
                value={formData.content}
                onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                placeholder="Share your experience and success story..."
                className="h-40 mb-12"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Impact & Achievement
              </label>
              <textarea
                value={formData.impact}
                onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                placeholder="What specific impact or achievement did you accomplish? (e.g., Increased income by 50%, Landed 5 new clients)"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent text-base sm:text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project/Portfolio Link (Optional)
              </label>
              <input
                type="url"
                value={formData.projectLink}
                onChange={(e) => setFormData(prev => ({ ...prev, projectLink: e.target.value }))}
                placeholder="https://your-project.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent text-base sm:text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        rating <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ajira-accent text-white py-3 rounded-lg hover:bg-ajira-accent/90 disabled:opacity-50 font-medium text-base sm:text-lg"
            >
              {submitting ? 'Submitting...' : 'Share Your Story'}
            </button>
          </form>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {testimonials.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Quote className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No testimonials found</h3>
            <p className="text-gray-500">
              {filter.searchQuery || filter.category !== 'all' || filter.rating > 0
                ? 'Try adjusting your filters to see more results'
                : 'Be the first to share your story!'}
            </p>
          </div>
        ) : (
          testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col"
            >
              <div className="flex items-start mb-4">
                <Quote className="w-8 h-8 text-ajira-accent opacity-50 mr-2 flex-shrink-0" />
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: testimonial.content }}
                />
              </div>

              <div className="mt-auto">
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-ajira-primary">
                      {testimonial.userName}
                    </div>
                    <div className="text-sm text-gray-500">{testimonial.userRole}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(testimonial.createdAt)}
                  </div>
                </div>

                {testimonial.impact && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-700">Impact:</div>
                    <div className="text-sm text-gray-600">{testimonial.impact}</div>
                  </div>
                )}

                {testimonial.projectLink && (
                  <a
                    href={testimonial.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center text-sm text-ajira-accent hover:underline"
                  >
                    View Project →
                  </a>
                )}

                <div className="mt-2">
                  <span className="inline-block bg-ajira-accent/10 text-ajira-accent px-2 py-1 rounded-full text-xs">
                    {testimonial.category}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TestimonialsPage 