import { useState } from 'react'
import { Calendar, Tag, ChevronRight, Search } from 'lucide-react'

interface Update {
  id: string
  title: string
  content: string
  category: 'event' | 'announcement' | 'achievement' | 'opportunity'
  date: string
  image?: string
  tags: string[]
}

const UpdatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'All Updates', color: 'bg-gray-600' },
    { id: 'event', name: 'Events', color: 'bg-blue-600' },
    { id: 'announcement', name: 'Announcements', color: 'bg-green-600' },
    { id: 'achievement', name: 'Achievements', color: 'bg-purple-600' },
    { id: 'opportunity', name: 'Opportunities', color: 'bg-orange-600' }
  ]

  const updates: Update[] = [
    {
      id: '1',
      title: 'Upcoming Digital Skills Workshop',
      content: `Join us for a comprehensive workshop on digital marketing and social media management. Learn from industry experts and get hands-on experience.`,
      category: 'event',
      date: '2024-04-15',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80',
      tags: ['workshop', 'digital-marketing', 'training']
    },
    {
      id: '2',
      title: 'Club Achievement Highlight',
      content: `Our members have successfully completed over 100 freelance projects this quarter! Congratulations to everyone for this amazing milestone.`,
      category: 'achievement',
      date: '2024-04-10',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      tags: ['achievement', 'freelancing']
    },
    {
      id: '3',
      title: 'New Partnership with Tech Giant',
      content: `We're excited to announce our new partnership with a leading tech company that will provide internship opportunities and mentorship programs for our club members.`,
      category: 'announcement',
      date: '2024-04-08',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      tags: ['partnership', 'opportunity']
    },
    {
      id: '4',
      title: 'Remote Work Opportunities',
      content: 'Multiple companies are looking for talented digital professionals for remote positions. Roles include web developers, digital marketers, and content writers.',
      category: 'opportunity',
      date: '2024-04-05',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      tags: ['jobs', 'remote-work']
    }
  ]

  const filteredUpdates = updates.filter(update => {
    const matchesCategory = selectedCategory === 'all' || update.category === selectedCategory
    const matchesSearch = update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
    const cat = categories.find(c => c.id === category)
    return cat?.color || 'bg-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-ajira-primary mb-4">Club Updates</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed about the latest news, events, and opportunities at Ajira Digital KiNaP Club.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
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
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search updates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ajira-primary/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredUpdates.map(update => (
            <div
              key={update.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {update.image && (
                <img
                  src={update.image}
                  alt={update.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(update.category)}`}>
                    {update.category.charAt(0).toUpperCase() + update.category.slice(1)}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(update.date)}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {update.title}
                </h3>

                <p className="text-gray-600 mb-4">
                  {update.content}
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