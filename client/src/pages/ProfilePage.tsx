import { useState, useEffect } from 'react'
import { useMutation, useQuery } from 'react-query'
import { doc, updateDoc, getDocs, query, collection, where, orderBy } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, COLLECTIONS, STORAGE_PATHS } from '../config/firebase'
import { useAuth } from '../hooks/useAuth'
import { 
  Camera, 
  Star, 
  Package, 
  MessageSquare, 
  Edit2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  User,
  MapPin,
  Code,
  Globe,
  Target,
  Award,
  TrendingUp,
  Briefcase,
  BookOpen,
  Calendar,
  Phone,
  Mail
} from 'lucide-react'

interface ClubMemberProfile {
  displayName: string
  email: string
  photoURL?: string
  bio: string
  location: string
  course: string
  year: string
  skills: string[]
  preferredPlatforms: string[]
  experienceLevel: string
  ajiraGoals: string
  preferredLearningMode: string
  linkedinProfile?: string
  githubProfile?: string
  portfolioUrl?: string
  phoneNumber?: string
  idNumber?: string
  achievements: string[]
  completedProjects: number
  mentorshipInterest: boolean
  availableForFreelance: boolean
  joinedDate: string
  lastActive: string
}

const ProfilePage = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  const [formData, setFormData] = useState<ClubMemberProfile>({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    bio: user?.bio || '',
    location: user?.location || '',
    course: user?.course || '',
    year: user?.year || '',
    skills: user?.skills || [],
    preferredPlatforms: user?.preferredPlatforms || [],
    experienceLevel: user?.experienceLevel || '',
    ajiraGoals: user?.ajiraGoals || '',
    preferredLearningMode: user?.preferredLearningMode || '',
    linkedinProfile: user?.linkedinProfile || '',
    githubProfile: user?.githubProfile || '',
    portfolioUrl: user?.portfolioUrl || '',
    phoneNumber: user?.phoneNumber || '',
    idNumber: user?.idNumber || '',
    achievements: user?.achievements || [],
    completedProjects: user?.completedProjects || 0,
    mentorshipInterest: user?.mentorshipInterest || false,
    availableForFreelance: user?.availableForFreelance || false,
    joinedDate: user?.joinedDate || new Date().toISOString(),
    lastActive: new Date().toISOString()
  })

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const requiredFields = [
      'displayName',
      'bio',
      'location',
      'course',
      'year',
      'experienceLevel',
      'ajiraGoals',
      'preferredLearningMode',
      'phoneNumber'
    ]
    
    const arrayFields = ['skills', 'preferredPlatforms']
    const optionalFields = ['linkedinProfile', 'githubProfile', 'portfolioUrl']
    
    let completed = 0
    let total = requiredFields.length + arrayFields.length + optionalFields.length + 1 // +1 for photo
    
    // Check required fields
    requiredFields.forEach(field => {
      if (formData[field as keyof ClubMemberProfile] && 
          String(formData[field as keyof ClubMemberProfile]).trim() !== '') {
        completed++
      }
    })
    
    // Check array fields
    arrayFields.forEach(field => {
      if (formData[field as keyof ClubMemberProfile] && 
          (formData[field as keyof ClubMemberProfile] as string[]).length > 0) {
        completed++
      }
    })
    
    // Check optional fields
    optionalFields.forEach(field => {
      if (formData[field as keyof ClubMemberProfile] && 
          String(formData[field as keyof ClubMemberProfile]).trim() !== '') {
        completed++
      }
    })
    
    // Check photo
    if (formData.photoURL && formData.photoURL.trim() !== '') {
      completed++
    }
    
    return Math.round((completed / total) * 100)
  }

  const profileCompletion = calculateProfileCompletion()

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return

    try {
      const file = e.target.files[0]
      const imageRef = ref(storage, `${STORAGE_PATHS.PROFILE_IMAGES}/${user.uid}`)
      await uploadBytes(imageRef, file)
      const photoURL = await getDownloadURL(imageRef)

      setFormData(prev => ({ ...prev, photoURL }))

      await updateDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        photoURL
      })
    } catch (error) {
      console.error('Error uploading profile image:', error)
    }
  }

  // Update profile mutation
  const updateProfileMutation = useMutation(async () => {
    if (!user) return

    const updateData = {
      ...formData,
      lastActive: new Date().toISOString()
    }

    await updateDoc(doc(db, COLLECTIONS.USERS, user.uid), updateData)
    setIsEditing(false)
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Handle array field changes
  const handleArrayChange = (value: string, field: 'skills' | 'preferredPlatforms' | 'achievements') => {
    const values = value.split(',').map(v => v.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, [field]: values }))
  }

  const platformOptions = [
    'Upwork', 'Fiverr', 'Freelancer.com', 'LinkedIn', 'GitHub', 'Behance', 
    'Dribbble', '99designs', 'Toptal', 'Guru.com', 'PeoplePerHour', 'Local Clients'
  ]

  const skillCategories = {
    'Web Development': ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'PHP', 'WordPress'],
    'Mobile Development': ['React Native', 'Flutter', 'iOS (Swift)', 'Android (Kotlin/Java)'],
    'Design': ['UI/UX Design', 'Graphic Design', 'Logo Design', 'Branding', 'Figma', 'Adobe Creative Suite'],
    'Digital Marketing': ['SEO', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'PPC Advertising'],
    'Data & Analytics': ['Data Analysis', 'Excel', 'Python', 'SQL', 'Power BI', 'Tableau'],
    'Writing & Content': ['Content Writing', 'Copywriting', 'Technical Writing', 'Blog Writing', 'Translation'],
    'Business': ['Project Management', 'Business Analysis', 'Consulting', 'Virtual Assistant']
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-ajira-primary mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-ajira-primary mb-4">
            Club Member Profile
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view and manage your Ajira Digital KiNaP Club profile.
          </p>
          <button className="bg-ajira-accent text-white px-6 py-3 rounded-lg hover:bg-ajira-accent/90">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg mb-8">
        <div className="relative h-48 rounded-t-lg bg-gradient-to-r from-ajira-primary to-ajira-accent">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={formData.photoURL || '/images/default-avatar.png'}
                alt={formData.displayName}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
              >
                <Camera className="w-5 h-5 text-gray-600" />
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          {/* Profile Completion Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={profileCompletion >= 100 ? "#10b981" : profileCompletion >= 70 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="2"
                    strokeDasharray={`${profileCompletion}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700">{profileCompletion}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-ajira-primary">
                {formData.displayName || 'Club Member'}
              </h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" />
                {formData.email}
              </p>
              {formData.location && (
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-2" />
                  {formData.location}
                </p>
              )}
              <div className="flex items-center mt-2 space-x-4">
                {formData.course && (
                  <span className="bg-ajira-primary/10 text-ajira-primary px-3 py-1 rounded-full text-sm">
                    {formData.course}
                  </span>
                )}
                {formData.year && (
                  <span className="bg-ajira-accent/10 text-ajira-accent px-3 py-1 rounded-full text-sm">
                    {formData.year}
                  </span>
                )}
                {formData.experienceLevel && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {formData.experienceLevel}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 bg-ajira-accent text-white px-4 py-2 rounded-lg hover:bg-ajira-accent/90"
            >
              <Edit2 className="w-5 h-5" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Profile Completion Alert */}
          {profileCompletion < 100 && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Complete your profile to unlock all features
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your profile is {profileCompletion}% complete. Add missing information to get better visibility and opportunities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-ajira-primary">
                {formData.completedProjects}
              </div>
              <p className="text-sm text-gray-600">Projects Completed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-ajira-primary">
                {formData.skills.length}
              </div>
              <p className="text-sm text-gray-600">Skills Listed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-ajira-primary">
                {formData.achievements.length}
              </div>
              <p className="text-sm text-gray-600">Achievements</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-ajira-primary">
                {Math.floor((new Date().getTime() - new Date(formData.joinedDate).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <p className="text-sm text-gray-600">Days Active</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'skills', 'goals', 'platforms', 'portfolio'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-ajira-accent text-ajira-accent'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                updateProfileMutation.mutateAsync()
              }}
              className="space-y-8"
            >
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  >
                    <option value="">Select your course</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Building Tech">Building Tech</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Human Resource">Human Resource</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Business Management">Business Management</option>
                    <option value="IT">IT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year/Level *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  >
                    <option value="">Select your year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  >
                    <option value="">Select experience level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio *
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="Tell us about yourself, your interests in digital work, and what you hope to achieve..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digital Skills *
                </label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleArrayChange(e.target.value, 'skills')}
                  placeholder="e.g., Web Development, Graphic Design, Digital Marketing"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              {/* Preferred Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Work Platforms *
                </label>
                <input
                  type="text"
                  value={formData.preferredPlatforms.join(', ')}
                  onChange={(e) => handleArrayChange(e.target.value, 'preferredPlatforms')}
                  placeholder="e.g., Upwork, Fiverr, LinkedIn, Local Clients"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Platforms you use or want to use for finding work. Options: {platformOptions.join(', ')}
                </p>
              </div>

              {/* Goals and Learning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ajira Goals *
                  </label>
                  <textarea
                    name="ajiraGoals"
                    value={formData.ajiraGoals}
                    onChange={handleChange}
                    rows={3}
                    required
                    placeholder="What do you want to achieve through Ajira Digital?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Learning Mode *
                  </label>
                  <select
                    name="preferredLearningMode"
                    value={formData.preferredLearningMode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  >
                    <option value="">Select learning preference</option>
                    <option value="Self-paced online">Self-paced online</option>
                    <option value="Live virtual sessions">Live virtual sessions</option>
                    <option value="In-person workshops">In-person workshops</option>
                    <option value="Hybrid (online + in-person)">Hybrid (online + in-person)</option>
                    <option value="Mentorship-based">Mentorship-based</option>
                  </select>
                </div>
              </div>

              {/* Professional Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="githubProfile"
                    value={formData.githubProfile}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="mentorshipInterest"
                    checked={formData.mentorshipInterest}
                    onChange={handleChange}
                    className="w-5 h-5 text-ajira-accent"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Interested in mentoring other members
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="availableForFreelance"
                    checked={formData.availableForFreelance}
                    onChange={handleChange}
                    className="w-5 h-5 text-ajira-accent"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Available for freelance projects
                  </label>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Achievements & Certifications
                </label>
                <input
                  type="text"
                  value={formData.achievements.join(', ')}
                  onChange={(e) => handleArrayChange(e.target.value, 'achievements')}
                  placeholder="e.g., Google Digital Marketing Certificate, Completed React Course"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Separate achievements with commas</p>
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="px-8 py-3 bg-ajira-accent text-white rounded-lg hover:bg-ajira-accent/90 disabled:opacity-50 flex items-center space-x-2"
                >
                  {updateProfileMutation.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-ajira-primary mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      About Me
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {formData.bio || 'No bio provided yet. Click "Edit Profile" to add your story!'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Academic Information</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Course:</span> {formData.course || 'Not specified'}</p>
                        <p><span className="font-medium">Year:</span> {formData.year || 'Not specified'}</p>
                        <p><span className="font-medium">Experience:</span> {formData.experienceLevel || 'Not specified'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {formData.phoneNumber || 'Not provided'}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {formData.location || 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {formData.achievements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-ajira-primary mb-3 flex items-center">
                        <Award className="w-5 h-5 mr-2" />
                        Achievements & Certifications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.achievements.map((achievement, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-ajira-primary mb-3 flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      Digital Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-ajira-primary/10 text-ajira-primary rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-600">No skills listed yet. Add your skills to showcase your abilities!</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Skill Development Suggestions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(skillCategories).map(([category, skills]) => (
                        <div key={category} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="font-medium text-ajira-primary mb-2">{category}</h5>
                          <div className="space-y-1">
                            {skills.slice(0, 4).map((skill, index) => (
                              <div key={index} className="text-sm text-gray-600">
                                • {skill}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Goals Tab */}
              {activeTab === 'goals' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-ajira-primary mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Ajira Goals
                    </h3>
                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                      {formData.ajiraGoals || 'No goals specified yet. Set your digital transformation goals!'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-ajira-primary mb-3 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Learning Preferences
                    </h3>
                    <p className="text-gray-600">
                      <span className="font-medium">Preferred Mode:</span> {formData.preferredLearningMode || 'Not specified'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Mentorship
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formData.mentorshipInterest 
                          ? "✅ Open to mentoring other members" 
                          : "Not currently interested in mentoring"}
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Freelance Availability
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formData.availableForFreelance 
                          ? "✅ Available for freelance projects" 
                          : "Not currently available for freelance work"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Platforms Tab */}
              {activeTab === 'platforms' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-ajira-primary mb-3 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Preferred Work Platforms
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.preferredPlatforms.length > 0 ? (
                        formData.preferredPlatforms.map((platform, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-ajira-accent/10 text-ajira-accent rounded-lg text-sm font-medium"
                          >
                            {platform}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-600">No platforms specified yet. Add platforms where you want to find work!</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Available Platforms</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {platformOptions.map((platform, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border text-center text-sm ${
                            formData.preferredPlatforms.includes(platform)
                              ? 'border-ajira-accent bg-ajira-accent/10 text-ajira-accent'
                              : 'border-gray-200 text-gray-600'
                          }`}
                        >
                          {platform}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-ajira-primary mb-3 flex items-center">
                      <Globe className="w-5 h-5 mr-2" />
                      Professional Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {formData.linkedinProfile && (
                        <a
                          href={formData.linkedinProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-ajira-accent transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-bold">in</span>
                          </div>
                          <div>
                            <div className="font-medium">LinkedIn</div>
                            <div className="text-sm text-gray-600">Professional Profile</div>
                          </div>
                        </a>
                      )}

                      {formData.githubProfile && (
                        <a
                          href={formData.githubProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-ajira-accent transition-colors"
                        >
                          <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center mr-3">
                            <Code className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">GitHub</div>
                            <div className="text-sm text-gray-600">Code Repository</div>
                          </div>
                        </a>
                      )}

                      {formData.portfolioUrl && (
                        <a
                          href={formData.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-ajira-accent transition-colors"
                        >
                          <div className="w-8 h-8 bg-ajira-accent rounded flex items-center justify-center mr-3">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">Portfolio</div>
                            <div className="text-sm text-gray-600">Personal Website</div>
                          </div>
                        </a>
                      )}
                    </div>

                    {!formData.linkedinProfile && !formData.githubProfile && !formData.portfolioUrl && (
                      <p className="text-gray-600">No professional links added yet. Add your LinkedIn, GitHub, or portfolio links!</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Project Portfolio</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h5 className="text-lg font-medium text-gray-700 mb-2">Showcase Your Work</h5>
                      <p className="text-gray-600 mb-4">
                        Upload screenshots, links, or descriptions of your projects to showcase your skills.
                      </p>
                      <button className="bg-ajira-accent text-white px-6 py-2 rounded-lg hover:bg-ajira-accent/90">
                        Add Project
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 