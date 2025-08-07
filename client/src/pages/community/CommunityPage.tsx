import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Search, 
  X, 
  Menu, 
  Play, 
  Check,
  Settings,
  Bell,
  Key,
  Keyboard,
  MessageCircle,
  User,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import ProfileCompletionBanner from '../../components/common/ProfileCompletionBanner';
import { checkProfileRequirements, type ProfileData } from '../../utils/profileCompletion';
import EmojiPicker from '../../components/common/EmojiPicker';
import FileUpload from '../../components/common/FileUpload';
import { geminiAI, fallbackResponses } from '../../services/geminiAI';
import websocketService from '../../services/websocketService';

type Theme = 'light' | 'dark' | 'system';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  isOwn?: boolean;
  messageType: 'text' | 'image' | 'file' | 'voice' | 'video' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  replyTo?: string;
  mediaUrl?: string;
  fileSize?: string;
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
  members: number;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: ChatMessage[];
  isOnline?: boolean;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  admins: string[];
  type: 'group' | 'direct' | 'channel';
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
  { id: 'account', name: 'Account', icon: Key, description: 'Security notifications, account info' },
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
  const [isMobile, setIsMobile] = useState(false);
  const [showStarredMessages, setShowStarredMessages] = useState(false);
  const [starredMessages, setStarredMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const [showRingtoneModal, setShowRingtoneModal] = useState(false);
  const [selectedRingtone, setSelectedRingtone] = useState('default');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState('default');
  const { theme: currentTheme, setTheme: setCurrentTheme, isDark } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsSearchQuery, setSettingsSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

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

  // Refs for scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);

  // 1. Add state for media quality
  const [showMediaQualityModal, setShowMediaQualityModal] = useState(false);
  const [selectedMediaQuality, setSelectedMediaQuality] = useState(() => localStorage.getItem('kinap-media-quality') || 'standard');

  // 1. Add state for media auto-download
  const [showMediaAutoDownloadModal, setShowMediaAutoDownloadModal] = useState(false);
  const [mediaAutoDownload, setMediaAutoDownload] = useState(() => {
    const saved = localStorage.getItem('kinap-media-auto-download');
    return saved
      ? JSON.parse(saved)
      : { photos: true, audio: true, videos: false, documents: false };
  });
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, { status: string; lastSeen: Date; userName: string }>>(new Map());
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);

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

  // Helper function to get status display text
  const getStatusDisplay = (status: User['status']) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  // Helper function to format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      replyTo: message.replyTo
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

  // Fallback function to save AI message via REST API
  const saveAIMessageViaAPI = async (messageId: string, groupId: string, content: string, userProfile: any) => {
    try {
      const aiSaveResponse = await fetch('http://localhost:5000/api/chat-messages', {
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
        console.error('Failed to save AI message to MongoDB');
      }
    } catch (error) {
      console.error('Error saving AI message to MongoDB:', error);
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

  // Check profile completion for community access - memoized to prevent unnecessary re-renders
  const profileCheck = useMemo(() => {
    const result = checkProfileRequirements(profileData, 'community');
    console.log('Profile check result:', result);
    console.log('Profile data:', profileData);
    
    // Temporary: Allow access if user has basic info (displayName, email) 
    // This prevents blocking users who have actually completed their profiles
    const hasBasicInfo = profileData.displayName && profileData.email;
    if (hasBasicInfo && !result.allowed) {
      console.log('🎯 Allowing community access based on basic profile info');
      return {
        allowed: true,
        completion: result.completion,
        requiredCompletion: result.requiredCompletion,
        missingFields: result.missingFields
      };
    }
    
    return result;
  }, [profileData]);

  // Initialize with empty groups - groups will be loaded from backend
  const initialGroups: ChatGroup[] = [];

  const ringtones = [
    { id: 'default', name: 'Default', description: 'Default notification sound' },
    { id: 'notification', name: 'Notification', description: 'Standard notification' },
    { id: 'chime', name: 'Chime', description: 'Gentle chime sound' },
    { id: 'bell', name: 'Bell', description: 'Classic bell sound' }
  ];

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

    // Load chat groups and messages from MongoDB
    loadChatGroupsAndMessages();
  }, []);

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
          
          const newMessage: ChatMessage = {
            id: data.id,
            userId: data.userId,
            userName: data.userName,
            userAvatar: data.userAvatar,
            message: data.content,
            timestamp: new Date(data.timestamp),
            messageType: data.messageType,
            status: data.status,
            content: data.content,
            mediaUrl: data.mediaUrl,
            fileSize: data.fileSize,
            duration: data.duration,
            replyTo: data.replyTo
          };
          
          // Update groups state
          setGroups(prev => prev.map(group => {
            if (group.id === data.groupId) {
              // Check if message already exists to avoid duplicates
              const messageExists = group.messages.some(msg => msg.id === data.id);
              if (!messageExists) {
                return {
                  ...group,
                  messages: [...group.messages, newMessage],
                  lastMessage: data.content,
                  lastMessageTime: new Date(data.timestamp)
                };
              }
            }
            return group;
          }));
          
          // Update selected group if it matches
          setSelectedGroup(prev => {
            if (prev && prev.id === data.groupId) {
              const messageExists = prev.messages.some(msg => msg.id === data.id);
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

        // Handle typing indicators
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

      } catch (error) {
        console.error('❌ Failed to connect WebSocket:', error);
        setIsWebSocketConnected(false);
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
      setIsWebSocketConnected(false);
    };
  }, [user?.id, activeUser.id, activeUser.name]); // Only depend on stable values

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

  // Function to load chat groups and messages from MongoDB
  const loadChatGroupsAndMessages = async () => {
    try {
      const userEmail = user?.email || user?.googleEmail || activeUser.name;
      console.log('🔄 Loading groups for user:', userEmail);
      console.log('👤 User object:', user);
      console.log('🎯 Active user:', activeUser);
      
      // Load groups based on user interests from backend
      const response = await fetch('http://localhost:5000/api/groups/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail
        })
      });
      
      console.log('📡 Groups API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Groups data received:', data);
        
        if (data.groups && data.groups.length > 0) {
          console.log('✅ Found', data.groups.length, 'groups');
          // Load messages for each group from MongoDB
          const groupsWithMessages = await Promise.all(
            data.groups.map(async (group: any) => {
              try {
                const groupId = group._id || group.id;
                const messagesResponse = await fetch(`http://localhost:5000/api/chat-messages/group/${groupId}`);
                if (messagesResponse.ok) {
                  const messagesData = await messagesResponse.json();
                  if (messagesData.success && messagesData.messages.length > 0) {
                    // Convert MongoDB messages to frontend format
                    const messages = messagesData.messages.map((msg: any) => ({
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

                    return {
                      id: groupId,
                      name: group.name,
                      description: group.description || `Community group for ${group.name}`,
                      avatar: group.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=1B4F72&color=fff`,
                      members: group.members?.length || 1,
                      messages: messages,
                      lastMessage: messages[messages.length - 1]?.content || 'No messages yet',
                      lastMessageTime: messages[messages.length - 1]?.timestamp || new Date(),
                      unreadCount: 0,
                      admins: group.admins || [activeUser.id],
                      type: group.type || 'group',
                      category: group.name
                    };
                  }
                }
              } catch (error) {
                console.error(`Error loading messages for group ${group._id || group.id}:`, error);
              }
              return {
                id: group._id || group.id,
                name: group.name,
                description: group.description || `Community group for ${group.name}`,
                avatar: group.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(group.name)}&background=1B4F72&color=fff`,
                members: group.members?.length || 1,
                messages: [],
                lastMessage: 'No messages yet',
                lastMessageTime: new Date(),
                unreadCount: 0,
                admins: group.admins || [activeUser.id],
                type: group.type || 'group',
                category: group.name
              };
            })
          );

          setGroups(groupsWithMessages);
          console.log('🎯 Groups set successfully:', groupsWithMessages.length);
          
          // Auto-select first group if none is selected and groups are available
          if (!selectedGroup && groupsWithMessages.length > 0) {
            console.log('🎯 Auto-selecting first group:', groupsWithMessages[0].name);
            handleGroupSelection(groupsWithMessages[0]);
          }
        } else {
          // No groups found, set empty state
          console.log('⚠️ No groups found in response');
          setGroups([]);
        }
      } else {
        // Failed to load groups, set empty state
        console.error('❌ Failed to load groups, status:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        
        // Fallback: Create Kinap AI group locally if API fails
        const fallbackGroups: ChatGroup[] = [{
          id: 'kinap-ai-fallback',
          name: 'Kinap AI',
          description: 'Your AI assistant for programming help, study guidance, and career advice',
          avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
          members: 1,
          messages: [{
            id: 'welcome-msg',
            userId: 'kinap-ai',
            userName: 'Kinap AI',
            userAvatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
            message: 'Hello! I\'m Kinap AI, ready to help you with anything!',
            timestamp: new Date(),
            messageType: 'text' as const,
            status: 'sent' as const,
            content: 'Hello! I\'m Kinap AI, ready to help you with anything!'
          }],
          lastMessage: 'Hello! I\'m Kinap AI, ready to help you with anything!',
          lastMessageTime: new Date(),
          unreadCount: 0,
          admins: [activeUser.id],
          type: 'direct' as const,
          category: 'AI Assistant'
        }];
        setGroups(fallbackGroups);
        // Auto-select the fallback group
        if (!selectedGroup && fallbackGroups.length > 0) {
          console.log('🎯 Auto-selecting fallback group:', fallbackGroups[0].name);
          setSelectedGroup(fallbackGroups[0]);
        }
      }
    } catch (error) {
      console.error('💥 Error loading chat groups and messages:', error);
      
      // Fallback: Create Kinap AI group locally if everything fails
      const fallbackGroups: ChatGroup[] = [{
        id: 'kinap-ai-fallback',
        name: 'Kinap AI',
        description: 'Your AI assistant for programming help, study guidance, and career advice',
        avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
        members: 1,
        messages: [{
          id: 'welcome-msg',
          userId: 'kinap-ai',
          userName: 'Kinap AI',
          userAvatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
          message: 'Hello! I\'m Kinap AI, ready to help you with anything!',
          timestamp: new Date(),
          messageType: 'text' as const,
          status: 'sent' as const,
          content: 'Hello! I\'m Kinap AI, ready to help you with anything!'
        }],
        lastMessage: 'Hello! I\'m Kinap AI, ready to help you with anything!',
        lastMessageTime: new Date(),
        unreadCount: 0,
        admins: [activeUser.id],
        type: 'direct' as const,
        category: 'AI Assistant'
      }];
      setGroups(fallbackGroups);
      // Auto-select the fallback group
      if (!selectedGroup && fallbackGroups.length > 0) {
        console.log('🎯 Auto-selecting fallback group:', fallbackGroups[0].name);
        setSelectedGroup(fallbackGroups[0]);
      }
    }
  };

  // Save settings to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-chat-settings', JSON.stringify(settings));
    setTimeout(() => setIsSaving(false), 500);
  }, [settings]);

  // Save selected ringtone to localStorage
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-selected-ringtone', selectedRingtone);
    setTimeout(() => setIsSaving(false), 500);
  }, [selectedRingtone]);



  // Save starred messages to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-starred-messages', JSON.stringify(starredMessages));
    setTimeout(() => setIsSaving(false), 500);
  }, [starredMessages]);

  // Save chat groups to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-chat-groups', JSON.stringify(groups));
    setTimeout(() => setIsSaving(false), 500);
  }, [groups]);

  // Click outside handler for menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        // Don't close if clicking on the dropdown menu itself
        if (!target.closest('.menu-dropdown')) {
          setShowMainMenu(false);
        }
      }
      
      // Close chat menu when clicking outside
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
        // On mobile, keep sidebar collapsed by default
        setSidebarCollapsed(true);
        setIsMobile(true);
      } else {
        // On desktop, show sidebar by default
        setSidebarCollapsed(false);
        setIsMobile(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom function - enhanced for auto-scroll
  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      });
    }
  }, []);

  // Auto-scroll when new messages are added to the selected group (only if user hasn't scrolled up)
  useEffect(() => {
    if (selectedGroup && selectedGroup.messages.length > 0 && !isUserScrolledUp) {
      // Small delay to ensure message is rendered before scrolling
      const timeoutId = setTimeout(() => {
        scrollToBottom(true); // Use smooth scroll for new messages
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedGroup?.messages?.length, selectedGroup?.id, scrollToBottom, isUserScrolledUp]);

  // Auto-scroll when switching groups (immediate scroll)
  useEffect(() => {
    if (selectedGroup && selectedGroup.messages.length > 0) {
      // Immediate scroll when switching groups
      scrollToBottom(false);
      setIsUserScrolledUp(false); // Reset scroll state when switching groups
    }
  }, [selectedGroup?.id, scrollToBottom]);

  // Add scroll event listener to detect when user scrolls up
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50; // 50px threshold
      
      // Update scroll state - user is scrolled up if not at bottom
      setIsUserScrolledUp(!isAtBottom);
    };

    messagesContainer.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
    };
  }, [selectedGroup?.id]); // Re-attach when group changes

  // Group selection handler with WebSocket room management
  const handleGroupSelection = useCallback(async (group: ChatGroup) => {
    console.log('🔄 Switching to group:', group.name, 'ID:', group.id);
    
    // Leave current group if one is selected
    if (selectedGroup && isWebSocketConnected) {
      try {
        await websocketService.leaveGroup(selectedGroup.id, activeUser.id);
        console.log('👈 Left group:', selectedGroup.name);
      } catch (error) {
        console.error('Error leaving group:', error);
      }
    }
    
    // Set the new selected group
    setSelectedGroup(group);
    setShowStarredMessages(false);
    
    // Join new group via WebSocket
    if (isWebSocketConnected) {
      try {
        await websocketService.joinGroup(group.id, activeUser.id);
        console.log('👉 Joined group:', group.name);
        
        // Load recent messages for this group if not already loaded
        if (group.messages.length === 0) {
          try {
            const messagesData = await websocketService.loadGroupMessages(group.id, 50, 0);
            if (messagesData.messages && messagesData.messages.length > 0) {
              const formattedMessages = messagesData.messages.map((msg: any) => ({
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
              
              // Update group with loaded messages
              setGroups(prev => prev.map(g => 
                g.id === group.id 
                  ? { ...g, messages: formattedMessages }
                  : g
              ));
              setSelectedGroup(prev => prev ? { ...prev, messages: formattedMessages } : null);
              console.log('📥 Loaded', formattedMessages.length, 'messages for group:', group.name);
            }
          } catch (error) {
            console.error('Error loading group messages:', error);
          }
        }
      } catch (error) {
        console.error('Error joining group:', error);
      }
    }
    
    // On mobile, collapse sidebar when group is selected
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, [selectedGroup, isWebSocketConnected, activeUser.id]);

  // Functions
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const messageId = Date.now().toString();
    const processedMessage = newMessage.trim();
    
    console.log('🔍 Sending message debug:');
    console.log('  selectedGroup.id:', selectedGroup.id);
    console.log('  activeUser.id:', activeUser.id);
    console.log('  user object:', user);
    console.log('  message content:', processedMessage);
    console.log('  isWebSocketConnected:', isWebSocketConnected);

    const message: ChatMessage = {
      id: messageId,
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      message: processedMessage,
      timestamp: new Date(),
      messageType: 'text',
      status: 'sending',
      isOwn: true, // Explicitly mark as own message
      content: processedMessage,
      replyTo: replyingTo?.id // Add reply reference
    };

    // IMMEDIATELY add message to local state for instant feedback
    setSelectedGroup(prev => prev ? { ...prev, messages: [...prev.messages, message] } : null);
    setGroups(prev => prev.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, messages: [...group.messages, message], lastMessage: processedMessage, lastMessageTime: new Date() }
        : group
    ));
    setNewMessage(''); // Clear input immediately
    setReplyingTo(null); // Clear reply state

    console.log('✅ Message added to local state:', message);

    // Helper function to update message status in both states
    const updateMessageStatus = (status: 'sent' | 'failed') => {
      setSelectedGroup(prev => prev ? {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        )
      } : null);
      setGroups(prev => prev.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, messages: group.messages.map(msg => 
              msg.id === messageId ? { ...msg, status } : msg
            )}
          : group
      ));
    };

    // ALWAYS save to database first via REST API for persistence with retry
    const saveWithRetry = async (retries = 3) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          await sendMessageViaAPI(message, messageId);
          console.log(`✅ Message saved to database via REST API (attempt ${attempt})`);
          updateMessageStatus('sent');
          return true;
        } catch (error) {
          console.error(`❌ Failed to save message (attempt ${attempt}/${retries}):`, error);
          
          if (attempt === retries) {
            // Final attempt failed
            updateMessageStatus('failed');
            console.error('💥 All attempts to save message failed');
            return false;
          } else {
            // Wait before retrying (exponential backoff)
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
            console.log(`⏳ Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      return false;
    };

    // Execute save with retry
    await saveWithRetry();

    // Send via WebSocket for real-time delivery to other users (but don't rely on it for persistence)
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
        console.log('✅ Message broadcasted via WebSocket');
      } catch (error) {
        console.error('⚠️ Failed to broadcast via WebSocket (message still saved):', error);
      }
    } else {
      console.log('⚠️ WebSocket not connected, message saved to database only');
    }

    // Show typing indicator
    if (settings.typingIndicators) {
      setTypingUsers(prev => [...prev, 'demo-user']);
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(id => id !== 'demo-user'));
      }, 2000);
    }

    // Play outgoing sound
    if (settings.outgoingSounds) {
      playRingtone('notification');
    }

    // Update read receipts
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

    // AI Response for Kinap AI chat
    if (selectedGroup.name === 'Kinap AI') {
      console.log('Starting AI response for Kinap AI...');
      React.startTransition(() => {
        setIsAIProcessing(true);
      });

      // Get user profile data for context
      const userProfile = {
        name: user?.displayName || 'Student',
        course: user?.course || 'Not specified',
        year: user?.year || 'Not specified',
        skills: user?.skills || []
      };

      console.log('User profile:', userProfile);
      console.log('Message to send:', processedMessage);

      // Use backend API instead of direct Gemini calls
      try {
        const response = await fetch('http://localhost:5000/api/chatbot/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: processedMessage,
            userProfile: userProfile,
            conversationHistory: selectedGroup.messages.map(msg => ({
              role: msg.userId === activeUser.id ? 'user' : 'assistant',
              content: msg.content || msg.message
            }))
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Backend AI response received:', data);
        
        const aiMessageId = Date.now().toString() + '-ai';
        const aiMessage: ChatMessage = {
          id: aiMessageId,
          userId: 'kinap-ai',
          userName: 'Kinap AI',
          userAvatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
          message: data.message || data.response || data.text,
          timestamp: new Date(),
          messageType: 'text',
          status: 'sent' as const,
          content: data.message || data.response || data.text
        };

        // Send AI message via WebSocket for real-time delivery and persistence
        if (isWebSocketConnected) {
          try {
            await websocketService.sendMessage({
              groupId: selectedGroup.id,
              userId: 'kinap-ai',
              userName: 'Kinap AI',
              content: data.message || data.response || data.text,
              messageType: 'text'
            });
          } catch (error) {
            console.error('Failed to send AI message via WebSocket:', error);
            // Fallback to REST API
            await saveAIMessageViaAPI(aiMessageId, selectedGroup.id, data.message || data.response || data.text, userProfile);
          }
        } else {
          // Fallback to REST API if WebSocket not connected
          await saveAIMessageViaAPI(aiMessageId, selectedGroup.id, data.message || data.response || data.text, userProfile);
        }

        React.startTransition(() => {
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group, messages: [...group.messages, aiMessage] }
              : group
          ));

          setSelectedGroup(prev => prev ? { ...prev, messages: [...prev.messages, aiMessage] } : null);
          setIsAIProcessing(false);
          
          // Auto-scroll for AI response only if user is at bottom
          if (!isUserScrolledUp) {
            setTimeout(() => scrollToBottom(true), 100);
          }
        });

        // Play incoming sound for AI response
        if (settings.incomingSounds) {
          playRingtone('notification');
        }
      } catch (error) {
        console.error('Backend AI Error:', error);
        
        // Fallback response if backend fails
        const fallbackResponse = fallbackResponses.default[Math.floor(Math.random() * fallbackResponses.default.length)];
        
        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '-ai',
          userId: 'kinap-ai',
          userName: 'Kinap AI',
          userAvatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40',
          message: fallbackResponse,
          timestamp: new Date(),
          messageType: 'text',
          status: 'sent' as const,
          content: fallbackResponse
        };

        React.startTransition(() => {
          setGroups(prev => prev.map(group => 
            group.id === selectedGroup.id 
              ? { ...group, messages: [...group.messages, aiMessage] }
              : group
          ));

          setSelectedGroup(prev => prev ? { ...prev, messages: [...prev.messages, aiMessage] } : null);
          setIsAIProcessing(false);
          
          // Auto-scroll for fallback AI response only if user is at bottom
          if (!isUserScrolledUp) {
            setTimeout(() => scrollToBottom(true), 100);
          }
        });

        // Play incoming sound for AI response
        if (settings.incomingSounds) {
          playRingtone('notification');
        }
      }
    }
  };

  const handleTyping = useCallback(() => {
    if (!selectedGroup || !settings.typingIndicators) return;
    
    if (!typingUsers.includes(activeUser.id)) {
      setTypingUsers(prev => [...prev, activeUser.id]);
    }
    
    // Clear existing timeout to prevent multiple timeouts
    const timeoutId = setTimeout(() => {
      setTypingUsers(prev => prev.filter(id => id !== activeUser.id));
    }, 3000);
    
    return () => clearTimeout(timeoutId);
  }, [selectedGroup, settings.typingIndicators, typingUsers, activeUser.id]);

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (files: any[]) => {
    setSelectedFiles(files);
    setShowFileUpload(false);
  };

  const toggleStarMessage = (message: ChatMessage) => {
    if (starredMessages.find(m => m.id === message.id)) {
      setStarredMessages(prev => prev.filter(m => m.id !== message.id));
      // Show unstar notification
      if (settings.messageNotifications) {
        // You can add a toast notification here
        console.log('Message unstarred');
      }
    } else {
      setStarredMessages(prev => [...prev, message]);
      // Show star notification
      if (settings.messageNotifications) {
        // You can add a toast notification here
        console.log('Message starred');
      }
    }
  };

  const joinGroup = (category: string) => {
    const existingGroup = groups.find(g => g.category === category);
    if (existingGroup) {
      setSelectedGroup(existingGroup);
      setShowSettings(false);
      return;
    }
    
    const newGroupData: ChatGroup = {
      id: Date.now().toString(),
      name: category,
      description: `${category} community group`,
      avatar: 'https://via.placeholder.com/40',
      members: 1,
      lastMessage: 'Welcome to the group!',
      lastMessageTime: new Date(),
      unreadCount: 0,
      messages: [],
      admins: [activeUser.id],
      type: 'group',
      category: category
    };
    
    setGroups(prev => [...prev, newGroupData]);
    setSelectedGroup(newGroupData);
    setShowSettings(false);
  };

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleThemeSelect = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
    setShowThemeModal(false);
  };

  const handleWallpaperSelect = (wallpaperId: string) => {
    setSelectedWallpaper(wallpaperId);
    setShowWallpaperModal(false);
    // Save to localStorage
    localStorage.setItem('kinap-wallpaper', wallpaperId);
  };

  const playRingtone = (ringtoneId: string) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const filteredGroups = groups
    .filter(group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Always pin Kinap AI to the top
      if (a.name === 'Kinap AI') return -1;
      if (b.name === 'Kinap AI') return 1;
      
      // Sort by last message time (most recent first)
      const aTime = a.messages.length > 0 ? new Date(a.messages[a.messages.length - 1].timestamp).getTime() : 0;
      const bTime = b.messages.length > 0 ? new Date(b.messages[b.messages.length - 1].timestamp).getTime() : 0;
      return bTime - aTime;
    });

  const filteredSettings = CHAT_SETTINGS.map(setting => {
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
          if (setting.id === 'theme') {
            setShowThemeModal(true);
          } else if (setting.id === 'wallpaper') {
            setShowWallpaperModal(true);
          } else if (setting.id === 'notifications') {
            setSelectedSetting('notifications');
          }
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
            {(setting.id === 'spell_check' || setting.id === 'replace_text_with_emoji') && (
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
                {currentTheme === 'system' ? '🖥️ System default' : currentTheme === 'light' ? '☀️ Light' : '🌙 Dark'}
              </div>
            ) : setting.id === 'wallpaper' ? (
              <div className="text-sm text-ajira-primary dark:text-ajira-accent mt-1 font-medium">
                🎨 {WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper)?.name || 'Default'}
              </div>
            ) : setting.value && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{setting.value}</div>
            )}
            {setting.id === 'spell_check' && (
              <div className="text-xs mt-2 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                {settings.spellCheck
                  ? '✅ Spell check is active. Misspelled words will be underlined.'
                  : '❌ Spell check is off. Enable for writing assistance.'}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {setting.toggle ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Map the setting ID to the correct settings property
                const settingKey = setting.id === 'spell_check' ? 'spellCheck' : 'replaceTextWithEmoji';
                toggleSetting(settingKey as keyof typeof settings);
              }}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 shadow-lg transform hover:scale-105 ${
                (setting.id === 'spell_check' ? settings.spellCheck : settings.replaceTextWithEmoji)
                  ? 'bg-gradient-to-r from-ajira-primary to-ajira-secondary'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                  (setting.id === 'spell_check' ? settings.spellCheck : settings.replaceTextWithEmoji) ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          ) : (
            setting.hasArrow && <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-ajira-primary transition-colors duration-200" />
          )}
        </div>
      </div>
    );
  });

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
      // Delete messages from MongoDB
      const response = await fetch(`http://localhost:5000/api/chat-messages/group/${selectedGroup.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: activeUser.id
        })
      });

      if (response.ok) {
        // Clear messages from local state
        setGroups(prev => prev.map(group => 
          group.id === selectedGroup.id 
            ? { ...group, messages: [] }
            : group
        ));

        setSelectedGroup(prev => prev ? { ...prev, messages: [] } : null);
        
        // Show success message
        console.log('Chat deleted successfully');
      } else {
        console.error('Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setShowDeleteConfirmModal(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''} overflow-hidden relative z-10`}>
      {/* Header */}
      <div className="bg-ajira-primary dark:bg-ajira-primary flex items-center justify-between p-3 sm:p-4 shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            ) : (
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            )}
          </button>
          <h1 className="text-white font-semibold text-base sm:text-lg truncate">Community Hub</h1>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Mobile Search Button */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => {
              // Toggle mobile search - you can implement this functionality
              const searchInput = document.querySelector('.mobile-search-input') as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
              }
            }}
          >
            <Search className="w-4 h-4 text-white" />
          </button>
          
          {/* Desktop Search */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 text-sm w-32 sm:w-48 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          
          <div className="relative">
            <button
              ref={menuRef}
              onClick={(e) => {
                e.stopPropagation();
                setShowMainMenu(!showMainMenu);
              }}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
            
            {/* Main Menu Dropdown */}
            {showMainMenu && (
              <div className="menu-dropdown absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[100] animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setShowStarredMessages(true);
                    setShowMainMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-t-lg text-sm sm:text-base"
                >
                  Starred messages
                </button>

                <button
                  onClick={() => {
                    setShowSettings(true);
                    setShowMainMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm sm:text-base"
                >
                  Settings
                </button>

                <button
                  onClick={handleDeleteChat}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium rounded-b-lg text-sm sm:text-base"
                >
                  Delete chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (shown when search button is clicked) */}
      <div className="sm:hidden bg-ajira-primary/90 backdrop-blur-sm px-3 py-2 border-t border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mobile-search-input w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/30"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'w-0 lg:w-80' : 'w-full lg:w-80'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden`}>
          {/* Sidebar Header */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Chats</h2>
              <button 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="New group"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search or start new chat"
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ajira-primary/50 focus:border-ajira-primary"
              />
            </div>
          </div>

          {/* Groups List */}
          <div className="flex-1 overflow-y-auto">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleGroupSelection(group)}
                  className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors touch-manipulation ${
                    selectedGroup?.id === group.id
                      ? 'bg-ajira-primary/10 dark:bg-ajira-primary/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                      />
                      {group.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {group.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                          {formatTime(group.lastMessageTime)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {group.lastMessage}
                        </p>
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
              ))
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">No chats yet</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start a conversation with Kinap AI or join a group to begin chatting.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Sidebar */}
        {showSettings && (
          <div className={`flex flex-col w-full lg:w-80 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 relative z-10 h-full shadow-xl ${selectedSetting && selectedSetting !== '' && isMobile ? 'hidden' : 'block'}`}>
            {/* Settings Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gradient-to-r from-ajira-primary to-ajira-secondary">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-xl font-bold text-white tracking-wide">Settings</h2>
                <div className="w-10"></div>
              </div>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search settings..."
                    value={settingsSearchQuery}
                    onChange={(e) => setSettingsSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Settings Categories */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                  {activeUser.avatar ? (
                    <img
                      src={activeUser.avatar}
                      alt={activeUser.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-ajira-primary/20"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-ajira-primary to-ajira-secondary rounded-full flex items-center justify-center ring-4 ring-ajira-primary/20 shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {activeUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{activeUser.name}</h3>
                    <p className="text-sm text-ajira-primary dark:text-ajira-accent font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      {activeUser.status === 'online' ? 'Active now' : getStatusDisplay(activeUser.status)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {SETTINGS_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedSetting(category.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md ${
                        selectedSetting === category.id
                          ? 'bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${
                        selectedSetting === category.id
                          ? 'bg-white/20'
                          : 'bg-gradient-to-br from-ajira-primary/10 to-ajira-secondary/10'
                      }`}>
                        <category.icon className={`w-5 h-5 ${
                          selectedSetting === category.id ? 'text-white' : 'text-ajira-primary'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold">{category.name}</div>
                        <div className={`text-sm ${
                          selectedSetting === category.id
                            ? 'text-white/80'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>{category.description}</div>
                      </div>
                      {selectedSetting !== category.id && (
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Content */}
        {showSettings && (
          <div className={`flex-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 ${selectedSetting && selectedSetting !== '' ? 'block' : 'hidden lg:block'}`}>
            {/* Mobile Back Button for Settings Content */}
            <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button
                onClick={() => setSelectedSetting('')}
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-ajira-primary dark:hover:text-ajira-accent transition-all duration-200 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back to Settings</span>
              </button>
            </div>
            <div className="p-8">
              {selectedSetting === 'chats' && (
                <>
                  <div className="flex items-center gap-4 mb-8 p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="p-3 bg-gradient-to-br from-ajira-primary to-ajira-secondary rounded-2xl shadow-lg">
                      <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chat Settings</h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">Customize your chat experience</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredSettings}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div 
          className={`${showSettings ? 'hidden' : 'flex'} flex-1 flex-col ${sidebarCollapsed ? 'block' : 'hidden lg:block'} relative min-h-0`}
          style={{ 
            backgroundColor: WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper)?.color || '#f0f2f5',
            height: '100vh', // Ensure full viewport height
            maxHeight: '100vh' // Prevent overflow
          }}
        >
          {/* Doodles Pattern Overlay */}
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
          {showStarredMessages ? (
            <>
              {/* Starred Messages Header */}
              <div className="bg-ajira-primary p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowStarredMessages(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-ajira-primary font-semibold text-xs sm:text-sm">★</span>
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-white text-sm sm:text-base truncate">Starred messages</h2>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Starred Messages Content */}
              <div className="flex-1 flex items-center justify-center p-3 sm:p-4 relative">
                {starredMessages.length > 0 ? (
                  <div className="w-full max-w-2xl">
                    <div className="space-y-3 sm:space-y-4">
                      {starredMessages.map((message, index) => (
                        <div
                          key={message.id || index}
                          className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-ajira-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-sm">
                                {message.userName ? message.userName.charAt(0).toUpperCase() : 'U'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {message.userName || 'Unknown User'}
                                </h3>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.timestamp).toLocaleDateString()}
                                  </span>
                                  <button
                                    onClick={() => toggleStarMessage(message)}
                                    className="text-ajira-primary hover:text-ajira-primary/80 transition-colors"
                                  >
                                    ★
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                {message.content || message.message}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>
                                  {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {message.status && (
                                  <span className="flex items-center gap-1">
                                    {message.status === 'read' ? '✓✓' : '✓'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center px-4 flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl sm:text-4xl text-gray-500">★</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No starred messages</h3>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                      <Settings className="w-4 h-4" />
                      <span>Use your account  on your phone to see older chats and messages.</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : selectedGroup ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
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
                        {selectedGroup.name === 'Kinap AI' ? (
                          isAIProcessing ? (
                            <span className="flex items-center gap-1">
                              <div className="w-1 h-1 bg-ajira-primary rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-ajira-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-1 h-1 bg-ajira-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <span className="ml-1">AI is thinking...</span>
                            </span>
                          ) : (
                            '🤖 AI Assistant - Always ready to help'
                          )
                        ) : (
                          `${selectedGroup.members} members`
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowChatMenu(!showChatMenu)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    </button>
                    
                    {/* Chat Menu Dropdown */}
                    {showChatMenu && (
                      <div className="chat-menu-dropdown absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[100] animate-in slide-in-from-top-2 duration-200">
                        <button
                          onClick={() => {
                            setShowChatMenu(false);
                            // Add search functionality here
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-t-lg text-sm sm:text-base"
                        >
                          Search messages
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
              </div>

              {/* Chat Content Container */}
              <div className="flex-1 flex flex-col min-h-0 max-h-full">
                {/* Messages */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth relative bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800"
                  style={{ 
                    scrollBehavior: 'smooth',
                    minHeight: '0', // Important for flex children
                    maxHeight: 'calc(100vh - 200px)' // Reserve space for header and input
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
                    </div>
                  )}
                  
                  {/* Messages */}
                  {selectedGroup.messages.map((message, index) => {
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
                        className={`flex ${message.userId === activeUser.id ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4 px-2 sm:px-0`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${
                            message.userId === activeUser.id
                              ? 'bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white rounded-br-md'
                              : message.userName === 'Kinap AI'
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-bl-md shadow-lg'
                              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'
                          }`}
                        >
                          {/* Message header */}
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <span className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                              {message.userId === activeUser.id ? (
                                <>
                                  <span>You</span>
                                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></span>
                                </>
                              ) : message.userName === 'Kinap AI' ? (
                                <>
                                  <span>🤖 Kinap AI</span>
                                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1z" clipRule="evenodd" />
                                  </svg>
                                </>
                              ) : (
                                message.userName
                              )}
                            </span>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              <span className="text-xs opacity-75">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {message.userId === activeUser.id && settings.readReceipts && (
                                <span className="text-xs opacity-75">
                                  {message.status === 'read' ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Reply context */}
                          {message.replyTo && (
                            <div 
                              className="mb-2 p-2 bg-black/10 dark:bg-white/10 rounded-lg border-l-2 border-current cursor-pointer hover:bg-black/20 dark:hover:bg-white/20 transition-colors touch-manipulation"
                              onClick={() => {
                                // Find the replied message element and scroll to it
                                const repliedMessage = selectedGroup.messages.find(m => m.id === message.replyTo);
                                if (repliedMessage) {
                                  const messageElements = document.querySelectorAll('[data-message-id]');
                                  const targetElement = Array.from(messageElements).find(el => 
                                    el.getAttribute('data-message-id') === message.replyTo
                                  );
                                  if (targetElement) {
                                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    // Highlight the message briefly
                                    targetElement.classList.add('ring-2', 'ring-ajira-primary', 'ring-opacity-50');
                                    setTimeout(() => {
                                      targetElement.classList.remove('ring-2', 'ring-ajira-primary', 'ring-opacity-50');
                                    }, 2000);
                                  }
                                }
                              }}
                              title="Click to view original message"
                            >
                              {(() => {
                                const repliedMessage = selectedGroup.messages.find(m => m.id === message.replyTo);
                                if (repliedMessage) {
                                  return (
                                    <div>
                                      <div className="text-xs opacity-75 mb-1">
                                        Replying to {repliedMessage.userName}
                                      </div>
                                      <div className="text-xs opacity-90 truncate">
                                        {repliedMessage.content || repliedMessage.message}
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div className="text-xs opacity-75">
                                      Replying to a message
                                    </div>
                                  );
                                }
                              })()}
                            </div>
                          )}
                          
                          {/* Message content */}
                          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                          
                          {/* Message actions */}
                          <div className="flex items-center justify-end gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleStarMessage(message)}
                              className="text-xs opacity-60 hover:opacity-100 transition-opacity p-1 rounded touch-manipulation"
                              title={starredMessages.some(sm => sm.id === message.id) ? 'Unstar message' : 'Star message'}
                            >
                              {starredMessages.some(sm => sm.id === message.id) ? '★' : '☆'}
                            </button>
                            
                            {message.userId !== activeUser.id && (
                              <button 
                                className="text-xs opacity-60 hover:opacity-100 transition-opacity p-1 rounded touch-manipulation"
                                title="Reply"
                                onClick={() => setReplyingTo(message)}
                              >
                                ↩️
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Typing indicator */}
                  {typingUsers.length > 0 && settings.typingIndicators && (
                    <div className="flex justify-start mb-4 px-2 sm:px-0">
                      <div className="max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-bl-md">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Processing Indicator */}
                  {isAIProcessing && selectedGroup?.name === 'Kinap AI' && (
                    <div className="flex justify-start mb-4 px-2 sm:px-0">
                      <div className="max-w-[85%] sm:max-w-[75%] lg:max-w-[60%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-600/10 border border-purple-200 dark:border-purple-700 rounded-bl-md">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">🤖 Kinap AI is thinking...</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Analyzing your question and preparing a helpful response</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} className="h-1" />
                </div>

                {/* Message Input */}
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex-shrink-0 relative z-[9999]">
                  {/* File Upload Area */}
                  {showFileUpload && (
                    <div className="mb-3 sm:mb-4">
                      <FileUpload
                        onFileSelect={setSelectedFiles}
                        maxFiles={5}
                        maxSize={50}
                        uploadContext="chat"
                        uploadedBy="user"
                      />
                    </div>
                  )}

                  <div className="flex items-end gap-2 sm:gap-3">
                    {/* Attach File Button */}
                    <div className="relative flex-shrink-0">
                      <button 
                        onClick={() => setShowFileUpload(!showFileUpload)}
                        className="p-2 sm:p-3 text-gray-500 hover:text-ajira-primary dark:text-gray-400 dark:hover:text-ajira-accent transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation"
                        title="Attach file"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </button>
                    </div>
                  
                    <div className="flex-1 relative">
                      {/* Reply Preview */}
                      {replyingTo && (
                        <div className="mb-2 p-3 bg-gray-100 dark:bg-gray-700 border-l-4 border-ajira-primary rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              Replying to {replyingTo.userName}
                            </span>
                            <button
                              onClick={() => setReplyingTo(null)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded touch-manipulation"
                              title="Cancel reply"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {replyingTo.message || replyingTo.content}
                          </p>
                        </div>
                      )}
                      
                      <textarea
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value);
                          if (settings.typingIndicators) {
                            handleTyping();
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && settings.enterToSend) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={selectedGroup?.name === 'Kinap AI' ? "💬 Ask Kinap AI anything..." : "💬 Type a message..."}
                        rows={1}
                        className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent resize-none text-sm sm:text-base leading-relaxed bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg touch-manipulation"
                        style={{
                          minHeight: window.innerWidth < 640 ? '44px' : '48px',
                          maxHeight: window.innerWidth < 640 ? '100px' : '120px'
                        }}
                      />
                      
                      {/* Emoji Picker */}
                      {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-2 z-50">
                          <EmojiPicker
                            onEmojiSelect={handleEmojiSelect}
                            onClose={() => setShowEmojiPicker(false)}
                            position="top"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Emoji Button */}
                    <button 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 sm:p-3 text-gray-500 hover:text-ajira-primary dark:text-gray-400 dark:hover:text-ajira-accent transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation flex-shrink-0"
                      title="Add emoji"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    
                    {/* Send Button */}
                    {newMessage.trim() ? (
                      <button
                        onClick={handleSendMessage}
                        disabled={isAIProcessing}
                        className="p-2 sm:p-3 bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex-shrink-0 relative z-[10000]"
                        title="Send message"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    ) : (
                      <button 
                        className="p-2 sm:p-3 text-gray-500 dark:text-gray-400 rounded-xl touch-manipulation flex-shrink-0 relative z-[10000]"
                        title="Record voice message"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Mobile Typing Hint */}
                  {selectedGroup?.name === 'Kinap AI' && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center sm:hidden">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        💡 Tip: Ask about programming, career advice, or study help
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to Community Hub</h3>
                    <p className="text-gray-600 dark:text-gray-400">Select a group to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleThemeSelect('light')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  currentTheme === 'light'
                    ? 'border-ajira-primary bg-ajira-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-gray-900 dark:text-white">Light</span>
                {currentTheme === 'light' && (
                  <div className="w-4 h-4 bg-ajira-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
              
              <button
                onClick={() => handleThemeSelect('dark')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  currentTheme === 'dark'
                    ? 'border-ajira-primary bg-ajira-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-gray-900 dark:text-white">Dark</span>
                {currentTheme === 'dark' && (
                  <div className="w-4 h-4 bg-ajira-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
              
              <button
                onClick={() => handleThemeSelect('system')}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  currentTheme === 'system'
                    ? 'border-ajira-primary bg-ajira-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-gray-900 dark:text-white">System default</span>
                {currentTheme === 'system' && (
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
                Cancel
              </button>
              <button
                onClick={() => setShowThemeModal(false)}
                className="px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors"
              >
                OK
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