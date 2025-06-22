import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Bell, 
  User, 
  Menu, 
  Home, 
  TrendingUp, 
  PlayCircle, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download, 
  MoreHorizontal,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  CheckCircle,
  Verified,
  Settings,
  History,
  Star
} from 'lucide-react'
import { Link } from 'react-router-dom'

const Videos: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState('grid')
  const [showSidebar, setShowSidebar] = useState(true)

  const categories = [
    'All',
    'Digital Skills',
    'Freelancing',
    'Web Development',
    'Digital Marketing',
    'Data Entry',
    'Content Creation',
    'Success Stories',
    'Tutorials',
    'Live Streams'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'upload_date', label: 'Upload date' },
    { value: 'view_count', label: 'View count' },
    { value: 'rating', label: 'Rating' },
    { value: 'duration', label: 'Duration' }
  ]

  // Enhanced YouTube-like video data with better verification system
  const videos = [
    {
      id: 1,
      title: "How I Earn $2000+ Monthly as a Kenyan Freelancer - Complete Guide 2025",
      thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
      duration: "15:42",
      views: "125K",
      uploadDate: "2 days ago",
      channel: {
        name: "KiNaP Success Stories",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        subscribers: "45.2K",
        verified: true,
        verificationBadge: "official" // official, music, verified
      },
      description: "In this video, I share my complete journey from student to successful freelancer earning over $2000 monthly. I'll show you the exact strategies, platforms, and skills that helped me achieve financial freedom through digital work.",
      category: "Success Stories",
      tags: ["freelancing", "kenya", "success", "digital work", "income"],
      likes: 8500,
      dislikes: 120,
      isLive: false,
      quality: "HD",
      isPremium: false,
      isSponsored: false
    },
    {
      id: 2,
      title: "WordPress Website Development Tutorial - Build Professional Sites in 2025",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
      duration: "45:18",
      views: "89K",
      uploadDate: "1 week ago",
      channel: {
        name: "KiNaP Tech Academy",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        subscribers: "78.9K",
        verified: true,
        verificationBadge: "verified"
      },
      description: "Complete WordPress tutorial for beginners. Learn how to create professional websites from scratch using the latest WordPress features and best practices for 2025.",
      category: "Web Development",
      tags: ["wordpress", "web development", "tutorial", "website", "coding"],
      likes: 6200,
      dislikes: 89,
      isLive: false,
      quality: "4K",
      isPremium: true,
      isSponsored: false
    },
    {
      id: 3,
      title: "🔴 LIVE: Digital Marketing Q&A - Growing Your Online Business in Kenya",
      thumbnail: "https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg",
      duration: "LIVE",
      views: "1.2K watching",
      uploadDate: "Live now",
      channel: {
        name: "KiNaP Marketing Hub",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        subscribers: "32.1K",
        verified: true,
        verificationBadge: "official"
      },
      description: "Join our live Q&A session where we answer your questions about digital marketing, social media growth, and building successful online businesses in Kenya.",
      category: "Live Streams",
      tags: ["live", "digital marketing", "q&a", "business", "kenya"],
      likes: 450,
      dislikes: 12,
      isLive: true,
      quality: "HD",
      isPremium: false,
      isSponsored: false
    },
    {
      id: 4,
      title: "Data Entry Mastery: Earn $500+ Monthly Working from Home",
      thumbnail: "https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg",
      duration: "28:35",
      views: "67K",
      uploadDate: "3 days ago",
      channel: {
        name: "KiNaP Work From Home",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        subscribers: "23.7K",
        verified: false,
        verificationBadge: null
      },
      description: "Learn the best data entry techniques, tools, and platforms to start earning money from home. Perfect for students and anyone looking for flexible online work.",
      category: "Data Entry",
      tags: ["data entry", "work from home", "online jobs", "income", "tutorial"],
      likes: 3400,
      dislikes: 67,
      isLive: false,
      quality: "HD",
      isPremium: false,
      isSponsored: true
    },
    {
      id: 5,
      title: "Content Creation Secrets: How I Built 100K+ Followers in 6 Months",
      thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
      duration: "22:14",
      views: "156K",
      uploadDate: "5 days ago",
      channel: {
        name: "KiNaP Creators",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        subscribers: "89.3K",
        verified: true,
        verificationBadge: "verified"
      },
      description: "The exact content creation strategy I used to grow from 0 to 100K+ followers across all platforms. Includes templates, tools, and actionable tips you can implement today.",
      category: "Content Creation",
      tags: ["content creation", "social media", "followers", "growth", "strategy"],
      likes: 12500,
      dislikes: 234,
      isLive: false,
      quality: "4K",
      isPremium: true,
      isSponsored: false
    },
    {
      id: 6,
      title: "Graphic Design for Beginners: Create Stunning Logos in Canva",
      thumbnail: "https://img.youtube.com/vi/hFZFjoX2cGg/maxresdefault.jpg",
      duration: "35:27",
      views: "43K",
      uploadDate: "1 week ago",
      channel: {
        name: "KiNaP Design Studio",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
        subscribers: "19.8K",
        verified: false,
        verificationBadge: null
      },
      description: "Complete beginner's guide to graphic design using Canva. Learn to create professional logos, social media graphics, and marketing materials without any prior experience.",
      category: "Digital Skills",
      tags: ["graphic design", "canva", "logo design", "tutorial", "beginner"],
      likes: 2800,
      dislikes: 45,
      isLive: false,
      quality: "HD",
      isPremium: false,
      isSponsored: false
    },
    {
      id: 7,
      title: "SEO Secrets: Rank #1 on Google in 2025 - Complete Guide",
      thumbnail: "https://img.youtube.com/vi/L_LUpnjgPso/maxresdefault.jpg",
      duration: "52:18",
      views: "234K",
      uploadDate: "2 weeks ago",
      channel: {
        name: "KiNaP SEO Masters",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        subscribers: "156.7K",
        verified: true,
        verificationBadge: "official"
      },
      description: "The most comprehensive SEO guide for 2025. Learn the latest Google algorithm updates, keyword research techniques, and on-page optimization strategies that actually work.",
      category: "Digital Marketing",
      tags: ["seo", "google", "ranking", "digital marketing", "website"],
      likes: 18900,
      dislikes: 456,
      isLive: false,
      quality: "4K",
      isPremium: true,
      isSponsored: false
    },
    {
      id: 8,
      title: "Virtual Assistant Success: From Zero to $1500/Month in 90 Days",
      thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg",
      duration: "38:45",
      views: "78K",
      uploadDate: "4 days ago",
      channel: {
        name: "KiNaP VA Academy",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
        subscribers: "34.5K",
        verified: true,
        verificationBadge: "verified"
      },
      description: "My complete virtual assistant journey and the exact steps I took to build a successful VA business. Includes client acquisition strategies, pricing, and service packages.",
      category: "Freelancing",
      tags: ["virtual assistant", "freelancing", "business", "income", "success"],
      likes: 5600,
      dislikes: 89,
      isLive: false,
      quality: "HD",
      isPremium: false,
      isSponsored: false
    },
    {
      id: 9,
      title: "Python Programming for Beginners - Build Your First App",
      thumbnail: "https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg",
      duration: "1:15:32",
      views: "92K",
      uploadDate: "1 week ago",
      channel: {
        name: "KiNaP Code Academy",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
        subscribers: "67.2K",
        verified: true,
        verificationBadge: "verified"
      },
      description: "Complete Python programming course for absolute beginners. Build your first application while learning programming fundamentals, data structures, and best practices.",
      category: "Web Development",
      tags: ["python", "programming", "coding", "tutorial", "beginner"],
      likes: 7800,
      dislikes: 123,
      isLive: false,
      quality: "4K",
      isPremium: true,
      isSponsored: false
    },
    {
      id: 10,
      title: "Affiliate Marketing in Kenya: Earn Passive Income Online",
      thumbnail: "https://img.youtube.com/vi/5qap5aO4i9A/maxresdefault.jpg",
      duration: "31:29",
      views: "145K",
      uploadDate: "6 days ago",
      channel: {
        name: "KiNaP Passive Income",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
        subscribers: "98.4K",
        verified: true,
        verificationBadge: "official"
      },
      description: "Learn how to start affiliate marketing in Kenya and build passive income streams. Covers the best affiliate programs, promotion strategies, and legal requirements.",
      category: "Digital Marketing",
      tags: ["affiliate marketing", "passive income", "kenya", "online business", "marketing"],
      likes: 11200,
      dislikes: 267,
      isLive: false,
      quality: "HD",
      isPremium: false,
      isSponsored: true
    }
  ]

  // Helper function to get verification badge
  const getVerificationBadge = (channel: any) => {
    if (!channel.verified) return null
    
    switch (channel.verificationBadge) {
      case 'official':
        return (
          <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center ml-1 flex-shrink-0" title="Official Channel">
            <CheckCircle className="w-3 h-3 text-white fill-current" />
          </div>
        )
      case 'verified':
        return (
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center ml-1 flex-shrink-0" title="Verified Channel">
            <CheckCircle className="w-3 h-3 text-white fill-current" />
          </div>
        )
      case 'music':
        return (
          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center ml-1 flex-shrink-0" title="Official Music Channel">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
        )
      default:
        return (
          <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center ml-1 flex-shrink-0" title="Verified">
            <CheckCircle className="w-3 h-3 text-white fill-current" />
          </div>
        )
    }
  }

  // Filter videos based on search and category
  const filteredVideos = videos.filter(video => {
    const matchesSearch = !searchQuery || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort videos
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'upload_date':
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      case 'view_count':
        return parseInt(b.views.replace(/[^\d]/g, '')) - parseInt(a.views.replace(/[^\d]/g, ''))
      case 'rating':
        return (b.likes / (b.likes + b.dislikes)) - (a.likes / (a.likes + a.dislikes))
      case 'duration':
        const getDuration = (duration: string) => {
          if (duration === 'LIVE') return 0
          const parts = duration.split(':').map(Number)
          return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1]
        }
        return getDuration(b.duration) - getDuration(a.duration)
      default:
        return 0 // relevance - keep original order
    }
  })

  const formatViews = (views: string) => {
    if (views.includes('watching')) return views
    const num = parseInt(views.replace(/[^\d]/g, ''))
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M views`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K views`
    return `${num} views`
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* YouTube-like Header */}
      <div className="bg-[#0f0f0f] border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <Menu size={20} className="text-white" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.jpeg" alt="KiNaP" className="h-8 w-auto rounded" />
              <span className="text-xl font-bold text-red-500 hidden sm:block">KiNaP Tube</span>
            </Link>
          </div>

          {/* Center Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                />
              </div>
              <button className="px-6 py-2 bg-[#272727] border border-l-0 border-gray-700 rounded-r-full hover:bg-gray-600 transition-colors">
                <Search size={20} className="text-white" />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
              <Settings size={20} className="text-white" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <Bell size={20} className="text-white" />
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <User size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 bg-[#0f0f0f] h-screen sticky top-16 overflow-y-auto border-r border-gray-800 hidden lg:block">
            <div className="p-4">
              {/* Navigation */}
              <div className="space-y-1 mb-6">
                <Link to="/" className="flex items-center space-x-6 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <Home size={20} className="text-white" />
                  <span className="text-white">Home</span>
                </Link>
                <button className="flex items-center space-x-6 px-3 py-2 hover:bg-gray-800 rounded-lg w-full text-left bg-gray-800 transition-colors">
                  <PlayCircle size={20} className="text-white" />
                  <span className="text-white">Videos</span>
                </button>
                <button className="flex items-center space-x-6 px-3 py-2 hover:bg-gray-800 rounded-lg w-full text-left transition-colors">
                  <TrendingUp size={20} className="text-white" />
                  <span className="text-white">Trending</span>
                </button>
                <button className="flex items-center space-x-6 px-3 py-2 hover:bg-gray-800 rounded-lg w-full text-left transition-colors">
                  <History size={20} className="text-white" />
                  <span className="text-white">History</span>
                </button>
                <button className="flex items-center space-x-6 px-3 py-2 hover:bg-gray-800 rounded-lg w-full text-left transition-colors">
                  <WatchLater size={20} className="text-white" />
                  <span className="text-white">Watch Later</span>
                </button>
              </div>

              {/* Categories */}
              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-3 px-3">Categories</h3>
                <div className="space-y-1">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-red-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Channels */}
              <div className="border-t border-gray-800 pt-4 mt-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3 px-3">Subscriptions</h3>
                <div className="space-y-2">
                  {['KiNaP Success Stories', 'KiNaP Tech Academy', 'KiNaP Marketing Hub'].map(channel => (
                    <div key={channel} className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        K
                      </div>
                      <span className="text-sm text-gray-300 truncate">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Mobile Category Scrollbar */}
          <div className="flex space-x-3 mb-4 overflow-x-auto scrollbar-hide lg:hidden">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Filters Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-300 hidden sm:block">Filters</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#272727] border border-gray-700 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 text-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-[#272727]">
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm">
              {sortedVideos.length} videos
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Videos Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4" 
            : "space-y-4"
          }>
            {sortedVideos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group cursor-pointer ${
                  viewMode === 'list' ? 'flex bg-[#181818] rounded-lg overflow-hidden hover:bg-[#272727]' : ''
                }`}
              >
                {/* Video Thumbnail */}
                <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : 'aspect-video'} rounded-lg overflow-hidden`}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:rounded-none transition-all duration-200"
                  />
                  
                  {/* Duration/Live Badge */}
                  <div className="absolute bottom-2 right-2">
                    {video.isLive ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium rounded">
                          LIVE
                        </span>
                      </div>
                    ) : (
                      <span className="bg-black/80 text-white px-2 py-1 text-xs rounded font-medium">
                        {video.duration}
                      </span>
                    )}
                  </div>

                  {/* Quality & Premium Badges */}
                  <div className="absolute top-2 right-2 flex flex-col space-y-1">
                    {video.quality === '4K' && (
                      <span className="bg-black/80 text-white px-2 py-1 text-xs rounded font-medium">
                        4K
                      </span>
                    )}
                    {video.isPremium && (
                      <span className="bg-yellow-600 text-white px-2 py-1 text-xs rounded font-medium">
                        PREMIUM
                      </span>
                    )}
                  </div>

                  {/* Sponsored Badge */}
                  {video.isSponsored && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-black px-2 py-1 text-xs rounded font-medium">
                        AD
                      </span>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-3 flex-1">
                  <div className="flex space-x-3">
                    {/* Channel Avatar */}
                    <img
                      src={video.channel.avatar}
                      alt={video.channel.name}
                      className="w-9 h-9 rounded-full flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      {/* Video Title */}
                      <h3 className="font-medium text-white line-clamp-2 group-hover:text-blue-400 cursor-pointer mb-1 text-sm leading-5">
                        {video.title}
                      </h3>
                      
                      {/* Channel Name */}
                      <div className="flex items-center mb-1">
                        <span className="text-sm text-gray-400 hover:text-white cursor-pointer">
                          {video.channel.name}
                        </span>
                        {getVerificationBadge(video.channel)}
                      </div>
                      
                      {/* Video Stats */}
                      <div className="text-sm text-gray-400">
                        <span>{formatViews(video.views)}</span>
                        <span className="mx-1">•</span>
                        <span>{video.uploadDate}</span>
                      </div>

                      {/* Description (for list view) */}
                      {viewMode === 'list' && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                    </div>

                    {/* More Options */}
                    <button className="p-1 hover:bg-gray-700 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={16} className="text-gray-400" />
                    </button>
                  </div>

                  {/* Action Buttons (for list view) */}
                  {viewMode === 'list' && (
                    <div className="flex items-center space-x-6 mt-3 pt-3 border-t border-gray-700">
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <ThumbsUp size={16} />
                        <span className="text-sm">{video.likes.toLocaleString()}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <ThumbsDown size={16} />
                        <span className="text-sm">{video.dislikes}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <Share2 size={16} />
                        <span className="text-sm">Share</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <Download size={16} />
                        <span className="text-sm">Download</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {sortedVideos.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-[#272727] text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors">
                Load More Videos
              </button>
            </div>
          )}

          {/* No Results */}
          {sortedVideos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-600 mb-4">
                <PlayCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No videos found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or browse different categories
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Videos