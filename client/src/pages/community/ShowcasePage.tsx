import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { collection, getDocs, addDoc, query, where, doc, setDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  }>({
    name: '',
    avatar: '',
    bio: '',
    skills: [],
    achievements: '',
    journey: '',
    portfolioLinks: [],
    socialLinks: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Messaging state
  const [chatUser, setChatUser] = useState<any>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // Fetch all profiles
  const { data: allProfiles, isLoading, error } = useQuery(
    ['showcaseProfiles'],
    async () => {
      const snapshot = await getDocs(collection(db, PROFILES_COLLECTION));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShowcaseProfile));
    },
    { enabled: !!user }
  );

  // If loading, show loading state
  if (isLoading || authLoading) {
    return <LoadingState message="Loading profiles" description="Please wait while we fetch the showcase profiles" />
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Showcase Profiles (Demo)</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

  // Fetch connections for current user
  const { data: connections } = useQuery(
    ['showcaseConnections', user?.uid],
    async () => {
      if (!user) return [];
      const q = query(collection(db, CONNECTIONS_COLLECTION), where('fromUserId', '==', user.uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data());
    },
    { enabled: !!user }
  );

  // Create or update profile mutation
  const saveProfileMutation = useMutation(
    async (form: typeof profileForm) => {
      let avatarUrl = form.avatar;
      if (imageFile) {
        setUploading(true);
        const storageRef = ref(storage, `${PROFILE_IMAGES_PATH}/${user.uid}_${Date.now()}`);
        await uploadBytes(storageRef, imageFile);
        avatarUrl = await getDownloadURL(storageRef);
        setUploading(false);
      }
      const docRef = doc(db, PROFILES_COLLECTION, user.uid);
      await setDoc(docRef, {
        userId: user.uid,
        name: form.name,
        avatar: avatarUrl,
        bio: form.bio,
        skills: form.skills,
        achievements: form.achievements,
        journey: form.journey,
        portfolioLinks: form.portfolioLinks,
        socialLinks: form.socialLinks,
      });
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

  // Connect mutation (add notification)
  const connectMutation = useMutation(
    async (toUserId: string) => {
      await addDoc(collection(db, CONNECTIONS_COLLECTION), {
        fromUserId: user.uid,
        toUserId,
        status: 'connected',
        createdAt: new Date(),
      });
      // Add notification for the recipient
      await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        fromUserId: user.uid,
        fromUserName: myProfile?.name || user.displayName || user.email,
        toUserId,
        type: 'connection',
        read: false,
        createdAt: new Date(),
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['showcaseConnections', user?.uid]),
    }
  );

  // Messaging: fetch messages between user and chatUser
  const { data: chatMessages, refetch: refetchMessages } = useQuery(
    ['showcaseMessages', user?.uid, chatUser?.userId],
    async () => {
      if (!user || !chatUser) return [];
      const q = query(
        collection(db, MESSAGES_COLLECTION),
        where('participants', 'array-contains', [user.uid, chatUser.userId].sort().join('-'))
      );
      const snapshot = await getDocs(q);
      // Sort by createdAt
      return snapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => a.createdAt?.toDate?.() - b.createdAt?.toDate?.());
    },
    { enabled: !!user && !!chatUser }
  );

  // Send message mutation (add notification)
  const sendMessageMutation = useMutation(
    async (content: string) => {
      if (!user || !chatUser) return;
      await addDoc(collection(db, MESSAGES_COLLECTION), {
        fromUserId: user.uid,
        toUserId: chatUser.userId,
        participants: [user.uid, chatUser.userId].sort().join('-'),
        content,
        createdAt: new Date(),
      });
      // Add notification for the recipient
      await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        fromUserId: user.uid,
        fromUserName: myProfile?.name || user.displayName || user.email,
        toUserId: chatUser.userId,
        type: 'message',
        read: false,
        createdAt: new Date(),
      });
    },
    {
      onSuccess: () => {
        setChatInput('');
        refetchMessages();
      },
    }
  );

  if (error) {
    return <div className="text-center py-12 text-red-500">Error loading profiles.</div>;
  }

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
      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-ajira-primary mb-8 text-center">Create Your Showcase Profile</h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            saveProfileMutation.mutate(profileForm);
          }}
          className="bg-white rounded-lg shadow p-6 space-y-4"
        >
          <div className="flex flex-col items-center mb-2">
            <div className="relative">
              <img
                src={imagePreview || profileForm.avatar || user.photoURL || 'https://via.placeholder.com/80'}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border mb-2"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-ajira-accent text-white rounded-full p-1 text-xs"
                onClick={() => fileInputRef.current?.click()}
                tabIndex={-1}
              >
                Upload
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <input
            name="name"
            value={profileForm.name}
            onChange={handleFormChange}
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <input
            name="avatar"
            value={profileForm.avatar}
            onChange={handleFormChange}
            placeholder="Avatar URL (optional)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            name="bio"
            value={profileForm.bio}
            onChange={handleFormChange}
            placeholder="Short Bio"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <input
            name="skills"
            value={profileForm.skills.join(', ')}
            onChange={(e) => handleSkillsChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="Skills (comma separated)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            name="portfolioLinks"
            value={profileForm.portfolioLinks.map(link => `${link.title} - ${link.url}`).join('\n')}
            onChange={(e) => handlePortfolioLinksChange(e.target.value.split('\n').map(line => {
              const [title, url] = line.split(' - ');
              return { title: title.trim(), url: url.trim() };
            }))}
            placeholder="Portfolio Links (one per line, format: Title - URL)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            name="socialLinks"
            value={profileForm.socialLinks.map(link => `${link.platform} - ${link.url}`).join('\n')}
            onChange={(e) => handleSocialLinksChange(e.target.value.split('\n').map(line => {
              const [platform, url] = line.split(' - ');
              return { platform: platform.trim(), url: url.trim() };
            }))}
            placeholder="Social Links (one per line, format: Platform - URL)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
          <textarea
            name="achievements"
            value={profileForm.achievements}
            onChange={handleFormChange}
            placeholder="Achievements"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            required
          />
          <textarea
            name="journey"
            value={profileForm.journey}
            onChange={handleFormChange}
            placeholder="Share your journey..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-ajira-accent text-white px-6 py-2 rounded hover:bg-ajira-accent/90 transition"
            disabled={saveProfileMutation.isLoading || uploading}
          >
            {saveProfileMutation.isLoading || uploading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-ajira-primary text-center mb-12">
        Professional Showcase
      </h1>

      {/* My Profile Section */}
      <div className="mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-start gap-6">
            <div className="w-48 flex-shrink-0">
              {editMode ? (
                <div className="relative">
                  <img
                    src={imagePreview || myProfile?.avatar || '/default-avatar.png'}
                    alt="Profile"
                    className="w-48 h-48 rounded-lg object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
                  >
                    <span className="sr-only">Change photo</span>
                    📷
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <img
                  src={myProfile?.avatar || '/default-avatar.png'}
                  alt="Profile"
                  className="w-48 h-48 rounded-lg object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              {editMode ? (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {profileForm.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-ajira-accent/10 text-ajira-accent px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                          <button
                            onClick={() => {
                              const newSkills = [...profileForm.skills];
                              newSkills.splice(index, 1);
                              handleSkillsChange(newSkills);
                            }}
                            className="ml-2 hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add skill..."
                        className="px-3 py-1 border border-gray-300 rounded-full text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            const newSkill = input.value.trim();
                            if (newSkill && !profileForm.skills?.includes(newSkill)) {
                              handleSkillsChange([...(profileForm.skills || []), newSkill]);
                              input.value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio Links
                    </label>
                    {profileForm.portfolioLinks?.map((link, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={link.title}
                          placeholder="Title"
                          onChange={(e) => {
                            const newLinks = [...profileForm.portfolioLinks];
                            newLinks[index].title = e.target.value;
                            handlePortfolioLinksChange(newLinks);
                          }}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="url"
                          value={link.url}
                          placeholder="URL"
                          onChange={(e) => {
                            const newLinks = [...profileForm.portfolioLinks];
                            newLinks[index].url = e.target.value;
                            handlePortfolioLinksChange(newLinks);
                          }}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          onClick={() => {
                            const newLinks = [...profileForm.portfolioLinks];
                            newLinks.splice(index, 1);
                            handlePortfolioLinksChange(newLinks);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        handlePortfolioLinksChange([
                          ...(profileForm.portfolioLinks || []),
                          { title: '', url: '' }
                        ]);
                      }}
                      className="text-ajira-accent hover:text-ajira-accent/80 text-sm"
                    >
                      + Add Portfolio Link
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Achievements
                    </label>
                    <textarea
                      name="achievements"
                      value={profileForm.achievements}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Journey
                    </label>
                    <textarea
                      name="journey"
                      value={profileForm.journey}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-ajira-accent text-white rounded-lg hover:bg-ajira-accent/90"
                    >
                      Save Profile
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-ajira-primary">
                        {myProfile?.name || user.displayName || 'Your Name'}
                      </h2>
                      <p className="text-gray-600">{myProfile?.bio || 'Add a bio to tell your story'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setProfileForm({
                          name: myProfile?.name || '',
                          avatar: myProfile?.avatar || '',
                          bio: myProfile?.bio || '',
                          skills: myProfile?.skills || [],
                          achievements: myProfile?.achievements || '',
                          journey: myProfile?.journey || '',
                          portfolioLinks: myProfile?.portfolioLinks || [],
                          socialLinks: myProfile?.socialLinks || [],
                        });
                        setEditMode(true);
                      }}
                      className="px-4 py-2 text-ajira-accent hover:bg-ajira-accent/10 rounded-lg"
                    >
                      Edit Profile
                    </button>
                  </div>

                  {myProfile && myProfile.skills && myProfile.skills.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {myProfile.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-ajira-accent/10 text-ajira-accent px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {myProfile && myProfile.portfolioLinks && myProfile.portfolioLinks.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Portfolio</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myProfile.portfolioLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-ajira-accent hover:underline"
                          >
                            🔗 {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {myProfile?.achievements && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                      <p className="text-gray-600">{myProfile.achievements}</p>
                    </div>
                  )}

                  {myProfile?.journey && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">My Journey</h3>
                      <p className="text-gray-600">{myProfile.journey}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Other Profiles Section */}
      <h2 className="text-2xl font-bold text-ajira-primary mb-6">Connect with Professionals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles?.map((profile) => (
          <div key={profile.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start gap-4">
              <img
                src={profile.avatar || '/default-avatar.png'}
                alt={profile.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{profile.bio}</p>
                {profile.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {profile.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-ajira-accent/10 text-ajira-accent px-2 py-0.5 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 3 && (
                      <span className="text-gray-500 text-xs">+{profile.skills.length - 3} more</span>
                    )}
                  </div>
                )}
                {user && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => connectMutation.mutate(profile.userId)}
                      disabled={isConnected(profile.userId) || connectMutation.isLoading}
                      className={`px-4 py-1.5 rounded font-medium text-sm transition ${
                        isConnected(profile.userId)
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-ajira-accent text-white hover:bg-ajira-accent/90'
                      } disabled:opacity-50`}
                    >
                      {isConnected(profile.userId)
                        ? 'Connected'
                        : connectMutation.isLoading
                        ? 'Connecting...'
                        : 'Connect'}
                    </button>
                    {isConnected(profile.userId) && (
                      <button
                        onClick={() => {
                          setChatUser(profile);
                          setChatOpen(true);
                        }}
                        className="px-4 py-1.5 rounded font-medium text-sm bg-ajira-primary text-white hover:bg-ajira-primary/90 transition"
                      >
                        Message
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Modal */}
      {chatOpen && chatUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-ajira-accent"
              onClick={() => setChatOpen(false)}
            >
              ×
            </button>
            <div className="flex items-center mb-4">
              <img
                src={chatUser.avatar || '/default-avatar.png'}
                alt={chatUser.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <span className="font-semibold">{chatUser.name}</span>
            </div>
            <div className="h-64 overflow-y-auto bg-gray-50 rounded p-2 mb-2">
              <div className="flex flex-col-reverse">
                {chatMessages && chatMessages.length > 0 ? (
                  chatMessages.map((msg: any, i: number) => (
                    <div
                      key={i}
                      className={`mb-2 flex ${msg.fromUserId === user.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`px-3 py-2 rounded-lg max-w-xs ${
                          msg.fromUserId === user.uid
                            ? 'bg-ajira-accent text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400">No messages yet.</div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && chatInput.trim()) {
                    sendMessageMutation.mutate(chatInput.trim());
                  }
                }}
              />
              <button
                onClick={() => {
                  if (chatInput.trim()) {
                    sendMessageMutation.mutate(chatInput.trim());
                  }
                }}
                disabled={!chatInput.trim() || sendMessageMutation.isLoading}
                className="px-4 py-2 bg-ajira-accent text-white rounded-lg hover:bg-ajira-accent/90 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowcasePage; 