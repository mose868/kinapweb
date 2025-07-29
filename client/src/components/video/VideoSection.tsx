import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, Radio, Upload, Play, Users, Clock, Search } from 'lucide-react'

const YOUTUBE_API_KEY = 'AIzaSyAYVllkkioS_hE0KPfcS3NZNU5xnFq7ml4'; // <-- Replace with your real API key
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_VIDEO_URL = 'https://www.googleapis.com/youtube/v3/videos';

interface Video {
  id: string
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
  const [videos, setVideos] = useState<Video[]>([])
  const [searchTerm, setSearchTerm] = useState('ajira digital')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

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

  // Fetch videos from YouTube API
  const fetchVideos = async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      // Search for videos
      const searchRes = await fetch(`${YOUTUBE_SEARCH_URL}?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`)
      const searchData = await searchRes.json()
      if (!searchData.items) throw new Error('No videos found')
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',')
      // Get video details (views, duration, etc)
      const detailsRes = await fetch(`${YOUTUBE_VIDEO_URL}?part=snippet,contentDetails,statistics,liveStreamingDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`)
      const detailsData = await detailsRes.json()
      const videos: Video[] = detailsData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        creator: item.snippet.channelTitle,
        views: item.statistics?.viewCount ? Number(item.statistics.viewCount).toLocaleString() : 'N/A',
        likes: item.statistics?.likeCount ? Number(item.statistics.likeCount) : 0,
        duration: item.contentDetails?.duration ? formatDuration(item.contentDetails.duration) : '',
        isLive: item.snippet.liveBroadcastContent === 'live',
        category: item.snippet.categoryId || 'General',
        createdAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
        viewers: item.liveStreamingDetails?.concurrentViewers ? Number(item.liveStreamingDetails.concurrentViewers) : undefined,
      }))
      setVideos(videos)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch videos')
    } finally {
      setLoading(false)
    }
  }

  // Format ISO 8601 duration to mm:ss or hh:mm:ss
  const formatDuration = (iso: string) => {
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return ''
    const [, h, m, s] = match.map(Number)
    return [h, m, s].filter(Boolean).map(v => String(v).padStart(2, '0')).join(':')
  }

  // Initial fetch
  React.useEffect(() => {
    fetchVideos(searchTerm)
    // eslint-disable-next-line
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVideos(searchTerm)
  }

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    if (category === 'All') {
      fetchVideos('ajira digital')
    } else {
      fetchVideos(category)
    }
  }

  return (
    <div className="bg-white py-4 w-full min-h-screen">
      {/* Sticky top bar for search and categories on mobile */}
      <div className="sticky top-0 z-40 bg-white w-full">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2 mb-2 w-full px-2 pt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search YouTube videos..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg w-full text-sm"
          />
          <button type="submit" className="bg-[#15325C] text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 text-sm">
            <Search size={18} />
            Search
          </button>
        </form>
        {/* Categories Filter - horizontal scroll on mobile */}
        <div className="flex gap-2 mb-2 w-full overflow-x-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {categories.map((category, index) => (
              <button
                key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#15325C] ${
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

      {loading && <div className="text-center py-8 text-ajira-accent font-bold">Loading videos...</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}

      {/* Videos Grid - YouTube style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 w-full px-2">
        {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:border-[#008000] w-full max-w-full flex flex-col"
              >
            <div className="relative w-full overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                className="w-full aspect-[16/9] h-auto object-cover block"
                onError={e => { e.currentTarget.src = '/default-thumbnail.png'; }}
              />
              {video.isLive && (
                <div className="absolute top-2 left-2 bg-[#FF0000] text-white px-2 py-1 rounded-lg text-xs flex items-center">
                  <Radio className="w-4 h-4 mr-1" /> LIVE
                </div>
              )}
              <div className="absolute top-2 right-2 bg-[#15325C] text-white px-2 py-1 rounded-lg text-xs">
                {video.category}
                    </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {video.isLive ? `${video.viewers || 0} watching` : video.duration}
                  </div>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center bg-[#15325C]/20 opacity-0 hover:opacity-100 transition-opacity"
              >
                <Play className="w-10 h-10 text-white" />
              </a>
                  </div>
            <div className="p-2 flex-1 flex flex-col justify-between">
              <h4 className="font-semibold text-sm mb-1 text-[#15325C] hover:text-[#008000] transition-colors break-words line-clamp-2">
                    {video.title}
                  </h4>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-600 gap-1">
                <span className="truncate max-w-full">{video.creator}</span>
                <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                    <Clock size={12} className="mr-1" />
                        <span>{video.createdAt}</span>
                      </div>
                      <div className="flex items-center">
                    <ThumbsUp size={12} className="mr-1" />
                        <span>{video.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>
    </div>
  )
}

export default VideoSection 