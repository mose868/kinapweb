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
  ArrowRight,
  Plus
} from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  isOwn?: boolean;
  messageType: 'text' | 'image' | 'file' | 'voice' | 'video' | 'system';
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

const CommunityPage: React.FC = () => {
  // State management
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsSidebar, setShowSettingsSidebar] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState('chats');
  const [showStarredMessages, setShowStarredMessages] = useState(false);
  const [starredMessages, setStarredMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showRingtoneModal, setShowRingtoneModal] = useState(false);
  const [selectedRingtone, setSelectedRingtone] = useState('default');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('system');
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsSearchQuery, setSettingsSearchQuery] = useState('');

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
        }
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

    // Load theme preference
    const savedTheme = localStorage.getItem('kinap-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
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
    const savedGroups = localStorage.getItem('kinap-chat-groups');
    if (savedGroups) {
      try {
        const parsedGroups = JSON.parse(savedGroups);
        // Convert date strings back to Date objects
        const groupsWithDates = parsedGroups.map((group: any) => ({
          ...group,
          lastMessageTime: new Date(group.lastMessageTime),
          messages: group.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setGroups(groupsWithDates);
      } catch (error) {
        console.error('Error loading chat groups:', error);
      }
    } else {
      setGroups(demoGroups);
    }
  }, []);

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

  // Save theme to localStorage and apply it
  useEffect(() => {
    setIsSaving(true);
    localStorage.setItem('kinap-theme', currentTheme);
    
    // Apply theme to document
    const root = document.documentElement;
    if (currentTheme === 'dark' || (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setTimeout(() => setIsSaving(false), 500);
  }, [currentTheme]);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Functions
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    const processedMessage = settings.replaceTextWithEmoji 
      ? newMessage.replace(/:\/\)/g, '😊').replace(/lol/g, '😂')
      : newMessage;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: activeUser.id,
      userName: activeUser.name,
      userAvatar: activeUser.avatar,
      message: processedMessage,
      timestamp: new Date(),
      messageType: 'text',
      status: 'sent',
      content: processedMessage
    };

    setGroups(prev => prev.map(group => 
      group.id === selectedGroup.id 
        ? { ...group, messages: [...group.messages, message] }
        : group
    ));

    setSelectedGroup(prev => prev ? { ...prev, messages: [...prev.messages, message] } : null);
    setNewMessage('');

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
  };

  const handleTyping = () => {
    if (!selectedGroup || !settings.typingIndicators) return;
    
    if (!typingUsers.includes(activeUser.id)) {
      setTypingUsers(prev => [...prev, activeUser.id]);
    }
    
    setTimeout(() => {
      setTypingUsers(prev => prev.filter(id => id !== activeUser.id));
    }, 3000);
  };

  const toggleStarMessage = (message: ChatMessage) => {
    if (starredMessages.find(m => m.id === message.id)) {
      setStarredMessages(prev => prev.filter(m => m.id !== message.id));
    } else {
      setStarredMessages(prev => [...prev, message]);
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

  const handleThemeSelect = (theme: string) => {
    setCurrentTheme(theme);
    setShowThemeModal(false);
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

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.category) return;

    const groupData: ChatGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      avatar: 'https://via.placeholder.com/40',
      members: 1,
      lastMessage: 'Group created',
      lastMessageTime: new Date(),
      unreadCount: 0,
      messages: [],
      admins: [activeUser.id],
      type: 'group',
      category: newGroup.category
    };

    setGroups(prev => [...prev, groupData]);
    setSelectedGroup(groupData);
    setShowCreateGroup(false);
    setNewGroup({ name: '', description: '', category: '' });
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSettings = CHAT_SETTINGS.filter(setting =>
    setting.name.toLowerCase().includes(settingsSearchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
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
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/70 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                    setShowMainMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium"
                >
                  Select chats
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
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed || showSettings ? 'hidden' : 'flex'} lg:flex flex-col w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 absolute lg:relative z-10 h-full`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chats</h2>
            </div>
            <div className="mt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search or start new chat"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ajira-primary"
                />
              </div>
            </div>
          </div>

          {/* Groups List */}
          <div className="flex-1 overflow-y-auto">
            {/* Starred Messages Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowStarredMessages(true);
                  setSelectedGroup(null);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  showStarredMessages
                    ? 'bg-ajira-primary/10 text-ajira-primary'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <div className="w-10 h-10 bg-ajira-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">★</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">Starred messages</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {starredMessages.length} message{starredMessages.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </button>
            </div>

            {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group);
                  setShowStarredMessages(false);
                  if (window.innerWidth < 1024) {
                    setSidebarCollapsed(true);
                  }
                }}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${
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
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-ajira-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">Demo User</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">Online</p>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="w-full bg-ajira-primary text-white p-3 rounded-full hover:bg-ajira-primary/90 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Sidebar */}
        {showSettings && (
          <div className="flex flex-col w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 absolute lg:relative z-10 h-full">
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
                  <div className="w-12 h-12 bg-ajira-primary rounded-full flex items-center justify-center">
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
          <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            <div className="p-6">
              {selectedSetting === 'chats' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chat Settings</h2>
                  </div>

                  <div className="space-y-1">
                    {filteredSettings.map((setting) => (
                      <div
                        key={setting.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          if (setting.id === 'theme') {
                            setShowThemeModal(true);
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
                          ) : setting.value && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{setting.value}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {setting.toggle ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSetting(setting.id as keyof typeof settings);
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
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className={`${showSettings ? 'hidden' : 'flex'} lg:flex flex-1 flex-col bg-gray-50 dark:bg-gray-900 ${sidebarCollapsed ? 'block' : 'hidden lg:block'}`}>
          {showStarredMessages ? (
            <>
              {/* Starred Messages Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowStarredMessages(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ajira-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">★</span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900 dark:text-white">Starred messages</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your important messages</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Starred Messages Content */}
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                {starredMessages.length > 0 ? (
                  <div className="w-full max-w-2xl">
                    <div className="space-y-4">
                      {starredMessages.map((message, index) => (
                        <div
                          key={message.id || index}
                          className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
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
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl text-gray-400">★</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No starred messages</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      Messages you star will appear here. Tap and hold on any message to star it.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : selectedGroup ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
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
                    <h2 className="font-semibold text-gray-900 dark:text-white">{selectedGroup.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedGroup.members} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Search className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedGroup.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.userId === activeUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.userId === activeUser.id
                          ? 'bg-ajira-primary text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          {message.userId === activeUser.id ? 'You' : message.userName}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs opacity-80">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {message.userId === activeUser.id && settings.readReceipts && (
                            <span className="text-xs">
                              {message.status === 'read' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <button
                        onClick={() => toggleStarMessage(message)}
                        className="mt-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
                      >
                        {starredMessages.some(sm => sm.id === message.id) ? '★' : '☆'}
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {typingUsers.length > 0 && settings.typingIndicators && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Someone is typing</span>
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
              <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2">
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
                    placeholder={settings.enterToSend ? "Type a message (Enter to send)" : "Type a message"}
                    spellCheck={settings.spellCheck}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ajira-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors"
                  >
                    Send
                  </button>
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

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Group</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ajira-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <input
                  type="text"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ajira-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  value={newGroup.category}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ajira-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {GROUP_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroup(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage; 