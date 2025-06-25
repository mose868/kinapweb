import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const MediaUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    story: '',
    location: ''
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const categories = [
    'Web Development',
    'Digital Marketing',
    'Data Analysis',
    'Content Creation',
    'Graphic Design',
    'Virtual Assistance',
    'Other'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const removeImage = () => {
    setImage(null)
    setPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setError('Failed to submit your story. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ajira-lightGray py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-ajira p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-ajira-blue mb-2">
                Share Your Success Story
              </h1>
              <p className="text-ajira-gray">
                Inspire others by sharing your journey with Ajira Digital
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center justify-center space-x-2">
                <Check size={20} />
                <span>Your story has been submitted successfully!</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-ajira-gray mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                  placeholder="Give your story a catchy title"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-ajira-gray mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-ajira-gray mb-2">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent"
                  placeholder="Your location (e.g., Kiambu, Thika)"
                />
              </div>

              <div>
                <label htmlFor="story" className="block text-sm font-medium text-ajira-gray mb-2">
                  Your Story
                </label>
                <textarea
                  id="story"
                  name="story"
                  required
                  value={formData.story}
                  onChange={handleChange}
                  rows={6}
                  className="block w-full px-4 py-3 border border-ajira-lightGray rounded-lg focus:ring-2 focus:ring-ajira-blue focus:border-transparent resize-none"
                  placeholder="Share your journey, challenges, and achievements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ajira-gray mb-2">
                  Add Photo
                </label>
                {!preview ? (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-ajira-lightGray rounded-lg">
                    <div className="space-y-2 text-center">
                      <div className="mx-auto h-12 w-12 text-ajira-gray">
                        <ImageIcon size={48} />
                      </div>
                      <div className="flex text-sm text-ajira-gray">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-ajira-blue hover:text-ajira-lightBlue focus-within:outline-none"
                        >
                          <span>Upload a photo</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-ajira-gray">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 rounded-lg max-h-64 mx-auto"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full flex items-center justify-center ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Submit Story
                    <Upload className="ml-2" size={20} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MediaUpload 