import React, { useState, useEffect, useRef } from 'react'
import YouTube from 'react-youtube';
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
  Star,
  Bookmark,
  Plus,
  UploadCloud,
  Flag,
  Copy,
  ExternalLink
} from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import onlineWorkVideos from '../../../../online_work_videos.json';
import axios from 'axios';

// Collapsible DescriptionBox component (must be top-level, not nested)
function DescriptionBox({ description }) {
  const [expanded, setExpanded] = useState(false);
  const shortDesc = description.length > 180 ? description.slice(0, 180) + '...' : description;
  return (
    <div className="mb-4">
      <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
        {expanded ? description : shortDesc}
      </p>
      {description.length > 180 && (
        <button
          className="text-blue-600 hover:underline mt-2 text-sm font-medium"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

const Videos: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('relevance')
  const [viewMode, setViewMode] = useState('grid')
  const [showSidebar, setShowSidebar] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)
  // Like/dislike state (persisted in localStorage)
  const [likes, setLikes] = useState<{ [id: number]: boolean }>({})
  const [dislikes, setDislikes] = useState<{ [id: number]: boolean }>({})
  // Comments state (persisted in localStorage)
  const [comments, setComments] = useState<{ [id: number]: string[] }>({})
  const [commentInput, setCommentInput] = useState('')
  // Toast message
  const [toast, setToast] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'trending'
  const location = useLocation();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', thumbnail: '', videoFile: null, duration: '' });
  const [uploadStep, setUploadStep] = useState(1); // 1: select file, 2: details
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');

  // For YouTube player control
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Video options dropdown state
  const [openVideoOptions, setOpenVideoOptions] = useState<number | null>(null);
  const videoOptionsRef = useRef<HTMLDivElement>(null);

  // Load likes/dislikes/comments from localStorage
  useEffect(() => {
    setLikes(JSON.parse(localStorage.getItem('videoLikes') || '{}'))
    setDislikes(JSON.parse(localStorage.getItem('videoDislikes') || '{}'))
    setComments(JSON.parse(localStorage.getItem('videoComments') || '{}'))
  }, [])

  // Persist likes/dislikes/comments
  useEffect(() => {
    localStorage.setItem('videoLikes', JSON.stringify(likes))
  }, [likes])
  useEffect(() => {
    localStorage.setItem('videoDislikes', JSON.stringify(dislikes))
  }, [dislikes])
  useEffect(() => {
    localStorage.setItem('videoComments', JSON.stringify(comments))
  }, [comments])

  // Click outside handler for video options dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (videoOptionsRef.current && !videoOptionsRef.current.contains(event.target as Node)) {
        setOpenVideoOptions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Video options handlers
  const handleVideoOptionsClick = (videoId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenVideoOptions(openVideoOptions === videoId ? null : videoId);
  };

  const handleVideoOption = (action: string, video: any) => {
    switch (action) {
      case 'save':
        setToast('Video saved to playlist!');
        break;
      case 'share':
        handleShare(video.videoUrl);
        break;
      case 'download':
        handleDownload(video);
        break;
      case 'report':
        setToast('Report submitted!');
        break;
      case 'copy-link':
        navigator.clipboard.writeText(video.videoUrl);
        setToast('Link copied to clipboard!');
        break;
      case 'open-external':
        window.open(video.videoUrl, '_blank');
        break;
    }
    setOpenVideoOptions(null);
    setTimeout(() => setToast(null), 2000);
  };

  // Like handler
  const handleLike = (id: number) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }))
    setDislikes(prev => ({ ...prev, [id]: false }))
  }
  // Dislike handler
  const handleDislike = (id: number) => {
    setDislikes(prev => ({ ...prev, [id]: !prev[id] }))
    setLikes(prev => ({ ...prev, [id]: false }))
  }
  // Share handler
  const handleShare = (videoUrl: string) => {
    navigator.clipboard.writeText(videoUrl)
    setToast('Link copied!')
    setTimeout(() => setToast(null), 2000)
  }
  // Download handler
  const handleDownload = (video: any) => {
    if (video.videoUrl.includes('youtube.com')) {
      setToast('Download not available for YouTube videos.')
      setTimeout(() => setToast(null), 2000)
      return
    }
    // For direct video files
    const link = document.createElement('a')
    link.href = video.videoUrl
    link.download = video.title
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  // Add comment
  const handleAddComment = (id: number) => {
    if (!commentInput.trim()) return
    setComments(prev => ({
      ...prev,
      [id]: prev[id] ? [commentInput, ...prev[id]] : [commentInput]
    }))
    setCommentInput('')
  }

  // Add this function to track video history
  function addToHistory(video) {
    const stored = localStorage.getItem('videoHistory');
    let history = stored ? JSON.parse(stored) : [];
    // Remove if already exists
    history = history.filter(v => v.id !== video.id);
    // Add to front
    history.unshift(video);
    // Limit to 100
    if (history.length > 100) history = history.slice(0, 100);
    localStorage.setItem('videoHistory', JSON.stringify(history));
  }

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
    'Live Streams',
    'Trading'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'upload_date', label: 'Upload date' },
    { value: 'view_count', label: 'View count' },
    { value: 'rating', label: 'Rating' },
    { value: 'duration', label: 'Duration' }
  ]

  // Use the imported JSON as the videos array
  const videos = onlineWorkVideos;

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

  // Helper: get verified videos sorted by views/likes
  const getTrendingVideos = () => {
    return [...videos]
      .filter(v => v.channel && v.channel.verified)
      .sort((a, b) => {
        // Try to sort by views (as number), fallback to likes
        const getViews = v => parseInt((v.views || '').replace(/[^\d]/g, '')) || 0;
        if (getViews(b) !== getViews(a)) return getViews(b) - getViews(a);
        return (b.likes || 0) - (a.likes || 0);
      });
  };

  // Autocomplete suggestions for search
  const searchSuggestions = searchQuery.length > 0 ?
    videos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.channel && video.channel.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 6) : [];

  // Helper: get all unique creators matching the search
  const creatorSuggestions = searchQuery.length > 0
    ? Array.from(new Set(videos
        .filter(video => video.channel && video.channel.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(video => video.channel.name)
      ))
    : [];

  // Trading videos: show all, no limit, from all creators
  const tradingVideos = videos.filter(
    v => v.category?.toLowerCase() === 'trading' || v.tags?.some(tag => tag.toLowerCase() === 'trading')
  );

  // Trending: top 24 unique, most popular videos from verified creators
  const trendingVideos = (() => {
    const seen = new Set();
    return getTrendingVideos()
      .filter(v => {
        if (seen.has(v.id)) return false;
        seen.add(v.id);
        return true;
      })
      .slice(0, 24);
  })();

  // All Videos: show all videos, not sorted/limited like trending
  const allVideos = videos;

  // In the render, for All Videos tab, use allVideos; for Trending, use trendingVideos
  const filteredVideos = selectedCategory === 'Trading'
    ? tradingVideos.filter(video => {
        const q = searchQuery.toLowerCase();
        return !q ||
          video.title.toLowerCase().includes(q) ||
          video.description.toLowerCase().includes(q) ||
          video.tags.some(tag => tag.toLowerCase().includes(q)) ||
          (video.channel && video.channel.name.toLowerCase().includes(q));
      })
    : activeTab === 'trending'
      ? trendingVideos.filter(video => {
          const q = searchQuery.toLowerCase();
          return !q ||
            video.title.toLowerCase().includes(q) ||
            video.description.toLowerCase().includes(q) ||
            video.tags.some(tag => tag.toLowerCase().includes(q)) ||
            (video.channel && video.channel.name.toLowerCase().includes(q));
        })
      : allVideos.filter(video => {
          const q = searchQuery.toLowerCase();
          const matchesSearch = !q ||
            video.title.toLowerCase().includes(q) ||
            video.description.toLowerCase().includes(q) ||
            video.tags.some(tag => tag.toLowerCase().includes(q)) ||
            (video.channel && video.channel.name.toLowerCase().includes(q));
          const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });

  // Fallback: trending/suggested videos (verified, sorted by views/likes)
  // This variable is no longer needed as trendingVideos is now a constant
  // const trendingVideos = getTrendingVideos().slice(0, 24);

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

  // Fullscreen toggle handler
  const handleFullscreen = () => {
    if (!playerRef.current) return;
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if ((playerRef.current as any).webkitRequestFullscreen) {
        (playerRef.current as any).webkitRequestFullscreen();
      } else if ((playerRef.current as any).msRequestFullscreen) {
        (playerRef.current as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change to update state
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  async function handleUploadSubmit(e) {
    e.preventDefault();
    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      formData.append('userId', 'demo-user');
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('thumbnail', uploadForm.thumbnail);
      formData.append('duration', uploadForm.duration);
      if (uploadForm.videoFile) formData.append('videoFile', uploadForm.videoFile);
      await axios.post('/api/user-videos/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      });
      setUploadSuccess(true);
      setUploadForm({ title: '', description: '', thumbnail: '', videoFile: null, duration: '' });
      setVideoPreviewUrl('');
      setUploadStep(1);
      setShowUploadModal(false);
      window.location.reload();
    } catch (err) {
      setUploadError('Upload failed.');
    }
    setUploading(false);
    setUploadProgress(0);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(f => ({ ...f, videoFile: file }));
      setVideoPreviewUrl(URL.createObjectURL(file));
      setUploadStep(2);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadForm(f => ({ ...f, videoFile: file }));
      setVideoPreviewUrl(URL.createObjectURL(file));
      setUploadStep(2);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  // Define a default avatar image at the top of the file
  const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

  return (
    <div className="flex min-h-screen bg-white w-full overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 py-6 px-2 fixed left-0 top-0 bottom-0 z-40">
        <div className="flex items-center mb-8 px-2">
          <img src="/logo.jpeg" alt="Kinap Hub" className="h-8 w-auto rounded mr-2" />
          <span className="text-2xl font-bold text-red-600 tracking-tight">Kinap Hub</span>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink to="/videos" className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-900'}` }>
            <Home size={22} /> Home
          </NavLink>
          <NavLink to="/shorts" className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700'}` }>
            <PlayCircle size={22} /> Shorts
          </NavLink>
          <NavLink to="/subscriptions" className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700'}` }>
            <User size={22} /> Subscriptions
          </NavLink>
        </nav>
        <div className="mt-8">
          <h4 className="text-xs text-gray-500 font-semibold mb-2 px-4">You</h4>
          <nav className="flex flex-col gap-2">
            <NavLink to="/history" className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700'}` }>
              <History size={22} /> History
            </NavLink>
            <NavLink to="/playlists" className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700'}` }>
              <Bookmark size={22} /> Playlists
            </NavLink>
            <NavLink to="/your-videos" className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700'}` }>
              <User size={22} /> Your videos
            </NavLink>
            <NavLink to="/watch-later" className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700'}` }>
              <Clock size={22} /> Watch later
            </NavLink>
            <NavLink to="/liked-videos" className={({ isActive }) => `flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700'}` }>
              <ThumbsUp size={22} /> Liked videos
            </NavLink>
          </nav>
        </div>
        <div className="mt-8">
          <h4 className="text-xs text-gray-500 font-semibold mb-2 px-4">Subscriptions</h4>
          <nav className="flex flex-col gap-2">
            <button className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <img src="https://yt3.ggpht.com/ytc/AMLnZu9QwTessOgamba=s68-c-k-c0x00ffffff-no-rj" alt="Tess Ogamba" className="w-6 h-6 rounded-full" /> Tess Ogamba
            </button>
            <button className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
              <img src="https://yt3.ggpht.com/ytc/AMLnZu9QwOnlineHustle=s68-c-k-c0x00ffffff-no-rj" alt="Online Hustle KE" className="w-6 h-6 rounded-full" /> Online Hustle KE
            </button>
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 md:ml-60 w-full">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-3 w-full">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded-full hover:bg-gray-100">
              <Menu size={24} />
            </button>
            <span className="text-xl font-bold text-red-600 md:hidden">Kinap Hub</span>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Tabs for All/Trending - KEEP THIS ONE */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                className={`px-4 py-2 rounded-full font-semibold transition-colors ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
                onClick={() => setActiveTab('all')}
              >
                All Videos
              </button>
              <button
                className={`px-4 py-2 rounded-full font-semibold transition-colors ${activeTab === 'trending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
                onClick={() => setActiveTab('trending')}
              >
                Trending
              </button>
            </div>
            {/* REMOVE THE DUPLICATE TABS BELOW, KEEP ONLY THE SEARCH BAR */}
            <div className="relative flex-1 max-w-2xl mx-4 mb-4 flex items-center" style={{ gap: '1.5rem' }}>
              {/* Search input with clear button */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search by title, creator, or tag..."
                  className="w-full px-4 py-2 bg-[#121212] border border-gray-700 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 pr-10"
                />
                {searchQuery && (
                    <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-lg"
                    onClick={() => setSearchQuery('')}
                    tabIndex={-1}
                  >
                    ✕
                    </button>
                )}
                {showSuggestions && (searchSuggestions.length > 0 || creatorSuggestions.length > 0) && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {creatorSuggestions.length > 0 && (
                      <div className="border-b border-gray-200 px-4 py-2 text-xs text-gray-500 font-semibold">Creators</div>
                    )}
                    {creatorSuggestions.map((creator, i) => (
                      <div
                        key={creator}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-900 border-b border-gray-100 last:border-b-0"
                        onMouseDown={() => {
                          setSearchQuery(creator);
                          setShowSuggestions(false);
                        }}
                      >
                        <span className="font-semibold">{creator}</span>
                      </div>
                    ))}
                    {searchSuggestions.length > 0 && (
                      <div className="border-b border-gray-200 px-4 py-2 text-xs text-gray-500 font-semibold">Videos</div>
                    )}
                    {searchSuggestions.map((s, i) => (
                      <div
                        key={s.id}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-gray-900 border-b border-gray-100 last:border-b-0"
                        onMouseDown={() => {
                          setSearchQuery(s.title);
                          setShowSuggestions(false);
                        }}
                      >
                        <span className="font-semibold">{s.title}</span>
                        <span className="ml-2 text-xs text-gray-500">{s.channel?.name}</span>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setShowUploadModal(true)}>
              <Plus size={22} />
            </button>
            <img src="/logo.jpeg" alt="User" className="w-8 h-8 rounded-full border border-gray-300" />
          </div>
        </header>
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto py-4 px-2 sm:px-4 bg-white border-b border-gray-200 scrollbar-hide w-full">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {category}
              </button>
            ))}
          </div>
        {/* Video Grid */}
        <main className="flex-1 p-2 sm:p-4 md:p-8 bg-white w-full">
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
              {filteredVideos.length} videos
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Videos Grid/List or Fallback */}
          {filteredVideos.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full" 
            : "space-y-4 w-full"
          }>
              {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group cursor-pointer ${
                  viewMode === 'list' ? 'flex bg-[#181818] rounded-lg overflow-hidden hover:bg-[#272727]' : ''
                }`}
                  onClick={() => { setSelectedVideo(video); addToHistory(video); }}
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
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
                    >
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-3 flex-1">
                  <div className="flex space-x-3">
                    {/* Channel Avatar */}
                    <img
                        src={video.channel.avatar || DEFAULT_AVATAR}
                      alt={video.channel.name}
                        className="w-6 h-6 rounded-full"
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
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-600 mb-4">
                <PlayCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">
                Try a different search or check out trending videos below.
              </p>
              {/* Fallback: Trending/Suggested Videos */}
              <div className="mt-8">
                <h4 className="text-lg font-bold text-white mb-4">Trending Now (Verified Creators)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {trendingVideos.map(video => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group cursor-pointer ${
                        viewMode === 'list' ? 'flex bg-[#181818] rounded-lg overflow-hidden hover:bg-[#272727]' : ''
                      }`}
                      onClick={() => { setSelectedVideo(video); addToHistory(video); }}
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
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
                        >
                          <PlayCircle className="w-16 h-16 text-white" />
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="p-3 flex-1">
                        <div className="flex space-x-3">
                          {/* Channel Avatar */}
                          <img
                            src={video.channel.avatar || DEFAULT_AVATAR}
                            alt={video.channel.name}
                            className="w-6 h-6 rounded-full"
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
              </div>
            </div>
          )}

          {/* Load More */}
          {filteredVideos.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-[#272727] text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors">
                Load More Videos
              </button>
            </div>
          )}

          {/* No Results */}
          {/* This block is now handled by the new_code, but keeping it for consistency */}
          {filteredVideos.length === 0 && (
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
        </main>
      </div>

      {/* Overlay for YouTube-like player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row items-start justify-center min-h-screen w-screen overflow-y-auto px-0 sm:px-2">
          {/* Elegant close button */}
          <button
            onClick={() => setSelectedVideo(null)}
            className="fixed top-6 right-6 bg-white text-black rounded-full p-2 hover:bg-red-500 hover:text-white z-[100] text-xl font-bold shadow-lg border border-gray-300 transition-colors duration-200"
            title="Close"
            style={{ fontSize: '1.7rem', lineHeight: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
          >
            ✕
          </button>
          <div className="relative w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-start justify-center min-h-[80vh] py-4 sm:py-8 px-1 sm:px-2 md:px-0 gap-4 sm:gap-8">
            {/* Left: Player + Info */}
            <div className="flex-1 flex flex-col items-center md:items-start justify-start w-full max-w-3xl mx-auto">
              {/* Video Player, centered with margin, rounded corners */}
              <div className="w-full flex justify-center items-center mb-4 sm:mb-6 mt-4 sm:mt-8 md:mt-0">
                <div className="relative w-full aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: '180px', maxWidth: '900px' }}>
                  {/* Use react-youtube for YouTube videos, fallback to <video> for uploads */}
                  {selectedVideo.videoUrl && selectedVideo.videoUrl.includes('youtube.com') ? (
                    <>
                      <YouTube
                        videoId={selectedVideo.videoUrl.split('v=')[1]}
                        opts={{
                          width: '100%',
                          height: '100%',
                          playerVars: {
                            autoplay: 1,
                            rel: 0,
                            modestbranding: 1,
                            showinfo: 0,
                            controls: 0, // Hide default controls
                          },
                        }}
                        className="w-full h-full min-h-[200px] rounded-2xl"
                        onReady={e => {
                          setYtPlayer(e.target);
                          setIsPlaying(true);
                        }}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      {/* Custom Play/Pause Controls */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                        <button
                          className="bg-white/80 hover:bg-white text-black rounded-full p-3 shadow-lg border border-gray-300"
                          onClick={() => {
                            if (ytPlayer) {
                              if (isPlaying) {
                                ytPlayer.pauseVideo();
                                setIsPlaying(false);
                              } else {
                                ytPlayer.playVideo();
                                setIsPlaying(true);
                              }
                            }
                          }}
                        >
                          {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                              <polygon points="6,4 20,12 6,20" fill="currentColor" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <video
                      src={selectedVideo.videoUrl}
                      controls
                      autoPlay
                    className="w-full h-full min-h-[200px] rounded-2xl"
                    style={{ borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
                    />
                  )}
                </div>
              </div>
              {/* Info/Actions Section */}
              <div className="w-full bg-white rounded-b-xl shadow-none p-0 mt-0" style={{ maxWidth: '900px' }}>
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight text-left px-2 md:px-0">{selectedVideo.title}</h2>
                {/* Channel Row and Actions */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 px-2 md:px-0">
                  <div className="flex items-center">
                    <img src={selectedVideo.channel.avatar || DEFAULT_AVATAR} alt={selectedVideo.channel.name} className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200 bg-white object-cover" />
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold text-gray-900 mr-2 text-lg">{selectedVideo.channel.name}</span>
                        {getVerificationBadge(selectedVideo.channel)}
                      </div>
                      <span className="text-gray-500 text-sm">{selectedVideo.channel.subscribers} subscribers</span>
                    </div>
                    <button className="ml-6 px-5 py-2 bg-red-600 text-white font-semibold rounded-full shadow hover:bg-red-700 transition-colors text-base">Subscribe</button>
                  </div>
                  {/* Action Row */}
                  <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
                    <button className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-base shadow-sm border border-gray-200 ${likes[selectedVideo.id] ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`} onClick={() => handleLike(selectedVideo.id)}>
                      <ThumbsUp size={18} />
                      <span>{selectedVideo.likes + (likes[selectedVideo.id] ? 1 : 0)}</span>
                    </button>
                    <button className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-base shadow-sm border border-gray-200 ${dislikes[selectedVideo.id] ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-red-50'}`} onClick={() => handleDislike(selectedVideo.id)}>
                      <ThumbsDown size={18} />
                      <span>{selectedVideo.dislikes + (dislikes[selectedVideo.id] ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-base shadow-sm border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" onClick={() => handleShare(selectedVideo.videoUrl)}>
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-base shadow-sm border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" onClick={() => handleDownload(selectedVideo)} disabled={selectedVideo.videoUrl.includes('youtube.com')} title={selectedVideo.videoUrl.includes('youtube.com') ? 'Download not available for YouTube videos' : 'Download'}>
                      <Download size={18} />
                      <span>Download</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full font-medium text-base shadow-sm border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                      <Bookmark size={18} />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
                {/* Meta Info Row */}
                <div className="flex flex-wrap items-center space-x-4 mb-3 text-gray-500 text-sm px-2 md:px-0">
                  <span>{formatViews(selectedVideo.views)} views</span>
                  <span>{selectedVideo.uploadDate}</span>
                  <span>{selectedVideo.quality}</span>
                </div>
                {/* Full Description (not collapsed, with line breaks) */}
                <div className="mb-4 px-2 md:px-0">
                  <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">{selectedVideo.description}</p>
                </div>
                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>
                {/* Comments Section */}
                <div className="mt-4 px-2 md:px-0">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Comments</h4>
                  <div className="flex mb-4">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-l-full text-gray-800 placeholder-gray-400"
                    />
                    <button
                      onClick={() => handleAddComment(selectedVideo.id)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 transition-colors"
                    >
                      Comment
                    </button>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {(comments[selectedVideo.id] || []).length === 0 && (
                      <div className="text-gray-500">No comments yet. Be the first to comment!</div>
                    )}
                    {(comments[selectedVideo.id] || []).map((c, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg px-4 py-2 text-gray-900 text-sm">{c}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Recommendations Sidebar (right on desktop, below on mobile) */}
            <div className="w-full md:w-96 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto rounded-r-2xl max-h-[80vh] flex flex-col mt-8 md:mt-0 md:ml-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Up next</h3>
              <div className="space-y-4 overflow-y-auto">
                {sortedVideos.filter(v => v.id !== selectedVideo.id).map(rec => (
                  <div
                    key={rec.id}
                    className={`flex items-start space-x-3 cursor-pointer rounded-lg p-2 transition-colors ${rec.id === selectedVideo.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    onClick={() => { setSelectedVideo(rec); addToHistory(rec); }}
                  >
                    <img src={rec.thumbnail} alt={rec.title} className="w-24 h-16 object-cover rounded shadow border border-gray-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 font-medium text-base line-clamp-2 mb-1">{rec.title}</h4>
                      <span className="text-gray-500 text-xs block mb-1">{rec.channel.name}</span>
                      <span className="text-gray-400 text-xs">{rec.duration} • {formatViews(rec.views)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Toast Message */}
          {toast && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 text-lg animate-fade-in">
              {toast}
            </div>
          )}
        </div>
      )}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2 sm:px-0">
          <div className="bg-white rounded-xl shadow-lg p-0 w-full max-w-lg relative flex flex-col">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold" onClick={() => { setShowUploadModal(false); setUploadStep(1); setVideoPreviewUrl(''); setUploadForm({ title: '', description: '', thumbnail: '', videoFile: null, duration: '' }); }}>✕</button>
            <div className="flex flex-col items-center p-8">
              <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
              {uploadStep === 1 && (
                <div className="w-full flex flex-col items-center">
                  <div
                    className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors mb-4"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => document.getElementById('video-upload-input').click()}
                  >
                    <UploadCloud size={48} className="text-blue-500 mb-2" />
                    <p className="text-lg font-semibold mb-2">Drag and drop video files to upload</p>
                    <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">Select files</button>
                    <input id="video-upload-input" type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                  </div>
                  <p className="text-gray-500 text-sm">Your videos will be private until you publish them.</p>
                </div>
              )}
              {uploadStep === 2 && (
                <form onSubmit={handleUploadSubmit} className="w-full flex flex-col gap-4 mt-2">
                  {videoPreviewUrl && (
                    <video src={videoPreviewUrl} controls className="w-full rounded-lg mb-2 max-h-56 bg-black" />
                  )}
                  <input type="text" className="w-full px-4 py-2 border rounded" placeholder="Title" value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))} required />
                  <textarea className="w-full px-4 py-2 border rounded" placeholder="Description" value={uploadForm.description} onChange={e => setUploadForm(f => ({ ...f, description: e.target.value }))} required />
                  <input type="text" className="w-full px-4 py-2 border rounded" placeholder="Thumbnail URL (optional)" value={uploadForm.thumbnail} onChange={e => setUploadForm(f => ({ ...f, thumbnail: e.target.value }))} />
                  <input type="text" className="w-full px-4 py-2 border rounded" placeholder="Duration (e.g. 03:45)" value={uploadForm.duration} onChange={e => setUploadForm(f => ({ ...f, duration: e.target.value }))} />
                  {uploading && (
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                  <div className="flex justify-between mt-2">
                    <button type="button" className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors" onClick={() => { setUploadStep(1); setVideoPreviewUrl(''); setUploadForm(f => ({ ...f, videoFile: null })); }}>Back</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors" disabled={uploading}>{uploading ? 'Publishing...' : 'Publish'}</button>
                  </div>
                  {uploadSuccess && <div className="text-green-600 font-semibold">Upload successful!</div>}
                  {uploadError && <div className="text-red-600 font-semibold">{uploadError}</div>}
                </form>
              )}
            </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default Videos;