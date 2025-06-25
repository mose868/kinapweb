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
      title: 'KiNaP Ajira Club AI & Machine Learning Bootcamp 2025',
      content: `Join our intensive 6-week AI and Machine Learning bootcamp starting February 2025. Learn Python, TensorFlow, and real-world AI applications. Industry professionals from Nairobi tech companies will mentor participants.`,
      category: 'event',
      date: '2025-02-15',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80',
      tags: ['AI', 'machine-learning', 'bootcamp', 'python']
    },
    {
      id: '2',
      title: 'Record-Breaking Year: 500+ Members Secured Digital Jobs',
      content: `Incredible achievement! Our club members have secured over 500 digital job placements in 2024, with average salary increases of 300%. This includes positions at top companies like Safaricom, Equity Bank, and international remote roles.`,
      category: 'achievement',
      date: '2025-01-20',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80',
      tags: ['achievement', 'employment', 'success-stories']
    },
    {
      id: '3',
      title: 'Partnership with Google Africa and Microsoft Kenya',
      content: `Exciting news! KiNaP Ajira Club has signed partnerships with Google Africa and Microsoft Kenya to provide free certification programs, cloud credits, and exclusive internship opportunities for our members throughout 2025.`,
      category: 'announcement',
      date: '2025-01-18',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80',
      tags: ['partnership', 'google', 'microsoft', 'certifications']
    },
    {
      id: '4',
      title: 'New State-of-the-Art Innovation Lab Opens',
      content: `Our brand new Innovation Lab is now open! Featuring VR/AR equipment, 3D printers, IoT development kits, and high-performance computing resources. Members can book sessions for hands-on learning and project development.`,
      category: 'announcement',
      date: '2025-01-15',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
      tags: ['innovation-lab', 'technology', 'equipment', 'learning']
    },
    {
      id: '5',
      title: 'Blockchain & Web3 Development Program Launch',
      content: `Starting March 2025, learn blockchain development, smart contracts, and DeFi applications. Partner with local fintech companies for real project experience. Prerequisites: Basic programming knowledge.`,
      category: 'event',
      date: '2025-03-01',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80',
      tags: ['blockchain', 'web3', 'cryptocurrency', 'smart-contracts']
    },
    {
      id: '6',
      title: '1000+ Freelance Projects Completed in Q4 2024',
      content: `Our members successfully delivered over 1000 freelance projects in the last quarter of 2024, earning a collective income of over KSh 50 million. Top categories: web development, digital marketing, and graphic design.`,
      category: 'achievement',
      date: '2025-01-10',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      tags: ['freelancing', 'income', 'projects', 'success']
    },
    {
      id: '7',
      title: 'International Exchange Program with Silicon Valley',
      content: `Selected members will participate in a 3-month exchange program with tech companies in Silicon Valley. Applications open February 2025. Fully sponsored including flights, accommodation, and stipend.`,
      category: 'opportunity',
      date: '2025-02-01',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80',
      tags: ['exchange-program', 'silicon-valley', 'international', 'sponsored']
    },
    {
      id: '8',
      title: 'KiNaP Ajira Annual Tech Conference 2025',
      content: `Join us for our biggest event of the year! 3-day conference featuring keynote speakers from Meta, Amazon, and local tech leaders. Workshops, networking sessions, and startup pitch competitions. Early bird tickets available.`,
      category: 'event',
      date: '2025-06-15',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
      tags: ['conference', 'networking', 'workshops', 'tech-leaders']
    },
    {
      id: '9',
      title: 'New Mobile App Development Track',
      content: `Learn Flutter, React Native, and native Android/iOS development. 12-week comprehensive program includes UI/UX design, backend integration, and app store deployment. Mentorship from senior mobile developers.`,
      category: 'announcement',
      date: '2025-04-01',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80',
      tags: ['mobile-development', 'flutter', 'react-native', 'app-development']
    },
    {
      id: '10',
      title: 'Cybersecurity Awareness Month Campaign',
      content: `March 2025 is our Cybersecurity Awareness Month! Free workshops on ethical hacking, penetration testing, and digital security. Collaboration with Kenya's National Computer and Cybercrimes Coordination Committee.`,
      category: 'event',
      date: '2025-03-01',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
      tags: ['cybersecurity', 'ethical-hacking', 'digital-security', 'awareness']
    },
    {
      id: '11',
      title: 'Alumni Network Reaches 5000+ Professionals',
      content: `Our alumni network has grown to over 5000 professionals working across 50+ countries. New mentorship matching system connects current students with successful graduates for career guidance and opportunities.`,
      category: 'achievement',
      date: '2025-01-05',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80',
      tags: ['alumni', 'mentorship', 'global-network', 'career-guidance']
    },
    {
      id: '12',
      title: 'Digital Marketing Certification Program with HubSpot',
      content: `Free HubSpot Digital Marketing Certification for all members! Covers content marketing, social media strategy, SEO, and analytics. Successful completion leads to job placement assistance with partner agencies.`,
      category: 'opportunity',
      date: '2025-02-10',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      tags: ['digital-marketing', 'hubspot', 'certification', 'job-placement']
    },
    {
      id: '13',
      title: 'Startup Incubator Program Launch',
      content: `Transform your ideas into reality! Our new startup incubator provides funding, mentorship, and workspace for student entrepreneurs. Applications open for the first cohort of 20 startups. Seed funding up to KSh 2 million available.`,
      category: 'announcement',
      date: '2025-03-15',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80',
      tags: ['startup-incubator', 'entrepreneurship', 'funding', 'mentorship']
    },
    {
      id: '14',
      title: 'Data Science & Analytics Bootcamp Success',
      content: `100% job placement rate for our Data Science bootcamp graduates! All 50 participants secured positions as data analysts, data scientists, and business intelligence specialists. Next cohort starts April 2025.`,
      category: 'achievement',
      date: '2025-01-25',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80',
      tags: ['data-science', 'job-placement', 'analytics', 'bootcamp-success']
    },
    {
      id: '15',
      title: 'Remote Work Opportunities: 200+ Open Positions',
      content: `Exclusive access to 200+ remote work opportunities from our partner companies globally. Positions range from entry-level to senior roles in development, design, marketing, and project management. Apply through our job portal.`,
      category: 'opportunity',
      date: '2025-01-30',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80',
      tags: ['remote-work', 'job-opportunities', 'global-positions', 'career-growth']
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