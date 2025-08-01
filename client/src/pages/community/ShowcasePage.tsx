import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import LoadingState from '../../components/common/LoadingState'

const PROFILES_COLLECTION = 'showcase_profiles';
const CONNECTIONS_COLLECTION = 'showcase_connections';
const MESSAGES_COLLECTION = 'showcase_messages';
const NOTIFICATIONS_COLLECTION = 'showcase_notifications';
const PROFILE_IMAGES_PATH = 'profile-images';

interface ShowcaseProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  achievements: string;
  journey: string;
  portfolioLinks: {
    title: string;
    url: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  availability: 'available' | 'busy' | 'not_available';
  hourlyRate?: string;
  preferredWorkTypes: string[];
  location: string;
  languages: string[];
  createdAt: any;
  updatedAt: any;
}

const ShowcasePage = () => {
  const { user, isLoading: authLoading } = useBetterAuthContext();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState<{
    name: string;
    avatar: string;
    bio: string;
    skills: string[];
    achievements: string;
    journey: string;
    portfolioLinks: { title: string; url: string }[];
    socialLinks: { platform: string; url: string }[];
    availability: 'available' | 'busy' | 'not_available';
    location: string;
    languages: string[];
  }>({
    name: '',
    avatar: '',
    bio: '',
    skills: [],
    achievements: '',
    journey: '',
    portfolioLinks: [],
    socialLinks: [],
    availability: '',
    location: '',
    languages: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Messaging state
  const [chatUser, setChatUser] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // --- All hooks must be called unconditionally ---
  // Fetch all profiles (replace with real backend API call)
  const { data: allProfiles, isLoading, error } = useQuery(
    ['showcaseProfiles'],
    async () => {
      // TODO: Replace with real backend API call, e.g.:
      // const res = await api.get('/showcase/profiles');
      // return res.data;
      return [];
    },
    { enabled: true }
  );

  // Fetch connections for current user (replace with real backend API call)
  const { data: connections } = useQuery(
    ['showcaseConnections', user?.uid],
    async () => {
      // TODO: Replace with real backend API call
      return [];
    },
    { enabled: !!user }
  );

  // Create or update profile mutation (replace with real backend API call)
  const saveProfileMutation = useMutation(
    async (form: typeof profileForm) => {
      let avatarUrl = form.avatar;
      if (imageFile) {
        setUploading(true);
        // For now, just use a local preview; for real upload, send to backend or S3
        avatarUrl = URL.createObjectURL(imageFile);
        setUploading(false);
      }
      // Call backend API to save profile
      const userId = user.id || user._id;
      const res = await fetch('/showcase/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          avatar: avatarUrl,
          userId,
        }),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      return res.json();
    },
    {
      onSuccess: () => {
        setEditMode(false);
        setImageFile(null);
        setImagePreview(null);
        queryClient.invalidateQueries(['showcaseProfiles']);
      },
    }
  );

  // Connect mutation (replace with real backend API call)
  const connectMutation = useMutation(
    async (toUserId: string) => {
      // TODO: Call backend to connect
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['showcaseConnections', user?.uid]),
    }
  );

  // Messaging: fetch messages between user and chatUser (replace with real backend API call)
  const { data: chatMessages, refetch: refetchMessages } = useQuery(
    ['showcaseMessages', user?.uid, chatUser?.userId],
    async () => {
      if (!user || !chatUser) return [];
      // TODO: Replace with real backend API call
      return [];
    },
    { enabled: !!user && !!chatUser }
  );

  // Send message mutation (replace with real backend API call)
  const sendMessageMutation = useMutation(
    async (content: string) => {
      if (!user || !chatUser) return;
      // TODO: Call backend to send message
    },
    {
      onSuccess: () => {
        setChatInput('');
        refetchMessages();
      },
    }
  );

  // --- End of hooks ---

  if (isLoading || authLoading) {
    return <LoadingState message="Loading profiles" description="Please wait while we fetch the showcase profiles" />
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error loading profiles.</div>;
  }

  // If user is not available, show coming soon message
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-12 w-full overflow-x-hidden">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ajira-primary mb-4 tracking-tight">
            🎨 Creative Portfolio Showcase
          </h1>
          <p className="text-lg text-gray-600">
            Where talent meets opportunity - showcase your best work to the world
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-4xl mx-auto">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ajira-primary mb-4">
              Your Digital Portfolio Hub is Coming Soon!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              We're building a stunning showcase platform where creative professionals can display their work, connect with clients, and grow their careers. Get ready to:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-left">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🎨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Showcase Your Work</h3>
                  <p className="text-gray-600 text-sm">Display your best projects with stunning visuals and detailed descriptions</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">👤</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Build Your Brand</h3>
                  <p className="text-gray-600 text-sm">Create a professional profile that tells your unique story</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🤝</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Connect & Collaborate</h3>
                  <p className="text-gray-600 text-sm">Network with other professionals and find exciting opportunities</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💼</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get Discovered</h3>
                  <p className="text-gray-600 text-sm">Attract clients and employers with your impressive portfolio</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Track Your Growth</h3>
                  <p className="text-gray-600 text-sm">Monitor views, connections, and engagement with analytics</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Launch Your Career</h3>
                  <p className="text-gray-600 text-sm">Take your professional journey to the next level</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-ajira-primary/10 via-ajira-accent/10 to-ajira-secondary/10 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-ajira-primary mb-2">Perfect For:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <span className="text-gray-700">🎨 Designers</span>
                <span className="text-gray-700">💻 Developers</span>
                <span className="text-gray-700">📝 Writers</span>
                <span className="text-gray-700">📊 Analysts</span>
                <span className="text-gray-700">🎬 Creators</span>
                <span className="text-gray-700">📱 Marketers</span>
                <span className="text-gray-700">🔧 Engineers</span>
                <span className="text-gray-700">💡 Consultants</span>
              </div>
            </div>
            
            <div className="bg-ajira-primary/5 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-ajira-primary mb-2">Why Choose Our Showcase?</h3>
              <p className="text-gray-700 text-sm">
                Unlike generic portfolio sites, our platform is specifically designed for the Ajira Digital community. 
                Connect with like-minded professionals, showcase your digital skills, and grow your network in a supportive environment.
              </p>
            </div>
            
            <p className="text-gray-500 text-sm">
              We're putting the finishing touches on your portfolio paradise. Get ready to shine! ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Find current user's profile
  const myProfile = allProfiles?.find((p) => (p as ShowcaseProfile).userId === user.uid) as ShowcaseProfile | undefined;
  // Other profiles
  const profiles = allProfiles?.filter((p) => (p as ShowcaseProfile).userId !== user.uid) as ShowcaseProfile[] | undefined;

  // Helper: check if already connected
  const isConnected = (profileId: string) => {
    return connections?.some((c: any) => c.toUserId === profileId && c.status === 'connected');
  };

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle skills change
  const handleSkillsChange = (skills: string[]) => {
    setProfileForm(prev => ({
      ...prev,
      skills
    }));
  };

  // Handle portfolio links change
  const handlePortfolioLinksChange = (links: { title: string; url: string }[]) => {
    setProfileForm(prev => ({
      ...prev,
      portfolioLinks: links
    }));
  };

  // Handle social links change
  const handleSocialLinksChange = (links: { platform: string; url: string }[]) => {
    setProfileForm(prev => ({
      ...prev,
      socialLinks: links
    }));
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // If user has no profile, show create form
  if (user && !myProfile && !editMode) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-2 sm:px-4 w-full overflow-x-hidden">
        <h1 className="text-3xl font-bold text-ajira-primary mb-8 text-center">Create Your Showcase Profile</h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            saveProfileMutation.mutate(profileForm);
          }}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-8"
        >
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6">
            <label className="font-semibold mb-2">Profile Photo</label>
            <img src={imagePreview || profileForm.avatar || user.photoURL || '/default-avatar.png'} className="w-24 h-24 rounded-full object-cover border-2 border-ajira-accent mb-2" />
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            <button type="button" className="bg-ajira-accent text-white px-4 py-1 rounded" onClick={() => fileInputRef.current?.click()}>Upload Photo</button>
          </div>

          {/* Basic Info */}
                  <div>
            <h2 className="text-xl font-bold mb-4">Basic Info</h2>
            <label className="block mb-1 font-medium">What’s your full name?</label>
            <input name="name" value={profileForm.name} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
            <label className="block mt-4 mb-1 font-medium">Tell us about yourself</label>
            <textarea name="bio" value={profileForm.bio} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Your background, passions, and what you love to do." required />
                  </div>

          {/* Skills & Experience */}
                  <div>
            <h2 className="text-xl font-bold mb-4">Skills & Experience</h2>
            <label className="block mb-1 font-medium">What are your top skills?</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileForm.skills.map((skill, idx) => (
                <span key={skill} className="bg-ajira-accent/10 text-ajira-accent px-3 py-1 rounded-full text-sm">
                          {skill}
                  <button type="button" className="ml-2 hover:text-red-500" onClick={() => handleSkillsChange(profileForm.skills.filter((_, i) => i !== idx))}>×</button>
                        </span>
                      ))}
                      <input
                        type="text"
                placeholder="Add a skill and press Enter"
                        className="px-3 py-1 border border-gray-300 rounded-full text-sm"
                onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const newSkill = input.value.trim();
                    if (newSkill && !profileForm.skills.includes(newSkill)) {
                      handleSkillsChange([...profileForm.skills, newSkill]);
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
            <label className="block mt-4 mb-1 font-medium">Share your proudest achievements</label>
            <textarea name="achievements" value={profileForm.achievements} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Awards, recognitions, or milestones." />
            <label className="block mt-4 mb-1 font-medium">Your Journey</label>
            <textarea name="journey" value={profileForm.journey} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="How did you get here? What’s your story?" />
                  </div>

          {/* Portfolio Links */}
                  <div>
            <h2 className="text-xl font-bold mb-4">Portfolio</h2>
            {profileForm.portfolioLinks.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={link.title}
                  placeholder="Title (e.g. My Website)"
                  onChange={e => {
                            const newLinks = [...profileForm.portfolioLinks];
                    newLinks[idx].title = e.target.value;
                            handlePortfolioLinksChange(newLinks);
                          }}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="url"
                          value={link.url}
                          placeholder="URL"
                  onChange={e => {
                            const newLinks = [...profileForm.portfolioLinks];
                    newLinks[idx].url = e.target.value;
                            handlePortfolioLinksChange(newLinks);
                          }}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        />
                <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handlePortfolioLinksChange(profileForm.portfolioLinks.filter((_, i) => i !== idx))}>×</button>
                      </div>
                    ))}
            <button type="button" onClick={() => handlePortfolioLinksChange([...(profileForm.portfolioLinks || []), { title: '', url: '' }])} className="text-ajira-accent hover:text-ajira-accent/80 text-sm">+ Add Portfolio Link</button>
                  </div>

          {/* Social Links */}
                  <div>
            <h2 className="text-xl font-bold mb-4">Social Links</h2>
            {profileForm.socialLinks.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={link.platform}
                  placeholder="Platform (e.g. LinkedIn)"
                  onChange={e => {
                    const newLinks = [...profileForm.socialLinks];
                    newLinks[idx].platform = e.target.value;
                    handleSocialLinksChange(newLinks);
                  }}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="url"
                  value={link.url}
                  placeholder="URL"
                  onChange={e => {
                    const newLinks = [...profileForm.socialLinks];
                    newLinks[idx].url = e.target.value;
                    handleSocialLinksChange(newLinks);
                  }}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                />
                <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleSocialLinksChange(profileForm.socialLinks.filter((_, i) => i !== idx))}>×</button>
              </div>
            ))}
            <button type="button" onClick={() => handleSocialLinksChange([...(profileForm.socialLinks || []), { platform: '', url: '' }])} className="text-ajira-accent hover:text-ajira-accent/80 text-sm">+ Add Social Link</button>
                  </div>

          {/* Work Preferences */}
                  <div>
            <h2 className="text-xl font-bold mb-4">Work Preferences</h2>
            <label className="block mb-1 font-medium">Availability</label>
            <select name="availability" value={profileForm.availability || ''} onChange={e => setProfileForm(prev => ({ ...prev, availability: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-4 py-2">
              <option value="">Select availability</option>
              <option value="available">Available for work</option>
              <option value="busy">Busy</option>
              <option value="not_available">Not available</option>
            </select>
            <label className="block mt-4 mb-1 font-medium">Location</label>
            <input name="location" value={profileForm.location || ''} onChange={handleFormChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Where are you based?" />
            <label className="block mt-4 mb-1 font-medium">Languages</label>
            <input name="languages" value={profileForm.languages?.join(', ') || ''} onChange={e => setProfileForm(prev => ({ ...prev, languages: e.target.value.split(',').map(l => l.trim()).filter(Boolean) }))} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Languages you speak (comma separated)" />
                  </div>

          <button type="submit" className="w-full bg-ajira-accent text-white py-3 rounded-lg font-bold text-lg mt-8 hover:bg-ajira-accent/90 transition">Save Profile</button>
                </form>
                    </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-12 w-full overflow-x-hidden">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ajira-primary text-center mb-12 tracking-tight">
        🚀 Project Showcase
      </h1>

      {/* Coming Soon Section */}
      <div className="text-center py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🚧</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-ajira-primary mb-4">
            Coming Soon!
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            We're working hard to bring you an amazing project showcase where you can:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ajira-accent/10 rounded-full flex items-center justify-center">
                <span className="text-ajira-accent text-lg">👤</span>
              </div>
              <span className="text-gray-700">Create your professional profile</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ajira-accent/10 rounded-full flex items-center justify-center">
                <span className="text-ajira-accent text-lg">💼</span>
              </div>
              <span className="text-gray-700">Showcase your projects</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ajira-accent/10 rounded-full flex items-center justify-center">
                <span className="text-ajira-accent text-lg">🤝</span>
              </div>
              <span className="text-gray-700">Connect with other professionals</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ajira-accent/10 rounded-full flex items-center justify-center">
                <span className="text-ajira-accent text-lg">💬</span>
              </div>
              <span className="text-gray-700">Collaborate on projects</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Stay tuned! We'll notify you as soon as the showcase is ready.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage; 