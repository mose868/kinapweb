import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ThumbsUp, 
  Radio, 
  Upload,
  Play,
  Users,
  Clock
} from 'lucide-react'

interface Video {
  id: number
  title: string
  thumbnail: string
  creator: string
  views: string
  likes: number
  duration?: string
  isLive: boolean
  category: string
  createdAt: string
  viewers?: number
}

const VideoSection: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 1,
      title: "Digital Marketing Fundamentals 2025",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
      creator: "Ajira Digital Club",
      views: "1.2K",
      likes: 245,
      duration: "15:30",
      isLive: false,
      category: "Digital Marketing",
      createdAt: "2 days ago"
    },
    {
      id: 2,
      title: "How I Earn $500+ Monthly Through Transcription - 2025 Success Story",
      thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
      creator: "Success Team",
      views: "856",
      likes: 156,
      duration: "45:20",
      isLive: false,
      category: "Success Stories",
      createdAt: "5 days ago"
    },
    {
      id: 3,
      title: "Live Q&A: Virtual Assistant Tips for 2025",
      thumbnail: "https://img.youtube.com/vi/ScMzIvxBSi4/maxresdefault.jpg",
      creator: "Career Guidance",
      views: "324",
      likes: 89,
      isLive: true,
      category: "Virtual Assistant",
      viewers: 45,
      createdAt: "Live Now"
    },
    {
      id: 4,
      title: "Web Development Bootcamp 2025 - Complete Guide",
      thumbnail: "https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg",
      creator: "Tech Mentors",
      views: "2.1K",
      likes: 387,
      duration: "1:20:15",
      isLive: false,
      category: "Web Development",
      createdAt: "1 week ago"
    },
    {
      id: 5,
      title: "Freelancing Success Stories from Kenya - 2025 Edition",
      thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
      creator: "Freelance Heroes",
      views: "1.8K",
      likes: 298,
      duration: "32:45",
      isLive: false,
      category: "Success Stories",
      createdAt: "3 days ago"
    },
    {
      id: 6,
      title: "Data Entry Mastery - Earn While You Learn 2025",
      thumbnail: "https://img.youtube.com/vi/hFZFjoX2cGg/maxresdefault.jpg",
      creator: "Data Pros",
      views: "967",
      likes: 178,
      duration: "28:12",
      isLive: false,
      category: "Data Entry",
      createdAt: "4 days ago"
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories: string[] = [
    'All',
    'Digital Marketing',
    'Web Development',
    'Data Entry',
    'Virtual Assistant',
    'Content Creation',
    'Transcription',
    'Success Stories'
  ]

  const handleLike = (videoId: number): void => {
    setVideos(videos.map(video => 
      video.id === videoId 
        ? { ...video, likes: video.likes + 1 }
        : video
    ))
  }

  const filteredVideos = videos.filter(video => 
    selectedCategory === 'All' || video.category === selectedCategory
  )

  return (
    <div className="bg-white py-12">
      <div className="container-custom">
        {/* Header with Categories */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#15325C]">Featured Videos</h2>
            <button
              className="bg-[#008000] hover:bg-[#008000]/90 text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Upload size={20} />
              <span>Upload Video</span>
            </button>
          </div>

          {/* Categories Filter with Kenyan Colors */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#15325C] text-white'
                    : index % 3 === 0 
                      ? 'bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000] hover:text-white'
                      : index % 3 === 1
                      ? 'bg-[#008000]/10 text-[#008000] hover:bg-[#008000] hover:text-white'
                      : 'bg-black/10 text-black hover:bg-black hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Live Streams Section */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-[#15325C] mb-4 flex items-center">
            <Radio className="w-5 h-5 text-[#FF0000] mr-2 animate-pulse" />
            Live Now
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.filter(video => video.isLive).map(video => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:border-[#008000]"
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#FF0000] text-white px-2 py-1 rounded-lg text-sm flex items-center">
                    <Radio className="w-4 h-4 mr-1" />
                    LIVE
                  </div>
                  <div className="absolute top-2 right-2 bg-[#15325C] text-white px-2 py-1 rounded-lg text-sm">
                    {video.category}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.viewers} watching
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2 text-[#15325C]">{video.title}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{video.creator}</span>
                    <div className="flex items-center space-x-2">
                      <Users size={16} />
                      <span>{video.viewers}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recorded Videos Grid */}
        <div>
          <h3 className="text-xl font-bold text-[#15325C] mb-4">Recent Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.filter(video => !video.isLive).map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 ${
                  index % 3 === 0 
                    ? 'hover:border-[#FF0000]'
                    : index % 3 === 1
                    ? 'hover:border-[#008000]'
                    : 'hover:border-black'
                }`}
              >
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-[#15325C] text-white px-2 py-1 rounded-lg text-sm">
                    {video.category}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center bg-[#15325C]/20 opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="w-12 h-12 text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-2 text-[#15325C] hover:text-[#008000] transition-colors">
                    {video.title}
                  </h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{video.creator}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        <span>{video.createdAt}</span>
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp
                          size={16}
                          className="mr-1 cursor-pointer hover:text-[#008000]"
                          onClick={() => handleLike(video.id)}
                        />
                        <span>{video.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoSection 