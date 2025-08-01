import React, { useState, useRef } from 'react';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import { Loader2, Youtube } from 'lucide-react'

interface VideoUploadProps {
  onSuccess?: () => void
}

const VideoUpload = ({ onSuccess }: VideoUploadProps) => {
  const { user } = useBetterAuthContext()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    youtubeUrl: ''
  })
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('')
  const [youtubeId, setYoutubeId] = useState<string>('')

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Generate thumbnail URL from YouTube video ID
  const getYoutubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  // Handle YouTube URL change
  const handleYoutubeUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, youtubeUrl: url }))
    const videoId = getYoutubeVideoId(url)
    if (videoId) {
      setYoutubeId(videoId)
      setThumbnailUrl(getYoutubeThumbnail(videoId))
    } else {
      setYoutubeId('')
      setThumbnailUrl('')
    }
  }

  // Upload mutation
  const uploadMutation = useMutation(async () => {
    if (!user) throw new Error('You must be logged in to upload videos')

    const videoId = getYoutubeVideoId(formData.youtubeUrl)
    if (!videoId) throw new Error('Invalid YouTube URL')

    // Create video document
    // await addDoc(collection(db, COLLECTIONS.VIDEOS), {
    //   userId: user.uid,
    //   title: formData.title,
    //   description: formData.description,
    //   category: formData.category,
    //   type: 'youtube',
    //   youtubeId: videoId,
    //   youtubeUrl: formData.youtubeUrl,
    //   thumbnailUrl: getYoutubeThumbnail(videoId),
    //   createdAt: serverTimestamp(),
    //   views: 0,
    //   likes: 0,
    //   comments: 0
    // })

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      youtubeUrl: ''
    })
    setThumbnailUrl('')
    setYoutubeId('')

    onSuccess?.()
  })

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await uploadMutation.mutateAsync()
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-ajira-primary mb-6 flex items-center">
        <Youtube className="w-8 h-8 mr-2" />
        Add YouTube Video
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* YouTube URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            YouTube Video URL
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.youtubeUrl}
              onChange={(e) => handleYoutubeUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
            />
            <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Preview */}
        {thumbnailUrl && (
          <div className="relative">
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <a 
                href={formData.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-white"
              >
                <Youtube className="w-12 h-12" />
                <span>Preview on YouTube</span>
              </a>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
          >
            <option value="">Select a category</option>
            <option value="tutorial">Tutorial</option>
            <option value="guide">Guide</option>
            <option value="success-story">Success Story</option>
            <option value="tips">Tips & Tricks</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={uploadMutation.isLoading || !youtubeId}
            className="w-full bg-ajira-accent text-white py-3 rounded-lg hover:bg-ajira-accent/90 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {uploadMutation.isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Adding Video...</span>
              </>
            ) : (
              <>
                <Youtube className="w-5 h-5" />
                <span>Add YouTube Video</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VideoUpload 