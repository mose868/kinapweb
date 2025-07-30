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
import { useTheme } from '../../contexts/ThemeContext';

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
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showRingtoneModal, setShowRingtoneModal] = useState(false);
  const [selectedRingtone, setSelectedRingtone] = useState('default');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState('default');
  const { theme: currentTheme, setTheme: setCurrentTheme, isDark } = useTheme();
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
          .replace(/illustrator/g, '🎨')
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
          .replace(/illustrator/g, '🎨')
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
          .replace(/illustrator/g, '🎨')
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

  const filteredSettings = CHAT_SETTINGS.map(setting => {
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
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${sidebarCollapsed ? 'hidden' : 'flex'} lg:flex flex-col w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 absolute lg:relative z-10 h-full`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chats</h2>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="lg:hidden p-2 bg-ajira-primary text-white rounded-full hover:bg-ajira-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
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
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 relative">
            <div className="absolute top-2 right-2 w-2 h-2 bg-ajira-primary rounded-full"></div>
            <button
              onClick={() => {
                setShowStarredMessages(true);
                setSelectedGroup(null);
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

          {/* Groups List */}
          <div className="flex-1 overflow-y-auto">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => {
                  setSelectedGroup(group);
                  setShowStarredMessages(false);
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-ajira-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm sm:text-base">Demo User</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Online</p>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 hidden lg:block">
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
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div 
          className={`${showSettings ? 'hidden' : 'flex'} flex-1 flex-col ${sidebarCollapsed ? 'block' : 'hidden lg:block'} relative`}
          style={{ 
            backgroundColor: WALLPAPER_OPTIONS.find(w => w.id === selectedWallpaper)?.color || '#f0f2f5'
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
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStarMessage(message);
                        }}
                        className={`mt-1 text-xs transition-all duration-200 ${
                          starredMessages.some(sm => sm.id === message.id) 
                            ? 'text-yellow-500 opacity-100 scale-110' 
                            : 'text-gray-400 hover:text-ajira-primary opacity-70 hover:opacity-100'
                        }`}
                        title={starredMessages.some(sm => sm.id === message.id) ? 'Unstar message' : 'Star message'}
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
                    className={`flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-ajira-primary ${chatInputClass}`}
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

      {/* In the chat area, show an HD badge if selectedMediaQuality === 'hd' */}
      {selectedMediaQuality === 'hd' && (
        <div className="absolute top-2 right-2 z-20">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-ajira-primary text-white shadow">HD Mode Active</span>
        </div>
      )}
    </div>
  );
};

export default CommunityPage; 