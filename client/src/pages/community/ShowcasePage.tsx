import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
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
  const { user, loading: authLoading } = useAuth();
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

  // If user is not available, show demo mode
  if (!user) {
    // Demo profiles
    const demoProfiles = [
      {
        id: '1',
        userId: 'demo1',
        name: 'Jane Doe',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        bio: 'Web developer and designer.',
        skills: ['React', 'Node.js', 'UI/UX'],
        achievements: 'Built 20+ websites for clients.',
        journey: 'Started as a freelancer, now runs a small agency.',
        portfolioLinks: [{ title: 'Portfolio', url: 'https://janedoe.dev' }],
        socialLinks: [{ platform: 'LinkedIn', url: 'https://linkedin.com/in/janedoe' }],
        availability: 'available',
        location: 'Nairobi',
        languages: ['English', 'Swahili'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: 'demo2',
        name: 'John Smith',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: 'Digital marketer and content creator.',
        skills: ['SEO', 'Content Writing', 'Social Media'],
        achievements: 'Grew 10+ brands online.',
        journey: 'Started as a blogger, now a marketing consultant.',
        portfolioLinks: [{ title: 'Blog', url: 'https://johnsmith.blog' }],
        socialLinks: [{ platform: 'Twitter', url: 'https://twitter.com/johnsmith' }],
        availability: 'busy',
        location: 'Mombasa',
        languages: ['English'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    return (
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8 w-full overflow-x-hidden">
        <h1 className="text-3xl font-bold mb-6">Showcase Profiles (Demo)</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full">
          {demoProfiles.map(profile => (
            <div key={profile.id} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full mb-4" />
              <h2 className="text-xl font-semibold mb-2">{profile.name}</h2>
              <p className="text-gray-600 mb-2">{profile.bio}</p>
              <div className="mb-2">
                <span className="font-semibold">Skills:</span> {profile.skills.join(', ')}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Location:</span> {profile.location}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Languages:</span> {profile.languages.join(', ')}
              </div>
              <a href={profile.portfolioLinks[0].url} target="_blank" rel="noopener noreferrer" className="text-ajira-accent underline">{profile.portfolioLinks[0].title}</a>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-500">Sign up or log in to create your own profile and connect with others!</p>
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

      {/* My Profile Section */}
      {myProfile && (
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 w-full">
            <img src={myProfile.avatar || '/default-avatar.png'} className="w-32 sm:w-40 h-32 sm:h-40 rounded-full object-cover border-4 border-ajira-primary shadow" />
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-ajira-primary mb-2">{myProfile.name}</h2>
              <p className="text-gray-600 mb-4">{myProfile.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {myProfile.skills?.map(skill => (
                  <span key={skill} className="bg-ajira-accent/10 text-ajira-accent px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                        ))}
                      </div>
              <div className="flex gap-4">
                <button className="bg-ajira-accent text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-ajira-accent/90 transition">Edit Profile</button>
                </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Profiles Section */}
      <section>
        <h2 className="text-2xl font-bold text-ajira-primary mb-8">Connect with Professionals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 w-full">
          {profiles?.map(profile => (
            <div key={profile.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition">
              <img src={profile.avatar || '/default-avatar.png'} className="w-20 sm:w-24 h-20 sm:h-24 rounded-full object-cover border-2 border-ajira-accent mb-4" />
              <h3 className="text-base sm:text-lg font-bold text-ajira-primary mb-1">{profile.name}</h3>
              <p className="text-gray-600 text-center mb-2 text-sm sm:text-base">{profile.bio}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {profile.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="bg-ajira-accent/10 text-ajira-accent px-2 py-0.5 rounded-full text-xs">{skill}</span>
                    ))}
                    {profile.skills.length > 3 && (
                  <span className="text-gray-400 text-xs">+{profile.skills.length - 3} more</span>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                {profile.portfolioLinks && profile.portfolioLinks[0]?.url && (
                  <a href={profile.portfolioLinks[0].url} target="_blank" rel="noopener noreferrer" className="text-ajira-accent underline text-xs flex items-center gap-1">
                    <span>🔗</span>Portfolio
                  </a>
                )}
                {profile.socialLinks?.map(link => (
                  <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ajira-accent text-xl">
                    <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
                  </a>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="bg-ajira-accent text-white px-4 py-1.5 rounded font-medium text-sm shadow hover:bg-ajira-accent/90 transition">Connect</button>
                <button className="bg-ajira-primary text-white px-4 py-1.5 rounded font-medium text-sm shadow hover:bg-ajira-primary/90 transition">Message</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ShowcasePage; 