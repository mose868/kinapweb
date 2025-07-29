import { useState } from 'react'
import { useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Search, ThumbsUp, ThumbsDown, Eye, Star } from 'lucide-react'
import axios from 'axios'
import LoadingState from '../../components/common/LoadingState'

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface FaqItem {
  _id: string
  question: string
  answer: string
  category: string
  tags: string[]
  isPopular: boolean
  viewCount: number
  helpfulCount: number
  notHelpfulCount: number
  priority: number
}

const FaqPage = () => {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [votedFAQs, setVotedFAQs] = useState<{[key: string]: 'helpful' | 'not-helpful'}>({})

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await axios.get(`${BASEURL}/faq`)
        const faqData = response.data.faqs || []
        setFaqs(faqData)
        setFilteredFaqs(faqData)
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(faqData.map((faq: FaqItem) => faq.category)))
        setCategories(uniqueCategories)
      } catch (err) {
        console.error('Error fetching FAQs:', err)
        setError('Failed to load FAQs')
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  useEffect(() => {
    let filtered = faqs

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredFaqs(filtered)
  }, [selectedCategory, searchQuery, faqs])

  const handleVote = async (faqId: string, voteType: 'helpful' | 'not-helpful') => {
    // Prevent multiple votes from same user (stored in localStorage)
    const votedKey = `faq_vote_${faqId}`
    const existingVote = localStorage.getItem(votedKey)
    
    if (existingVote) {
      alert('You have already voted on this FAQ')
      return
    }

    try {
      const endpoint = voteType === 'helpful' ? 'helpful' : 'not-helpful'
      await axios.post(`${BASEURL}/faq/${faqId}/${endpoint}`)
      
      // Store vote in localStorage
      localStorage.setItem(votedKey, voteType)
      setVotedFAQs(prev => ({ ...prev, [faqId]: voteType }))
      
      // Update local FAQ data
      setFaqs(prev => prev.map(faq => {
        if (faq._id === faqId) {
          return {
            ...faq,
            [voteType === 'helpful' ? 'helpfulCount' : 'notHelpfulCount']: 
              faq[voteType === 'helpful' ? 'helpfulCount' : 'notHelpfulCount'] + 1
          }
        }
        return faq
      }))
      
      alert('Thank you for your feedback!')
    } catch (error) {
      console.error('Error voting:', error)
      alert('Failed to record your vote')
    }
  }

  // Load existing votes from localStorage
  useEffect(() => {
    const votes: {[key: string]: 'helpful' | 'not-helpful'} = {}
    faqs.forEach(faq => {
      const votedKey = `faq_vote_${faq._id}`
      const existingVote = localStorage.getItem(votedKey)
      if (existingVote) {
        votes[faq._id] = existingVote as 'helpful' | 'not-helpful'
      }
    })
    setVotedFAQs(votes)
  }, [faqs])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  if (loading) {
    return <LoadingState message="Loading FAQs" />
  }

  if (error) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="container-custom py-8 sm:py-12 w-full px-2 sm:px-4 overflow-x-hidden">
      <h1 className="text-4xl font-bold text-ajira-primary mb-8">Frequently Asked Questions</h1>
      
      {/* Search and Filter */}
      <div className="mb-8 space-y-4 w-full">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent text-base sm:text-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent text-base sm:text-lg"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        {/* Popular FAQs Toggle */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedCategory === 'all' 
                ? 'bg-ajira-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All FAQs
          </button>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">
            {filteredFaqs.length} FAQ{filteredFaqs.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      <div className="space-y-8 w-full">
        {categories.filter(category => 
          selectedCategory === 'all' || selectedCategory === category
        ).map(category => {
          const categoryFaqs = filteredFaqs.filter(faq => faq.category === category)
          if (categoryFaqs.length === 0) return null
          
          return (
          <div key={category} className="space-y-4 w-full">
            <h2 className="text-2xl font-semibold text-ajira-primary">{category}</h2>
            
            <div className="space-y-4 w-full">
              {categoryFaqs
                .map((faq, index) => {
                  const isOpen = openItems.includes(index)
                  const hasVoted = votedFAQs[faq._id]
                  
                  return (
                    <div 
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm w-full"
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full flex flex-wrap items-center justify-between p-4 text-left bg-white hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="font-medium text-gray-900 text-base sm:text-lg">{faq.question}</span>
                          {faq.isPopular && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700 text-base sm:text-lg">{faq.answer}</p>
                          
                          {/* Tags */}
                          {faq.tags && faq.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {faq.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="bg-ajira-primary/10 text-ajira-primary text-xs px-2 py-1 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Voting and Stats */}
                          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200 gap-2 w-full">
                            <div className="flex items-center gap-2 sm:gap-4 text-sm text-gray-500 flex-wrap">
                              <span className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{faq.viewCount} views</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <ThumbsUp className="w-4 h-4 text-green-600" />
                                <span>{faq.helpfulCount} helpful</span>
                              </span>
                            </div>
                            {/* Voting Buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-gray-600 mr-2">Was this helpful?</span>
                              <button
                                onClick={() => handleVote(faq._id, 'helpful')}
                                disabled={!!hasVoted}
                                className={`p-2 rounded-lg transition ${
                                  hasVoted === 'helpful'
                                    ? 'bg-green-100 text-green-600'
                                    : hasVoted
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-600'
                                }`}
                                title="Mark as helpful"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleVote(faq._id, 'not-helpful')}
                                disabled={!!hasVoted}
                                className={`p-2 rounded-lg transition ${
                                  hasVoted === 'not-helpful'
                                    ? 'bg-red-100 text-red-600'
                                    : hasVoted
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                                }`}
                                title="Mark as not helpful"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        )})}
        
        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search terms or category filter.' 
                : 'No FAQs are available at the moment.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FaqPage 