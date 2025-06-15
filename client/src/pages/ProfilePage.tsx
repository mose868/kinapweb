import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { doc, updateDoc, getDocs, query, collection, where, orderBy } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, COLLECTIONS, STORAGE_PATHS } from '../config/firebase'
import { useAuth } from '../hooks/useAuth'
import { Camera, Star, Package, MessageSquare, Edit2, Loader2 } from 'lucide-react'

const ProfilePage = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skills: user?.skills || [],
    languages: user?.languages || [],
  })

  // Fetch user's gigs if they are a seller
  const { data: userGigs } = useQuery(
    ['userGigs', user?.uid],
    async () => {
      if (!user?.uid || user.role !== 'seller') return []
      const snapshot = await getDocs(
        query(
          collection(db, 'gigs'),
          where('sellerId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
      )
      return snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }))
    },
    {
      enabled: !!user?.uid && user.role === 'seller'
    }
  )

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return

    try {
      const file = e.target.files[0]
      const imageRef = ref(storage, `${STORAGE_PATHS.PROFILE_IMAGES}/${user.uid}`)
      await uploadBytes(imageRef, file)
      const photoURL = await getDownloadURL(imageRef)

      await updateDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        photoURL
      })

      // Refresh page to show new image
      window.location.reload()
    } catch (error) {
      console.error('Error uploading profile image:', error)
    }
  }

  // Update profile mutation
  const updateProfileMutation = useMutation(async () => {
    if (!user) return

    await updateDoc(doc(db, COLLECTIONS.USERS, user.uid), {
      displayName: formData.displayName,
      bio: formData.bio,
      location: formData.location,
      skills: formData.skills,
      languages: formData.languages,
    })

    setIsEditing(false)
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle array field changes (skills and languages)
  const handleArrayChange = (value: string, field: 'skills' | 'languages') => {
    const values = value.split(',').map(v => v.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, [field]: values }))
  }

  if (!user) {
    // Demo profile
    const demoProfile = {
      displayName: 'Demo User',
      email: 'demo@ajira.com',
      photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8,
      completedOrders: 12,
      reviews: 7,
      bio: 'This is a demo profile. Sign up to create your own!',
      location: 'Nairobi',
      skills: ['React', 'Node.js'],
      languages: ['English', 'Swahili'],
    };
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="relative h-48 rounded-t-lg bg-ajira-primary">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={demoProfile.photoURL}
                  alt={demoProfile.displayName}
                  className="w-32 h-32 rounded-full border-4 border-white"
                />
                <label
                  htmlFor="profile-image-demo"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="file"
                    id="profile-image-demo"
                    accept="image/*"
                    className="hidden"
                    onChange={() => alert('Sign up to upload your own profile picture!')}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-ajira-primary">
                  {demoProfile.displayName}
                </h1>
                <p className="text-gray-600">{demoProfile.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-xl font-semibold text-ajira-primary">
                  <span>{demoProfile.rating}</span>
                </div>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-ajira-primary">
                  {demoProfile.completedOrders}
                </div>
                <p className="text-sm text-gray-600">Orders Completed</p>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-ajira-primary">
                  {demoProfile.reviews}
                </div>
                <p className="text-sm text-gray-600">Reviews</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 mb-2">{demoProfile.bio}</p>
              <div className="mb-2">
                <span className="font-semibold">Location:</span> {demoProfile.location}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Skills:</span> {demoProfile.skills.join(', ')}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Languages:</span> {demoProfile.languages.join(', ')}
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Sign up or log in to edit your profile and upload your own picture!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow">
        {/* Profile Header */}
        <div className="relative h-48 rounded-t-lg bg-ajira-primary">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img
                src={user.photoURL || '/images/default-avatar.png'}
                alt={user.displayName}
                className="w-32 h-32 rounded-full border-4 border-white"
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
        </div>

        {/* Profile Content */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-ajira-primary">
                {user.displayName}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 text-ajira-accent hover:text-ajira-accent/80"
            >
              <Edit2 className="w-5 h-5" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-xl font-semibold text-ajira-primary">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>{user.rating.toFixed(1)}</span>
              </div>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-ajira-primary">
                {user.completedOrders}
              </div>
              <p className="text-sm text-gray-600">Orders Completed</p>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-ajira-primary">
                {user.reviews}
              </div>
              <p className="text-sm text-gray-600">Reviews</p>
            </div>
          </div>

          {isEditing ? (
            // Edit Form
            <form
              onSubmit={(e) => {
                e.preventDefault()
                updateProfileMutation.mutateAsync()
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleArrayChange(e.target.value, 'skills')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.languages.join(', ')}
                  onChange={(e) => handleArrayChange(e.target.value, 'languages')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="px-6 py-2 bg-ajira-accent text-white rounded-lg hover:bg-ajira-accent/90 disabled:opacity-50 flex items-center space-x-2"
                >
                  {updateProfileMutation.isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            // Profile Info
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-ajira-primary mb-2">
                  About Me
                </h3>
                <p className="text-gray-600">
                  {user.bio || 'No bio provided yet.'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-ajira-primary mb-2">
                  Location
                </h3>
                <p className="text-gray-600">
                  {user.location || 'No location provided yet.'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-ajira-primary mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No skills listed yet.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-ajira-primary mb-2">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Seller Gigs */}
          {user.role === 'seller' && userGigs && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-ajira-primary mb-6">
                My Gigs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userGigs.map((gig: any) => (
                  <div
                    key={gig.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <img
                      src={gig.images[0]}
                      alt={gig.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-ajira-primary mb-2 line-clamp-2">
                        {gig.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>{gig.orders} orders</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4" />
                          <span>{gig.reviews} reviews</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 