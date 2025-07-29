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

  // If no testimonials, show demo testimonials
  if (!testimonials || testimonials.length === 0) {
    const demoTestimonials = [
      {
        id: 'demo1',
        userName: 'Jane Doe',
        userRole: 'Web Developer',
        content: 'Ajira Digital helped me land my first freelance job in 2025! The new AI-powered training modules are incredible. Highly recommend to anyone starting out.',
        rating: 5,
        category: 'Web Development',
        impact: 'Landed first client worth $2,000',
        createdAt: new Date(),
      },
      {
        id: 'demo2',
        userName: 'John Smith',
        userRole: 'Digital Marketer',
        content: 'The community and resources are top-notch. I learned so much about social media automation and AI tools in 2025. My business has grown 300%!',
        rating: 5,
        category: 'Digital Marketing',
        impact: 'Business growth of 300%',
        createdAt: new Date(),
      },
      {
        id: 'demo3',
        userName: 'Sarah Johnson',
        userRole: 'Content Creator',
        content: 'Amazing mentorship program! The 2025 content creation strategies helped me build a YouTube channel with 100K+ subscribers.',
        rating: 5,
        category: 'Content Creation',
        impact: 'Built 100K+ subscriber channel',
        createdAt: new Date(),
      },
      {
        id: 'demo4',
        userName: 'Michael Brown',
        userRole: 'Data Analyst',
        content: 'The AI and machine learning courses for 2025 are cutting-edge. I transitioned from basic data entry to advanced analytics.',
        rating: 4,
        category: 'Data Analysis',
        impact: 'Career transition to analytics',
        createdAt: new Date(),
      },
      {
        id: 'demo5',
        userName: 'Emily Davis',
        userRole: 'Virtual Assistant',
        content: 'Excellent training on automation tools and client management. Now I manage 15+ clients efficiently using 2025 productivity tools.',
        rating: 5,
        category: 'Virtual Assistant',
        impact: 'Managing 15+ clients',
        createdAt: new Date(),
      },
      {
        id: 'demo6',
        userName: 'David Wilson',
        userRole: 'Freelance Writer',
        content: 'The writing and SEO courses helped me increase my rates by 200%. The 2025 AI writing tools integration is fantastic!',
        rating: 4,
        category: 'Content Writing',
        impact: 'Increased rates by 200%',
        createdAt: new Date(),
      }
    ];
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-12 w-full overflow-x-hidden">
        <h1 className="text-4xl font-bold text-ajira-primary mb-4">Success Stories & Testimonials 2025 (Demo)</h1>
        <p className="text-lg text-gray-600 mb-8">Experience the latest success stories from our 2025 cohort</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full">
          {demoTestimonials.map(t => (
            <div key={t.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-2">
                <span className="font-bold text-lg mr-2">{t.userName}</span>
                <span className="text-sm text-gray-500">({t.userRole})</span>
              </div>
              <div className="mb-2">{t.content}</div>
              <div className="mb-2"><span className="font-semibold">Category:</span> {t.category}</div>
              <div className="mb-2"><span className="font-semibold">Impact:</span> {t.impact}</div>
              <div className="mb-2"><span className="font-semibold">Rating:</span> {t.rating} / 5</div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-500">Sign up or log in to share your own story!</p>
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