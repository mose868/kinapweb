import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ChevronLeft, 
  MoreVertical, 
  Search, 
  X, 
  Bell,
  Keyboard,
  MessageCircle,
  User,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import ProfileCompletionBanner from '../../components/common/ProfileCompletionBanner';
import { checkProfileRequirements, type ProfileData } from '../../utils/profileCompletion';
import EmojiPicker from '../../components/common/EmojiPicker';
import FileUpload from '../../components/common/FileUpload';
import { fallbackResponses } from '../../services/geminiAI';
import websocketService from '../../services/websocketService';
import toast from 'react-hot-toast';

type Theme = 'light' | 'dark' | 'system';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  isOwn?: boolean;
  messageType: 'text' | 'image' | 'file' | 'voice' | 'video' | 'audio' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  replyTo?: string;
  mediaUrl?: string;
  fileSize?: string;
  fileName?: string;
  duration?: string;
  isEdited?: boolean;
  reactions?: { emoji: string; users: string[] }[];
  type?: 'system';
  content?: string;
}

interface ChatGroup {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members?: number; // Optional for AI groups
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: ChatMessage[];
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  admins: string[];
  type: 'group' | 'direct' | 'channel' | 'ai';
  isTyping?: boolean;
  typingUsers?: string[];
  category?: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

const SETTINGS_CATEGORIES = [
  { id: 'chats', name: 'Chats', icon: MessageCircle, description: 'Theme, wallpaper, chat settings' },
  { id: 'notifications', name: 'Notifications', icon: Bell, description: 'Message notifications' },
  { id: 'keyboard', name: 'Keyboard shortcuts', icon: Keyboard, description: 'Quick actions' }
];

const CHAT_SETTINGS = [
  { id: 'display', name: 'Display', hasArrow: true },
  { id: 'theme', name: 'Theme', hasArrow: true },
  { id: 'wallpaper', name: 'Wallpaper', hasArrow: true },
  { id: 'chat_settings', name: 'Chat settings', hasArrow: true },
  { id: 'media_upload_quality', name: 'Media upload quality', hasArrow: true },
  { id: 'media_auto_download', name: 'Media auto-download', hasArrow: true },
  { id: 'spell_check', name: 'Spell check', description: 'Check spelling while typing', toggle: true, value: false },
  { id: 'replace_text_with_emoji', name: 'Replace text with emoji', description: 'Emoji will replace specific text as you type', toggle: true, value: false }
];

const GROUP_CATEGORIES = [
  'Web Development',
  'Mobile Development', 
  'Data Science',
  'UI/UX Design',
  'Digital Marketing',
  'Content Creation',
  'Business & Entrepreneurship',
  'Student Support'
];

// Wallpaper options like WhatsApp
const WALLPAPER_OPTIONS = [
  {
    id: 'default',
    name: 'Default',
    color: '#f0f2f5',
    pattern: 'none',
    preview: 'default',
    text: 'dark',
  },
  {
    id: 'cape-honey',
    name: 'Cape Honey',
    color: '#f7dc6f',
    pattern: 'doodles',
    preview: 'cape-honey',
    text: 'dark',
  },
  {
    id: 'light-blue',
    name: 'Light Blue',
    color: '#e3f2fd',
    pattern: 'doodles',
    preview: 'light-blue',
    text: 'dark',
  },
  {
    id: 'light-green',
    name: 'Light Green',
    color: '#e8f5e8',
    pattern: 'doodles',
    preview: 'light-green',
    text: 'dark',
  },
  {
    id: 'light-purple',
    name: 'Light Purple',
    color: '#f3e5f5',
    pattern: 'doodles',
    preview: 'light-purple',
    text: 'dark',
  },
  {
    id: 'light-gray',
    name: 'Light Gray',
    color: '#f5f5f5',
    pattern: 'doodles',
    preview: 'light-gray',
    text: 'dark',
  },
  {
    id: 'light-yellow',
    name: 'Light Yellow',
    color: '#fffde7',
    pattern: 'doodles',
    preview: 'light-yellow',
    text: 'dark',
  },
  {
    id: 'light-orange',
    name: 'Light Orange',
    color: '#fff3e0',
    pattern: 'doodles',
    preview: 'light-orange',
    text: 'dark',
  },
  {
    id: 'light-pink',
    name: 'Light Pink',
    color: '#fce4ec',
    pattern: 'doodles',
    preview: 'light-pink',
    text: 'dark',
  },
  {
    id: 'light-red',
    name: 'Light Red',
    color: '#ffebee',
    pattern: 'doodles',
    preview: 'light-red',
    text: 'dark',
  },
  {
    id: 'dark-blue',
    name: 'Dark Blue',
    color: '#1a237e',
    pattern: 'doodles',
    preview: 'dark-blue',
    text: 'light',
  },
  {
    id: 'dark-green',
    name: 'Dark Green',
    color: '#1b5e20',
    pattern: 'doodles',
    preview: 'dark-green',
    text: 'light',
  },
  {
    id: 'dark-purple',
    name: 'Dark Purple',
    color: '#4a148c',
    pattern: 'doodles',
    preview: 'dark-purple',
    text: 'light',
  },
  {
    id: 'dark-gray',
    name: 'Dark Gray',
    color: '#424242',
    pattern: 'doodles',
    preview: 'dark-gray',
    text: 'light',
  },
  {
    id: 'dark-yellow',
    name: 'Dark Yellow',
    color: '#f57f17',
    pattern: 'doodles',
    preview: 'dark-yellow',
    text: 'dark',
  },
  {
    id: 'dark-orange',
    name: 'Dark Orange',
    color: '#e65100',
    pattern: 'doodles',
    preview: 'dark-orange',
    text: 'light',
  },
  {
    id: 'dark-pink',
    name: 'Dark Pink',
    color: '#880e4f',
    pattern: 'doodles',
    preview: 'dark-pink',
    text: 'light',
  },
  {
    id: 'dark-red',
    name: 'Dark Red',
    color: '#b71c1c',
    pattern: 'doodles',
    preview: 'dark-red',
    text: 'light',
  },
];

const CommunityPage: React.FC = () => {
  // State management
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsSidebar, setShowSettingsSidebar] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState('chats');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  // Profile completion check
  const { user } = useBetterAuthContext();
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [showProfileBanner, setShowProfileBanner] = useState(true);

  const [settings, setSettings] = useState({
    darkTheme: false,
    enterToSend: true,
    messageNotifications: true,
    sound: true,
    spellCheck: false,
    replaceTextWithEmoji: false,
    messagePreview: false,
    readReceipts: false,
    typingIndicators: false,
    autoSaveMedia: false,
    lastSeen: false,
    profilePhoto: false,
    about: false,
    groups: false,
    status: false,
    showPreviews: false,
    reactionNotifications: false,
    backgroundSync: false,
    incomingSounds: false,
    outgoingSounds: false,
    vibration: false,
    ledLight: false
  });

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    category: ''
  });

  const menuRef = useRef<HTMLButtonElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsSearchQuery, setSettingsSearchQuery] = useState('');
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiProcessingLock, setAiProcessingLock] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [showStarredMessages, setShowStarredMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [recentMessageIds, setRecentMessageIds] = useState<Set<string>>(new Set());
  const [wsMessageBlocked, setWsMessageBlocked] = useState(false);
  const [processedMessageKeys, setProcessedMessageKeys] = useState<Set<string>>(new Set());
  // Mobile UI state handled by selectedGroup: when null → list screen; when set → chat screen
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
    // Use real user data from authentication context
  const activeUser: User = user ? {
    id: user.id || user._id || 'anonymous',
    name: user.displayName || user.name || user.email || 'Anonymous User',
    avatar: user.photoURL || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.name || user.email || 'A')}&background=1B4F72&color=fff`,
    status: 'online'
  } : {
    id: 'anonymous',
    name: 'Anonymous User',
    avatar: 'https://ui-avatars.com/api/?name=A&background=1B4F72&color=fff',
    status: 'offline'
  };

  // Add user to interest groups
  const addUserToInterestGroups = async () => {
    if (!user?.email) {
      console.log('❌ No user email available');
      return;
    }

    try {
      console.log('🔄 Adding user to interest groups...');
      const base = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
      
      // First, get the user's profile to check interests
      const profileResponse = await fetch(`${base}/better-auth/get-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const interests = profileData.interests || [];
        
        if (interests.length === 0) {
          console.log('❌ No interests found in user profile');
          // Set some default interests based on user data
          const defaultInterests = ['Student Support', 'Programming', 'Career Development'];
          
          // Update profile with default interests
          await fetch(`${base}/better-auth/update-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: user.email,
              interests: defaultInterests
            })
          });
          
          console.log('✅ Added default interests to profile');
        } else {
          console.log('✅ User has interests:', interests);
          // Update profile to trigger group assignment
          await fetch(`${base}/better-auth/update-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: user.email,
              interests: interests
            })
          });
        }
        
        // Reload groups after assignment
        setTimeout(() => {
          loadChatGroupsAndMessages();
        }, 1000);
        
        console.log('✅ Interest groups assignment completed');
      }
    } catch (error) {
      console.error('❌ Error adding user to interest groups:', error);
    }
  };

  // Helper function to get status display text
  const getStatusDisplay = (status: User['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  // Helper function to format time (accepts Date | string | number)
  const formatTime = (input: unknown) => {
    try {
      const date = input instanceof Date ? input : new Date(input as any);
      if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Helper function to deduplicate messages
  const deduplicateMessages = (messages: ChatMessage[]): ChatMessage[] => {
    const seen = new Set<string>();
    const uniqueMessages: ChatMessage[] = [];
    
    messages.forEach(message => {
      // Create a unique key based on content, userId, and timestamp (within 5 seconds)
      const timestamp = new Date(message.timestamp).getTime();
      const roundedTimestamp = Math.floor(timestamp / 5000) * 5000; // Round to 5-second intervals
      const key = `${message.content}-${message.userId}-${roundedTimestamp}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMessages.push(message);
      } else {
        console.log('🔄 Skipping duplicate message:', message.content);
      }
    });
    
    return uniqueMessages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  // Load user memory from localStorage
  const loadUserMemory = () => {
    try {
      const userMemoryData = localStorage.getItem('kinap-ai-user-memory');
      if (userMemoryData) {
        const userMemory = JSON.parse(userMemoryData);
        console.log('🧠 Loaded user memory:', userMemory);
        return userMemory;
      }
    } catch (error) {
      console.error('Error loading user memory:', error);
    }
    return null;
  };

  // Function to save Kinap AI messages to localStorage as backup
  const saveKinapAIToLocalStorage = (messages: ChatMessage[]) => {
    try {
      // Save with timestamp for better organization
      const conversationData = {
        messages: messages,
        lastUpdated: new Date().toISOString(),
        userId: activeUser.id,
        totalMessages: messages.length
      };
      localStorage.setItem('kinap-ai-conversation', JSON.stringify(conversationData));
      console.log('✅ Kinap AI conversation saved to localStorage with', messages.length, 'messages');
      
      // Also save user information for memory
      const userMemory = {
        name: activeUser.name,
        displayName: user?.displayName || activeUser.name,
        email: user?.email || '',
        course: user?.course || '',
        year: user?.year || '',
        skills: user?.skills || [],
        lastInteraction: new Date().toISOString()
      };
      localStorage.setItem('kinap-ai-user-memory', JSON.stringify(userMemory));
    } catch (error) {
      console.error('Error saving Kinap AI conversation to localStorage:', error);
    }
  };

  // Fallback function to send message via REST API
  const sendMessageViaAPI = async (message: ChatMessage, messageId: string) => {
    if (!selectedGroup) {
      throw new Error('No group selected');
    }

    const requestBody = {
      messageId: messageId,
      groupId: selectedGroup.id,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      message: message.content,
      content: message.content,
      messageType: message.messageType || 'text',
      status: 'sent',
      replyTo: message.replyTo,
      mediaUrl: message.mediaUrl,
      fileName: message.fileName,
      fileSize: message.fileSize
    };

    console.log('📡 Sending message via REST API:', requestBody);

    const response = await fetch('http://localhost:5000/api/chat-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('REST API Error Response:', response.status, errorText);
      throw new Error(`Failed to save message: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Message saved to database via REST API:', result);
    return result;
  };

  // Save user message to Kinap AI endpoint (MySQL)
  const saveUserMessageToKinapAI = async (message: ChatMessage, userId: string) => {
    try {
      const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
      
      // Save to MySQL using the chat-messages endpoint
      const response = await fetch(`${base}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: message.id,
          groupId: 'kinap-ai',
          conversationId: 'kinap-ai-conversation',
          userId: userId,
          userName: message.userName,
          userAvatar: message.userAvatar,
          message: message.content,
          content: message.content,
          messageType: 'text',
          status: 'sent',
          isAIMessage: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save user message to Kinap AI MySQL:', response.status, errorText);
        return false;
      } else {
        console.log('✅ User message saved successfully to Kinap AI MySQL');
        return true;
      }
    } catch (error) {
      console.error('Error saving user message to Kinap AI MySQL:', error);
      return false;
    }
  };

  // Save AI message to Kinap AI endpoint (MySQL)
  const saveAIMessageToKinapAI = async (messageId: string, userId: string, content: string, userProfile: any) => {
    try {
      const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
      
      // Save to MySQL using the chat-messages endpoint
      const response = await fetch(`${base}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: messageId,
          groupId: 'kinap-ai',
          conversationId: 'kinap-ai-conversation',
          userId: 'kinap-ai',
          userName: 'Kinap AI',
          userAvatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
          message: content,
          content: content,
          messageType: 'text',
          status: 'sent',
          isAIMessage: true,
          userProfile: userProfile || {}
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save AI message to Kinap AI MySQL:', response.status, errorText);
        return false;
      } else {
        console.log('✅ AI message saved successfully to Kinap AI MySQL');
        return true;
      }
    } catch (error) {
      console.error('Error saving AI message to Kinap AI MySQL:', error);
      return false;
    }
  };

  // Fallback function to save AI message via REST API (for backward compatibility)
  const saveAIMessageViaAPI = async (messageId: string, groupId: string, content: string, userProfile: any) => {
    try {
      const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
      const aiSaveResponse = await fetch(`${base}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: messageId,
          groupId: groupId,
          userId: 'kinap-ai',
          userName: 'Kinap AI',
          userAvatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
          message: content,
          content: content,
          messageType: 'text',
          status: 'sent',
          isAIMessage: true,
          userProfile: userProfile
        })
      });

      if (!aiSaveResponse.ok) {
        const errorText = await aiSaveResponse.text();
        console.error('Failed to save AI message to MongoDB:', aiSaveResponse.status, errorText);
        toast.error('Failed to save AI message to database');
      } else {
        console.log('✅ AI message saved successfully to MongoDB');
      }
    } catch (error) {
      console.error('Error saving AI message to MongoDB:', error);
      toast.error('Failed to save AI message to database');
    }
  };

  // Update profile data from user context
  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || user.name,
        email: user.email,
        photoURL: user.photoURL || user.avatar,
        bio: user.bio,
        location: user.location,
        course: user.course,
        year: user.year,
        skills: user.skills || [],
        preferredPlatforms: user.preferredPlatforms || [],
        experienceLevel: user.experienceLevel,
        ajiraGoals: user.ajiraGoals,
        preferredLearningMode: user.preferredLearningMode,
        linkedinProfile: user.linkedinProfile,
        githubProfile: user.githubProfile,
        portfolioUrl: user.portfolioUrl,
        phoneNumber: user.phoneNumber,
        idNumber: user.idNumber,
        achievements: user.achievements || [],
        completedProjects: user.completedProjects,
        mentorshipInterest: user.mentorshipInterest,
        availableForFreelance: user.availableForFreelance,
        joinedDate: user.joinedDate,
        lastActive: user.lastActive
      });
    }
  }, [user]);

  // Load user profile data for completion checking
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user || !user.id) {
        setProfileData({});
        return;
      }

      try {
        const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${base}/users/profile/${user.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setProfileData(data.profile || {});
        } else {
          console.log('⚠️ Could not load user profile, using empty data');
          setProfileData({});
        }
      } catch (error) {
        console.error('❌ Error loading user profile:', error);
        setProfileData({});
      }
    };

    loadUserProfile();
  }, [user]);

  // Refs for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);

  // Media quality state
  const [showMediaQualityModal, setShowMediaQualityModal] = useState(false);
  const [selectedMediaQuality, setSelectedMediaQuality] = useState(() => localStorage.getItem('kinap-media-quality') || 'standard');

  // Media auto-download state
  const [showMediaAutoDownloadModal, setShowMediaAutoDownloadModal] = useState(false);
  const [mediaAutoDownload, setMediaAutoDownload] = useState(() => {
    const saved = localStorage.getItem('kinap-media-auto-download');
    return saved
      ? JSON.parse(saved)
      : { photos: true, audio: true, videos: false, documents: false };
  });

  // Chat menu state
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, { status: string; lastSeen: Date; userName: string }>>(new Map());
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);



  // Ringtone and wallpaper state
  const [selectedRingtone, setSelectedRingtone] = useState('default');
  const [selectedWallpaper, setSelectedWallpaper] = useState('default');

  // Starred messages state
  const [starredMessages, setStarredMessages] = useState<ChatMessage[]>([]);

  // Effects
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedGroup || isSendingMessage) return;
    
    // Prevent rapid-fire sending
    setIsSendingMessage(true);
    
    // Block WebSocket messages temporarily to prevent duplicates
    setWsMessageBlocked(true);

    if (newMessage.trim() && selectedFiles.length > 0) {
      // If you have a combined sender elsewhere, call it; otherwise fall back to text-only
      // await handleSendMessageWithFiles();
    }

    if (newMessage.trim()) {
      const messageId = `user-${Date.now()}-${Math.random().toString(36).slice(2)}-${activeUser.id}`;
      const processedMessage = newMessage.trim();

      const message: ChatMessage = {
        id: messageId,
        userId: activeUser.id,
        userName: activeUser.name,
        userAvatar: activeUser.avatar,
        message: processedMessage,
        timestamp: new Date(),
        messageType: 'text',
        status: 'sending',
        isOwn: true,
        content: processedMessage,
        replyTo: replyingTo?.id
      };

      // Check if this message already exists to prevent duplicates
      const messageAlreadyExists = selectedGroup.messages.some(msg => 
        msg.content === processedMessage && 
        msg.userId === activeUser.id &&
        Math.abs(new Date(msg.timestamp).getTime() - Date.now()) < 5000 // Within 5 seconds
      );
      
      if (messageAlreadyExists) {
        console.log('🔄 Message already exists, skipping duplicate');
        setIsSendingMessage(false);
        return;
      }
      
      // Update state and save to localStorage in one go
      setSelectedGroup(prev => {
        if (!prev) return null;
        const updatedGroup = { ...prev, messages: [...prev.messages, message] };
        
        // Save Kinap AI messages to localStorage for persistence
        if (prev.id === 'kinap-ai') {
          try {
            saveKinapAIToLocalStorage(updatedGroup.messages);
            console.log('✅ Saved user message to Kinap AI localStorage:', message.content);
          } catch (error) {
            console.error('Error saving Kinap AI messages to localStorage:', error);
          }
        }
        
        return updatedGroup;
      });
      
      setGroups(prev => prev.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, messages: [...group.messages, message], lastMessage: processedMessage, lastMessageTime: new Date() }
          : group
      ));
      setNewMessage('');
      setReplyingTo(null);

      const updateMessageStatus = (status: 'sent' | 'failed') => {
        setSelectedGroup(prev => prev ? {
          ...prev,
          messages: prev.messages.map(msg => msg.id === messageId ? { ...msg, status } : msg)
        } : null);
        setGroups(prev => prev.map(group => 
          group.id === selectedGroup.id 
            ? { ...group, messages: group.messages.map(msg => msg.id === messageId ? { ...msg, status } : msg) }
            : group
        ));
      };

      const saveWithRetry = async (retries = 3) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            // For Kinap AI, use the specific endpoint
            if (selectedGroup.id === 'kinap-ai') {
              const userId = (user as any)?.id || (user as any)?._id || 'anonymous';
              const success = await saveUserMessageToKinapAI(message, userId);
              if (success) {
                updateMessageStatus('sent');
                return true;
              } else {
                throw new Error('Failed to save to Kinap AI');
              }
            } else {
              // For regular groups, use the normal endpoint
              await sendMessageViaAPI(message, messageId);
              updateMessageStatus('sent');
              return true;
            }
          } catch (error) {
            if (attempt === retries) {
              updateMessageStatus('failed');
              return false;
            }
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            await new Promise(res => setTimeout(res, delay));
          }
        }
        return false;
      };

      // Execute save with retry
      await saveWithRetry();

      // Send via WebSocket for real-time delivery to other users (non-persistent)
      if (isWebSocketConnected) {
        try {
          await websocketService.sendMessage({
            groupId: selectedGroup.id,
            userId: activeUser.id,
            userName: activeUser.name,
            content: processedMessage,
            messageType: 'text',
            replyTo: replyingTo?.id
          });
        } catch (error) {
          // ignore; message already persisted via REST
        }
      }

      // Typing indicator demo
      if (settings.typingIndicators) {
        setTypingUsers(prev => [...prev, 'demo-user']);
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(id => id !== 'demo-user'));
        }, 2000);
      }

      // Outgoing sound
      if (settings.outgoingSounds) {
        playRingtone(selectedRingtone || 'notification');
      }

      // Read receipts simulation
      if (settings.readReceipts) {
        setTimeout(() => {
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group, messages: group.messages.map(msg => 
                  msg.id === message.id ? { ...msg, status: 'read' } : msg
                )}
              : group
          ));
        }, 1000);
      }

      // AI response for Kinap AI
      if (selectedGroup.name === 'Kinap AI' && !aiProcessingLock) {
        setAiProcessingLock(true); // Prevent duplicate processing
        
        // Show typing indicator immediately and ensure it's visible
        setIsAIProcessing(true);
        
        // Force a re-render to show typing indicator
        setTimeout(() => {
          setIsAIProcessing(true);
        }, 0);
        
        // Add a safety timeout to prevent stuck processing state
        const safetyTimeout = setTimeout(() => {
          console.log('AI processing timeout - resetting state');
          setIsAIProcessing(false);
          setAiProcessingLock(false); // Reset lock
          
          // Add fallback response when AI times out
          const timeoutResponse = "I'm having trouble responding right now. Please try again in a moment! 😊";
          const timeoutMessage: ChatMessage = {
            id: Date.now().toString() + '-ai-timeout',
            userId: 'kinap-ai',
            userName: 'Kinap AI',
            userAvatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
            message: timeoutResponse,
            timestamp: new Date(),
            messageType: 'text',
            status: 'sent',
            content: timeoutResponse,
          };
          
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group, messages: [...group.messages, timeoutMessage] }
              : group
          ));
          setSelectedGroup(prev => prev ? { ...prev, messages: [...prev.messages, timeoutMessage] } : null);
          
          // Save timeout message to backend
          try {
            saveAIMessageViaAPI(timeoutMessage.id, selectedGroup.id, timeoutResponse, userProfile);
          } catch (error) {
            console.error('Failed to save timeout message:', error);
          }
        }, 10000); // 10 second safety timeout
        
        const userProfile = {
          name: user?.displayName || 'Student',
          course: user?.course || 'Not specified',
          year: user?.year || 'Not specified',
          skills: user?.skills || []
        };

        try {
          const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
          
          // Get the full conversation history for context
          const conversationHistory = selectedGroup.messages
            .filter(msg => msg.userId === activeUser.id || msg.userName === 'Kinap AI')
            .map(msg => ({
              role: msg.userId === activeUser.id ? 'user' : 'assistant',
              content: msg.content || msg.message
            }))
            .slice(-20); // Keep last 20 messages for context (adjust as needed)
          
          // Load user memory for enhanced context
          const userMemory = loadUserMemory();
          
          // Create enhanced conversation context with system message
          const enhancedConversationHistory = [
            {
              role: 'system',
              content: `You are Kinap AI, an intelligent assistant for the KiNaP Ajira Club. You have access to the conversation history with the user.

User Information:
- Name: ${activeUser.name} (${user?.displayName || activeUser.name})
- Email: ${user?.email || 'Not provided'}
- Course: ${user?.course || 'Not specified'}
- Year: ${user?.year || 'Not specified'}
- Skills: ${user?.skills?.join(', ') || 'Not specified'}

Please use the conversation history to provide contextual and helpful responses. If the user asks about something they mentioned before, reference that information naturally.`
            },
            ...conversationHistory
          ];
          
          // Debug: Log the conversation history being sent
          console.log('🧠 Sending conversation history to AI:', conversationHistory.length, 'messages');
          console.log('🧠 Conversation context:', conversationHistory.map(msg => `${msg.role}: ${msg.content}`));
          
          // Quick responses for common queries (instant response)
          const quickResponses = {
            greeting: [
              "👋 Hello! How can I help you with Ajira Digital today?",
              "🌟 Hi there! What would you like to know about our platform?",
              "✨ Hey! Welcome to KiNaP Ajira Club. How can I assist you?"
            ],
            help: [
              "💡 I'm here to help with mentorship, marketplace, training, and community topics!",
              "🚀 Let me guide you through our amazing Ajira Digital features!",
              "🎯 I can help with programming, career advice, project ideas, and more!"
            ],
            thanks: [
              "✨ You're welcome! Happy to help!",
              "🎉 Anytime! That's what I'm here for!",
              "🙏 My pleasure! Feel free to ask anything else!"
            ]
          };
          
          // Check for quick responses first
          const lowerMessage = processedMessage.toLowerCase();
          let aiText;
          
          // Check if user is asking about something they just mentioned (memory test)
          const isMemoryTest = (lowerMessage.includes('what did i say') && lowerMessage.includes('my name')) || 
                              (lowerMessage.includes('what did i tell you') && lowerMessage.includes('name')) ||
                              (lowerMessage.includes('do you remember') && lowerMessage.includes('name')) ||
                              (lowerMessage.includes('who did i say') && lowerMessage.includes('am')) ||
                              (lowerMessage.includes('who am i') && conversationHistory.length > 2) ||
                              (lowerMessage.includes('what is my name') && conversationHistory.length > 2) ||
                              (lowerMessage.includes('remember me') && conversationHistory.length > 2);
          
          if (isMemoryTest && conversationHistory.length > 2) {
            // User is testing memory - provide a contextual response
            const recentUserMessages = conversationHistory
              .filter(msg => msg.role === 'user')
              .slice(-3)
              .map(msg => msg.content);
            
            aiText = `Yes, ${activeUser.name}! I remember you mentioned: "${recentUserMessages.join(', ')}". How can I help you today?`;
          } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            // Check if we have conversation history to show memory
            if (conversationHistory.length > 2) {
              aiText = `👋 Welcome back! I remember our previous conversation about ${conversationHistory.slice(-4, -2).map(msg => msg.content).join(', ')}. How can I help you today?`;
            } else {
              aiText = quickResponses.greeting[Math.floor(Math.random() * quickResponses.greeting.length)];
            }
          } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            aiText = quickResponses.help[Math.floor(Math.random() * quickResponses.help.length)];
          } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            aiText = quickResponses.thanks[Math.floor(Math.random() * quickResponses.thanks.length)];
          } else {
            // Use API for more complex queries with full conversation context
            // Add timeout to prevent long delays
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased timeout for context processing
            
            const requestBody = {
              message: processedMessage,
              userId: user?.id || 'anonymous',
              conversationId: selectedGroup.id,
              conversationHistory: enhancedConversationHistory, // Send enhanced conversation history
              userProfile: userProfile,
              // Add additional context for better memory
              context: {
                userName: activeUser.name,
                userDisplayName: user?.displayName || activeUser.name,
                conversationLength: conversationHistory.length,
                lastMessageTime: selectedGroup.messages[selectedGroup.messages.length - 1]?.timestamp
              }
            };
            
            console.log('📤 Sending request to AI with context:', requestBody);
            
            const response = await fetch(`${base}/chatbot/kinap-ai`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBody),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            
            // Check if the AI response indicates memory loss
            const responseText = data.response || data.message || '';
            const hasMemoryLoss = responseText.toLowerCase().includes('don\'t have a memory') || 
                                 responseText.toLowerCase().includes('don\'t remember') ||
                                 responseText.toLowerCase().includes('can\'t remember') ||
                                 responseText.toLowerCase().includes('memory banks are fuzzy') ||
                                 responseText.toLowerCase().includes('i don\'t have access to past conversations');
            
            if (hasMemoryLoss && conversationHistory.length > 2) {
              // AI forgot - provide a contextual response using conversation history
              console.log('🧠 AI forgot - providing contextual response');
              const recentUserMessages = conversationHistory
                .filter(msg => msg.role === 'user')
                .slice(-3)
                .map(msg => msg.content);
              
              aiText = `Of course I remember you, ${activeUser.name}! 😊 In our recent conversation, you mentioned: "${recentUserMessages.join(', ')}". I'm here to help you with whatever you need!`;
            } else {
              aiText = responseText || fallbackResponses.default[Math.floor(Math.random() * fallbackResponses.default.length)];
            }
          }
          
          const aiMessageId = Date.now().toString() + '-ai';
          const aiMessage: ChatMessage = {
            id: aiMessageId,
            userId: 'kinap-ai',
            userName: 'Kinap AI',
            userAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4QjVDRjY7c3RvcC1vcGFjaXR5OjEiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzYzNjZGMjtzdG9wLW9wYWNpdHk6MSIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5LPC90ZXh0Pgo8L3N2Zz4=',
            message: aiText,
            timestamp: new Date(),
            messageType: 'text',
            status: 'sent',
            content: aiText
          };

          // Add AI message to UI immediately (simplified approach)
          clearTimeout(safetyTimeout);
          
          // Update both groups and selectedGroup immediately with localStorage saving
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group, messages: [...group.messages, aiMessage] }
              : group
          ));
          
          setSelectedGroup(prev => {
            if (!prev) return null;
            const updatedGroup = { ...prev, messages: [...prev.messages, aiMessage] };
            
            // Save Kinap AI messages to localStorage for persistence
            if (prev.id === 'kinap-ai') {
              try {
                saveKinapAIToLocalStorage(updatedGroup.messages);
                console.log('✅ Saved AI response to Kinap AI localStorage:', aiMessage.content);
              } catch (error) {
                console.error('Error saving Kinap AI messages to localStorage:', error);
              }
            }
            
            return updatedGroup;
          });
          
          // Reset AI processing state
          setIsAIProcessing(false);
          setAiProcessingLock(false); // Reset lock
          
          // Scroll to bottom after a short delay to ensure message is rendered
          setTimeout(() => {
            if (!isUserScrolledUp) scrollToBottom(true);
          }, 50);

          // Save to backend immediately (blocking to ensure persistence)
          try {
            if (selectedGroup.id === 'kinap-ai') {
              const userId = (user as any)?.id || (user as any)?._id || 'anonymous';
              const success = await saveAIMessageToKinapAI(aiMessageId, userId, aiText, userProfile);
              if (success) {
                console.log('✅ AI message saved to Kinap AI MongoDB successfully');
              } else {
                console.error('❌ Failed to save AI message to Kinap AI backend');
                toast.error('Failed to save AI message. Please try again.');
              }
            } else {
              await saveAIMessageViaAPI(aiMessageId, selectedGroup.id, aiText, userProfile);
              console.log('✅ AI message saved to MongoDB successfully');
            }
          } catch (saveError) {
            console.error('❌ Failed to save AI message to backend:', saveError);
            // Show error to user since persistence failed
            toast.error('Failed to save AI message. Please try again.');
          }
        } catch (error) {
          console.error('Kinap AI error:', error);
          clearTimeout(safetyTimeout);
          setIsAIProcessing(false);
          setAiProcessingLock(false); // Reset lock
          
          // Show error toast to user
          toast.error('AI is having trouble responding. Please try again!');
          
          // Backend AI error: use fallback response and optional sound
          const fallbackResponse = "I'm having trouble connecting right now. Please try again in a moment! 😊";
          
          console.log('Using fallback response:', fallbackResponse);

          const aiMessage: ChatMessage = {
            id: Date.now().toString() + '-ai',
            userId: 'kinap-ai',
            userName: 'Kinap AI',
            userAvatar:
              'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
            message: fallbackResponse,
            timestamp: new Date(),
            messageType: 'text',
            status: 'sent',
            content: fallbackResponse,
          };

          // Update both groups and selectedGroup immediately for fallback response
          setGroups(prev =>
            prev.map(group =>
              group.id === selectedGroup.id
                ? { ...group, messages: [...group.messages, aiMessage] }
                : group,
            ),
          );
          setSelectedGroup(prev => {
            if (!prev) return null;
            const updatedGroup = { ...prev, messages: [...prev.messages, aiMessage] };
            
            // Save fallback response to localStorage for Kinap AI
            if (prev.id === 'kinap-ai') {
              try {
                saveKinapAIToLocalStorage(updatedGroup.messages);
                console.log('✅ Saved fallback AI response to Kinap AI localStorage:', aiMessage.content);
              } catch (error) {
                console.error('Error saving fallback AI message to localStorage:', error);
              }
            }
            
            return updatedGroup;
          });
          
          setIsAIProcessing(false);
          setAiProcessingLock(false); // Reset lock
          
          // Save fallback response to backend as well
          try {
            const fallbackMessageId = Date.now().toString() + '-ai-fallback';
            if (selectedGroup.id === 'kinap-ai') {
              const userId = (user as any)?.id || (user as any)?._id || 'anonymous';
              const success = await saveAIMessageToKinapAI(fallbackMessageId, userId, fallbackResponse, userProfile);
              if (success) {
                console.log('✅ Fallback AI message saved to Kinap AI MongoDB successfully');
              } else {
                console.error('❌ Failed to save fallback AI message to Kinap AI backend');
              }
            } else {
              await saveAIMessageViaAPI(fallbackMessageId, selectedGroup.id, fallbackResponse, userProfile);
              console.log('✅ Fallback AI message saved to MongoDB successfully');
            }
          } catch (saveError) {
            console.error('❌ Failed to save fallback AI message to backend:', saveError);
          }

          // Scroll to bottom after a short delay to ensure message is rendered
          setTimeout(() => {
            if (!isUserScrolledUp) scrollToBottom(true);
          }, 50);

          if (settings.incomingSounds) {
            playRingtone(selectedRingtone || 'notification');
          }
        }
      }
    }
    
    // Reset sending state after a short delay to prevent rapid-fire sending
    setTimeout(() => {
      setIsSendingMessage(false);
      setWsMessageBlocked(false); // Re-enable WebSocket messages
    }, 1000); // Increased delay to ensure WebSocket message doesn't interfere
  };

  // Handle sending files selected in the input area
  const handleSendFiles = async () => {
    if (!selectedGroup || selectedFiles.length === 0) return;

    const filesArray = Array.isArray(selectedFiles) ? selectedFiles : [];

    for (const file of filesArray) {
      try {
        const messageId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const fileName: string = file?.originalName || file?.name || 'File';
        const fileSize: string = file?.fileSize || (file?.size ? `${Math.round(file.size / 1024)} KB` : '');
        const fileType: string = file?.mimeType || file?.type || 'application/octet-stream';

        let messageType: ChatMessage['messageType'] = 'file';
        if (fileType.startsWith('image/')) messageType = 'image';
        else if (fileType.startsWith('video/')) messageType = 'video';
        else if (fileType.startsWith('audio/')) messageType = 'audio';

        const mediaUrl: string | undefined = file?.downloadUrl || file?.previewUrl || file?.url || (typeof URL !== 'undefined' && file instanceof Blob ? URL.createObjectURL(file) : undefined);

        const outgoing: ChatMessage = {
          id: messageId,
          userId: activeUser.id,
          userName: activeUser.name,
          userAvatar: activeUser.avatar,
          message: `📎 ${fileName}`,
          content: `📎 ${fileName}`,
          timestamp: new Date(),
          messageType,
          status: 'sending',
          isOwn: true,
          mediaUrl,
          fileName,
          fileSize
        };

        setSelectedGroup(prev => prev ? { ...prev, messages: [...prev.messages, outgoing] } : null);
        setGroups(prev => prev.map(group => 
          group.id === selectedGroup.id 
            ? { ...group, messages: [...group.messages, outgoing], lastMessage: outgoing.content || outgoing.message, lastMessageTime: new Date() }
            : group
        ));

        try {
          await sendMessageViaAPI(outgoing, messageId);
          setSelectedGroup(prev => prev ? { ...prev, messages: prev.messages.map(m => m.id === messageId ? { ...m, status: 'sent' } : m) } : null);
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group, messages: group.messages.map(m => m.id === messageId ? { ...m, status: 'sent' } : m) }
              : group
          ));
        } catch {
          setSelectedGroup(prev => prev ? { ...prev, messages: prev.messages.map(m => m.id === messageId ? { ...m, status: 'failed' } : m) } : null);
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group, messages: group.messages.map(m => m.id === messageId ? { ...m, status: 'failed' } : m) }
              : group
          ));
        }
      } catch {}
    }

    setSelectedFiles([]);
    setShowFileUpload(false);
  };

  // Emoji selection handler
  const handleEmojiSelect = (emoji: any) => {
    const value = typeof emoji === 'string' ? emoji : (emoji?.native || emoji?.emoji || '');
    if (!value) return;
    setNewMessage(prev => `${prev || ''}${value}`);
    setShowEmojiPicker(false);
  };

  // Merge uploaded files from the FileUpload component
  const handleFileSelect = (files: any[]) => {
    if (!files || files.length === 0) return;
    setSelectedFiles((prev: any[]) => [...prev, ...files]);
  };

  // Remove a selected file by id (non-destructive to other UI)
  const removeSelectedFile = (fileId: string) => {
    setSelectedFiles((prev: any[]) => prev.filter((file: any) => file?.id !== fileId));
  };

  const handleCreateGroup = () => {
    if (!newGroup.name.trim() || !newGroup.category) return;
    
    // TODO: Implement group creation logic
    console.log('Creating group:', newGroup);
    setNewGroup({ name: '', description: '', category: '' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search logic
  };

  // Message search helpers (community hub only)
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
    return parts.map((part, i) => (
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/60 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      )
    ));
  };

    // Check profile completion for community access - memoized to prevent unnecessary re-renders
  const profileCheck = useMemo(() => {
    // Never block group visibility: compute completion info only
    try {
    const result = checkProfileRequirements(profileData, 'community');
      const hasBasicInfo = !!(profileData.displayName && profileData.email);
      return {
        allowed: true, // Always allow Community Hub access and group visibility
        completion: result?.completion ?? 100,
        requiredCompletion: result?.requiredCompletion ?? 70,
        missingFields: hasBasicInfo ? [] : (result?.missingFields ?? []),
      };
    } catch {
      return { allowed: true, completion: 100, requiredCompletion: 70, missingFields: [] };
    }
  }, [profileData]);

  // Only show the banner if profile is actually below requirement AND not dismissed
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('kinap-hide-community-banner') === '1';
      const raw = checkProfileRequirements(profileData, 'community');
      const hasBasic = !!(profileData.displayName && profileData.email);
      const isIncomplete = (raw?.completion ?? 100) < (raw?.requiredCompletion ?? 70) && !hasBasic;
      setShowProfileBanner(!dismissed && isIncomplete);
    } catch {
      // If anything goes wrong, don't block UI with banner
      setShowProfileBanner(false);
    }
  }, [profileData]);

  // Initialize with empty groups - groups will be loaded from backend
  const initialGroups: ChatGroup[] = [];

  // Samsung-style ringtone set (use your actual audio files with the same IDs under /ringtones/samsung)
  const ringtones = [
    { id: 'over-the-horizon', name: 'Over the Horizon', description: 'Signature' },
    { id: 'calypso', name: 'Calypso', description: 'Bright marimba' },
    { id: 'morning-flower', name: 'Morning Flower', description: 'Light chime' },
    { id: 'skyline', name: 'Skyline', description: 'Soft synth' },
    { id: 'atomic-bell', name: 'Atomic Bell', description: 'Classic bell' },
    { id: 'basic-call', name: 'Basic Call', description: 'Clean tone' },
    { id: 'beep-once', name: 'Beep Once', description: 'Short alert' },
    { id: 'crystal', name: 'Crystal', description: 'Glass sparkle' },
    { id: 'crescendo', name: 'Crescendo', description: 'Rising tone' },
    { id: 'hologram', name: 'Hologram', description: 'Digital sweep' },
    { id: 'moon', name: 'Moon', description: 'Ambient pad' },
    { id: 'nostalgia', name: 'Nostalgia', description: 'Soft melody' },
    { id: 'orchid', name: 'Orchid', description: 'Gentle pluck' },
    { id: 'plum', name: 'Plum', description: 'Warm chime' },
    { id: 'sunrise', name: 'Sunrise', description: 'Uplifting tone' }
  ];

  // Simple in-page ringtone player (uses preloaded audio files if available)
  const playRingtone = useCallback((ringtoneId: string) => {
    // If host application exposed a shared player, use it first
    if (typeof (window as any).playRingtone === 'function') {
      try { (window as any).playRingtone(ringtoneId); return; } catch {}
    }
    // Prefer real audio files if present in public/ringtones/samsung
    try {
      const fileMap: Record<string, string> = {
        'over-the-horizon': '/ringtones/samsung/over-the-horizon.mp3',
        'calypso': '/ringtones/samsung/calypso.mp3',
        'morning-flower': '/ringtones/samsung/morning-flower.mp3',
        'skyline': '/ringtones/samsung/skyline.mp3',
        'atomic-bell': '/ringtones/samsung/atomic-bell.mp3',
        'basic-call': '/ringtones/samsung/basic-call.mp3',
        'beep-once': '/ringtones/samsung/beep-once.mp3',
        'crystal': '/ringtones/samsung/crystal.mp3',
        'crescendo': '/ringtones/samsung/crescendo.mp3',
        'hologram': '/ringtones/samsung/hologram.mp3',
        'moon': '/ringtones/samsung/moon.mp3',
        'nostalgia': '/ringtones/samsung/nostalgia.mp3',
        'orchid': '/ringtones/samsung/orchid.mp3',
        'plum': '/ringtones/samsung/plum.mp3',
        'sunrise': '/ringtones/samsung/sunrise.mp3'
      };

      const src = fileMap[ringtoneId];
      if (src) {
        const audio = new Audio(src);
        audio.volume = 0.7;
        // Try/catch to avoid unhandled promise on autoplay policies
        audio.play().catch(() => {});
        if (navigator.vibrate) { try { navigator.vibrate(60); } catch {} }
        return;
      }

      // Fallback to a small synthesized ping if file missing
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.2);
      if (navigator.vibrate) { try { navigator.vibrate(40); } catch {} }
    } catch {}
  }, []);

  // Load persistent data from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('kinap-chat-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    // Load selected ringtone
    const savedRingtone = localStorage.getItem('kinap-selected-ringtone');
    if (savedRingtone) {
      setSelectedRingtone(savedRingtone);
    }

    // Load wallpaper preference
    const savedWallpaper = localStorage.getItem('kinap-wallpaper');
    if (savedWallpaper) {
      setSelectedWallpaper(savedWallpaper);
    }

    // Load starred messages
    const savedStarredMessages = localStorage.getItem('kinap-starred-messages');
    if (savedStarredMessages) {
      try {
        const parsedStarredMessages = JSON.parse(savedStarredMessages);
        setStarredMessages(parsedStarredMessages);
      } catch (error) {
        console.error('Error loading starred messages:', error);
      }
    }

      // Instant groups from cache for fast first paint
  const cachedGroups = localStorage.getItem('kinap-chat-groups');
  if (cachedGroups) {
    try {
      const parsed = JSON.parse(cachedGroups);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setGroups(parsed);
        if (!selectedGroup) {
          setSelectedGroup(parsed[0]);
        }
      }
    } catch (e) {
      // ignore cache parse errors
    }
  }

  // Load Kinap AI conversation history from localStorage as fallback
  const loadKinapAIHistory = () => {
    try {
      const kinapAIHistory = localStorage.getItem('kinap-ai-conversation');
      if (kinapAIHistory) {
        const parsedHistory = JSON.parse(kinapAIHistory);
        
        // Handle both old format (array) and new format (object)
        let messages: ChatMessage[] = [];
        if (Array.isArray(parsedHistory)) {
          // Old format - direct array
          messages = parsedHistory;
        } else if (parsedHistory.messages && Array.isArray(parsedHistory.messages)) {
          // New format - object with messages property
          messages = parsedHistory.messages;
          console.log('📅 Loaded conversation from', new Date(parsedHistory.lastUpdated).toLocaleDateString());
        }
        
        if (messages.length > 0) {
          // Deduplicate messages before setting them
          const deduplicatedHistory = deduplicateMessages(messages);
          
          // Update Kinap AI group with saved messages
          setGroups(prev => prev.map(group => 
            group.id === 'kinap-ai' 
              ? { 
                  ...group, 
                  messages: deduplicatedHistory,
                  lastMessage: deduplicatedHistory[deduplicatedHistory.length - 1]?.content || 'Hello! I\'m your KiNaP AI assistant. Ask me anything about programming, studies, or career advice! 🤖✨',
                  lastMessageTime: deduplicatedHistory[deduplicatedHistory.length - 1]?.timestamp || new Date()
                }
              : group
          ));
          
          // Update selected group if it's Kinap AI
          setSelectedGroup(prev => 
            prev && prev.id === 'kinap-ai' 
              ? { 
                  ...prev, 
                  messages: deduplicatedHistory,
                  lastMessage: deduplicatedHistory[deduplicatedHistory.length - 1]?.content || 'Hello! I\'m your KiNaP AI assistant. Ask me anything about programming, studies, or career advice! 🤖✨',
                  lastMessageTime: deduplicatedHistory[deduplicatedHistory.length - 1]?.timestamp || new Date()
                }
              : prev
          );
          
          console.log('✅ Loaded', deduplicatedHistory.length, 'messages from Kinap AI conversation history');
        }
      }
    } catch (error) {
      console.error('Error loading Kinap AI history from localStorage:', error);
    }
  };

  // Load Kinap AI history on mount
  loadKinapAIHistory();
  
  // Debug function to check localStorage (remove in production)
  const debugLocalStorage = () => {
    try {
      const saved = localStorage.getItem('kinap-ai-conversation');
      console.log('🔍 Current Kinap AI localStorage:', saved ? JSON.parse(saved) : 'empty');
    } catch (error) {
      console.error('Error reading localStorage:', error);
    }
  };
  
  // Check localStorage on mount for debugging
  debugLocalStorage();
  



  // Load Kinap AI conversation history from backend
  const loadKinapAIHistoryFromBackend = async () => {
    try {
      const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
      const userId = (user as any)?.id || (user as any)?._id || 'anonymous';
      
      // Try to load Kinap AI conversation history from backend
      const response = await fetch(`${base}/chatbot/kinap-ai/conversation/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.history && data.history.length > 0) {
          console.log('✅ Loaded Kinap AI history from backend:', data.history.length, 'messages');
          
          // Convert backend format to frontend format
          const messages = data.history.map((msg: any) => ({
            id: msg.messageId || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            userId: msg.userId,
            userName: msg.userName || (msg.role === 'user' ? activeUser.name : 'Kinap AI'),
            userAvatar: msg.userAvatar || (msg.role === 'user' ? activeUser.avatar : 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40'),
            message: msg.content || msg.message,
            timestamp: new Date(msg.timestamp),
            messageType: 'text',
            status: 'sent',
            content: msg.content || msg.message,
            isOwn: msg.role === 'user'
          }));
          
          // Deduplicate messages before setting them
          const deduplicatedMessages = deduplicateMessages(messages);
          
          // Update Kinap AI group with loaded messages
          setGroups(prev => prev.map(group => 
            group.id === 'kinap-ai' 
              ? { 
                  ...group, 
                  messages: deduplicatedMessages,
                  lastMessage: deduplicatedMessages[deduplicatedMessages.length - 1]?.content || 'Hello! I\'m your KiNaP AI assistant. Ask me anything! 🤖✨',
                  lastMessageTime: deduplicatedMessages[deduplicatedMessages.length - 1]?.timestamp || new Date()
                }
              : group
          ));
          
          // Update selected group if it's Kinap AI
          setSelectedGroup(prev => 
            prev && prev.id === 'kinap-ai' 
              ? { 
                  ...prev, 
                  messages: deduplicatedMessages,
                  lastMessage: deduplicatedMessages[deduplicatedMessages.length - 1]?.content || 'Hello! I\'m your KiNaP AI assistant. Ask me anything! 🤖✨',
                  lastMessageTime: deduplicatedMessages[deduplicatedMessages.length - 1]?.timestamp || new Date()
                }
              : prev
          );
          
          // Save to localStorage as backup
          localStorage.setItem('kinap-ai-conversation', JSON.stringify(messages));
        }
      } else {
        console.log('📭 No Kinap AI history found in backend, using localStorage fallback');
      }
    } catch (error) {
      console.error('❌ Error loading Kinap AI history from backend:', error);
      // Fallback to localStorage is already handled by loadKinapAIHistory
    }
  };
  }, []);

  // Compute filtered groups for sidebar list
  const filteredGroups = useMemo<ChatGroup[]>(() => {
    const query = (searchQuery || '').toLowerCase();
    const result = groups
      .filter((g) =>
        g.name.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        if (a.name === 'Kinap AI') return -1;
        if (b.name === 'Kinap AI') return 1;
        const aTime = a.messages.length > 0
          ? new Date(a.messages[a.messages.length - 1].timestamp).getTime()
          : 0;
        const bTime = b.messages.length > 0
          ? new Date(b.messages[b.messages.length - 1].timestamp).getTime()
          : 0;
        return bTime - aTime;
      });
    return result;
  }, [groups, searchQuery]);

  // Build settings list UI based on current state
  const filteredSettings = CHAT_SETTINGS.map((setting) => {
    if (setting.id === 'media_upload_quality') {
      return (
        <div
          key={setting.id}
          className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.01] shadow-lg hover:shadow-xl group"
          onClick={() => setShowMediaQualityModal(true)}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-200">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v11h6V6H9z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white text-lg">{setting.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                {selectedMediaQuality === 'hd' ? '🎯 HD Quality' : '📱 Standard Quality'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-ajira-primary/10 text-ajira-primary rounded-full text-sm font-medium">
              {selectedMediaQuality === 'hd' ? 'HD' : 'Standard'}
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-ajira-primary transition-colors duration-200" />
          </div>
        </div>
      );
    }
    if (setting.id === 'media_auto_download') {
      return (
        <div
          key={setting.id}
          className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.01] shadow-lg hover:shadow-xl group"
          onClick={() => setShowMediaAutoDownloadModal(true)}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-200">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-white text-lg">{setting.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">📥 Auto-download media files</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-ajira-primary transition-colors duration-200" />
        </div>
      );
    }
    return (
      <div
        key={setting.id}
        className="flex items-center justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.01] shadow-lg hover:shadow-xl group"
        onClick={() => {
          if (setting.id === 'theme') setShowThemeModal(true);
          else if (setting.id === 'wallpaper') setShowWallpaperModal(true);
        }}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl transition-all duration-200 ${
            setting.id === 'display' ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20' :
            setting.id === 'theme' ? 'bg-gradient-to-br from-indigo-500/10 to-blue-500/10 group-hover:from-indigo-500/20 group-hover:to-blue-500/20' :
            setting.id === 'wallpaper' ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 group-hover:from-emerald-500/20 group-hover:to-teal-500/20' :
            setting.id === 'chat_settings' ? 'bg-gradient-to-br from-orange-500/10 to-red-500/10 group-hover:from-orange-500/20 group-hover:to-red-500/20' :
            'bg-gradient-to-br from-gray-500/10 to-slate-500/10 group-hover:from-gray-500/20 group-hover:to-slate-500/20'
          }`}>
            {setting.id === 'display' && (
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
            {setting.id === 'theme' && (
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            )}
            {setting.id === 'wallpaper' && (
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            {setting.id === 'chat_settings' && (
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-white text-lg">{setting.name}</div>
            {setting.description && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{setting.description}</div>
            )}
            {setting.id === 'theme' ? (
              <div className="text-sm text-ajira-primary dark:text-ajira-accent mt-1 font-medium">
                {theme === 'system' ? '🖥️ System default' : theme === 'light' ? '☀️ Light' : '🌙 Dark'}
              </div>
            ) : setting.id === 'wallpaper' ? (
              <div className="text-sm text-ajira-primary dark:text-ajira-accent mt-1 font-medium">
                🎨 {WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper)?.name || 'Default'}
              </div>
            ) : null}
          </div>
        </div>
        {setting.hasArrow && setting.id !== 'display' && setting.id !== 'chat_settings' && (
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-ajira-primary transition-colors duration-200" />
        )}
      </div>
    );
  });

  // Load Kinap AI conversation history from backend
  const loadKinapAIHistoryFromBackend = async () => {
    try {
      const userId = user?.id || user?.email;
      if (!userId) {
        console.log('No user ID available, skipping message load');
        return;
      }
      
      const base = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${base}/chat-messages/group/kinap-ai?userId=${encodeURIComponent(userId)}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.messages && Array.isArray(data.messages)) {
          const formattedMessages = data.messages.map((msg: any) => ({
            id: msg.messageId || msg.id,
            userId: msg.userId,
            userName: msg.userName,
            userAvatar: msg.userAvatar,
            message: msg.message || msg.content,
            timestamp: new Date(msg.timestamp),
            messageType: msg.messageType || 'text',
            status: msg.status || 'sent',
            content: msg.content || msg.message,
            mediaUrl: msg.mediaUrl,
            fileName: msg.fileName,
            fileSize: msg.fileSize,
            fileType: msg.fileType,
            duration: msg.duration,
            isEdited: msg.isEdited || false,
            reactions: msg.reactions || [],
            replyTo: msg.replyTo
          }));
          
          // Deduplicate messages before setting them
          const deduplicatedMessages = deduplicateMessages(formattedMessages);
          
          // Update Kinap AI group with messages
          setGroups(prev => prev.map(g => g.id === 'kinap-ai' ? {
            ...g,
            messages: deduplicatedMessages,
            lastMessage: deduplicatedMessages[deduplicatedMessages.length - 1]?.content || 'Hello! I\'m your KiNaP AI assistant. Ask me anything about programming, studies, or career advice! 🤖✨',
            lastMessageTime: deduplicatedMessages[deduplicatedMessages.length - 1]?.timestamp || new Date()
          } : g));
          
          setSelectedGroup(prev => prev && prev.id === 'kinap-ai' ? {
            ...prev,
            messages: deduplicatedMessages,
            lastMessage: deduplicatedMessages[deduplicatedMessages.length - 1]?.content || 'Hello! I\'m your KiNaP AI assistant. Ask me anything about programming, studies, or career advice! 🤖✨',
            lastMessageTime: deduplicatedMessages[deduplicatedMessages.length - 1]?.timestamp || new Date()
          } : prev);
          
          console.log('✅ Loaded Kinap AI conversation history from backend');
        }
      }
    } catch (error) {
      console.error('❌ Error loading Kinap AI history:', error);
    }
  };

  // Load chat groups and (then) messages from backend
  const loadChatGroupsAndMessages = async () => {
    try {
      const userEmail = user?.email || user?.googleEmail || activeUser.name;
      console.log('🔄 Loading groups for user:', userEmail);
      console.log('👤 User object:', user);
      console.log('🎯 Active user:', activeUser);
      
      // Load groups based on user interests from backend
      const base = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
      const userId = (user as any)?.id || (user as any)?._id;
      let response: Response | undefined;

      if (userEmail) {
        response = await fetch(`${base}/groups/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail })
        });
        // If backend returns 404 for unknown email, try userId endpoint as a fallback
        if (response.status === 404 && userId) {
          try {
            response = await fetch(`${base}/groups/user/${userId}`);
          } catch {}
        }
      } else if (userId) {
        response = await fetch(`${base}/groups/user/${userId}`);
      } else {
        // No identity available; ensure UI shows a safe default
        const fallback: ChatGroup[] = [
          {
            id: 'kinap-ai',
            name: 'Kinap AI',
            description: 'Your AI assistant for programming help, study guidance, and career advice',
            avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',

            messages: [],
            lastMessage: 'Hello! I\'m your KiNaP AI assistant. Ask me anything! 🤖✨',
            lastMessageTime: new Date(),
            unreadCount: 0,
            admins: [],
            type: 'ai',
            category: 'AI'
          }
        ];
        setGroups(fallback);
        if (!selectedGroup) handleGroupSelection(fallback[0]);
        return;
      }
      
      console.log('📡 Groups API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Groups data received:', data);
        console.log('📋 Groups array:', data.groups);
        console.log('📋 Groups length:', data.groups?.length);
        console.log('📋 Success flag:', data.success);
        
        if (data.groups && data.groups.length > 0) {
          console.log('✅ Found', data.groups.length, 'groups');
          
          // Process all groups from API
          const apiGroups = data.groups.map((group: any) => ({
            id: group.id,
            name: group.name,
            description: group.description || `Community group for ${group.name}`,
            avatar: group.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=1B4F72&color=fff`,
            members: Array.isArray(group.members) ? group.members.length : 1,
            messages: [],
            lastMessage: group.lastMessage || 'No messages yet',
            lastMessageTime: new Date(group.lastMessageTime || Date.now()),
            unreadCount: group.unreadCount || 0,
            admins: group.admins || [],
            type: group.type || 'group',
            category: group.category || group.name,
            isPinned: group.type === 'ai' || group.id === 'kinap-ai',
            isOnline: group.type === 'ai' || group.id === 'kinap-ai'
          } as ChatGroup));

          // Filter out any Kinap AI groups from API response to avoid duplicates
          const filteredApiGroups = apiGroups.filter((g: ChatGroup) => g.id !== 'kinap-ai' && g.name !== 'Kinap AI' && g.name !== 'KiNaP AI Assistant');
          
          // Create Kinap AI group if it doesn't exist
          const kinapAIGroup: ChatGroup = {
            id: 'kinap-ai',
            name: 'Kinap AI',
            description: 'Your AI assistant for programming help, study guidance, career advice, and academic support',
            avatar: 'https://ui-avatars.com/api/?name=KiNaP+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',

            messages: [],
            lastMessage: 'Hello! I\'m your KiNaP AI assistant. Ask me anything about programming, studies, or career advice! 🤖✨',
            lastMessageTime: new Date(),
            unreadCount: 0,
            admins: [],
            type: 'ai',
            category: 'AI',
            isPinned: true,
            isOnline: true
          };
          
          // Get existing Kinap AI group if it exists (the one that works with Gemini)
          const existingKinapAI = groups.find(g => g.id === 'kinap-ai');
          
          // Combine Kinap AI with filtered API groups
          const allGroups = [kinapAIGroup, ...filteredApiGroups];
          
          // Sort groups: pinned (AI) first, then by last message time
          const sortedGroups = allGroups.sort((a: ChatGroup, b: ChatGroup) => {
            // AI groups always first
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            if (a.isPinned && b.isPinned) return 0;
            
            // Then sort by last message time
            return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
          });

          console.log('📋 Setting groups:', sortedGroups.map((g: ChatGroup) => `${g.name} (${g.type || 'group'})`));
          
          // Ensure Kinap AI is always present
          const hasKinapAI = sortedGroups.some(g => g.id === 'kinap-ai');
          const finalGroups = hasKinapAI ? sortedGroups : [kinapAIGroup, ...sortedGroups];
          
          setGroups(finalGroups);
          
          // Select KiNaP AI by default, or first group if no KiNaP AI
          const kinapAI = sortedGroups.find((g: ChatGroup) => g.id === 'kinap-ai' || g.type === 'ai');
          const defaultGroup = kinapAI || sortedGroups[0];
          
          if (!selectedGroup && defaultGroup) {
            console.log('🎯 Selecting default group:', defaultGroup.name);
            handleGroupSelection(defaultGroup);
          }

          // Phase 2: load messages in background per group without blocking UI
          sortedGroups.forEach(async (g: ChatGroup) => {
            try {
              const userId = user?.id || user?.email;
              if (!userId) return;
              
              const r = await fetch(`${base}/chat-messages/group/${g.id}?userId=${encodeURIComponent(userId)}`);
              if (r.ok) {
                const md = await r.json();
                if (md.success && md.messages.length > 0) {
                  const messages = md.messages.map((msg: any) => ({
                      id: msg.messageId,
                      userId: msg.userId,
                      userName: msg.userName,
                      userAvatar: msg.userAvatar,
                      message: msg.message,
                      timestamp: new Date(msg.timestamp),
                      messageType: msg.messageType,
                      status: msg.status,
                      content: msg.content,
                      mediaUrl: msg.mediaUrl,
                      fileName: msg.fileName,
                      fileSize: msg.fileSize,
                      fileType: msg.fileType,
                      duration: msg.duration,
                      isEdited: msg.isEdited,
                      reactions: msg.reactions,
                      replyTo: msg.replyTo
                    }));
                  // Special handling for Kinap AI: merge with localStorage data
                  let finalMessages = messages;
                  if (g.id === 'kinap-ai') {
                    try {
                      const localStorageHistory = localStorage.getItem('kinap-ai-conversation');
                      if (localStorageHistory) {
                        const localMessages = JSON.parse(localStorageHistory);
                        if (Array.isArray(localMessages) && localMessages.length > 0) {
                          // Combine backend and localStorage messages
                          const combinedMessages = [...messages, ...localMessages];
                          // Deduplicate the combined messages
                          finalMessages = deduplicateMessages(combinedMessages);
                          console.log('✅ Merged and deduplicated Kinap AI messages from backend and localStorage');
                        }
                      }
                    } catch (error) {
                      console.error('Error merging Kinap AI messages:', error);
                    }
                  }
                  
                  // Always deduplicate messages for all groups
                  finalMessages = deduplicateMessages(finalMessages);
                  
                  setGroups((prev) => {
                    const updated = prev.map((x) => x.id === g.id ? {
                      ...x,
                      messages: finalMessages,
                        lastMessage: finalMessages[finalMessages.length - 1]?.content || 'No messages yet',
                        lastMessageTime: finalMessages[finalMessages.length - 1]?.timestamp || new Date(),
                    } : x);
                    
                    // Ensure Kinap AI is always present
                    const hasKinapAI = updated.some(group => group.id === 'kinap-ai');
                    if (!hasKinapAI) {
                      const kinapAIGroup: ChatGroup = {
                        id: 'kinap-ai',
                        name: 'Kinap AI',
                        description: 'Your AI assistant for programming help, study guidance, career advice, and academic support',
                        avatar: 'https://ui-avatars.com/api/?name=KiNaP+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',
            
                        messages: [],
                        lastMessage: 'Hello! I\'m your KiNaP AI assistant. Ask me anything about programming, studies, or career advice! 🤖✨',
                        lastMessageTime: new Date(),
                        unreadCount: 0,
                        admins: [],
                        type: 'ai',
                        category: 'AI',
                        isPinned: true,
                        isOnline: true
                      };
                      return [kinapAIGroup, ...updated];
                    }
                    return updated;
                  });
                  setSelectedGroup((prev) => prev && prev.id === g.id ? { ...prev, messages: finalMessages } : prev);
                }
              }
            } catch (err) {
              // Background load error: ignore
            }
          });
        } else {
          console.log('📭 No groups found for user; showing Kinap AI');
          const fallback: ChatGroup[] = [
            {
              id: 'kinap-ai',
              name: 'Kinap AI',
              description: 'Your AI assistant for programming help, study guidance, and career advice',
              avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',
  
              messages: [],
              lastMessage: 'Hello! I\'m your KiNaP AI assistant. Ask me anything! 🤖✨',
              lastMessageTime: new Date(),
              unreadCount: 0,
              admins: [],
              type: 'ai',
              category: 'AI'
            }
          ];
          setGroups(fallback);
          if (!selectedGroup) handleGroupSelection(fallback[0]);
          
          // Load Kinap AI conversation history from backend
          loadKinapAIHistoryFromBackend();
        }
      } else {
        console.error('❌ Failed to load groups:', response?.status);
        const fallback: ChatGroup[] = [
          {
            id: 'kinap-ai',
            name: 'Kinap AI',
            description: 'Your AI assistant for programming help, study guidance, and career advice',
            avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',

            messages: [],
            lastMessage: 'Hello! I\'m your KiNaP AI assistant. Ask me anything! 🤖✨',
            lastMessageTime: new Date(),
            unreadCount: 0,
            admins: [],
            type: 'ai',
            category: 'AI'
          }
        ];
        setGroups(fallback);
        if (!selectedGroup) handleGroupSelection(fallback[0]);
        
        // Load Kinap AI conversation history from backend
        loadKinapAIHistoryFromBackend();
      }
    } catch (error) {
      console.error('❌ Error loading groups:', error);
              const fallback: ChatGroup[] = [
          {
            id: 'kinap-ai',
            name: 'Kinap AI',
            description: 'Your AI assistant for programming help, study guidance, and career advice',
            avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',

            messages: [],
            lastMessage: 'Hello! I\'m your KiNaP AI assistant. Ask me anything! 🤖✨',
            lastMessageTime: new Date(),
            unreadCount: 0,
            admins: [],
            type: 'ai',
            category: 'AI'
          }
        ];
      setGroups(fallback);
      if (!selectedGroup) handleGroupSelection(fallback[0]);
    }
  };

  // Group selection handler with WebSocket room management
  const handleGroupSelection = useCallback(async (group: ChatGroup) => {
    if (selectedGroup && isWebSocketConnected) {
      try {
        await websocketService.leaveGroup(selectedGroup.id, activeUser.id);
      } catch {}
    }

    // Clear recent message IDs when switching groups to prevent cross-group duplicates
    setRecentMessageIds(new Set());
    setSelectedGroup(group);
    // If you intended to hide the starred view when switching groups, reset any starred-view toggle here.
    // This file only has `starredMessages` content state, not a `showStarredMessages` flag, so we keep logic minimal.

    if (isWebSocketConnected) {
      try {
        await websocketService.joinGroup(group.id, activeUser.id);
        if (group.messages.length === 0) {
          try {
            const data = await websocketService.loadGroupMessages(group.id, 50, 0);
            if (data.messages && data.messages.length > 0) {
              const formatted = data.messages.map((msg: any) => ({
                id: msg.id,
                userId: msg.userId,
                userName: msg.userName,
                userAvatar: msg.userAvatar,
                message: msg.content,
                timestamp: new Date(msg.timestamp),
                messageType: msg.messageType,
                status: msg.status,
                content: msg.content,
                mediaUrl: msg.mediaUrl,
                fileSize: msg.fileSize,
                duration: msg.duration,
                isEdited: msg.isEdited,
                reactions: msg.reactions,
                replyTo: msg.replyTo
              }));
              setGroups(prev => prev.map(g => g.id === group.id ? { ...g, messages: formatted } : g));
              setSelectedGroup(prev => prev ? { ...prev, messages: formatted } : null);
            }
          } catch {}
        }
      } catch {}
    }

    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, [selectedGroup, isWebSocketConnected, activeUser.id]);

  // WebSocket connection and real-time updates
  useEffect(() => {
    if (!user || !activeUser.id) return;

    // Check WebSocket connection status
    const connectionStatus = websocketService.getConnectionStatus();
    console.log('🔍 WebSocket connection status:', connectionStatus);
    
    // Prevent multiple connections by checking if already connected
    if (connectionStatus.isConnected) {
      console.log('🔗 WebSocket already connected, skipping...');
      setIsWebSocketConnected(true);
      return;
    }

    const connectWebSocket = async () => {
      try {
        await websocketService.connect(activeUser.id, activeUser.name);
        setIsWebSocketConnected(true);
        console.log('✅ WebSocket connected successfully');

        // Set up event listeners for real-time updates
        websocketService.onMessage((data: any) => {
          console.log('📨 Received WebSocket message:', data);
          
          // Block WebSocket messages for a short period after sending to prevent duplicates
          if (wsMessageBlocked) {
            console.log('🔄 WebSocket messages temporarily blocked to prevent duplicates');
            return;
          }
          
          // Create a unique message identifier for duplicate detection
          const messageKey = `${data.userId}-${data.content}-${data.groupId}`;
          
          // Skip if we've already processed this exact message
          if (recentMessageIds.has(messageKey)) {
            console.log('🔄 Skipping already processed message:', messageKey);
            return;
          }
          
          // Skip messages from the current user to avoid duplicates
          if (data.userId === activeUser.id) {
            console.log('🔄 Skipping own message from WebSocket to avoid duplicate');
            return;
          }
          
          // Additional check: skip if this is a message we just sent (by content and timing)
          const justSentByMe = selectedGroup?.messages.find(msg => 
            msg.content === data.content && 
            msg.userId === activeUser.id &&
            msg.status === 'sending' && // Only check messages that are still being sent
            Math.abs(new Date(msg.timestamp).getTime() - new Date(data.timestamp).getTime()) < 3000 // Within 3 seconds
          );
          
          if (justSentByMe) {
            console.log('🔄 Skipping message I just sent');
            return;
          }
          
          // Check if this message already exists in the current group
          const existingMessage = selectedGroup?.messages.find(msg => 
            msg.id === data.id || 
            (msg.content === data.content && 
             msg.userId === data.userId &&
             Math.abs(new Date(msg.timestamp).getTime() - new Date(data.timestamp).getTime()) < 5000) // Within 5 seconds
          );
          
          if (existingMessage) {
            console.log('🔄 Skipping existing message in current group');
            return;
          }
          
          const newMessage: ChatMessage = {
            id: data.id || `ws-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            userId: data.userId,
            userName: data.userName,
            userAvatar: data.userAvatar,
            message: data.content,
            timestamp: new Date(data.timestamp),
            messageType: data.messageType || 'text',
            status: data.status || 'sent',
            content: data.content,
            mediaUrl: data.mediaUrl,
            fileSize: data.fileSize,
            duration: data.duration,
            replyTo: data.replyTo
          };
          
          // Add message key to recent set to prevent duplicates
          setRecentMessageIds(prev => {
            const newSet = new Set(prev);
            newSet.add(messageKey);
            // Clean up old entries after 30 seconds
            setTimeout(() => {
              setRecentMessageIds(current => {
                const cleaned = new Set(current);
                cleaned.delete(messageKey);
                return cleaned;
              });
            }, 30000);
            return newSet;
          });
          
          // Update groups state
          setGroups(prev => prev.map(group => {
            if (group.id === data.groupId) {
              // Check if message already exists to avoid duplicates
              const messageExists = group.messages.some(msg => 
                msg.id === data.id || 
                (msg.content === data.content && 
                 msg.userId === data.userId &&
                 Math.abs(new Date(msg.timestamp).getTime() - new Date(data.timestamp).getTime()) < 5000)
              );
              
              if (!messageExists) {
                return {
                  ...group,
                  messages: [...group.messages, newMessage],
                  lastMessage: data.content,
                  lastMessageTime: new Date(data.timestamp)
                };
              } else {
                console.log('🔄 Skipping duplicate message in groups state');
              }
            }
            return group;
          }));
          
          // Update selected group if it matches
          setSelectedGroup(prev => {
            if (prev && prev.id === data.groupId) {
              const messageExists = prev.messages.some(msg => 
                msg.id === data.id || 
                (msg.content === data.content && 
                 msg.userId === data.userId &&
                 Math.abs(new Date(msg.timestamp).getTime() - new Date(data.timestamp).getTime()) < 5000)
              );
              
              if (!messageExists) {
                // Auto-scroll for real-time messages only if user is at bottom
                if (!isUserScrolledUp) {
                  setTimeout(() => scrollToBottom(true), 50);
                }
                
                return {
                  ...prev,
                  messages: [...prev.messages, newMessage],
                  lastMessage: data.content,
                  lastMessageTime: new Date(data.timestamp)
                };
              } else {
                console.log('🔄 Skipping duplicate message in selected group');
              }
            }
            return prev;
          });
        });

        // Handle user status updates
        websocketService.onUserStatusUpdate((data: any) => {
          setOnlineUsers(prev => {
            const newMap = new Map(prev);
            newMap.set(data.userId, {
              status: data.status,
              lastSeen: new Date(data.lastSeen),
              userName: data.userName || 'Unknown'
            });
            return newMap;
          });
        });
      } catch (error) {
        console.error('❌ WebSocket connection failed:', error);
        setIsWebSocketConnected(false);
      }
    };

    connectWebSocket();

    // Cleanup function
    return () => {
      websocketService.disconnect();
      setIsWebSocketConnected(false);
    };
  }, [user, activeUser.id]);

      // Load chat groups on component mount
    useEffect(() => {
      // Auto-add user to interest groups if they have no groups
      if (user && user.email && groups.length <= 1) {
        // Only auto-add if they only have Kinap AI or no groups
        const hasOtherGroups = groups.some(g => g.id !== 'kinap-ai');
        if (!hasOtherGroups) {
          console.log('🔄 Auto-adding user to interest groups...');
          addUserToInterestGroups();
        }
      }
    }, [user, groups]);

    // Load chat groups on component mount
    useEffect(() => {
      // Always ensure KiNaP AI is available, even without authentication
      const kinapAIGroup: ChatGroup = {
        id: 'kinap-ai',
        name: 'Kinap AI',
        description: 'Your AI assistant for programming help, study guidance, career advice, and academic support',
        avatar: 'https://ui-avatars.com/api/?name=KiNaP+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',
        members: 1,
        messages: [],
        lastMessage: 'Hello! I\'m your KiNaP AI assistant. Ask me anything about programming, studies, or career advice! 🤖✨',
        lastMessageTime: new Date(),
        unreadCount: 0,
        admins: [],
        type: 'ai',
        category: 'AI',
        isPinned: true, // Always pinned at top
        isOnline: true
      };

      // If user is not authenticated, show only KiNaP AI
      if (!user || !user.id) {
        console.log('🔒 User not authenticated, showing only KiNaP AI');
        setGroups([kinapAIGroup]);
        setSelectedGroup(kinapAIGroup);
        return;
      }

      // Check if user has completed profile requirements for community access
      const profileRequirements = checkProfileRequirements(profileData, 'community');
      if (!profileRequirements.allowed) {
        console.log('📋 Profile incomplete for community access, completion:', profileRequirements.completion + '%');
        console.log('📋 Missing fields:', profileRequirements.missingFields);
        // Still show KiNaP AI even if profile incomplete
        setGroups([kinapAIGroup]);
        setSelectedGroup(kinapAIGroup);
        return;
      }

      console.log('✅ User authenticated, loading groups. Profile completion:', profileRequirements.completion + '%');
      
      // Set KiNaP AI immediately while loading other groups
      setGroups([kinapAIGroup]);
      setSelectedGroup(kinapAIGroup);
      
      loadChatGroupsAndMessages();
    }, [user, profileData]);

  // Handle typing indicators
  useEffect(() => {
    if (!isWebSocketConnected) return;

    websocketService.onTyping((data: any) => {
      setGroups(prev => prev.map(group => {
        if (group.id === data.groupId) {
          return {
            ...group,
            isTyping: true,
            typingUsers: [...(group.typingUsers || []), data.userName]
          };
        }
        return group;
      }));
    });

    websocketService.onStopTyping((data: any) => {
      setGroups(prev => prev.map(group => {
        if (group.id === data.groupId) {
          const typingUsers = (group.typingUsers || []).filter(user => user !== data.userName);
          return {
            ...group,
            isTyping: typingUsers.length > 0,
            typingUsers
          };
        }
        return group;
      }));
    });
  }, [isWebSocketConnected]);

  // Update user status when component mounts and on visibility change
  useEffect(() => {
    if (!isWebSocketConnected || !activeUser) return;

    // Set user as online
    websocketService.updateStatus(activeUser.id, 'online');

    // Handle visibility change to update status
    const handleVisibilityChange = () => {
      if (document.hidden) {
        websocketService.updateStatus(activeUser.id, 'away');
      } else {
        websocketService.updateStatus(activeUser.id, 'online');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isWebSocketConnected, activeUser]);

  // Scroll to bottom function - memoized
  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  }, []);

  // Close chat menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.chat-menu-dropdown')) {
        setShowChatMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
        setIsMobile(true);
      } else {
        setSidebarCollapsed(false);
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll when new messages arrive (if user at bottom)
  useEffect(() => {
    if (selectedGroup && selectedGroup.messages.length > 0 && !isUserScrolledUp) {
      const timeoutId = window.setTimeout(() => {
        scrollToBottom(true);
      }, 100);
      return () => window.clearTimeout(timeoutId);
    }
  }, [selectedGroup?.messages?.length, selectedGroup?.id, scrollToBottom, isUserScrolledUp]);

  // 2. Get the selected wallpaper object
  const selectedWallpaperObj = WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper) || WALLPAPER_OPTIONS[0];
  const chatTextClass = selectedWallpaperObj.text === 'light' ? 'text-white' : 'text-gray-900';
  const chatInputClass = selectedWallpaperObj.text === 'light' ? 'bg-gray-900 text-white placeholder-gray-300' : 'bg-white text-gray-900 placeholder-gray-500';

  const handleMediaQualitySelect = (quality: string) => {
    setSelectedMediaQuality(quality);
    setShowMediaQualityModal(false);
    localStorage.setItem('kinap-media-quality', quality);
  };

  const handleToggleAutoDownload = (type: 'photos' | 'audio' | 'videos' | 'documents') => {
    setMediaAutoDownload((prev: any) => {
      const updated = { ...prev, [type]: !prev[type] };
      localStorage.setItem('kinap-media-auto-download', JSON.stringify(updated));
      return updated;
    });
  };

  // Theme selection handler
  const handleThemeSelect = (nextTheme: 'light' | 'dark' | 'system') => {
    setTheme(nextTheme);
    setShowThemeModal(false);
  };

  // Wallpaper selector handler
  const handleWallpaperSelect = (wallpaperId: string) => {
    setSelectedWallpaper(wallpaperId);
    try {
      localStorage.setItem('kinap-wallpaper', wallpaperId);
    } catch {}
    setShowWallpaperModal(false);
  };

  // Function to handle chat deletion
  const handleDeleteChat = () => {
    if (selectedGroup) {
      setShowDeleteConfirmModal(true);
    }
  };

  // Function to confirm and execute chat deletion
  const confirmDeleteChat = async () => {
    if (!selectedGroup) return;

    try {
      console.log('🗑️ Deleting chat for group:', selectedGroup.id);
      
      const userId = user?.id || user?.email;
      if (!userId) {
        console.error('User authentication required to clear messages');
        return;
      }
      
      // Use the correct endpoint for clearing group messages
      const response = await fetch(`http://localhost:5000/api/chat-messages/group/${selectedGroup.id}/clear?userId=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        // Clear messages from state
        setGroups(prev => prev.map(group => 
          group.id === selectedGroup.id 
            ? { ...group, messages: [], lastMessage: 'No messages yet', lastMessageTime: new Date() }
            : group
        ));
        
        setSelectedGroup(prev => prev ? { 
          ...prev, 
          messages: [], 
          lastMessage: 'No messages yet', 
          lastMessageTime: new Date() 
        } : null);
        
        // Clear localStorage for this group
        try {
          localStorage.removeItem(`chat_messages_${selectedGroup.id}`);
          if (selectedGroup.id === 'kinap-ai') {
            localStorage.removeItem('kinap-ai-conversation');
          }
        } catch (error) {
          console.warn('Could not clear localStorage:', error);
        }
        
        console.log('✅ Chat deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to delete chat:', errorData);
      }
    } catch (error) {
      console.error('❌ Error deleting chat:', error);
    } finally {
      setShowDeleteConfirmModal(false);
    }
  };

  // Auto-scroll on group switch (immediate)
  useEffect(() => {
    if (selectedGroup && selectedGroup.messages.length > 0) {
      scrollToBottom(false);
      setIsUserScrolledUp(false);
    }
  }, [selectedGroup?.id, scrollToBottom]);

  // Detect user scroll position to toggle auto-scroll behavior
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
      setIsUserScrolledUp(!isAtBottom);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedGroup?.id]);

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-chat-settings', JSON.stringify(settings));
    const timeoutId = window.setTimeout(() => setIsSaving(false), 500);
    return () => window.clearTimeout(timeoutId);
  }, [settings]);

  // Save selected ringtone to localStorage (persist for Community Hub only)
  useEffect(() => {
    setIsSaving(true);
    try { localStorage.setItem('kinap-selected-ringtone', selectedRingtone); } catch {}
    const timeoutId = window.setTimeout(() => setIsSaving(false), 300);
    return () => window.clearTimeout(timeoutId);
  }, [selectedRingtone]);

  // Save starred messages to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-starred-messages', JSON.stringify(starredMessages));
    const timeoutId = window.setTimeout(() => setIsSaving(false), 500);
    return () => window.clearTimeout(timeoutId);
  }, [starredMessages]);

  // Save chat groups to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-chat-groups', JSON.stringify(groups));
    const timeoutId = window.setTimeout(() => setIsSaving(false), 500);
    return () => window.clearTimeout(timeoutId);
  }, [groups]);

  // Click outside handler for main menu dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.menu-dropdown')) {
          setShowMainMenu(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  

  // Save settings to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-chat-settings', JSON.stringify(settings));
    const timeoutId = window.setTimeout(() => setIsSaving(false), 500);
    return () => window.clearTimeout(timeoutId);
  }, [settings]);

  // Save selected ringtone to localStorage
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-selected-ringtone', selectedRingtone);
    const timeoutId = window.setTimeout(() => setIsSaving(false), 500);
    return () => window.clearTimeout(timeoutId);
  }, [selectedRingtone]);

  // Save starred messages to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-starred-messages', JSON.stringify(starredMessages));
    const timeoutId = window.setTimeout(() => setIsSaving(false), 500);
    return () => window.clearTimeout(timeoutId);
  }, [starredMessages]);

  // Save chat groups to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-chat-groups', JSON.stringify(groups));
    const timeoutId = window.setTimeout(() => setIsSaving(false), 500);
    return () => window.clearTimeout(timeoutId);
  }, [groups]);

  // Click outside handler for menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.menu-dropdown')) {
          setShowMainMenu(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`hidden lg:flex ${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 transition-all duration-300 flex-col min-h-0`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="text-xl font-semibold text-gray-800">Community</h2>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          {filteredGroups.length > 0 ? (
            <>
              {/* Debug info - remove this in production */}
              {import.meta.env?.DEV && (
                <div className="p-2 bg-blue-50 text-xs text-blue-600 border-b">
                  📊 {filteredGroups.length} groups loaded | User: {user?.email} | Auth: {user ? '✅' : '❌'}
                </div>
              )}
              {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => handleGroupSelection(group)}
                className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors touch-manipulation ${
                  group.name === 'Kinap AI' 
                    ? selectedGroup?.id === group.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 dark:from-purple-500/30 dark:to-indigo-500/30 border-l-4 border-purple-500'
                      : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 border-l-4 border-purple-300'
                    : selectedGroup?.id === group.id
                      ? 'bg-ajira-primary/10 dark:bg-ajira-primary/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative flex-shrink-0">
                    {group.name === 'Kinap AI' ? (
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-purple-300 dark:ring-purple-600 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg sm:text-xl">K</span>
                      </div>
                    ) : (
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                    )}
                    {group.name === 'Kinap AI' ? (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-purple-500 to-indigo-600 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-[8px] sm:text-[10px] text-white font-bold">AI</span>
                      </span>
                    ) : group.isOnline ? (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                    ) : null}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold text-sm sm:text-base truncate ${
                        group.name === 'Kinap AI' 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {group.name === 'Kinap AI' ? '🤖 ' + group.name : group.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                        {formatTime(group.lastMessageTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {group.name === 'Kinap AI' && (
                          <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] rounded-full font-semibold flex-shrink-0">
                            PINNED
                          </span>
                        )}
                        <p className={`text-sm truncate ${
                          group.name === 'Kinap AI' 
                            ? 'text-purple-600 dark:text-purple-400 font-medium' 
                            : 'text-gray-600 dark:text-gray-300'
                        }`}>
                          {group.lastMessage}
                        </p>
                      </div>
                      {group.unreadCount > 0 && (
                        <span className="ml-2 bg-ajira-primary text-white text-xs rounded-full px-2 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center flex-shrink-0">
                          {group.unreadCount > 99 ? '99+' : group.unreadCount}
                        </span>
                      )}
                    </div>
                    
                    {/* Typing indicator */}
                    {group.isTyping && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-ajira-primary rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-ajira-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-ajira-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-ajira-primary ml-1">
                          {group.typingUsers?.join(', ')} typing...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </>
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No chats yet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Start a conversation with Kinap AI or join a group to begin chatting.
              </p>
              {user && (
                <button
                  onClick={addUserToInterestGroups}
                  className="px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors text-sm font-medium"
                >
                  Join Interest Groups
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create Group Button removed intentionally: users are auto-added based on interests */}
      </div>

      {/* WhatsApp-like mobile layout: list screen when no group selected */}
      {!selectedGroup && (
        <div className="lg:hidden flex-1 flex flex-col min-h-0">
          <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredGroups.length > 0 ? (
              <>
                {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => handleGroupSelection(group)}
                className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors ${
                  group.name === 'Kinap AI' 
                    ? 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/20 dark:hover:to-indigo-900/20 border-l-4 border-purple-300' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                     {group.name === 'Kinap AI' ? (
                       <div className="w-12 h-12 rounded-full ring-2 ring-purple-300 dark:ring-purple-600 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                         <span className="text-white font-bold text-xl">K</span>
                       </div>
                     ) : (
                       <img 
                         src={group.avatar} 
                         alt={group.name} 
                         className="w-12 h-12 rounded-full object-cover" 
                       />
                     )}
                     {group.name === 'Kinap AI' && (
                       <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-600 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                         <span className="text-[10px] text-white font-bold">AI</span>
                       </span>
                     )}
                   </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold truncate ${
                        group.name === 'Kinap AI' 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {group.name === 'Kinap AI' ? '🤖 ' + group.name : group.name}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{formatTime(group.lastMessageTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {group.name === 'Kinap AI' && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] rounded-full font-semibold">
                          PINNED
                        </span>
                      )}
                      <p className={`text-sm truncate ${
                        group.name === 'Kinap AI' 
                          ? 'text-purple-600 dark:text-purple-400 font-medium' 
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {group.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              ))}
              </>
            ) : (
              <div className="p-6 text-center text-gray-600 dark:text-gray-300">No chats yet</div>
            )}
          </div>
        </div>
      )}

      {/* Chat Area - desktop always, mobile when a group is selected */}
      <div 
        className={`${showSettings ? 'hidden' : ''} ${selectedGroup ? 'flex' : 'hidden lg:flex'} flex-1 min-w-0 flex-col relative min-h-0`}
        style={{ 
          backgroundColor: WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper)?.color || '#f0f2f5'
        }}
      >
        {/* Page Header: Community Hub */}
        <div className="sticky top-0 z-10 bg-[#113A59] text-white">
          <div className="max-w-full px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="font-semibold text-base sm:text-lg">Community Hub</div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={messageSearchQuery}
                  onChange={(e) => setMessageSearchQuery(e.target.value)}
                  className="px-3 py-2 rounded-md bg-white/10 text-white placeholder-white/80 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-white/10 rounded-md"
                aria-label="Options"
                title="Options"
              >
                <MoreVertical className="w-5 h-5" />
            </button>
          </div>
      </div>
        </div>
        {WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper)?.pattern === 'doodles' && (
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full flex flex-wrap items-center justify-center text-gray-600 text-xs p-4">
              <span className="mx-1">💬</span>
              <span className="mx-1">⭐</span>
              <span className="mx-1">❤️</span>
              <span className="mx-1">📱</span>
              <span className="mx-1">📷</span>
              <span className="mx-1">✏️</span>
              <span className="mx-1">⏰</span>
              <span className="mx-1">🦊</span>
              <span className="mx-1">🐋</span>
              <span className="mx-1">🌽</span>
              <span className="mx-1">🎵</span>
            </div>
          </div>
        )}

        {selectedGroup && (
          <>
            {/* Chat Header (with menu) */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                {/* Mobile back to chats list */}
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Back to chats"
                  onClick={() => setSelectedGroup(null)}
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <img
                  src={selectedGroup.avatar}
                  alt={selectedGroup.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {selectedGroup.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                    {selectedGroup.type === 'ai' || selectedGroup.id === 'kinap-ai' 
                      ? selectedGroup.description 
                      : `${selectedGroup.members || 0} members`}
                  </p>
                </div>
                </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 relative">
                <button 
                  onClick={() => setShowChatMenu(!showChatMenu)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Chat menu"
                >
                  <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
                {showChatMenu && (
                  <div className="chat-menu-dropdown absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[100]">
                    <button
                      onClick={() => {
                        setShowStarredMessages(true);
                        setShowChatMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-t-lg text-sm sm:text-base"
                    >
                      Starred messages
                    </button>
                    <button
                      onClick={() => {
                        setShowSettings(true);
                        setShowChatMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm sm:text-base"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowChatMenu(false);
                        handleDeleteChat();
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-b-lg text-sm sm:text-base"
                    >
                      Delete chat
                    </button>
              </div>
                )}
            </div>
            </div>
            {/* Chat Content Container */}
            <div className="flex-1 flex flex-col min-h-0 max-h-full">
              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-3 sm:space-y-6 scroll-smooth relative bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800"
                style={{ 
                  scrollBehavior: 'smooth',
                  minHeight: '0',
                  maxHeight: '100%'
                }}
              >
                {/* Scroll to Bottom Button - Show when user has scrolled up or has many messages */}
                {(selectedGroup.messages.length > 5 || isUserScrolledUp) && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      scrollToBottom(true); // Use smooth scroll for manual button
                      setIsUserScrolledUp(false); // Reset scroll state when manually scrolling to bottom
                    }}
                    className={`fixed bottom-32 right-8 z-50 p-3 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
                      isUserScrolledUp 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' 
                        : 'bg-gradient-to-r from-ajira-primary to-ajira-secondary'
                    }`}
                    title={isUserScrolledUp ? "New messages available - Click to scroll to bottom" : "Scroll to bottom"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                )}
                
                {/* Empty state */}
                {selectedGroup.messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-ajira-primary/20 to-ajira-secondary/20 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-ajira-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {selectedGroup.name === 'Kinap AI' ? 'Start chatting with Kinap AI!' : `Welcome to ${selectedGroup.name}`}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      {selectedGroup.name === 'Kinap AI' 
                        ? 'Ask me anything about programming, studies, or career advice. I\'m here to help!' 
                        : 'This is the beginning of your conversation. Share ideas, collaborate, and connect!'}
                    </p>
                    {selectedGroup.name === 'Kinap AI' && selectedGroup.messages.length > 0 && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                            💾 Memory Active - I remember our conversation ({selectedGroup.messages.length} messages)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Messages (filtered/highlighted by messageSearchQuery) */}
                {(selectedGroup.messages || []).filter((m) => {
                  if (!messageSearchQuery) return true;
                  const q = messageSearchQuery.toLowerCase();
                  const body = (m.content || m.message || '').toLowerCase();
                  const user = (m.userName || '').toLowerCase();
                  return body.includes(q) || user.includes(q);
                }).map((message, index) => {
                  console.log(`🔍 Message ${index}:`, {
                    messageUserId: message.userId,
                    activeUserId: activeUser.id,
                    isOwn: message.userId === activeUser.id,
                    userName: message.userName,
                    content: message.content
                  });
                  
                  return (
                    <div
                      key={index}
                      data-message-id={message.id}
                      className={`flex ${message.userId === activeUser.id ? 'justify-end' : 'justify-start'} mb-2 sm:mb-4 px-2 sm:px-6`}
                    >
                      <div
                        className={`max-w-[90vw] sm:max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${
                          message.userId === activeUser.id
                            ? 'bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white rounded-br-none'
                            : message.userName === 'Kinap AI'
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-bl-none shadow-lg'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
                        }`}
                      >
                        {/* Message header with sender name and timestamp */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="block text-xs font-semibold mb-1">
                            {message.userId === activeUser.id ? 'You' : message.userName}
                          </span>
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp as unknown as Date)}
                          </span>
                        </div>
                        
                        {/* Message content */}
                          <div className="text-sm sm:text-base">
                            {message.messageType === 'image' && (message.mediaUrl || (message as any).previewUrl) ? (
                            <div className="space-y-2">
                              <img 
                                  src={(message as any).previewUrl || message.mediaUrl} 
                                alt="Image" 
                                className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => {
                                  // Create fullscreen modal for image viewing
                                  const modal = document.createElement('div');
                                  modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] cursor-pointer';
                                  modal.onclick = () => modal.remove();
                                  
                                  const img = document.createElement('img');
                                  img.src = (message as any).previewUrl || message.mediaUrl || '';
                                  img.className = 'max-w-full max-h-full object-contain';
                                  img.alt = 'Fullscreen Image';
                                  
                                  modal.appendChild(img);
                                  document.body.appendChild(modal);
                                }}
                              />
                              {message.content && message.content !== 'Image' && message.content !== `📎 ${message.fileName || ''}` && (
                                <p>{message.content}</p>
                              )}
                            </div>
                            ) : message.messageType === 'video' && (message.mediaUrl || (message as any).previewUrl) ? (
                            <div className="space-y-2">
                              <video 
                                controls 
                                className="max-w-full rounded-lg"
                                preload="metadata"
                              >
                                  <source src={(message as any).previewUrl || message.mediaUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <p>{message.content || message.message}</p>
                            </div>
                          ) : message.messageType === 'audio' && message.mediaUrl ? (
                            <div className="space-y-2">
                              <audio controls className="w-full">
                                <source src={message.mediaUrl} type="audio/mpeg" />
                                Your browser does not support the audio tag.
                              </audio>
                              <p>{message.content || message.message}</p>
                            </div>
                          ) : message.messageType === 'file' && message.mediaUrl ? (
                            <div className="space-y-2">
                              <a 
                                href={message.mediaUrl} 
                                download={message.fileName}
                                className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                              >
                                <div className="flex-shrink-0">
                                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {message.fileName || 'File'}
                                  </p>
                                  {message.fileSize && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {message.fileSize}
                                    </p>
                                  )}
                  </div>
                                <div className="flex-shrink-0">
                                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                </div>
                              </a>
                              <p>{message.content || message.message}</p>
                            </div>
                            ) : (
                              <div>
                                {messageSearchQuery
                                  ? highlightText(message.content || message.message || '', messageSearchQuery)
                                  : (message.content || message.message)}
                              </div>
                            )}
                          {/* Message status indicators */}
                          {message.userId === activeUser.id && (
                            <div className="flex items-center justify-end mt-1 gap-1">
                              {message.status === 'sending' && (
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              )}
                              {message.status === 'sent' && (
                                <span className="text-xs opacity-70">✓</span>
                              )}
                              {message.status === 'delivered' && (
                                <span className="text-xs opacity-70">✓✓</span>
                              )}
                              {message.status === 'read' && (
                                <span className="text-xs opacity-70 text-blue-300">✓✓</span>
                              )}
                              {message.status === 'failed' && (
                                <span className="text-xs text-red-300">✗</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* AI Processing Indicator */}
                {isAIProcessing && selectedGroup?.name === 'Kinap AI' && (
                  <div className="flex justify-start mb-4 px-2 sm:px-6 animate-pulse">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl rounded-bl-none px-4 py-3 shadow-lg max-w-[90vw] sm:max-w-xs md:max-w-md border-2 border-purple-300">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <div className="text-sm font-semibold">🤖 Kinap AI is typing...</div>
                        </div>
                        <button
                          onClick={() => {
                            setIsAIProcessing(false);
                            setAiProcessingLock(false);
                            toast.error('AI response cancelled. Please try again!');
                          }}
                          className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
              <div ref={messagesEndRef} />
            </div>

              {/* Input Area */}
              <div className="px-2 sm:px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 z-10">
                <div className="flex items-end gap-3">
                  <div className="relative">
                    <button 
                      onClick={() => setShowFileUpload(!showFileUpload)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      title="Attach files"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex-1 relative">
                    <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={selectedGroup?.name === 'Kinap AI' ? "💬 Ask Kinap AI anything..." : "💬 Type a message..."}
                      rows={1}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent resize-none text-sm leading-relaxed bg-gray-50 placeholder-gray-500 transition-all duration-200"
                      style={{
                        minHeight: '44px',
                        maxHeight: '120px'
                      }}
                      disabled={isAIProcessing || isSendingMessage}
                    />
                    
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2">
                        <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
                      </div>
                    )}
                  </div>
                  
                <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                  
                  {(newMessage.trim() || selectedFiles.length > 0) ? (
                    <button
                      onClick={newMessage.trim() ? handleSendMessage : handleSendFiles}
                      disabled={isAIProcessing || isSendingMessage}
                      className="p-3 bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white rounded-full hover:from-ajira-primary/90 hover:to-ajira-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label={newMessage.trim() ? "Send message" : "Send files"}
                    >
                      {isSendingMessage ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <button className="p-3 text-gray-500 hover:text-gray-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  )}
              </div>
                
                {/* File Preview Area */}
                {selectedFiles.length > 0 && (
                  <div className="mt-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg overflow-hidden">
                    {/* Large Image Preview */}
                    <div className="p-4">
                      {selectedFiles.filter((file: any) => file?.mimeType && typeof file.mimeType === 'string' && file.mimeType.startsWith('image/') && file.status === 'completed').length > 0 && (
                        <div className="mb-4">
                          <div className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                            <img
                              src={
                                selectedFiles.find((file: any) => file?.mimeType && typeof file.mimeType === 'string' && file.mimeType.startsWith('image/') && file.status === 'completed')?.downloadUrl 
                                || selectedFiles.find((file: any) => file?.mimeType && typeof file.mimeType === 'string' && file.mimeType.startsWith('image/') && file.status === 'completed')?.url 
                                || selectedFiles.find((file: any) => file?.mimeType && typeof file.mimeType === 'string' && file.mimeType.startsWith('image/') && file.status === 'completed')?.previewUrl 
                                || ''
                              }
                              alt="Preview"
                              className="w-full h-64 object-cover"
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              {selectedFiles.filter((file: any) => file?.mimeType && typeof file.mimeType === 'string' && file.mimeType.startsWith('image/') && file.status === 'completed').length} image{selectedFiles.filter((file: any) => file?.mimeType && typeof file.mimeType === 'string' && file.mimeType.startsWith('image/') && file.status === 'completed').length > 1 ? 's' : ''}
            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedFiles([])}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Files */}
                    <div className="p-3 space-y-2">
                      {/* File List */}
                      {selectedFiles.map((file: any) => (
                        <div
                          key={file.id || file.name}
                          className={`flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border transition-all duration-200 ${
                            file?.status === 'completed'
                              ? 'border-green-200 dark:border-green-700'
                              : file?.status === 'uploading'
                              ? 'border-blue-200 dark:border-blue-700'
                              : 'border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* File Icon */}
                            {file?.mimeType && typeof file.mimeType === 'string' && file.mimeType.startsWith('image/') ? (
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-700">
                                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              </div>
                            ) : file?.mimeType && typeof file.mimeType === 'string' && file.mimeType.startsWith('video/') ? (
                              <div className="flex-shrink-0 relative">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center border border-red-200 dark:border-red-700">
                                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                {file?.status === 'completed' && (
                                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  </div>
                                )}
                              </div>
                            ) : file?.mimeType && typeof file.mimeType === 'string' && file.mimeType.startsWith('audio/') ? (
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center border border-green-200 dark:border-green-700">
                                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                  </svg>
                                </div>
                              </div>
                            ) : (
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                              </div>
                            )}

                            {/* File Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {file?.originalName || file?.name || 'File'}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {file?.fileSize || (file?.size ? `${Math.round(file.size / 1024)} KB` : '')}
                                </p>
                                {file?.status === 'uploading' && (
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                    <span className="text-xs text-blue-500">Uploading...</span>
                                  </div>
                                )}
                                {file?.status === 'completed' && (
                                  <div className="flex items-center gap-1">
                                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-xs text-green-500">Ready</span>
                                  </div>
                                )}
                                {file?.status === 'failed' && (
                                  <div className="flex items-center gap-1">
                                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="text-xs text-red-500">Failed</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
              <button
                            onClick={() => removeSelectedFile(file?.id || file?.name)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-2"
              >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
              </button>
            </div>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between gap-2">
                      <div className="text-xs text-gray-500">You can review files before sending</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelectedFiles([])} className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600">Clear</button>
                        <button onClick={handleSendFiles} className="px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white shadow hover:from-ajira-primary/90 hover:to-ajira-secondary/90">Send Files</button>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex justify-end mt-1">
                        {(() => {
                          const completedFiles = selectedFiles.filter((file: any) => file?.status === 'completed');
                          const uploadingFiles = selectedFiles.filter((file: any) => file?.status === 'uploading');
                          const hasCompletedFiles = completedFiles.length > 0;
                          const hasUploadingFiles = uploadingFiles.length > 0;
                          
                          return (
                            <div className="flex items-center gap-3">
                              {hasUploadingFiles && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                                  <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                    {uploadingFiles.length} uploading...
                                  </span>
          </div>
        )}
                              <button
                                onClick={handleSendFiles}
                                disabled={!hasCompletedFiles}
                                className={`px-6 py-3 rounded-xl transition-all duration-200 shadow-lg text-sm font-semibold flex items-center gap-2 ${
                                  hasCompletedFiles
                                    ? 'bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white hover:from-ajira-primary/90 hover:to-ajira-secondary/90 hover:shadow-xl transform hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Send {completedFiles.length} File{completedFiles.length > 1 ? 's' : ''}
                              </button>
      </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* File Upload */}
                {showFileUpload && (
                  <div className="absolute bottom-20 left-2 sm:left-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80 max-w-[90vw]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">📎 Attach Files</h3>
                      <button 
                        onClick={() => setShowFileUpload(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <FileUpload 
                      onFileSelect={handleFileSelect}
                      uploadContext="chat"
                      uploadedBy={activeUser.id}
                      relatedId={selectedGroup?.id as any}
                      multiple={true}
                      maxFiles={10}
                      maxSize={100}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-[70] bg-black/40 lg:hidden" onClick={() => setShowMobileSidebar(false)}>
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Chats</h3>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setShowMobileSidebar(false)}>
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="overflow-y-auto h-full">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => { handleGroupSelection(group); setShowMobileSidebar(false); }}
                    className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer ${selectedGroup?.id === group.id ? 'bg-ajira-primary/10 dark:bg-ajira-primary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={group.avatar} alt={group.name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">{group.name}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{formatTime(group.lastMessageTime)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{group.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-600 dark:text-gray-300">No chats yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Layout (visible when showSettings is true) */}
      {showSettings && (
        <div className={`flex-1 ${sidebarCollapsed ? 'block' : 'hidden lg:flex'} flex relative min-h-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800`}>
          {/* Settings Sidebar */}
          <div className="w-80 shrink-0 hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Close settings">
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search settings..."
                  value={settingsSearchQuery}
                  onChange={(e) => setSettingsSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-ajira-primary"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {SETTINGS_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedSetting(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedSetting === category.id
                      ? 'bg-ajira-primary/10 text-ajira-primary'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{category.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{category.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Mobile header */}
            <div className="lg:hidden p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
              <button onClick={() => setShowSettings(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <div className="font-semibold text-gray-900 dark:text-white">Settings</div>
              <div className="w-9" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="max-w-3xl mx-auto space-y-4">
                {selectedSetting === 'chats' && (
                  <>{filteredSettings}</>
                )}

                {selectedSetting === 'notifications' && (
                  <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Notifications (Community Hub)</h4>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Incoming sounds</span>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, incomingSounds: !prev.incomingSounds }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.incomingSounds ? 'bg-ajira-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.incomingSounds ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Outgoing sounds</span>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, outgoingSounds: !prev.outgoingSounds }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.outgoingSounds ? 'bg-ajira-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.outgoingSounds ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Selected ringtone</span>
                      <select
                        value={selectedRingtone}
                        onChange={(e) => setSelectedRingtone(e.target.value)}
                        className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-700 dark:text-gray-200"
                      >
                        {ringtones.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="pt-3 flex items-center justify-between gap-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Current: {ringtones.find(r => r.id === selectedRingtone)?.name || 'None'}</div>
                      <button
                        onClick={() => {
                          // Persist selection and confirm
                          try { localStorage.setItem('kinap-selected-ringtone', selectedRingtone); } catch {}
                          playRingtone(selectedRingtone || 'over-the-horizon');
                        }}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white shadow hover:from-ajira-primary/90 hover:to-ajira-secondary/90"
                      >
                        Set as Ringtone
                      </button>
                    </div>
                  </div>
                )}

                {selectedSetting === 'keyboard' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Chat Shortcuts</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Send message</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Send your typed message</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Enter</kbd>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">New line</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Add a line break in your message</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Shift</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Enter</kbd>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Search messages</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Focus on search input</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Ctrl</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">F</kbd>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Open emoji picker</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Add emojis to your message</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Ctrl</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">;</kbd>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Navigation Shortcuts</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Open settings</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Quick access to settings</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Ctrl</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">,</kbd>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Toggle theme</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Ctrl</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">D</kbd>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Escape/Close</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Close modals, menus, or go back</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Esc</kbd>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Focus message input</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Quickly start typing a message</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Tab</kbd>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">File & Media Shortcuts</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Upload file</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Open file picker to attach files</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Ctrl</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">U</kbd>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Paste clipboard</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Paste text or images from clipboard</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Ctrl</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">V</kbd>
                          </div>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Take screenshot</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Capture and share screenshot</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Ctrl</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">Shift</kbd>
                            <span className="text-gray-400">+</span>
                            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded border">S</kbd>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                          <Keyboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h5 className="font-medium text-blue-900 dark:text-blue-100">Pro Tip</h5>
                          <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                            Most shortcuts work across the entire Community Hub. You can use these shortcuts to navigate faster and improve your chatting experience!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Completion Banner (non-blocking) */}
      {showProfileBanner && user && (
        <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto z-[60] max-w-xl">
          <ProfileCompletionBanner
            profileData={profileData}
            feature="community"
            onComplete={() => {
              setShowProfileBanner(false);
              try { localStorage.setItem('kinap-hide-community-banner', '1'); } catch {}
            }}
          />
        </div>
      )}

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleThemeSelect('light')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  theme === 'light'
                    ? 'border-ajira-primary bg-ajira-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-gray-900 dark:text-white">Light</span>
                {theme === 'light' && (
                  <div className="w-4 h-4 bg-ajira-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>

              <button
                onClick={() => handleThemeSelect('dark')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'border-ajira-primary bg-ajira-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-gray-900 dark:text-white">Dark</span>
                {theme === 'dark' && (
                  <div className="w-4 h-4 bg-ajira-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>

              <button
                onClick={() => handleThemeSelect('system')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  theme === 'system'
                    ? 'border-ajira-primary bg-ajira-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-gray-900 dark:text-white">System default</span>
                {theme === 'system' && (
                  <div className="w-4 h-4 bg-ajira-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowThemeModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Wallpaper Selection Modal */}
      {showWallpaperModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Set chat wallpaper</h3>
              <button
                onClick={() => setShowWallpaperModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row gap-4 overflow-hidden">
              {/* Wallpaper Options */}
              <div className="w-full sm:w-1/2 pr-0 sm:pr-4 overflow-y-auto max-h-60 sm:max-h-none">
                <div className="space-y-3">
                  {WALLPAPER_OPTIONS.map((wallpaper) => (
                    <button
                      key={wallpaper.id}
                      onClick={() => handleWallpaperSelect(wallpaper.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        selectedWallpaper === wallpaper.id
                          ? 'border-ajira-primary bg-ajira-primary/10'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {/* Small preview thumbnail */}
                      <div 
                        className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-600 flex-shrink-0 flex items-center justify-center relative"
                        style={{ backgroundColor: wallpaper.color }}
                      >
                        {wallpaper.pattern === 'doodles' && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">✨</span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 dark:text-white">{wallpaper.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Background color</div>
                      </div>
                      {selectedWallpaper === wallpaper.id && (
                        <div className="w-4 h-4 bg-ajira-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Wallpaper Preview */}
              <div className="w-full sm:w-1/2 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 flex flex-col min-h-40 border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Wallpaper preview</h4>
                <div 
                  className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden min-h-32 flex items-center justify-center"
        style={{ 
                    backgroundColor: WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper)?.color || '#f0f2f5'
        }}
      >
                  {/* Doodles Pattern */}
        {WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper)?.pattern === 'doodles' && (
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full flex flex-wrap items-center justify-center text-gray-600 text-xs p-4">
              <span className="mx-1">💬</span>
              <span className="mx-1">⭐</span>
              <span className="mx-1">❤️</span>
              <span className="mx-1">📱</span>
              <span className="mx-1">📷</span>
              <span className="mx-1">✏️</span>
              <span className="mx-1">⏰</span>
              <span className="mx-1">🦊</span>
              <span className="mx-1">🐋</span>
              <span className="mx-1">🌽</span>
              <span className="mx-1">🎵</span>
            </div>
          </div>
        )}
                  {/* Mock Chat Interface or Fallback */}
                  <div className="absolute inset-0 flex flex-col">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-ajira-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">U</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">User</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Online</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center text-gray-600 dark:text-gray-400">
                        <div className="text-sm">Chat preview</div>
                        <div className="text-xs mt-1">Messages will appear here</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowWallpaperModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleWallpaperSelect(selectedWallpaper)}
                className="px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors"
              >
                Set Wallpaper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Quality Selection Modal */}
      {showMediaQualityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Media upload quality</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleMediaQualitySelect('standard')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-ajira-primary active:scale-95 ${
                  selectedMediaQuality === 'standard'
                    ? 'border-ajira-primary bg-ajira-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-gray-900 dark:text-white">Standard</span>
                {selectedMediaQuality === 'standard' && (
                  <div className="w-4 h-4 bg-ajira-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
              <button
                onClick={() => handleMediaQualitySelect('hd')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-ajira-primary active:scale-95 ${
                  selectedMediaQuality === 'hd'
                    ? 'border-ajira-primary bg-ajira-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-gray-900 dark:text-white">HD</span>
                {selectedMediaQuality === 'hd' && (
                  <div className="w-4 h-4 bg-ajira-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowMediaQualityModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Auto-Download Modal */}
      {showMediaAutoDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Media auto-download</h3>
            <div className="space-y-4">
              {['photos', 'audio', 'videos', 'documents'].map(type => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white capitalize">{type}</span>
                  <button
                    onClick={() => handleToggleAutoDownload(type as any)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ajira-primary ${mediaAutoDownload[type as keyof typeof mediaAutoDownload] ? 'bg-ajira-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mediaAutoDownload[type as keyof typeof mediaAutoDownload] ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <div className="my-6 text-xs text-gray-600 dark:text-gray-400">
              Voice messages are always automatically downloaded for the best communication experience.
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed mb-4"
              disabled
            >
              <span className="text-base">↻</span> Reset auto-download settings
            </button>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowMediaAutoDownloadModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Chat Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete Chat</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete all messages in this chat? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteChat}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In the chat area, show an HD badge if selectedMediaQuality === 'hd' */}
      {selectedMediaQuality === 'hd' && (
        <div className="absolute top-2 right-2 z-20">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-ajira-primary text-white shadow">HD Mode Active</span>
        </div>
      )}
      
      {/* Custom styles for better scrolling */}
      <style>{`
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar for webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        
        /* Dark mode scrollbar */
        .dark .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.3);
        }
        
        .dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CommunityPage;

