import React, { useState, useEffect, useRef } from 'react';
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
  Users,
  ArrowRight,

  // WhatsApp-style interface icons
  Paperclip,
  Send,
  Smile,
  Camera,
  FileText,
  Image,
  Video,
  Music,
  File,
  Phone,
  Video as VideoIcon,
  CornerUpLeft,
  Circle,
  CircleDot,
  Download
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { groupsApi } from '../../api/groups';
import { kinapAIApi } from '../../api/chat';
import socketService from '../../services/socket';

type Theme = 'light' | 'dark' | 'system';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  isOwn?: boolean;
  messageType: 'text' | 'image' | 'file' | 'video' | 'system' | 'audio' | 'document';
  status: 'sending' | 'sent' | 'delivered' | 'read';
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
  { id: 'display', name: 'Display', isHeader: true },
  { id: 'theme', name: 'Theme', hasArrow: true },
  { id: 'wallpaper', name: 'Wallpaper', hasArrow: true },
  { id: 'chat_settings', name: 'Chat settings', isHeader: true },
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

// 1. Add default wallpapers and colors at the top of the file:
const DEFAULT_WALLPAPERS = [
  { id: 'wa1', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
  { id: 'wa2', url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80' },
  { id: 'wa3', url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80' },
  { id: 'wa4', url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80' },
  { id: 'wa5', url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80' },
  { id: 'color1', color: '#efeae2' },
  { id: 'color2', color: '#d2f8d2' },
  { id: 'color3', color: '#f5e1fd' },
  { id: 'color4', color: '#fffbe7' },
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
  const [privacySettings, setPrivacySettings] = useState(() => {
    const saved = localStorage.getItem('kinap-privacy-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading privacy settings:', error);
      }
    }
    return {
      profileVisibility: 'Everyone',
      onlineStatus: true
    };
  });
  const [joiningGroup, setJoiningGroup] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
  
  // File upload states
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<ChatMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // File input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('kinap-chat-settings');
    const defaultSettings = {
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
    };
    
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        return { ...defaultSettings, ...parsedSettings };
      } catch (error) {
        console.error('Error loading settings:', error);
        return defaultSettings;
      }
    }
    
    return defaultSettings;
  });



  const menuRef = useRef<HTMLButtonElement>(null);

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

  // Demo data
  const demoUsers: User[] = [
    { id: '1', name: 'John Doe', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: '2', name: 'Jane Smith', avatar: 'https://via.placeholder.com/40', status: 'online' },
    { id: '3', name: 'Bob Johnson', avatar: 'https://via.placeholder.com/40', status: 'away' }
  ];

  const activeUser = demoUsers[0];

  const demoGroups: ChatGroup[] = [
    {
      id: '1',
      name: 'Web Development',
      description: 'Web development discussions',
      avatar: 'https://via.placeholder.com/40',
      members: 15,
      lastMessage: 'Check out this new React tutorial...',
      lastMessageTime: new Date(),
      unreadCount: 2,
      messages: [
        {
          id: '1',
          userId: '1',
          userName: 'John Doe',
          userAvatar: 'https://via.placeholder.com/40',
          message: 'Hello everyone!',
          timestamp: new Date(Date.now() - 3600000),
          messageType: 'text',
          status: 'read',
          content: 'Hello everyone!'
        },
        {
          id: '2',
          userId: '2',
          userName: 'Jane Smith',
          userAvatar: 'https://via.placeholder.com/40',
          message: 'Hi John!',
          timestamp: new Date(Date.now() - 1800000),
          messageType: 'text',
          status: 'read',
          content: 'Hi John!'
        },

      ],
      admins: ['1'],
      type: 'group',
      category: 'Web Development'
    },
    {
      id: '2',
      name: 'Mobile Development',
      description: 'Mobile app development discussions',
      avatar: 'https://via.placeholder.com/40',
      members: 8,
      lastMessage: 'Anyone working with Flutter?',
      lastMessageTime: new Date(Date.now() - 1200000),
      unreadCount: 0,
      messages: [],
      admins: ['1'],
      type: 'group',
      category: 'Mobile Development'
    }
  ];

  const ringtones = [
    { id: 'default', name: 'Default', description: 'Default notification sound' },
    { id: 'notification', name: 'Notification', description: 'Standard notification' },
    { id: 'chime', name: 'Chime', description: 'Gentle chime sound' },
    { id: 'bell', name: 'Bell', description: 'Classic bell sound' }
  ];

  // Load persistent data from localStorage on component mount
  useEffect(() => {
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

    // Load chat groups with messages
    const loadGroups = async () => {
      const savedGroups = localStorage.getItem('kinap-chat-groups');
      let currentGroups: ChatGroup[] = [];
      
      if (savedGroups) {
        try {
          const parsedGroups = JSON.parse(savedGroups);
          // Convert date strings back to Date objects
          currentGroups = parsedGroups.map((group: any) => ({
            ...group,
            lastMessageTime: new Date(group.lastMessageTime),
            messages: group.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
        } catch (error) {
          console.error('Error loading chat groups:', error);
          currentGroups = demoGroups;
        }
      } else {
        // If no saved groups, start with demo groups and save them
        currentGroups = demoGroups;
        localStorage.setItem('kinap-chat-groups', JSON.stringify(demoGroups));
      }

      // Ensure we always have at least one group for testing
      if (currentGroups.length === 0) {
        currentGroups = [demoGroups[0]]; // Always keep at least the first demo group
        localStorage.setItem('kinap-chat-groups', JSON.stringify(currentGroups));
      }

      setGroups(currentGroups);

      // Load user's groups from API (but don't override existing groups)
      try {
        const userId = 'demo-user-id'; // In real app, get from auth context
        const response = await fetch(`/api/groups/user/${userId}`);
        if (response.ok) {
          const apiGroups = await response.json();
          const formattedGroups = apiGroups.map((group: any) => ({
            id: group._id,
            name: group.name,
            description: group.description,
            avatar: 'https://via.placeholder.com/40',
            members: group.members?.length || 0,
            lastMessage: 'Welcome to the group!',
            lastMessageTime: new Date(group.createdAt),
            unreadCount: 0,
            messages: [],
            admins: group.admins || [],
            type: 'group' as const,
            category: group.category
          }));

          // Merge API groups with existing groups (only add new ones)
          setGroups((prev: ChatGroup[]) => {
            const merged = [...prev];
            formattedGroups.forEach((apiGroup: any) => {
              const exists = merged.find(g => g.id === apiGroup.id || g.category === apiGroup.category);
              if (!exists) {
                merged.push(apiGroup);
              }
            });
            return merged;
          });
        }
      } catch (error) {
        console.error('Error loading groups from API:', error);
        // If API fails, we still have our local groups
      }
    };

    loadGroups();
    
    // Ensure we always have at least one group for testing
    const ensureDefaultGroup = () => {
      const savedGroups = localStorage.getItem('kinap-chat-groups');
      if (!savedGroups || JSON.parse(savedGroups).length === 0) {
        const defaultGroup = demoGroups[0];
        localStorage.setItem('kinap-chat-groups', JSON.stringify([defaultGroup]));
        setGroups([defaultGroup]);
      }
    };
    
    // Check after a short delay to ensure groups are loaded
    setTimeout(ensureDefaultGroup, 1000);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-chat-settings', JSON.stringify(settings));
    setTimeout(() => setIsSaving(false), 500);
  }, [settings]);

  // Save privacy settings to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-privacy-settings', JSON.stringify(privacySettings));
    setTimeout(() => setIsSaving(false), 500);
  }, [privacySettings]);

  // Save media auto-download settings to localStorage whenever they change
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-media-auto-download', JSON.stringify(mediaAutoDownload));
    setTimeout(() => setIsSaving(false), 500);
  }, [mediaAutoDownload]);

  // Save media quality setting to localStorage whenever it changes
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-media-quality', selectedMediaQuality);
    setTimeout(() => setIsSaving(false), 500);
  }, [selectedMediaQuality]);

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
    if (groups.length > 0) { // Only save if we have groups
      setIsSaving(true);
      localStorage.setItem('kinap-chat-groups', JSON.stringify(groups));
      setTimeout(() => setIsSaving(false), 500);
    }
  }, [groups]);

  // Save privacy settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kinap-privacy-settings', JSON.stringify(privacySettings));
  }, [privacySettings]);

  // Save media auto-download settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kinap-media-auto-download', JSON.stringify(mediaAutoDownload));
  }, [mediaAutoDownload]);

  // Save media quality setting to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kinap-media-quality', selectedMediaQuality);
  }, [selectedMediaQuality]);

  // Socket.IO Integration for Real-time Messaging
  useEffect(() => {
    // Initialize Socket.IO connection
    const activeUser = {
      id: 'demo-user-id',
      name: 'Demo User',
      avatar: 'https://via.placeholder.com/40/1B4F72/FFFFFF?text=U'
    };

    // Connect to Socket.IO
    const socket = socketService.connect(activeUser.id, activeUser.name, activeUser.avatar);

    // Listen for incoming messages
    socketService.on('message', (messageData: ChatMessage) => {
      setGroups(prevGroups => {
        return prevGroups.map(group => {
          if (group.id === messageData.groupId) {
            return {
              ...group,
              messages: [...group.messages, messageData],
              lastMessage: messageData.content || messageData.message,
              lastMessageTime: new Date()
            };
          }
          return group;
        });
      });
    });

    // Listen for typing indicators
    socketService.on('user_typing', ({ groupId, userId, userName }) => {
      setGroups(prevGroups => {
        return prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              isTyping: true,
              typingUsers: [...(group.typingUsers || []), userName]
            };
          }
          return group;
        });
      });
    });

    socketService.on('user_stop_typing', ({ groupId, userId }) => {
      setGroups(prevGroups => {
        return prevGroups.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              isTyping: false,
              typingUsers: (group.typingUsers || []).filter(user => user !== userId)
            };
          }
          return group;
        });
      });
    });

    // Listen for user join/leave events
    socketService.on('user_joined', ({ groupId, userName }) => {
      console.log(`${userName} joined group ${groupId}`);
    });

    socketService.on('user_left', ({ groupId, userName }) => {
      console.log(`${userName} left group ${groupId}`);
    });

    // Listen for message reactions
    socketService.on('reaction_added', ({ messageId, userId, reaction }) => {
      setGroups(prevGroups => {
        return prevGroups.map(group => {
          return {
            ...group,
            messages: group.messages.map(msg => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  reactions: [...(msg.reactions || []), { emoji: reaction, users: [userId] }]
                };
              }
              return msg;
            })
          };
        });
      });
    });

    // Listen for message edits
    socketService.on('message_edited', ({ messageId, newContent, userId }) => {
      setGroups(prevGroups => {
        return prevGroups.map(group => {
          return {
            ...group,
            messages: group.messages.map(msg => {
              if (msg.id === messageId) {
                return {
                  ...msg,
                  content: newContent,
                  message: newContent,
                  isEdited: true
                };
              }
              return msg;
            })
          };
        });
      });
    });

    // Listen for message deletions
    socketService.on('message_deleted', ({ messageId, userId }) => {
      setGroups(prevGroups => {
        return prevGroups.map(group => {
          return {
            ...group,
            messages: group.messages.filter(msg => msg.id !== messageId)
          };
        });
      });
    });

    // Listen for online/offline status
    socketService.on('user_online', ({ userId, userName, userAvatar }) => {
      console.log(`${userName} is now online`);
    });

    socketService.on('user_offline', ({ userId }) => {
      console.log(`User ${userId} is now offline`);
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Click outside handler for menu and other dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Close main menu
      if (menuRef.current && !menuRef.current.contains(target)) {
        if (!target.closest('.menu-dropdown')) {
          setShowMainMenu(false);
        }
      }
      
      // Close attachment menu
      if (!target.closest('.attachment-menu')) {
        setShowAttachmentMenu(false);
      }
      
      // Close emoji picker
      if (!target.closest('.emoji-picker')) {
        setShowEmojiPicker(false);
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

  // Functions
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const processedMessage = settings.replaceTextWithEmoji 
      ? newMessage
          .replace(/:\/\)/g, '😊')
          .replace(/lol/g, '😂')
          .replace(/rofl/g, '🤣')
          .replace(/omg/g, '😱')
          .replace(/wow/g, '😮')
          .replace(/cool/g, '😎')
          .replace(/sad/g, '😢')
          .replace(/cry/g, '😭')
          .replace(/love/g, '❤️')
          .replace(/heart/g, '❤️')
          .replace(/thumbs up/g, '👍')
          .replace(/thumbs down/g, '👎')
          .replace(/ok/g, '👌')
          .replace(/fire/g, '🔥')
          .replace(/100/g, '💯')
          .replace(/clap/g, '👏')
          .replace(/pray/g, '🙏')
          .replace(/eyes/g, '👀')
          .replace(/brain/g, '🧠')
          .replace(/party/g, '🎉')
          .replace(/music/g, '🎵')
          .replace(/coffee/g, '☕')
          .replace(/pizza/g, '🍕')
          .replace(/beer/g, '🍺')
          .replace(/wine/g, '🍷')
          .replace(/cake/g, '🎂')
          .replace(/gift/g, '🎁')
          .replace(/star/g, '⭐')
          .replace(/moon/g, '🌙')
          .replace(/sun/g, '☀️')
          .replace(/rain/g, '🌧️')
          .replace(/snow/g, '❄️')
          .replace(/rocket/g, '🚀')
          .replace(/car/g, '🚗')
          .replace(/plane/g, '✈️')
          .replace(/boat/g, '🚢')
          .replace(/train/g, '🚂')
          .replace(/bike/g, '🚲')
          .replace(/walk/g, '🚶')
          .replace(/run/g, '🏃')
          .replace(/sleep/g, '😴')
          .replace(/wake/g, '😴')
          .replace(/work/g, '💼')
          .replace(/study/g, '📚')
          .replace(/code/g, '💻')
          .replace(/bug/g, '🐛')
          .replace(/fix/g, '🔧')
          .replace(/test/g, '🧪')
          .replace(/deploy/g, '🚀')
          .replace(/git/g, '📝')
          .replace(/merge/g, '🔀')
          .replace(/commit/g, '💾')
          .replace(/push/g, '⬆️')
          .replace(/pull/g, '⬇️')
          .replace(/branch/g, '🌿')
          .replace(/repo/g, '📦')
          .replace(/api/g, '🔌')
          .replace(/db/g, '🗄️')
          .replace(/server/g, '🖥️')
          .replace(/client/g, '💻')
          .replace(/frontend/g, '🎨')
          .replace(/backend/g, '⚙️')
          .replace(/fullstack/g, '🔄')
          .replace(/devops/g, '🔧')
          .replace(/cloud/g, '☁️')
          .replace(/docker/g, '🐳')
          .replace(/kubernetes/g, '☸️')
          .replace(/aws/g, '☁️')
          .replace(/azure/g, '☁️')
          .replace(/gcp/g, '☁️')
          .replace(/react/g, '⚛️')
          .replace(/vue/g, '💚')
          .replace(/angular/g, '🅰️')
          .replace(/node/g, '🟢')
          .replace(/python/g, '🐍')
          .replace(/java/g, '☕')
          .replace(/javascript/g, '📜')
          .replace(/typescript/g, '📘')
          .replace(/html/g, '🌐')
          .replace(/css/g, '🎨')
          .replace(/sql/g, '🗄️')
          .replace(/mongodb/g, '🍃')
          .replace(/postgres/g, '🐘')
          .replace(/mysql/g, '🐬')
          .replace(/redis/g, '🔴')
          .replace(/elasticsearch/g, '🔍')
          .replace(/kafka/g, '📨')
          .replace(/rabbitmq/g, '🐰')
          .replace(/nginx/g, '🌐')
          .replace(/apache/g, '🦅')
          .replace(/linux/g, '🐧')
          .replace(/windows/g, '🪟')
          .replace(/mac/g, '🍎')
          .replace(/ios/g, '📱')
          .replace(/android/g, '🤖')
          .replace(/flutter/g, '🦋')
          .replace(/swift/g, '🐦')
          .replace(/kotlin/g, '🔶')
          .replace(/dart/g, '🎯')
          .replace(/go/g, '🐹')
          .replace(/rust/g, '🦀')
          .replace(/c\+\+/g, '⚡')
          .replace(/c#/g, '🔷')
          .replace(/php/g, '🐘')
          .replace(/ruby/g, '💎')
          .replace(/scala/g, '🔴')
          .replace(/haskell/g, 'λ')
          .replace(/lisp/g, '📝')
          .replace(/prolog/g, '🔍')
          .replace(/erlang/g, '📞')
          .replace(/elixir/g, '💜')
          .replace(/clojure/g, '🍃')
          .replace(/f#/g, '🔷')
          .replace(/ocaml/g, '🐫')
          .replace(/nim/g, '👑')
          .replace(/zig/g, '⚡')
          .replace(/v/g, '🔵')
          .replace(/crystal/g, '💎')
          .replace(/julia/g, '🔷')
          .replace(/r/g, '📊')
          .replace(/matlab/g, '📈')
          .replace(/octave/g, '📊')
          .replace(/sas/g, '📊')
          .replace(/spss/g, '📊')
          .replace(/stata/g, '📊')
          .replace(/excel/g, '📊')
          .replace(/tableau/g, '📊')
          .replace(/powerbi/g, '📊')
          .replace(/looker/g, '📊')
          .replace(/metabase/g, '📊')
          .replace(/grafana/g, '📊')
          .replace(/kibana/g, '📊')
          .replace(/datadog/g, '🐕')
          .replace(/newrelic/g, '📊')
          .replace(/sentry/g, '🚨')
          .replace(/loggly/g, '📝')
          .replace(/papertrail/g, '📝')
          .replace(/sumologic/g, '📊')
          .replace(/splunk/g, '📊')
          .replace(/prometheus/g, '📊')
          .replace(/influxdb/g, '📊')
          .replace(/timescaledb/g, '📊')
          .replace(/clickhouse/g, '📊')
          .replace(/bigquery/g, '📊')
          .replace(/snowflake/g, '❄️')
          .replace(/redshift/g, '📊')
          .replace(/databricks/g, '📊')
          .replace(/airflow/g, '🌪️')
          .replace(/luigi/g, '🍕')
          .replace(/prefect/g, '🌊')
          .replace(/dagster/g, '💎')
          .replace(/mlflow/g, '🧪')
          .replace(/kubeflow/g, '☸️')
          .replace(/tensorflow/g, '🧠')
          .replace(/pytorch/g, '🔥')
          .replace(/keras/g, '🧠')
          .replace(/scikit/g, '🔬')
          .replace(/pandas/g, '🐼')
          .replace(/numpy/g, '🔢')
          .replace(/matplotlib/g, '📊')
          .replace(/seaborn/g, '📊')
          .replace(/plotly/g, '📊')
          .replace(/bokeh/g, '📊')
          .replace(/dash/g, '📊')
          .replace(/streamlit/g, '📊')
          .replace(/gradio/g, '📊')
          .replace(/fastapi/g, '⚡')
          .replace(/django/g, '🐍')
          .replace(/flask/g, '🍶')
          .replace(/express/g, '🚂')
          .replace(/koa/g, '🌲')
          .replace(/hapi/g, '🎯')
          .replace(/sails/g, '⛵')
          .replace(/meteor/g, '☄️')
          .replace(/strapi/g, '🎯')
          .replace(/ghost/g, '👻')
          .replace(/wordpress/g, '📝')
          .replace(/drupal/g, '💧')
          .replace(/joomla/g, '🎯')
          .replace(/magento/g, '🛒')
          .replace(/shopify/g, '🛒')
          .replace(/woocommerce/g, '🛒')
          .replace(/prestashop/g, '🛒')
          .replace(/opencart/g, '🛒')
          .replace(/oscommerce/g, '🛒')
          .replace(/zencart/g, '🛒')
          .replace(/bigcommerce/g, '🛒')
          .replace(/squarespace/g, '🛒')
          .replace(/wix/g, '🛒')
          .replace(/webflow/g, '🛒')
          .replace(/bubble/g, '🛒')
          .replace(/airtable/g, '📊')
          .replace(/notion/g, '📝')
          .replace(/slack/g, '💬')
          .replace(/discord/g, '🎮')
          .replace(/teams/g, '👥')
          .replace(/zoom/g, '📹')
          .replace(/meet/g, '📹')
          .replace(/skype/g, '📞')
          .replace(/telegram/g, '📱')
          .replace(/signal/g, '📱')
          .replace(/whatsapp/g, '📱')
          .replace(/wechat/g, '📱')
          .replace(/line/g, '📱')
          .replace(/kakao/g, '📱')
          .replace(/viber/g, '📱')
          .replace(/snapchat/g, '👻')
          .replace(/instagram/g, '📷')
          .replace(/facebook/g, '📘')
          .replace(/twitter/g, '🐦')
          .replace(/linkedin/g, '💼')
          .replace(/github/g, '🐙')
          .replace(/gitlab/g, '🦊')
          .replace(/bitbucket/g, '🪣')
          .replace(/jira/g, '🎯')
          .replace(/confluence/g, '📚')
          .replace(/trello/g, '📋')
          .replace(/asana/g, '📋')
          .replace(/monday/g, '📋')
          .replace(/clickup/g, '📋')
          .replace(/roam/g, '🧠')
          .replace(/obsidian/g, '💎')
          .replace(/logseq/g, '📝')
          .replace(/remnote/g, '📝')
          .replace(/roamresearch/g, '🧠')
          .replace(/amplenote/g, '📝')
          .replace(/bear/g, '🐻')
          .replace(/ulysses/g, '📝')
          .replace(/scrivener/g, '📝')
          .replace(/typora/g, '📝')
          .replace(/markdown/g, '📝')
          .replace(/latex/g, '📝')
          .replace(/mathjax/g, '📝')
          .replace(/katex/g, '📝')
          .replace(/mermaid/g, '📊')
          .replace(/plantuml/g, '📊')
          .replace(/drawio/g, '📊')
          .replace(/figma/g, '🎨')
          .replace(/sketch/g, '🎨')
          .replace(/adobe/g, '🎨')
          .replace(/photoshop/g, '🎨')
          .replace(/indesign/g, '🎨')
          .replace(/premiere/g, '🎬')
          .replace(/aftereffects/g, '🎬')
          .replace(/blender/g, '🎬')
          .replace(/maya/g, '🎬')
          .replace(/3dsmax/g, '🎬')
          .replace(/cinema4d/g, '🎬')
          .replace(/houdini/g, '🎬')
          .replace(/nuke/g, '🎬')
          .replace(/davinci/g, '🎬')
          .replace(/finalcut/g, '🎬')
          .replace(/imovie/g, '🎬')
          .replace(/openshot/g, '🎬')
          .replace(/kdenlive/g, '🎬')
          .replace(/shotcut/g, '🎬')
          .replace(/lightworks/g, '🎬')
          .replace(/resolve/g, '🎬')
          .replace(/vegas/g, '🎬')
          .replace(/camtasia/g, '🎬')
          .replace(/obs/g, '🎬')
          .replace(/streamlabs/g, '🎬')
          .replace(/xsplit/g, '🎬')
          .replace(/wirecast/g, '🎬')
          .replace(/vimeo/g, '🎬')
          .replace(/youtube/g, '📺')
          .replace(/twitch/g, '🎮')
          .replace(/mixer/g, '🎮')
          .replace(/tiktok/g, '📱')
          .replace(/pinterest/g, '📌')
          .replace(/reddit/g, '🤖')
          .replace(/hackernews/g, '📰')
          .replace(/producthunt/g, '🚀')
          .replace(/indiehackers/g, '🚀')
          .replace(/devto/g, '📝')
          .replace(/medium/g, '📝')
          .replace(/substack/g, '📝')
          .replace(/hashnode/g, '📝')
          .replace(/squarespace/g, '🛒')
          .replace(/wix/g, '🛒')
          .replace(/webflow/g, '🛒')
          .replace(/bubble/g, '🛒')
          .replace(/airtable/g, '📊')
          .replace(/notion/g, '📝')
          .replace(/slack/g, '💬')
          .replace(/discord/g, '🎮')
          .replace(/teams/g, '👥')
          .replace(/zoom/g, '📹')
          .replace(/meet/g, '📹')
          .replace(/skype/g, '📞')
          .replace(/telegram/g, '📱')
          .replace(/signal/g, '📱')
          .replace(/whatsapp/g, '📱')
          .replace(/wechat/g, '📱')
          .replace(/line/g, '📱')
          .replace(/kakao/g, '📱')
          .replace(/viber/g, '📱')
          .replace(/snapchat/g, '👻')
          .replace(/instagram/g, '📷')
          .replace(/facebook/g, '📘')
          .replace(/twitter/g, '🐦')
          .replace(/linkedin/g, '💼')
          .replace(/github/g, '🐙')
          .replace(/gitlab/g, '🦊')
          .replace(/bitbucket/g, '🪣')
          .replace(/jira/g, '🎯')
          .replace(/confluence/g, '📚')
          .replace(/trello/g, '📋')
          .replace(/asana/g, '📋')
          .replace(/monday/g, '📋')
          .replace(/clickup/g, '📋')
          .replace(/roam/g, '🧠')
          .replace(/obsidian/g, '💎')
          .replace(/logseq/g, '📝')
          .replace(/remnote/g, '📝')
          .replace(/roamresearch/g, '🧠')
          .replace(/amplenote/g, '📝')
          .replace(/bear/g, '🐻')
          .replace(/ulysses/g, '📝')
          .replace(/scrivener/g, '📝')
          .replace(/typora/g, '📝')
          .replace(/markdown/g, '📝')
          .replace(/latex/g, '📝')
          .replace(/mathjax/g, '📝')
          .replace(/katex/g, '📝')
          .replace(/mermaid/g, '📊')
          .replace(/plantuml/g, '📊')
          .replace(/drawio/g, '📊')
          .replace(/figma/g, '🎨')
          .replace(/sketch/g, '🎨')
          .replace(/adobe/g, '🎨')
          .replace(/photoshop/g, '🎨')
          .replace(/indesign/g, '🎨')
          .replace(/premiere/g, '🎬')
          .replace(/aftereffects/g, '🎬')
          .replace(/blender/g, '🎬')
          .replace(/maya/g, '🎬')
          .replace(/3dsmax/g, '🎬')
          .replace(/cinema4d/g, '🎬')
          .replace(/houdini/g, '🎬')
          .replace(/nuke/g, '🎬')
          .replace(/davinci/g, '🎬')
          .replace(/finalcut/g, '🎬')
          .replace(/imovie/g, '🎬')
          .replace(/openshot/g, '🎬')
          .replace(/kdenlive/g, '🎬')
          .replace(/shotcut/g, '🎬')
          .replace(/lightworks/g, '🎬')
          .replace(/resolve/g, '🎬')
          .replace(/vegas/g, '🎬')
          .replace(/camtasia/g, '🎬')
          .replace(/obs/g, '🎬')
          .replace(/streamlabs/g, '🎬')
          .replace(/xsplit/g, '🎬')
          .replace(/wirecast/g, '🎬')
          .replace(/vimeo/g, '🎬')
          .replace(/youtube/g, '📺')
          .replace(/twitch/g, '🎮')
          .replace(/mixer/g, '🎮')
          .replace(/tiktok/g, '📱')
          .replace(/pinterest/g, '📌')
          .replace(/reddit/g, '🤖')
          .replace(/hackernews/g, '📰')
          .replace(/producthunt/g, '🚀')
          .replace(/indiehackers/g, '🚀')
          .replace(/devto/g, '📝')
          .replace(/medium/g, '📝')
          .replace(/substack/g, '📝')
          .replace(/hashnode/g, '📝')
      : newMessage;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      message: processedMessage,
      timestamp: new Date(),
      isOwn: true,
      messageType: 'text',
      status: 'sending',
      replyTo: replyToMessage?.id,
      content: processedMessage
    };

    // Send message via Socket.IO for real-time communication
    if (selectedGroup && socketService.isSocketConnected()) {
      socketService.sendGroupMessage(
        selectedGroup.id,
        activeUser.id,
        processedMessage,
        'text',
        activeUser.name
      );
    }

    // Add to selected group
    setSelectedGroup(prev => {
      if (!prev) return null;
      const updatedGroup = { ...prev, messages: [...prev.messages, message] };
      
      // Save to localStorage immediately
      const updatedGroups = groups.map(group => 
        group.id === selectedGroup.id ? updatedGroup : group
      );
      localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
      
      return updatedGroup;
    });
    
    // Update groups state
    setGroups(prev => {
      const updatedGroups = prev.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, messages: [...group.messages, message] }
          : group
      );
      // Save to localStorage
      localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
      return updatedGroups;
    });

    // Clear input and reply
    setNewMessage('');
    setReplyToMessage(null);

    // Simulate message delivery (grey double tick)
    setTimeout(() => {
      setSelectedGroup(prev => {
        if (!prev) return null;
        const updatedGroup = { ...prev, messages: prev.messages.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' as const } : msg
        )};
        
        // Save to localStorage
        const updatedGroups = groups.map(group => 
          group.id === selectedGroup.id ? updatedGroup : group
        );
        localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
        
        return updatedGroup;
      });
    }, 1500);

    // Simulate message read (blue double tick)
    setTimeout(() => {
      setSelectedGroup(prev => {
        if (!prev) return null;
        const updatedGroup = { ...prev, messages: prev.messages.map(msg => 
          msg.id === message.id ? { ...msg, status: 'read' as const } : msg
        )};
        
        // Save to localStorage
        const updatedGroups = groups.map(group => 
          group.id === selectedGroup.id ? updatedGroup : group
        );
        localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
        
        return updatedGroup;
      });
    }, 3000);

    // Play sound if enabled
    if (settings.sound) {
      playRingtone('message');
    }
  };

  const handleTyping = () => {
    if (!selectedGroup || !settings.typingIndicators) return;
    
    // Send typing indicator via Socket.IO
    if (socketService.isSocketConnected()) {
      socketService.startTyping(selectedGroup.id, activeUser.id, activeUser.name);
    }
    
    if (!typingUsers.includes(activeUser.id)) {
      setTypingUsers(prev => [...prev, activeUser.id]);
    }
    
    setTimeout(() => {
      setTypingUsers(prev => prev.filter(id => id !== activeUser.id));
      
      // Stop typing indicator via Socket.IO
      if (socketService.isSocketConnected()) {
        socketService.stopTyping(selectedGroup.id, activeUser.id);
      }
    }, 3000);
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

  const joinGroup = async (category: string) => {
    try {
      console.log('Attempting to join group:', category);
      
      // Check if user is already a member
      const isAlreadyMember = groups.some(g => g.category === category);
      
      if (isAlreadyMember) {
        console.log('Already a member of this group');
        return; // Already a member
      }

      setJoiningGroup(category);

      // For demo purposes, using a mock userId
      // In a real app, this would come from the auth context
      const userId = 'demo-user-id';

      // Try API call first, fallback to localStorage if it fails
      try {
        console.log('Making API call to join group...');
        const response = await fetch(`/api/groups/join/${category}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('API response:', result);
          
          // Create new group for this category
          const newGroup: ChatGroup = {
            id: result.group._id || Date.now().toString(),
            name: result.group.name || `${category} Community`,
            description: result.group.description || `${category.toLowerCase()} discussions and community`,
            avatar: 'https://via.placeholder.com/40',
            members: result.group.members?.length || 1,
            lastMessage: 'Welcome to the group!',
            lastMessageTime: new Date(),
            unreadCount: 0,
            messages: [],
            admins: result.group.admins || ['1'],
            type: 'group',
            category: category
          };

          setGroups(prev => {
            const updatedGroups = [...prev, newGroup];
            // Immediately save to localStorage to ensure persistence
            localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
            return updatedGroups;
          });

          // Join Socket.IO room for real-time messaging
          if (socketService.isSocketConnected()) {
            socketService.joinGroup(newGroup.id, activeUser.id, activeUser.name);
          }

          console.log('Successfully joined group via API');
          setJoinSuccess(category);
          setTimeout(() => setJoinSuccess(null), 3000);
          
          // Add join notification to the newly joined group
          addJoinNotification('Demo User', `${category} Community`, newGroup.id);
        } else {
          console.error('API call failed, falling back to localStorage');
          throw new Error('API call failed');
        }
      } catch (apiError) {
        console.log('API call failed, using localStorage fallback:', apiError);
        
        // Fallback to localStorage only
        const newGroup: ChatGroup = {
          id: Date.now().toString(),
          name: `${category} Community`,
          description: `${category.toLowerCase()} discussions and community`,
          avatar: 'https://via.placeholder.com/40',
          members: 1,
          lastMessage: 'Welcome to the group!',
          lastMessageTime: new Date(),
          unreadCount: 0,
          messages: [],
          admins: ['1'],
          type: 'group',
          category: category
        };

        setGroups(prev => {
          const updatedGroups = [...prev, newGroup];
          // Immediately save to localStorage to ensure persistence
          localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
          return updatedGroups;
        });
        
                  console.log('Successfully joined group via localStorage');
          setJoinSuccess(category);
          setTimeout(() => setJoinSuccess(null), 3000);
          
          // Add join notification to the newly joined group
          addJoinNotification('Demo User', `${category} Community`, newGroup.id);
      }
    } catch (error) {
      console.error('Error joining group:', error);
    } finally {
      setJoiningGroup(null);
    }
  };

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings((prev: typeof settings) => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleThemeSelect = (theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
    setShowThemeModal(false);
  };

  // 2. Add state for uploaded wallpaper:
  const [uploadedWallpaper, setUploadedWallpaper] = useState<string | null>(null);
  const uploadWallpaperInputRef = useRef<HTMLInputElement>(null);

  // 3. Update handleWallpaperSelect to support uploaded images and persist:
  const handleWallpaperSelect = (wallpaperIdOrUrl: string) => {
    setSelectedWallpaper(wallpaperIdOrUrl);
    setShowWallpaperModal(false);
    localStorage.setItem('kinap-wallpaper', wallpaperIdOrUrl);
  };

  // 4. Add upload handler:
  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedWallpaper(url);
      handleWallpaperSelect(url);
    }
  };

  // 5. On mount, load wallpaper from localStorage:
  useEffect(() => {
    const savedWallpaper = localStorage.getItem('kinap-wallpaper');
    if (savedWallpaper) {
      setSelectedWallpaper(savedWallpaper);
      if (savedWallpaper.startsWith('blob:')) setUploadedWallpaper(savedWallpaper);
    }
  }, []);

  // 6. In the wallpaper modal, show default wallpapers, colors, upload, and remove:
  // (Replace the modal content for wallpaper selection with this)
  {showWallpaperModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Wallpaper</h3>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {DEFAULT_WALLPAPERS.map(wp => (
            <button
              key={wp.id}
              onClick={() => handleWallpaperSelect(wp.url || wp.color!)}
              className={`h-16 w-16 rounded-lg border-2 ${selectedWallpaper === (wp.url || wp.color) ? 'border-ajira-primary' : 'border-transparent'}`}
              style={wp.color ? { background: wp.color } : { backgroundImage: `url(${wp.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
          ))}
          {uploadedWallpaper && (
            <button
              onClick={() => handleWallpaperSelect(uploadedWallpaper)}
              className={`h-16 w-16 rounded-lg border-2 ${selectedWallpaper === uploadedWallpaper ? 'border-ajira-primary' : 'border-transparent'}`}
              style={{ backgroundImage: `url(${uploadedWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              title="Your uploaded wallpaper"
            />
          )}
        </div>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => uploadWallpaperInputRef.current?.click()}
            className="px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors"
          >
            Upload Wallpaper
          </button>
          <button
            onClick={() => { setSelectedWallpaper(''); setShowWallpaperModal(false); localStorage.removeItem('kinap-wallpaper'); setUploadedWallpaper(null); }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Remove Wallpaper
          </button>
        </div>
        <input
          ref={uploadWallpaperInputRef}
          type="file"
          accept="image/*"
          onChange={handleWallpaperUpload}
          className="hidden"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowWallpaperModal(false)}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowWallpaperModal(false)}
            className="px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )}

  const playRingtone = (ringtoneId: string) => {
    try {
      // Create audio context with fallback for older browsers
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      // Resume audio context if suspended (required for mobile devices)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const gainNode = audioContext.createGain();
      gainNode.connect(audioContext.destination);
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
      
      // 30 WhatsApp-style ringtones with cross-device compatibility
      const ringtones: { [key: string]: { frequencies: number[], durations: number[], type?: string } } = {
        // Classic WhatsApp Sounds
        'default': {
          frequencies: [800, 1000, 1200],
          durations: [0.1, 0.1, 0.2]
        },
        'notification': {
          frequencies: [523.25, 659.25, 783.99], // C5, E5, G5 chord
          durations: [0.15, 0.15, 0.3]
        },
        'message': {
          frequencies: [800, 1000],
          durations: [0.1, 0.2]
        },
        'call': {
          frequencies: [440, 554.37, 659.25, 783.99], // A4, C#5, E5, G5
          durations: [0.2, 0.2, 0.2, 0.4]
        },
        'group': {
          frequencies: [600, 800, 1000, 1200],
          durations: [0.1, 0.1, 0.1, 0.3]
        },
        
        // Modern Notification Sounds
        'gentle': {
          frequencies: [523.25, 659.25],
          durations: [0.3, 0.5]
        },
        'chime': {
          frequencies: [1046.50, 1318.51, 1567.98], // C6, E6, G6
          durations: [0.2, 0.2, 0.4]
        },
        'urgent': {
          frequencies: [400, 600, 800, 1000, 1200],
          durations: [0.08, 0.08, 0.08, 0.08, 0.2]
        },
        'soft': {
          frequencies: [440, 523.25],
          durations: [0.4, 0.6]
        },
        'bright': {
          frequencies: [659.25, 783.99, 987.77], // E5, G5, B5
          durations: [0.15, 0.15, 0.3]
        },
        
        // Musical Tones
        'melody1': {
          frequencies: [523.25, 659.25, 783.99, 987.77], // C5, E5, G5, B5
          durations: [0.2, 0.2, 0.2, 0.4]
        },
        'melody2': {
          frequencies: [440, 554.37, 659.25, 783.99, 987.77], // A4, C#5, E5, G5, B5
          durations: [0.15, 0.15, 0.15, 0.15, 0.3]
        },
        'melody3': {
          frequencies: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6
          durations: [0.2, 0.2, 0.2, 0.4]
        },
        'melody4': {
          frequencies: [440, 523.25, 659.25, 783.99], // A4, C5, E5, G5
          durations: [0.25, 0.25, 0.25, 0.5]
        },
        'melody5': {
          frequencies: [659.25, 783.99, 987.77, 1174.66], // E5, G5, B5, D6
          durations: [0.15, 0.15, 0.15, 0.3]
        },
        
        // Alert Sounds
        'alert1': {
          frequencies: [800, 600, 800, 1000],
          durations: [0.1, 0.1, 0.1, 0.2]
        },
        'alert2': {
          frequencies: [1000, 800, 1000, 1200],
          durations: [0.1, 0.1, 0.1, 0.2]
        },
        'alert3': {
          frequencies: [600, 800, 1000, 1200, 1000],
          durations: [0.08, 0.08, 0.08, 0.08, 0.2]
        },
        'alert4': {
          frequencies: [400, 600, 800, 1000, 1200],
          durations: [0.06, 0.06, 0.06, 0.06, 0.2]
        },
        'alert5': {
          frequencies: [1200, 1000, 800, 600],
          durations: [0.1, 0.1, 0.1, 0.2]
        },
        
        // Nature-Inspired Sounds
        'bird': {
          frequencies: [1046.50, 1318.51, 1567.98, 1760.00], // C6, E6, G6, A6
          durations: [0.2, 0.2, 0.2, 0.4]
        },
        'wind': {
          frequencies: [440, 523.25, 659.25],
          durations: [0.3, 0.3, 0.5]
        },
        'water': {
          frequencies: [523.25, 659.25, 783.99, 987.77],
          durations: [0.25, 0.25, 0.25, 0.5]
        },
        'forest': {
          frequencies: [440, 554.37, 659.25],
          durations: [0.4, 0.4, 0.6]
        },
        'ocean': {
          frequencies: [523.25, 659.25, 783.99],
          durations: [0.3, 0.3, 0.5]
        },
        
        // Tech-Inspired Sounds
        'digital1': {
          frequencies: [800, 1000, 1200, 1400],
          durations: [0.1, 0.1, 0.1, 0.2]
        },
        'digital2': {
          frequencies: [600, 800, 1000, 1200, 1400],
          durations: [0.08, 0.08, 0.08, 0.08, 0.2]
        },
        'digital3': {
          frequencies: [400, 600, 800, 1000, 1200, 1400],
          durations: [0.06, 0.06, 0.06, 0.06, 0.06, 0.2]
        },
        'digital4': {
          frequencies: [1400, 1200, 1000, 800],
          durations: [0.1, 0.1, 0.1, 0.2]
        },
        'digital5': {
          frequencies: [800, 1000, 1200, 1000, 800],
          durations: [0.1, 0.1, 0.1, 0.1, 0.2]
        },
        
        // Minimal Sounds
        'minimal1': {
          frequencies: [523.25],
          durations: [0.3]
        },
        'minimal2': {
          frequencies: [659.25],
          durations: [0.3]
        },
        'minimal3': {
          frequencies: [783.99],
          durations: [0.3]
        },
        'minimal4': {
          frequencies: [440, 659.25],
          durations: [0.2, 0.4]
        },
        'minimal5': {
          frequencies: [523.25, 783.99],
          durations: [0.2, 0.4]
        }
      };
      
      const ringtone = ringtones[ringtoneId] || ringtones['default'];
      let currentTime = audioContext.currentTime;
      
      // Create oscillators for each frequency
      ringtone.frequencies.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const envelope = audioContext.createGain();
        
        oscillator.connect(envelope);
        envelope.connect(gainNode);
        
        // Set frequency
        oscillator.frequency.setValueAtTime(frequency, currentTime);
        
        // Create envelope for smoother sound
        envelope.gain.setValueAtTime(0, currentTime);
        envelope.gain.linearRampToValueAtTime(0.3, currentTime + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.01, currentTime + ringtone.durations[index]);
        
        oscillator.start(currentTime);
        oscillator.stop(currentTime + ringtone.durations[index]);
        
        currentTime += ringtone.durations[index];
      });
      
    } catch (error) {
      console.warn('Audio playback failed:', error);
      // Fallback: try using HTML5 Audio API for older devices
      try {
        const audio = new Audio();
        audio.volume = 0.3;
        // Create a simple beep using data URL
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (fallbackError) {
        console.warn('Fallback audio also failed:', fallbackError);
      }
    }
  };



  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSettings = CHAT_SETTINGS.map(setting => {
    // Handle header items (Display and Chat settings)
    if (setting.isHeader) {
      return (
        <div
          key={setting.id}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
        >
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            {setting.name}
          </div>
        </div>
      );
    }
    
    if (setting.id === 'media_upload_quality') {
      return (
        <div
          key={setting.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setShowMediaQualityModal(true)}
        >
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">{setting.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedMediaQuality === 'hd' ? 'HD' : 'Standard'}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      );
    }
    if (setting.id === 'media_auto_download') {
      return (
        <div
          key={setting.id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setShowMediaAutoDownloadModal(true)}
        >
          <div className="flex-1">
            <div className="font-medium text-gray-900 dark:text-white">{setting.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Auto-download media files</div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      );
    }
    return (
      <div
        key={setting.id}
        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
        <div className="flex-1">
          <div className="font-medium text-gray-900 dark:text-white">{setting.name}</div>
          {setting.description && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{setting.description}</div>
          )}
          {setting.id === 'theme' ? (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{currentTheme === 'system' ? 'System default' : currentTheme === 'light' ? 'Light' : 'Dark'}</div>
          ) : setting.id === 'wallpaper' ? (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper)?.name || 'Default'}
            </div>
          ) : setting.value && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{setting.value}</div>
          )}
          {setting.id === 'spell_check' && (
            <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
              {settings.spellCheck
                ? 'Spell check is active. Misspelled words will be underlined.'
                : 'Spell check is off. Enable for writing assistance.'}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {setting.toggle ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Map the setting ID to the correct settings property
                const settingKey = setting.id === 'spell_check' ? 'spellCheck' : 'replaceTextWithEmoji';
                toggleSetting(settingKey as keyof typeof settings);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                (setting.id === 'spell_check' ? settings.spellCheck : settings.replaceTextWithEmoji)
                  ? 'bg-ajira-primary'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  (setting.id === 'spell_check' ? settings.spellCheck : settings.replaceTextWithEmoji) ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          ) : (
            setting.hasArrow && <ArrowRight className="w-5 h-5 text-gray-400" />
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

  // Handle privacy settings changes
  const handlePrivacySettingChange = (setting: string, value: string | boolean) => {
    const newSettings = { ...privacySettings, [setting]: value };
    setPrivacySettings(newSettings);
    localStorage.setItem('kinap-privacy-settings', JSON.stringify(newSettings));
  };

  // File upload functions
  const handleFileUpload = async (file: File, type: 'image' | 'video' | 'file') => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Convert file to base64 for persistent storage
      const fileUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
      
      // Determine file size
      const fileSize = file.size < 1024 * 1024 
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

      // Create message
      const fileMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: activeUser.id,
        userName: activeUser.name,
        userAvatar: activeUser.avatar,
        message: file.name,
        timestamp: new Date(),
        isOwn: true,
        messageType: type,
        status: 'sent',
        mediaUrl: fileUrl,
        fileSize: fileSize,
        content: file.name
      };

      // Simulate upload completion
      setTimeout(() => {
        setUploadProgress(100);
        setIsUploading(false);

        // Add to selected group
        if (selectedGroup) {
          setSelectedGroup(prev => {
            if (!prev) return null;
            const updatedGroup = { ...prev, messages: [...prev.messages, fileMessage] };
            
            // Save to localStorage immediately
            const updatedGroups = groups.map(group => 
              group.id === selectedGroup.id ? updatedGroup : group
            );
            localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
            
            return updatedGroup;
          });
          
          // Update groups state
          setGroups(prev => {
            const updatedGroups = prev.map(group => 
              group.id === selectedGroup.id 
                ? { ...group, messages: [...group.messages, fileMessage] }
                : group
            );
            // Save to localStorage
            localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
            return updatedGroups;
          });

          // Simulate message delivery (grey double tick)
          setTimeout(() => {
            setSelectedGroup(prev => {
              if (!prev) return null;
              const updatedGroup = { ...prev, messages: prev.messages.map(msg => 
                msg.id === fileMessage.id ? { ...msg, status: 'delivered' as const } : msg
              )};
              
              // Save to localStorage
              const updatedGroups = groups.map(group => 
                group.id === selectedGroup.id ? updatedGroup : group
              );
              localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
              
              return updatedGroup;
            });
          }, 1500);

          // Simulate message read (blue double tick)
          setTimeout(() => {
            setSelectedGroup(prev => {
              if (!prev) return null;
              const updatedGroup = { ...prev, messages: prev.messages.map(msg => 
                msg.id === fileMessage.id ? { ...msg, status: 'read' as const } : msg
              )};
              
              // Save to localStorage
              const updatedGroups = groups.map(group => 
                group.id === selectedGroup.id ? updatedGroup : group
              );
              localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
              
              return updatedGroup;
            });
          }, 3000);
        }
      }, 1000);

    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
      alert('Error uploading file. Please try again.');
    }
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'file') => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, type);
    }
    event.target.value = '';
  };

  // Join notification function
  const addJoinNotification = (userName: string, groupName: string, groupId: string) => {
    const joinMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'system',
      userName: 'System',
      userAvatar: '',
      message: `${userName} joined ${groupName}`,
      timestamp: new Date(),
      messageType: 'system',
      status: 'sent',
      content: `${userName} joined ${groupName}`
    };

    // Add notification to the specific group that was joined
    setGroups(prev => {
      const updatedGroups = prev.map(group => 
        group.id === groupId 
          ? { ...group, messages: [...group.messages, joinMessage] }
          : group
      );
      
      // Save to localStorage
      localStorage.setItem('kinap-chat-groups', JSON.stringify(updatedGroups));
      
      // If this group is currently selected, update selectedGroup as well
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(prev => prev ? { ...prev, messages: [...prev.messages, joinMessage] } : null);
      }
      
      return updatedGroups;
    });
  };

  // Reply to message function
  const handleReply = (message: ChatMessage) => {
    setReplyToMessage(message);
  };

  // Cancel reply function
  const cancelReply = () => {
    setReplyToMessage(null);
  };

  // Emoji picker function
  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Media viewer states
  const [viewingMedia, setViewingMedia] = useState<{
    type: 'image' | 'video' | 'document';
    url: string;
    fileName?: string;
    fileSize?: string;
  } | null>(null);

  // Chat options menu states
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  // AI Chat states
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [aiInputMessage, setAiInputMessage] = useState('');
  const [aiConversationId, setAiConversationId] = useState<string>('');

  // Message search states
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<ChatMessage[]>([]);

  // Media viewer functions
  const openMediaViewer = (media: {
    type: 'image' | 'video' | 'document';
    url: string;
    fileName?: string;
    fileSize?: string;
  }) => {
    setViewingMedia(media);
  };

  const closeMediaViewer = () => {
    setViewingMedia(null);
  };

  // Handle escape key to close media viewer and chat options
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewingMedia) {
          closeMediaViewer();
        }
        if (showChatOptions) {
          setShowChatOptions(false);
        }
        if (isSelectMode) {
          setIsSelectMode(false);
          setSelectedMessages([]);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [viewingMedia, showChatOptions, isSelectMode]);

  // Handle click outside to close chat options
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showChatOptions && !target.closest('.chat-options-dropdown')) {
        setShowChatOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showChatOptions]);

  // Chat options functions
  const toggleChatOptions = () => {
    setShowChatOptions(!showChatOptions);
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedMessages([]);
    setShowChatOptions(false);
  };

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const clearChat = () => {
    if (selectedGroup) {
      setSelectedGroup(prev => prev ? { ...prev, messages: [] } : null);
      setGroups(prev => prev.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, messages: [] }
          : group
      ));
      localStorage.setItem('kinap-chat-groups', JSON.stringify(groups.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, messages: [] }
          : group
      )));
    }
    setShowChatOptions(false);
  };

  const deleteChat = () => {
    if (selectedGroup) {
      setGroups(prev => prev.filter(group => group.id !== selectedGroup.id));
      setSelectedGroup(null);
      localStorage.setItem('kinap-chat-groups', JSON.stringify(groups.filter(group => group.id !== selectedGroup.id)));
    }
    setShowChatOptions(false);
  };

  const muteNotifications = () => {
    if (selectedGroup) {
      setSelectedGroup(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null);
      setGroups(prev => prev.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, isMuted: !group.isMuted }
          : group
      ));
      localStorage.setItem('kinap-chat-groups', JSON.stringify(groups.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, isMuted: !group.isMuted }
          : group
      )));
    }
    setShowChatOptions(false);
  };

  // AI Chat functions
  const handleAISendMessage = async () => {
    if (!aiInputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      message: aiInputMessage,
      timestamp: new Date(),
      isOwn: true,
      messageType: 'text',
      status: 'sent',
      content: aiInputMessage
    };

    // Add user message to AI chat
    setAiMessages(prev => [...prev, userMessage]);
    const currentMessage = aiInputMessage;
    setAiInputMessage('');
    setAiTyping(true);

    try {
      // Call the real Gemini API
      const response = await kinapAIApi.sendMessage(currentMessage, aiConversationId);
      
      // Update conversation ID if it's a new conversation
      if (response.conversationId && !aiConversationId) {
        setAiConversationId(response.conversationId);
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'ai-assistant',
        userName: 'Kinap AI',
        userAvatar: 'https://via.placeholder.com/40/1B4F72/FFFFFF?text=AI',
        message: response.response,
        timestamp: new Date(),
        isOwn: false,
        messageType: 'text',
        status: 'read',
        content: response.response
      };

      setAiMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Kinap AI:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'ai-assistant',
        userName: 'Kinap AI',
        userAvatar: 'https://via.placeholder.com/40/1B4F72/FFFFFF?text=AI',
        message: "I'm sorry, I'm having trouble connecting to my AI capabilities right now. Please try again in a moment.",
        timestamp: new Date(),
        isOwn: false,
        messageType: 'text',
        status: 'read',
        content: "I'm sorry, I'm having trouble connecting to my AI capabilities right now. Please try again in a moment."
      };

      setAiMessages(prev => [...prev, errorMessage]);
    } finally {
      setAiTyping(false);
    }
  };



  const startAIChat = () => {
    setShowAIChat(true);
    setSelectedGroup(null);
    setShowStarredMessages(false);
    // Clear previous conversation and start fresh
    setAiMessages([]);
    setAiConversationId('');
    // On mobile, collapse sidebar when AI chat is selected
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  };

  const clearAIConversation = async () => {
    if (aiConversationId) {
      try {
        await kinapAIApi.clearConversation(aiConversationId);
      } catch (error) {
        console.error('Error clearing AI conversation:', error);
      }
    }
    setAiMessages([]);
    setAiConversationId('');
  };

  // Message search functionality
  const handleMessageSearch = () => {
    if (!searchQuery.trim() || !selectedGroup) return;

    const query = searchQuery.toLowerCase();
    const results = selectedGroup.messages.filter(message => 
      message.content?.toLowerCase().includes(query) ||
      message.message.toLowerCase().includes(query) ||
      message.userName.toLowerCase().includes(query)
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <div className="bg-ajira-primary dark:bg-ajira-primary flex items-center justify-between p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-white" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-white" />
            )}
          </button>
          <h1 className="text-white font-semibold text-lg">Community Hub</h1>
        </div>
        
        <div className="flex items-center gap-2">
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
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
            
            {/* Main Menu Dropdown */}
            {showMainMenu && (
              <div className="menu-dropdown absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[100] animate-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setShowStarredMessages(true);
                    setShowMainMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-t-lg"
                >
                  Starred messages
                </button>

                <button
                  onClick={() => {
                    setShowSettings(true);
                    setShowMainMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    setShowMainMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-b-lg"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden h-screen">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'hidden' : 'flex'} lg:flex flex-col w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 absolute lg:relative z-10 h-full`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chats</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search or start new chat"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ajira-primary"
              />
            </div>
          </div>

          {/* Starred Messages Section - Pinned */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 relative flex-shrink-0">
            <div className="absolute top-2 right-2 w-2 h-2 bg-ajira-primary rounded-full"></div>
            <button
              onClick={() => {
                setShowStarredMessages(true);
                setSelectedGroup(null);
                setShowAIChat(false);
                // On mobile, collapse sidebar when viewing starred messages
                if (window.innerWidth < 1024) {
                  setSidebarCollapsed(true);
                }
              }}
              className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors ${
                showStarredMessages
                  ? 'bg-ajira-primary/10 text-ajira-primary'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-ajira-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">★</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-sm sm:text-base truncate">Starred messages</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {starredMessages.length} message{starredMessages.length !== 1 ? 's' : ''}
                </div>
              </div>
            </button>
          </div>

          {/* AI Chat Section */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 relative flex-shrink-0">
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <button
              onClick={startAIChat}
              className={`w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors ${
                showAIChat
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-900 dark:text-white'
              }`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">AI</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium text-sm sm:text-base truncate">Kinap AI</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Your AI assistant
                </div>
              </div>
            </button>
          </div>

          {/* Groups List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group);
                  setShowStarredMessages(false);
                  setShowAIChat(false);
                  // On mobile, collapse sidebar when group is selected
                  if (window.innerWidth < 1024) {
                    setSidebarCollapsed(true);
                  }
                }}
                className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
                  selectedGroup?.id === group.id
                    ? 'bg-ajira-primary/10 dark:bg-ajira-primary/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">{group.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {group.messages.length > 0
                        ? group.messages[group.messages.length - 1].content
                        : 'No messages yet'}
                    </p>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium ml-2">
                    {group.messages.length > 0
                      ? new Date(group.messages[group.messages.length - 1].timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : ''}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {group.members} members
                  </span>
                  {group.unreadCount > 0 && (
                    <span className="bg-ajira-primary text-white text-xs px-2 py-1 rounded-full">
                      {group.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* User Profile */}
          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-ajira-primary rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                <span className="text-white font-semibold text-xs sm:text-sm">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">Demo User</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  {privacySettings.onlineStatus ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>


        </div>

        {/* Settings Sidebar */}
        {showSettings && (
          <div className={`flex flex-col w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 relative z-10 h-full ${selectedSetting && selectedSetting !== '' && isMobile ? 'hidden' : 'block'}`}>
            {/* Settings Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
                <div className="w-10"></div>
              </div>
              <div className="mt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search settings"
                    value={settingsSearchQuery}
                    onChange={(e) => setSettingsSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ajira-primary"
                  />
                </div>
              </div>
            </div>

            {/* Settings Categories */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-ajira-primary rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-white font-semibold text-lg">D</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Demo User</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">„Füchte dich nicht, denn ich bin mit dir..."</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {SETTINGS_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedSetting(category.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        selectedSetting === category.id
                          ? 'bg-ajira-primary/10 text-ajira-primary'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{category.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Content */}
        {showSettings && (
          <div className={`flex-1 bg-gray-50 dark:bg-gray-900 ${selectedSetting && selectedSetting !== '' ? 'block' : 'hidden lg:block'}`}>
            {/* Mobile Back Button for Settings Content */}
            <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedSetting('')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Settings</span>
              </button>
            </div>
            <div className="p-6">
              {selectedSetting === 'chats' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chat Settings</h2>
                  </div>

                  <div className="space-y-1">
                    {filteredSettings}
                  </div>
                </>
              )}

              {selectedSetting === 'notifications' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Settings</h2>
                  </div>

                  <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                    {/* Message Notifications */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Message Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Message notifications</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Show notifications for new messages</div>
                          </div>
                          <button
                            onClick={() => toggleSetting('messageNotifications')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.messageNotifications ? 'bg-ajira-primary' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.messageNotifications ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Show previews</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Show message content in notifications</div>
                          </div>
                          <button
                            onClick={() => toggleSetting('showPreviews')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.showPreviews ? 'bg-ajira-primary' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.showPreviews ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Sound Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sound Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Incoming sounds</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Play sounds for incoming messages</div>
                          </div>
                          <button
                            onClick={() => toggleSetting('incomingSounds')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.incomingSounds ? 'bg-ajira-primary' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.incomingSounds ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Outgoing sounds</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Play sounds for outgoing messages</div>
                          </div>
                          <button
                            onClick={() => toggleSetting('outgoingSounds')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.outgoingSounds ? 'bg-ajira-primary' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.outgoingSounds ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notification Sound */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notification Sound</h3>
                      <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                        {[
                          'default', 'notification', 'message', 'call', 'group',
                          'gentle', 'chime', 'urgent', 'soft', 'bright',
                          'melody1', 'melody2', 'melody3', 'melody4', 'melody5',
                          'alert1', 'alert2', 'alert3', 'alert4', 'alert5',
                          'bird', 'wind', 'water', 'forest', 'ocean',
                          'digital1', 'digital2', 'digital3', 'digital4', 'digital5'
                        ].map((ringtone) => (
                          <button
                            key={ringtone}
                            onClick={() => {
                              playRingtone(ringtone);
                              setSelectedRingtone(ringtone);
                            }}
                            className={`p-3 text-left rounded-lg border transition-colors ${
                              selectedRingtone === ringtone
                                ? 'border-ajira-primary bg-ajira-primary/10 text-ajira-primary'
                                : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div className="text-sm font-medium capitalize">{ringtone}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Tap to preview</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Notifications */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Notifications</h3>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {/* New Message Notification */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <div className="w-8 h-8 bg-ajira-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900 dark:text-white text-sm">New message from John</h5>
                              <span className="text-xs text-gray-500">2m ago</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                              Hey! How's the project going?
                            </p>
                          </div>
                        </div>
                        
                        {/* Group Notification */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900 dark:text-white text-sm">Web Development Group</h5>
                              <span className="text-xs text-gray-500">5m ago</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                              Jane added you to the group
                            </p>
                          </div>
                        </div>
                        
                        {/* System Notification */}
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Settings className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-900 dark:text-white text-sm">System Update</h5>
                              <span className="text-xs text-gray-500">1h ago</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                              New features available in Community Hub
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-center">
                        <button className="text-ajira-primary hover:text-ajira-primary/80 text-sm font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedSetting === 'account' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Key className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Settings</h2>
                  </div>

                  <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                    {/* Profile Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="w-16 h-16 bg-ajira-primary rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <span className="text-white font-semibold text-xl">D</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">Demo User</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">demo@example.com</p>
                            <p className="text-xs text-gray-500 mt-1">Member since January 2024</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Join Groups */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Join Groups</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        You were automatically added to groups based on your registration interests. 
                        Join additional groups to connect with more communities.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {GROUP_CATEGORIES.map((category) => {
                          const isAlreadyMember = groups.some(g => g.category === category);
                          return (
                            <div
                              key={category}
                              className={`p-4 rounded-lg border transition-colors ${
                                isAlreadyMember
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">{category}</h4>
                                {isAlreadyMember && (
                                  <span className="text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
                                    Member
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {category.toLowerCase()} discussions and community
                              </p>
                              <button
                                onClick={() => joinGroup(category)}
                                disabled={isAlreadyMember || joiningGroup === category}
                                className={`w-full px-3 py-2 text-sm rounded-lg transition-colors ${
                                  isAlreadyMember
                                    ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 cursor-not-allowed'
                                    : joiningGroup === category
                                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                                    : joinSuccess === category
                                    ? 'bg-green-500 text-white cursor-not-allowed'
                                    : 'bg-ajira-primary text-white hover:bg-ajira-primary/90'
                                }`}
                              >
                                {isAlreadyMember 
                                  ? 'Already a Member' 
                                  : joiningGroup === category 
                                  ? 'Joining...' 
                                  : joinSuccess === category 
                                  ? 'Joined Successfully!' 
                                  : 'Join Group'
                                }
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>



                    {/* Privacy Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Privacy</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Profile visibility</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Control who can see your profile information</div>
                          </div>
                          <select 
                            value={privacySettings.profileVisibility}
                            onChange={(e) => handlePrivacySettingChange('profileVisibility', e.target.value)}
                            className="px-3 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ajira-primary"
                          >
                            <option value="Everyone">Everyone</option>
                            <option value="Group members only">Group members only</option>
                            <option value="Friends only">Friends only</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">Online status</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Show when you're online</div>
                          </div>
                          <button
                            onClick={() => handlePrivacySettingChange('onlineStatus', !privacySettings.onlineStatus)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ajira-primary ${
                              privacySettings.onlineStatus ? 'bg-ajira-primary' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                privacySettings.onlineStatus ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>


                  </div>
                </>
              )}

              {selectedSetting === 'keyboard' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Keyboard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Keyboard Shortcuts</h2>
                  </div>

                  <div className="h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                    {/* Navigation Shortcuts */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Navigation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Go to next chat</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + ↓</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Go to previous chat</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + ↑</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Open chat</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Enter</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Close chat</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Esc</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Toggle sidebar</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + B</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Open settings</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + ,</kbd>
                        </div>
                      </div>
                    </div>

                    {/* Messaging Shortcuts */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Messaging</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Send message</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Enter</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">New line</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Shift + Enter</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Focus message input</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + L</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Clear input</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + K</kbd>
                        </div>
                      </div>
                    </div>

                    {/* Search & Filter Shortcuts */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Search & Filter</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Search messages</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + F</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Search chats</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + Shift + F</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Find next</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">F3</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Find previous</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Shift + F3</kbd>
                        </div>
                      </div>
                    </div>

                    {/* Media & Attachments */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Media & Attachments</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Attach file</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + U</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Take photo</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + C</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Record voice</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + V</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Share location</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + G</kbd>
                        </div>
                      </div>
                    </div>

                    {/* Message Actions */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Message Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Reply to message</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">R</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Forward message</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">F</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Star message</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">S</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Delete message</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Delete</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Copy message</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + C</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Edit message</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">E</kbd>
                        </div>
                      </div>
                    </div>

                    {/* Group & Contact Actions */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Group & Contact Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Create new group</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + N</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Add contact</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + A</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">View group info</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + I</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Mute chat</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + M</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Archive chat</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + E</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Pin chat</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + P</kbd>
                        </div>
                      </div>
                    </div>

                    {/* System Actions */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Refresh</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">F5</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Hard refresh</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">Ctrl + F5</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Toggle fullscreen</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">F11</kbd>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Developer tools</span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded">F12</kbd>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Shortcuts */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Mobile Shortcuts</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Swipe to reply</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Swipe left on message</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Swipe to delete</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Swipe right on message</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Long press menu</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Long press on message</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-gray-700 dark:text-gray-300">Pull to refresh</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Pull down chat list</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {showStarredMessages ? (
            <>
              {/* Starred Messages Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  {window.innerWidth < 1024 && (
                    <button
                      onClick={() => setSidebarCollapsed(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Starred messages</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{starredMessages.length} messages</p>
                  </div>
                </div>
              </div>

              {/* Starred Messages Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 relative min-h-0">
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
          ) : showAIChat ? (
            <>
              {/* AI Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  {window.innerWidth < 1024 && (
                    <button
                      onClick={() => setSidebarCollapsed(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">AI</span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Kinap AI</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your AI assistant</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-600 dark:text-blue-400">Online</span>
                </div>
              </div>

              {/* AI Chat Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0"
                style={{ background: '#efeae2' }}
              >
                {aiMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <span className="text-white font-semibold text-lg">AI</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Kinap AI</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                      I'm your AI assistant. I can help with writing, analysis, coding, creative tasks, and answering questions.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Hello', 'Help me write', 'Explain something', 'Code help'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setAiInputMessage(suggestion)}
                          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* AI Chat Header with Clear Button */}
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">AI</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Kinap AI</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">AI Assistant</p>
                        </div>
                      </div>
                      <button
                        onClick={clearAIConversation}
                        className="px-3 py-1 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                      >
                        Clear Chat
                      </button>
                    </div>
                    
                                        {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {aiMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.userId === activeUser.id ? 'justify-end' : 'justify-start'} mb-2`}
                        >
                          <div className="max-w-xs lg:max-w-md">
                            <div
                              className={`px-3 py-2 rounded-2xl shadow-sm max-w-xs lg:max-w-md ${
                                message.userId === activeUser.id
                                  ? 'bg-[#dcf8c6] text-gray-900 ml-auto'
                                  : 'bg-white text-gray-900 shadow-md'
                              }`}
                            >
                              {/* Message header */}
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-700">
                                    {message.userId === activeUser.id ? 'You' : message.userName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  {message.userId === activeUser.id && (
                                    <span className="text-xs text-gray-500 ml-1">✓✓</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Message content */}
                              <p className="text-sm leading-relaxed">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* AI Typing Indicator */}
                      {aiTyping && (
                        <div className="flex justify-start mb-2">
                          <div className="max-w-xs lg:max-w-md">
                            <div className="px-3 py-2 rounded-2xl shadow-sm bg-white text-gray-900 shadow-md">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-700">Kinap AI</span>
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Chat Input */}
              <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={aiInputMessage}
                      onChange={(e) => setAiInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAISendMessage()}
                      placeholder="Message Kinap AI..."
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleAISendMessage}
                    disabled={!aiInputMessage.trim() || aiTyping}
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : selectedGroup ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  {window.innerWidth < 1024 && (
                    <button
                      onClick={() => setSidebarCollapsed(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white text-lg">{selectedGroup.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedGroup.members} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleMessageSearch}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Search className="w-5 h-5 text-gray-500" />
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                    onClick={toggleChatOptions}
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Chat Options Dropdown */}
              {showChatOptions && (
                <div className="absolute top-16 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg min-w-48 chat-options-dropdown">
                  <div className="py-1">
                    <button
                      onClick={toggleSelectMode}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Select messages
                    </button>
                    <button
                      onClick={muteNotifications}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      {selectedGroup?.isMuted ? 'Unmute notifications' : 'Mute notifications'}
                    </button>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={clearChat}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear chat
                    </button>
                    <button
                      onClick={deleteChat}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Delete chat
                    </button>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {showSearchResults && (
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                    </span>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0"
                style={selectedWallpaper ? (selectedWallpaper.startsWith('#') ? { background: selectedWallpaper } : { backgroundImage: `url(${selectedWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }) : { 
                  background: '#efeae2',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              >
                                {(showSearchResults ? searchResults : selectedGroup.messages).map((message: ChatMessage, index: number) => (
                  <div
                    key={index}
                    className={`flex ${message.userId === activeUser.id ? 'justify-end' : 'justify-start'} mb-2 ${
                      isSelectMode ? 'cursor-pointer' : ''
                    }`}
                    onClick={isSelectMode ? () => toggleMessageSelection(message.id) : undefined}
                  >
                    {message.messageType === 'system' ? (
                      // System message (join notification)
                      <div className="flex justify-center w-full my-2">
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-4 py-2 rounded-full shadow-sm">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-xs lg:max-w-md">
                        {/* Reply to message */}
                        {message.replyTo && (
                          <div className={`mb-2 px-3 py-2 rounded-lg text-xs border-l-4 ${
                            message.userId === activeUser.id
                              ? 'bg-white/30 text-white border-white/50'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300'
                          }`}>
                            <div className="font-medium mb-1">Reply to message</div>
                            <div className="truncate opacity-75">Original message content...</div>
                          </div>
                        )}
                        
                        <div
                          className={`px-3 py-2 rounded-2xl shadow-sm max-w-xs lg:max-w-md ${
                            message.userId === activeUser.id
                              ? 'bg-[#dcf8c6] text-gray-900 ml-auto'
                              : 'bg-white text-gray-900 shadow-md'
                          } ${
                            isSelectMode && selectedMessages.includes(message.id)
                              ? 'ring-2 ring-ajira-primary ring-opacity-50'
                              : ''
                          }`}
                        >
                          {/* Message header */}
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {isSelectMode && (
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  selectedMessages.includes(message.id)
                                    ? 'bg-ajira-primary border-ajira-primary'
                                    : 'border-gray-300'
                                }`}>
                                  {selectedMessages.includes(message.id) && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                              )}
                              {message.userId !== activeUser.id && (
                                <span className="text-sm font-semibold text-gray-700">
                                  {message.userName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {message.userId === activeUser.id && (
                                <span className="text-xs ml-1">
                                  {message.status === 'read' ? (
                                    <span className="text-blue-500">✓✓</span>
                                  ) : message.status === 'delivered' ? (
                                    <span className="text-gray-500">✓✓</span>
                                  ) : (
                                    <span className="text-gray-400">✓</span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Message content */}
                          {message.messageType === 'image' ? (
                            <div>
                              <img 
                                src={message.mediaUrl} 
                                alt="Image" 
                                className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity shadow-sm" 
                                onClick={() => openMediaViewer({
                                  type: 'image',
                                  url: message.mediaUrl!,
                                  fileName: message.content
                                })}
                              />
                              {message.content && (
                                <p className="text-sm mt-2 leading-relaxed">{message.content}</p>
                              )}
                            </div>
                          ) : message.messageType === 'video' ? (
                            <div>
                              <video 
                                src={message.mediaUrl} 
                                controls 
                                className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                                onClick={() => openMediaViewer({
                                  type: 'video',
                                  url: message.mediaUrl!,
                                  fileName: message.content
                                })}
                              />
                              {message.content && (
                                <p className="text-sm mt-2 leading-relaxed">{message.content}</p>
                              )}
                            </div>
                          ) : message.messageType === 'file' || message.messageType === 'document' ? (
                            <div 
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors shadow-sm"
                              onClick={() => openMediaViewer({
                                type: 'document',
                                url: message.mediaUrl!,
                                fileName: message.content,
                                fileSize: message.fileSize
                              })}
                            >
                              <FileText className="w-8 h-8 text-gray-500" />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{message.content}</div>
                                <div className="text-xs text-gray-500 mt-1">{message.fileSize}</div>
                              </div>
                              <Download className="w-5 h-5 text-gray-500" />
                            </div>
                          ) : (
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          )}
                          
                          {/* Message actions */}
                          <div className="flex items-center justify-between mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReply(message);
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              Reply
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStarMessage(message);
                              }}
                              className={`text-xs transition-all duration-200 ${
                                starredMessages.some(sm => sm.id === message.id) 
                                  ? 'text-yellow-500 opacity-100 scale-110' 
                                  : 'text-gray-400 hover:text-yellow-500 opacity-70 hover:opacity-100'
                              }`}
                              title={starredMessages.some(sm => sm.id === message.id) ? 'Unstar message' : 'Star message'}
                            >
                              {starredMessages.some(sm => sm.id === message.id) ? '★' : '☆'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing indicator */}
                {typingUsers.length > 0 && settings.typingIndicators && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600">Someone is typing</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-3">
                {/* Reply to message */}
                {replyToMessage && (
                  <div className="bg-gray-100 rounded-lg p-2 mb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Reply to {replyToMessage.userName}</div>
                        <div className="text-sm text-gray-700 truncate">{replyToMessage.content}</div>
                      </div>
                      <button
                        onClick={cancelReply}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  {/* Attachment button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    
                    {/* Attachment menu */}
                    {showAttachmentMenu && (
                      <div className="attachment-menu absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]">
                        <button
                          onClick={() => {
                            imageInputRef.current?.click();
                            setShowAttachmentMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-left"
                        >
                          <Image className="w-4 h-4 text-green-500" />
                          <span>Photo</span>
                        </button>
                        <button
                          onClick={() => {
                            videoInputRef.current?.click();
                            setShowAttachmentMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-left"
                        >
                          <Video className="w-4 h-4 text-green-500" />
                          <span>Video</span>
                        </button>
                        <button
                          onClick={() => {
                            documentInputRef.current?.click();
                            setShowAttachmentMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded text-left"
                        >
                          <FileText className="w-4 h-4 text-green-500" />
                          <span>Document</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Emoji button */}
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  
                  {/* Message input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        if (settings.typingIndicators) {
                          handleTyping();
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && settings.enterToSend) {
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message"
                      spellCheck={settings.spellCheck}
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    
                    {/* Emoji picker */}
                    {showEmojiPicker && (
                      <div className="emoji-picker absolute bottom-full left-0 mb-2 z-50">
                        {/* @ts-ignore */}
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: any) => addEmoji(emoji.native)}
                          theme={isDark ? 'dark' : 'light'}
                          previewPosition="none"
                          skinTonePosition="search"
                          style={{ width: 350 }}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Send button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`p-2 rounded-full transition-colors ${
                      newMessage.trim() 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Hidden file inputs */}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileInput(e, 'image')}
                  className="hidden"
                />
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileInput(e, 'video')}
                  className="hidden"
                />
                <input
                  ref={documentInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  onChange={(e) => handleFileInput(e, 'file')}
                  className="hidden"
                />
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



      {/* Success Toast Notification */}
      {joinSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span>Successfully joined {joinSuccess} group!</span>
          </div>
        </div>
      )}

      {/* In the chat area, show an HD badge if selectedMediaQuality === 'hd' */}
      {selectedMediaQuality === 'hd' && (
        <div className="absolute top-2 right-2 z-20">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-ajira-primary text-white shadow">HD Mode Active</span>
        </div>
      )}

      {/* Full Screen Media Viewer */}
      {viewingMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeMediaViewer}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Media content */}
            <div className="max-w-full max-h-full flex items-center justify-center">
              {viewingMedia.type === 'image' ? (
                <img
                  src={viewingMedia.url}
                  alt={viewingMedia.fileName || 'Image'}
                  className="max-w-full max-h-full object-contain"
                />
              ) : viewingMedia.type === 'video' ? (
                <video
                  src={viewingMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain"
                />
              ) : viewingMedia.type === 'document' ? (
                <div className="bg-white rounded-lg p-8 max-w-md text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {viewingMedia.fileName || 'Document'}
                  </h3>
                  {viewingMedia.fileSize && (
                    <p className="text-sm text-gray-500 mb-4">{viewingMedia.fileSize}</p>
                  )}
                  <a
                    href={viewingMedia.url}
                    download={viewingMedia.fileName}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              ) : null}
            </div>

            {/* File info overlay */}
            {viewingMedia.fileName && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <p className="text-sm font-medium">{viewingMedia.fileName}</p>
                {viewingMedia.fileSize && (
                  <p className="text-xs text-gray-300">{viewingMedia.fileSize}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage; 