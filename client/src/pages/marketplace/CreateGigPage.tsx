import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { useAuth } from '../../hooks/useAuth'
import type { Gig, GigPackage } from '../../types/marketplace'
import { Upload, X, Plus, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const CATEGORIES = [
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'content-writing', label: 'Content Writing' },
  { value: 'graphic-design', label: 'Graphic Design' },
  { value: 'virtual-assistant', label: 'Virtual Assistant' },
  { value: 'data-entry', label: 'Data Entry' }
]

const SUBCATEGORIES: Record<string, Array<{ value: string; label: string }>> = {
  'digital-marketing': [
    { value: 'social-media', label: 'Social Media Marketing' },
    { value: 'seo', label: 'Search Engine Optimization' },
    { value: 'email-marketing', label: 'Email Marketing' }
  ],
  'web-development': [
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'full-stack', label: 'Full Stack Development' }
  ],
  // Add more subcategories for other categories
}

const DEFAULT_PACKAGE: GigPackage = {
  name: 'basic',
  price: 0,
  description: '',
  deliveryTime: 1,
  revisions: 1,
  features: []
}

const CreateGigPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    tags: [] as string[],
    requirements: [] as string[],
    faqs: [] as Array<{ question: string; answer: string }>,
    packages: [
      { ...DEFAULT_PACKAGE, name: 'basic' },
      { ...DEFAULT_PACKAGE, name: 'standard' },
      { ...DEFAULT_PACKAGE, name: 'premium' }
    ] as GigPackage[],
  })

  const [files, setFiles] = useState<{
    images: File[]
    video?: File
    documents: File[]
  }>({
    images: [],
    documents: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePackageChange = (index: number, field: keyof GigPackage, value: any) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }))
  }

  const handleFeatureChange = (packageIndex: number, featureIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === packageIndex
          ? {
              ...pkg,
              features: pkg.features.map((feature, j) =>
                j === featureIndex ? value : feature
              )
            }
          : pkg
      )
    }))
  }

  const addFeature = (packageIndex: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === packageIndex
          ? { ...pkg, features: [...pkg.features, ''] }
          : pkg
      )
    }))
  }

  const removeFeature = (packageIndex: number, featureIndex: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === packageIndex
          ? {
              ...pkg,
              features: pkg.features.filter((_, j) => j !== featureIndex)
            }
          : pkg
      )
    }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim())
    setFormData(prev => ({ ...prev, tags }))
  }

  const handleRequirementChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => (i === index ? value : req))
    }))
  }

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      )
    }))
  }

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }))
  }

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'video' | 'documents') => {
    const selectedFiles = Array.from(e.target.files || [])
    if (type === 'images' && selectedFiles.length + files.images.length > 8) {
      toast.error('Maximum 8 images allowed')
      return
    }
    if (type === 'video' && selectedFiles.length > 1) {
      toast.error('Only one video allowed')
      return
    }
    setFiles(prev => ({
      ...prev,
      [type]: type === 'video' ? selectedFiles[0] : [...(prev[type] as File[]), ...selectedFiles]
    }))
  }

  const removeFile = (type: 'images' | 'video' | 'documents', index: number) => {
    setFiles(prev => ({
      ...prev,
      [type]: type === 'video'
        ? undefined
        : (prev[type] as File[]).filter((_, i) => i !== index)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title) newErrors.title = 'Title is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.subcategory) newErrors.subcategory = 'Subcategory is required'
    if (files.images.length === 0) newErrors.images = 'At least one image is required'

    formData.packages.forEach((pkg, index) => {
      if (!pkg.price) newErrors[`package-${index}-price`] = 'Price is required'
      if (!pkg.description) newErrors[`package-${index}-description`] = 'Description is required'
      if (pkg.features.length === 0) newErrors[`package-${index}-features`] = 'At least one feature is required'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadFile = async (file: File, path: string) => {
    // Placeholder for the removed uploadFile function
    return URL.createObjectURL(file)
  }

  const createGig = useMutation(async () => {
    if (!user) throw new Error('User not authenticated')
    if (!validateForm()) throw new Error('Please fill all required fields')

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Upload images
      const imageUrls = await Promise.all(
        files.images.map(file => uploadFile(file, 'gig-images'))
      )
      setUploadProgress(40)

      // Upload video if exists
      let videoUrl
      if (files.video) {
        videoUrl = await uploadFile(files.video, 'gig-videos')
      }
      setUploadProgress(60)

      // Upload documents
      const documentUrls = await Promise.all(
        files.documents.map(file => uploadFile(file, 'gig-documents'))
      )
      setUploadProgress(80)

      // Create gig document
      const gigData: Partial<Gig> = {
        sellerId: user.uid,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        packages: formData.packages,
        images: imageUrls,
        video: videoUrl,
        documents: documentUrls,
        tags: formData.tags,
        requirements: formData.requirements,
        faqs: formData.faqs,
        status: 'active',
        stats: {
          views: 0,
          orders: 0,
          rating: 0,
          reviews: 0,
          completionRate: 100
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Placeholder for the removed addDoc function
      const gigId = 'placeholder-gig-id'
      setUploadProgress(100)
      return gigId
    } catch (error) {
      console.error('Error creating gig:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, {
    onSuccess: (gigId) => {
      toast.success('Gig created successfully!')
      navigate(`/marketplace/gigs/${gigId}`)
    },
    onError: (error) => {
      toast.error('Failed to create gig. Please try again.')
      console.error('Error:', error)
    }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create a New Gig</h1>

      <form onSubmit={(e) => { e.preventDefault(); createGig.mutate() }} className="space-y-8">
        {/* Overview Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gig Overview</h2>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Gig Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                placeholder="I will..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Category and Subcategory */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  disabled={!formData.category}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                >
                  <option value="">Select a subcategory</option>
                  {formData.category && SUBCATEGORIES[formData.category]?.map(sub => (
                    <option key={sub.value} value={sub.value}>{sub.label}</option>
                  ))}
                </select>
                {errors.subcategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                placeholder="Describe your service in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                placeholder="e.g., logo design, branding, creative"
              />
            </div>
          </div>
        </section>

        {/* Pricing Packages Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing Packages</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {formData.packages.map((pkg, index) => (
              <div key={pkg.name} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 capitalize mb-4">
                  {pkg.name} Package
                </h3>

                <div className="space-y-4">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price (KES)
                    </label>
                    <input
                      type="number"
                      value={pkg.price}
                      onChange={(e) => handlePackageChange(index, 'price', Number(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                    />
                    {errors[`package-${index}-price`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`package-${index}-price`]}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={pkg.description}
                      onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                    />
                    {errors[`package-${index}-description`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`package-${index}-description`]}</p>
                    )}
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Delivery Time (days)
                    </label>
                    <input
                      type="number"
                      value={pkg.deliveryTime}
                      onChange={(e) => handlePackageChange(index, 'deliveryTime', Number(e.target.value))}
                      min={1}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                    />
                  </div>

                  {/* Revisions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Revisions
                    </label>
                    <input
                      type="number"
                      value={pkg.revisions}
                      onChange={(e) => handlePackageChange(index, 'revisions', Number(e.target.value))}
                      min={1}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features
                    </label>
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, featureIndex, e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                          placeholder="e.g., 3 logo concepts"
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(index, featureIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFeature(index)}
                      className="flex items-center text-sm text-ajira-primary hover:text-ajira-primary-dark"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Feature
                    </button>
                    {errors[`package-${index}-features`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`package-${index}-features`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Buyer Requirements</h2>

          <div className="space-y-4">
            {formData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                  placeholder="e.g., What's your brand name?"
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="flex items-center text-sm text-ajira-primary hover:text-ajira-primary-dark"
            >
              <Plus size={16} className="mr-1" />
              Add Requirement
            </button>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                    placeholder="Question"
                  />
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                <textarea
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  rows={2}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-ajira-primary focus:ring-ajira-primary"
                  placeholder="Answer"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addFaq}
              className="flex items-center text-sm text-ajira-primary hover:text-ajira-primary-dark"
            >
              <Plus size={16} className="mr-1" />
              Add FAQ
            </button>
          </div>
        </section>

        {/* Media Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Media</h2>

          {/* Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (up to 8)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {files.images.map((file, index) => (
                <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile('images', index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {files.images.length < 8 && (
                <label className="aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-ajira-primary cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, 'images')}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-gray-400" />
                </label>
              )}
            </div>
            {errors.images && (
              <p className="text-sm text-red-600">{errors.images}</p>
            )}
          </div>

          {/* Video */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video (optional)
            </label>
            {files.video ? (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <video
                  src={URL.createObjectURL(files.video)}
                  controls
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile('video', 0)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-ajira-primary cursor-pointer">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'video')}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-gray-400" />
              </label>
            )}
          </div>

          {/* Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Documents (optional)
            </label>
            <div className="space-y-2">
              {files.documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile('documents', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <label className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-ajira-primary cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  onChange={(e) => handleFileChange(e, 'documents')}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">Upload documents</span>
              </label>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ajira-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Gig...' : 'Create Gig'}
          </button>

          {isSubmitting && (
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                <div
                  className="bg-ajira-primary h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span>{uploadProgress}%</span>
            </div>
          )}
        </div>

        {createGig.isError && (
          <div className="flex items-center gap-2 text-red-600 mt-4">
            <AlertCircle size={20} />
            <span>Failed to create gig. Please try again.</span>
          </div>
        )}
      </form>
    </div>
  )
}

export default CreateGigPage 