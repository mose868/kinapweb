import { useState } from 'react'
import { useEffect } from 'react'
import { Calendar, Tag, ChevronRight, Search } from 'lucide-react'
import axios from 'axios'
import LoadingState from '../../components/common/LoadingState'

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface Update {
  _id: string
  title: string
  excerpt: string
  content: string
  category: string
  publishDate: string
  images: string[]
  tags: string[]
  featured: boolean
  priority: string
  engagement: {
    views: number
    likes: number
    shares: number
  }
  author: string
}

const UpdatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Updates', color: 'bg-gray-600' }
  ])

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await axios.get(`${BASEURL}/updates?limit=50`)
        setUpdates(response.data.updates || [])
        
        // Extract unique categories from updates
        const uniqueCategories = [...new Set(response.data.updates?.map((update: Update) => update.category) || [])]
        const categoryColors = {
          'Event': 'bg-blue-600',
          'Announcement': 'bg-green-600', 
          'Achievement': 'bg-purple-600',
          'Training': 'bg-orange-600',
          'Partnership': 'bg-pink-600',
          'General': 'bg-gray-600'
        }
        
        const formattedCategories = [
          { id: 'all', name: 'All Updates', color: 'bg-gray-600' },
          ...uniqueCategories.map(cat => ({
            id: cat.toLowerCase(),
            name: cat,
            color: categoryColors[cat as keyof typeof categoryColors] || 'bg-gray-600'
          }))
        ]
        
        setCategories(formattedCategories)
      } catch (err) {
        console.error('Error fetching updates:', err)
        setError('Failed to load updates')
      } finally {
        setLoading(false)
      }
    }

    fetchUpdates()
  }, [])

  const filteredUpdates = updates.filter(update => {
    const matchesCategory = selectedCategory === 'all' || update.category.toLowerCase() === selectedCategory
    const matchesSearch = update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category.toLowerCase())
    return cat?.color || 'bg-gray-600'
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 w-full overflow-x-hidden">
      <div className="container-custom px-2 sm:px-4 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-ajira-primary mb-4">Club Updates</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest news, events, and opportunities at Ajira Digital KiNaP Club.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between w-full">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === category.id
                      ? `${category.color} text-white`
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ajira-primary/20 text-base sm:text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
          {filteredUpdates.map(update => (
            <div
              key={update._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden w-full"
            >
              {update.images && update.images.length > 0 && (
                <img
                  src={update.images[0]}
                  alt={update.title}
                  className="w-full h-40 sm:h-48 object-cover"
                />
              )}
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(update.category)}`}>
                    {update.category.charAt(0).toUpperCase() + update.category.slice(1)}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(update.publishDate)}
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {update.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {update.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                  {update.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>

                <button className="mt-4 text-ajira-primary font-medium flex items-center hover:text-ajira-primary/80 transition-colors">
                  Read More
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredUpdates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No updates found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UpdatesPage 