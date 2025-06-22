import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MoreVertical, Send, Smile, Hash, MessageCircle, Settings, ChevronLeft, ChevronRight, Mic, Image, File, Plus, CheckCheck, Check, Volume2, Play, Pause, Download, Reply, X, Pin, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

// Enhanced interfaces
interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  isOwn?: boolean;
  messageType: 'text' | 'image' | 'file' | 'voice' | 'video';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
  mediaUrl?: string;
  fileSize?: string;
  duration?: string;
  isEdited?: boolean;
  reactions?: { emoji: string; users: string[] }[];
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
}

const CommunityPage = () => {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [currentGroup, setCurrentGroup] = useState<ChatGroup | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current user data
  const currentUser = {
    id: user?.uid || 'current-user',
    name: user?.displayName || 'You',
    avatar: user?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    isOnline: true,
    status: 'Online'
  };

  // Enhanced demo groups with realistic Kenyan content
  const demoGroups: ChatGroup[] = [
    {
      id: 'tech-wizards',
      name: 'Tech Wizards KE 🇰🇪',
      description: 'Kenyan developers sharing code, opportunities & tech trends',
      avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop&crop=face',
      members: 1247,
      lastMessage: 'Grace: Just landed a remote job at $3000/month! 🎉',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 3,
      isOnline: true,
      isPinned: true,
      isMuted: false,
      isArchived: false,
      admins: ['admin1', 'admin2'],
      type: 'group',
      isTyping: false,
      typingUsers: [],
      messages: [
        {
          id: '1',
          userId: 'user1',
          userName: 'Kevin Mwangi',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          message: 'Mambo vipi wasee! Anyone working on Flutter projects hii 2025?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          messageType: 'text',
          status: 'read',
          reactions: [{ emoji: '👍', users: ['user2', 'user3'] }]
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Grace Wanjiku',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          message: 'Poa Kevin! Niko na React Native project, lakini Flutter pia ni poa. Unaeza share resources?',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          messageType: 'text',
          status: 'read',
          replyTo: '1'
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'James Kamau',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          message: 'Check out this job posting - Senior Dev role, KSh 250K+',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          messageType: 'file',
          status: 'read',
          mediaUrl: 'job-posting.pdf',
          fileSize: '2.4 MB'
        },
        {
          id: '4',
          userId: 'user2',
          userName: 'Grace Wanjiku',
          userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          message: 'Just landed a remote job at $3000/month! Thanks to this community 🙏',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          messageType: 'text',
          status: 'read',
          reactions: [
            { emoji: '🎉', users: ['user1', 'user3', 'user4', 'user5'] },
            { emoji: '👏', users: ['user6', 'user7'] }
          ]
        }
      ]
    },
    // AJIRA DIGITAL TRAINING MODULES GROUPS
    {
      id: 'web-dev-mastery',
      name: 'Web Development Mastery 💻',
      description: 'HTML, CSS, JavaScript, React & Full-Stack Development',
      avatar: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=100&h=100&fit=crop&crop=face',
      members: 856,
      lastMessage: 'Peter: Check out this React tutorial for beginners',
      lastMessageTime: new Date(Date.now() - 10 * 60 * 1000),
      unreadCount: 5,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['web-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'mobile-app-dev',
      name: 'Mobile App Development 📱',
      description: 'Flutter, React Native, Android & iOS Development',
      avatar: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=100&h=100&fit=crop&crop=face',
      members: 624,
      lastMessage: 'Sarah: Flutter vs React Native - which is better?',
      lastMessageTime: new Date(Date.now() - 25 * 60 * 1000),
      unreadCount: 2,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['mobile-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'digital-marketing-hub',
      name: 'Digital Marketing Hub 📈',
      description: 'SEO, Social Media, Content Marketing & Google Ads',
      avatar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop&crop=face',
      members: 934,
      lastMessage: 'Mark: Just earned KSh 50K from one social media campaign!',
      lastMessageTime: new Date(Date.now() - 45 * 60 * 1000),
      unreadCount: 8,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['marketing-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'data-science-analytics',
      name: 'Data Science & Analytics 📊',
      description: 'Python, R, Machine Learning, AI & Data Visualization',
      avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=face',
      members: 567,
      lastMessage: 'Dr. Wanjiku: Free Python for Data Science course link',
      lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      unreadCount: 12,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['data-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'graphic-design-studio',
      name: 'Graphic Design Studio 🎨',
      description: 'Photoshop, Illustrator, Canva & Brand Design',
      avatar: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop&crop=face',
      members: 789,
      lastMessage: 'Creative Mary: Logo design tips for beginners',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 4,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['design-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'ui-ux-designers',
      name: 'UI/UX Designers Hub 🎯',
      description: 'Figma, Adobe XD, User Research & Design Thinking',
      avatar: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=100&h=100&fit=crop&crop=face',
      members: 445,
      lastMessage: 'Design Pro: Figma to code workflow tutorial',
      lastMessageTime: new Date(Date.now() - 20 * 60 * 1000),
      unreadCount: 6,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['ux-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'content-creators',
      name: 'Content Creators Network 📝',
      description: 'Copywriting, Video Creation, Blogging & YouTube',
      avatar: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=100&h=100&fit=crop&crop=face',
      members: 723,
      lastMessage: 'Content King: How I made KSh 100K from YouTube',
      lastMessageTime: new Date(Date.now() - 35 * 60 * 1000),
      unreadCount: 9,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['content-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'cybersecurity-experts',
      name: 'Cybersecurity Experts 🔒',
      description: 'Ethical Hacking, Network Security & IT Security',
      avatar: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop&crop=face',
      members: 398,
      lastMessage: 'SecureGuy: Latest cybersecurity threats to watch',
      lastMessageTime: new Date(Date.now() - 50 * 60 * 1000),
      unreadCount: 3,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['security-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'blockchain-crypto',
      name: 'Blockchain & Crypto 🪙',
      description: 'Smart Contracts, DeFi, NFTs & Cryptocurrency',
      avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop&crop=face',
      members: 512,
      lastMessage: 'CryptoKev: Building my first DApp tutorial',
      lastMessageTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      unreadCount: 7,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['crypto-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'e-commerce-masters',
      name: 'E-commerce Masters 🛒',
      description: 'Shopify, WooCommerce, Dropshipping & Online Stores',
      avatar: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&crop=face',
      members: 667,
      lastMessage: 'ShopGuru: Made KSh 200K last month dropshipping',
      lastMessageTime: new Date(Date.now() - 40 * 60 * 1000),
      unreadCount: 11,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['ecommerce-admin'],
      type: 'group',
      messages: []
    },
    // FREELANCING & BUSINESS GROUPS
    {
      id: 'freelance-masters',
      name: 'Freelance Masters 💰',
      description: 'Kenyan freelancers sharing gigs, tips & success stories',
      avatar: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=100&fit=crop&crop=face',
      members: 892,
      lastMessage: 'Peter: Voice message (0:45)',
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 7,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['admin3'],
      type: 'group',
      isTyping: true,
      typingUsers: ['Mary Njeri'],
      messages: [
        {
          id: '1',
          userId: 'user4',
          userName: 'Peter Ochieng',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          message: 'Wasee, nimemaliza project ya web design - client from US. $2000! 🔥',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          messageType: 'text',
          status: 'read'
        },
        {
          id: '2',
          userId: 'user5',
          userName: 'Mary Njeri',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
          message: 'Congratulations Peter! Uliget wapi hio client?',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          messageType: 'text',
          status: 'read'
        },
        {
          id: '3',
          userId: 'user4',
          userName: 'Peter Ochieng',
          userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
          message: 'LinkedIn actually! Let me explain...',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          messageType: 'voice',
          status: 'read',
          duration: '2:34'
        }
      ]
    },
    {
      id: 'upwork-fiverr-pros',
      name: 'Upwork & Fiverr Pros ⭐',
      description: 'Platform strategies, client acquisition & profile optimization',
      avatar: 'https://images.unsplash.com/photo-1553484771-047a44eee27a?w=100&h=100&fit=crop&crop=face',
      members: 634,
      lastMessage: 'TopRated: How I became Fiverr Pro in 6 months',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 15,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['platform-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'remote-workers-ke',
      name: 'Remote Workers KE 🌍',
      description: 'Remote job opportunities and work-from-home tips',
      avatar: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=100&h=100&fit=crop&crop=face',
      members: 1156,
      lastMessage: 'RemotePro: 10 companies hiring Kenyans remotely',
      lastMessageTime: new Date(Date.now() - 55 * 60 * 1000),
      unreadCount: 22,
      isOnline: true,
      isPinned: true,
      isMuted: false,
      isArchived: false,
      admins: ['remote-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'startup-founders',
      name: 'Startup Founders Kenya 🚀',
      description: 'Tech entrepreneurs, funding & business development',
      avatar: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=100&h=100&fit=crop&crop=face',
      members: 423,
      lastMessage: 'StartupCEO: Just raised $50K seed funding! AMA',
      lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unreadCount: 18,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['startup-admin'],
      type: 'group',
      messages: []
    },
    // SKILL-SPECIFIC GROUPS
    {
      id: 'python-programmers',
      name: 'Python Programmers 🐍',
      description: 'Django, Flask, Data Science & Python Development',
      avatar: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=100&h=100&fit=crop&crop=face',
      members: 578,
      lastMessage: 'PythonGuru: Django REST API tutorial for beginners',
      lastMessageTime: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
      unreadCount: 8,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['python-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'javascript-devs',
      name: 'JavaScript Developers ⚡',
      description: 'React, Node.js, Vue, Angular & Modern JavaScript',
      avatar: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=100&h=100&fit=crop&crop=face',
      members: 721,
      lastMessage: 'JSNinja: ES6+ features you should know in 2025',
      lastMessageTime: new Date(Date.now() - 45 * 60 * 1000),
      unreadCount: 6,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['js-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'video-editors',
      name: 'Video Editors Studio 🎬',
      description: 'DaVinci Resolve, Premiere Pro & Video Production',
      avatar: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=100&h=100&fit=crop&crop=face',
      members: 456,
      lastMessage: 'VideoMaster: Color grading tutorial for African skin tones',
      lastMessageTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      unreadCount: 4,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['video-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'wordpress-developers',
      name: 'WordPress Developers 📝',
      description: 'Theme development, plugins & WordPress business',
      avatar: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&h=100&fit=crop&crop=face',
      members: 623,
      lastMessage: 'WPExpert: Custom theme development from scratch',
      lastMessageTime: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
      unreadCount: 9,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['wp-admin'],
      type: 'group',
      messages: []
    },
    // LEARNING & CERTIFICATION GROUPS
    {
      id: 'aws-cloud-practitioners',
      name: 'AWS Cloud Practitioners ☁️',
      description: 'Amazon Web Services certification & cloud computing',
      avatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&h=100&fit=crop&crop=face',
      members: 387,
      lastMessage: 'CloudMaster: Passed AWS Solutions Architect exam!',
      lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 12,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['aws-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'google-certified',
      name: 'Google Certified Pros 🎓',
      description: 'Google Ads, Analytics, Cloud & Digital Marketing certs',
      avatar: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=face',
      members: 534,
      lastMessage: 'GooglePro: Free Google Skillshop courses list',
      lastMessageTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      unreadCount: 7,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['google-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'microsoft-certified',
      name: 'Microsoft Certified 💼',
      description: 'Azure, Office 365, Power Platform & MS certifications',
      avatar: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=face',
      members: 445,
      lastMessage: 'MSExpert: Power BI dashboard tutorial',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
      unreadCount: 5,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['ms-admin'],
      type: 'group',
      messages: []
    },
    // CAREER & NETWORKING GROUPS
    {
      id: 'tech-interviews',
      name: 'Tech Interview Prep 💡',
      description: 'Coding challenges, interview tips & job preparation',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      members: 678,
      lastMessage: 'InterviewAce: Common React interview questions',
      lastMessageTime: new Date(Date.now() - 2.2 * 60 * 60 * 1000),
      unreadCount: 14,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['interview-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'women-in-tech-ke',
      name: 'Women in Tech KE 👩‍💻',
      description: 'Supporting women in technology careers',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      members: 456,
      lastMessage: 'TechQueen: Mentorship program for female developers',
      lastMessageTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      unreadCount: 8,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['women-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'students-developers',
      name: 'Student Developers 🎓',
      description: 'University & college students learning programming',
      avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop&crop=face',
      members: 892,
      lastMessage: 'StudentDev: Final year project ideas for CS students',
      lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unreadCount: 19,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['student-admin'],
      type: 'group',
      messages: []
    },
    // INDUSTRY-SPECIFIC GROUPS
    {
      id: 'fintech-kenya',
      name: 'FinTech Kenya 💳',
      description: 'Mobile money, banking APIs & financial technology',
      avatar: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop&crop=face',
      members: 423,
      lastMessage: 'FintechDev: M-Pesa API integration tutorial',
      lastMessageTime: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
      unreadCount: 6,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['fintech-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'agritech-solutions',
      name: 'AgriTech Solutions 🌾',
      description: 'Technology solutions for agriculture & farming',
      avatar: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=100&h=100&fit=crop&crop=face',
      members: 267,
      lastMessage: 'AgriDev: IoT sensors for smart farming',
      lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      unreadCount: 3,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['agri-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'healthtech-innovators',
      name: 'HealthTech Innovators 🏥',
      description: 'Healthcare technology & medical app development',
      avatar: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=face',
      members: 345,
      lastMessage: 'HealthDev: HIPAA compliance for health apps',
      lastMessageTime: new Date(Date.now() - 7 * 60 * 60 * 1000),
      unreadCount: 4,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['health-admin'],
      type: 'group',
      messages: []
    },
    // RESOURCES & LEARNING
    {
      id: 'free-resources',
      name: 'Free Learning Resources 📚',
      description: 'Free courses, tutorials, books & learning materials',
      avatar: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop&crop=face',
      members: 1234,
      lastMessage: 'ResourceGuru: 100+ free programming books collection',
      lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 25,
      isOnline: true,
      isPinned: true,
      isMuted: false,
      isArchived: false,
      admins: ['resource-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'coding-challenges',
      name: 'Daily Coding Challenges 🧩',
      description: 'LeetCode, HackerRank & programming problem solving',
      avatar: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=100&h=100&fit=crop&crop=face',
      members: 567,
      lastMessage: 'CodeChallenger: Today\'s problem: Two Sum variations',
      lastMessageTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
      unreadCount: 12,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['challenge-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'open-source-contributors',
      name: 'Open Source Contributors 🌐',
      description: 'GitHub projects, open source contributions & collaboration',
      avatar: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=100&h=100&fit=crop&crop=face',
      members: 456,
      lastMessage: 'OSContributor: Hacktoberfest 2025 projects list',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
      unreadCount: 9,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['os-admin'],
      type: 'group',
      messages: []
    },
    // OFFICIAL GROUPS
    {
      id: 'kinap-official',
      name: 'KiNaP Official 📢',
      description: 'Official updates & announcements',
      avatar: '/logo.jpeg',
      members: 3456,
      lastMessage: 'Admin: New Digital Skills Bootcamp Feb 15th',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 1,
      isOnline: true,
      isPinned: true,
      isMuted: false,
      isArchived: false,
      admins: ['admin1'],
      type: 'channel',
      messages: [
        {
          id: '1',
          userId: 'admin1',
          userName: 'KiNaP Admin',
          userAvatar: '/logo.jpeg',
          message: '🎉 New Digital Skills Bootcamp starting February 15th, 2025. Registration open!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          messageType: 'text',
          status: 'read',
          reactions: [{ emoji: '🔥', users: ['user1', 'user2'] }]
        }
      ]
    },
    {
      id: 'alumni-network',
      name: 'KiNaP Alumni Network 🎓',
      description: 'Connect with KiNaP graduates and success stories',
      avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=100&fit=crop&crop=face',
      members: 2134,
      lastMessage: 'Alumni: Class of 2020 reunion planning',
      lastMessageTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      unreadCount: 16,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['alumni-admin'],
      type: 'group',
      messages: []
    },
    {
      id: 'mentorship-program',
      name: 'Mentorship Program 🤝',
      description: 'Connect mentors with mentees for career guidance',
      avatar: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=100&h=100&fit=crop&crop=face',
      members: 789,
      lastMessage: 'MentorLead: New mentor-mentee matching session',
      lastMessageTime: new Date(Date.now() - 9 * 60 * 60 * 1000),
      unreadCount: 11,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      admins: ['mentor-admin'],
      type: 'group',
      messages: []
    }
  ];

  const [groups, setGroups] = useState<ChatGroup[]>(demoGroups);

  // Message status icons
  const getMessageStatusIcon = (status: string, isOwn: boolean) => {
    if (!isOwn) return null;
    
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  // Voice message component
  const VoiceMessage = ({ message }: { message: ChatMessage }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg max-w-xs">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 bg-kenya-red text-white rounded-full flex items-center justify-center hover:bg-kenya-green transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-1">
            <Volume2 className="w-3 h-3 text-gray-500" />
            <div className="flex-1 h-1 bg-gray-300 rounded-full">
              <div className="w-1/3 h-full bg-kenya-red rounded-full"></div>
            </div>
          </div>
          <div className="text-xs text-gray-500">{message.duration}</div>
        </div>
      </div>
    );
  };

  // File message component
  const FileMessage = ({ message }: { message: ChatMessage }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg max-w-xs">
      <div className="w-10 h-10 bg-kenya-red text-white rounded-lg flex items-center justify-center">
        <File className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{message.mediaUrl}</p>
        <p className="text-xs text-gray-500">{message.fileSize}</p>
      </div>
      <button className="p-1 hover:bg-gray-200 rounded">
        <Download className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );

  // Message reactions
  const MessageReactions = ({ reactions }: { reactions: { emoji: string; users: string[] }[] }) => (
    <div className="flex flex-wrap gap-1 mt-1">
      {reactions.map((reaction, index) => (
        <button
          key={index}
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
        >
          <span>{reaction.emoji}</span>
          <span className="text-gray-600">{reaction.users.length}</span>
        </button>
      ))}
    </div>
  );

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentGroup?.messages]);

  // Update current group
  useEffect(() => {
    if (selectedGroup) {
      const group = groups.find(g => g.id === selectedGroup);
      setCurrentGroup(group || null);
      
      if (group) {
        setGroups(prev => prev.map(g => 
          g.id === selectedGroup ? { ...g, unreadCount: 0 } : g
        ));
      }
    }
  }, [selectedGroup, groups]);

  // Format time helper
  const formatTime = useCallback((date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  }, []);

  // Send message function
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !currentGroup) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      message: newMessage,
      timestamp: new Date(),
      isOwn: true,
      messageType: 'text',
      status: 'sending',
      replyTo: replyingTo?.id
    };

    setGroups(prev => prev.map(group => 
      group.id === currentGroup.id
        ? { 
            ...group, 
            messages: [...group.messages, message],
            lastMessage: newMessage,
            lastMessageTime: new Date()
          }
        : group
    ));

    setNewMessage('');
    setReplyingTo(null);

    // Simulate delivery
    setTimeout(() => {
      setGroups(prev => prev.map(group => 
        group.id === currentGroup.id
          ? { 
              ...group, 
              messages: group.messages.map(msg => 
                msg.id === message.id ? { ...msg, status: 'delivered' } : msg
              )
            }
          : group
      ));
    }, 1000);
  }, [newMessage, currentGroup, currentUser, replyingTo]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentGroup) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      message: `Shared ${file.name}`,
      timestamp: new Date(),
      isOwn: true,
      messageType: file.type.startsWith('image/') ? 'image' : 'file',
      status: 'sending',
      mediaUrl: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`
    };

    setGroups(prev => prev.map(group => 
      group.id === currentGroup.id
        ? { 
            ...group, 
            messages: [...group.messages, message],
            lastMessage: `📎 ${file.name}`,
            lastMessageTime: new Date()
          }
        : group
    ));
  };

  // Filter groups
  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-kenya-black mb-4">
            KiNaP Digital Community Hub 💬
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Connect with fellow students, mentors, and industry professionals. Share knowledge, 
            collaborate on projects, and build your digital career network.
          </p>
        </div>

        {/* WhatsApp Integration Section */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.515"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">Connect via WhatsApp</h3>
                <p className="text-green-100">
                  Get instant support, join exclusive groups, and receive real-time updates
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <a
                href="https://wa.me/254712345678?text=Hi%20KiNaP%20Ajira!%20I%27d%20like%20to%20join%20the%20community%20and%20learn%20about%20digital%20skills%20training."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.515"/>
                </svg>
                <span>Chat with Us</span>
              </a>
              <div className="text-sm text-green-100">
                <p>📱 +254 712 345 678</p>
                <p>⏰ Available 24/7</p>
              </div>
            </div>
          </div>
          
          {/* WhatsApp Groups */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">🎓 Study Groups</h4>
              <p className="text-sm text-green-100">Join subject-specific study groups and collaborative learning sessions</p>
              <a 
                href="https://chat.whatsapp.com/studygroups"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
              >
                Join Groups
              </a>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">💼 Job Alerts</h4>
              <p className="text-sm text-green-100">Get instant notifications about job opportunities and freelance gigs</p>
              <a 
                href="https://chat.whatsapp.com/jobalerts"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
              >
                Subscribe
              </a>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-2">🚀 Project Teams</h4>
              <p className="text-sm text-green-100">Find teammates for hackathons, competitions, and startup projects</p>
              <a 
                href="https://chat.whatsapp.com/projectteams"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
              >
                Find Teams
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-300px)]">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} border-r border-gray-200 flex flex-col transition-all duration-300 bg-gray-50`}>
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <h2 className="text-lg font-semibold text-gray-900">Community Groups</h2>
                  )}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Groups List */}
              <div className="flex-1 overflow-y-auto">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                      selectedGroup === group.id ? 'bg-kenya-green bg-opacity-10 border-r-4 border-r-kenya-green' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={group.avatar}
                          alt={group.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {group.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                        {group.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-kenya-red text-white text-xs rounded-full flex items-center justify-center font-medium">
                            {group.unreadCount > 9 ? '9+' : group.unreadCount}
                          </div>
                        )}
                      </div>
                      
                      {!sidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                              {group.isPinned && <Pin className="w-3 h-3 text-gray-400" />}
                              {group.isMuted && <Settings className="w-3 h-3 text-gray-400" />}
                            </div>
                            <span className="text-xs text-gray-500">{formatTime(group.lastMessageTime)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {group.isTyping && group.typingUsers && group.typingUsers.length > 0 && (
                              <div className="flex items-center gap-1 text-kenya-green text-sm">
                                <div className="flex gap-1">
                                  <div className="w-1 h-1 bg-kenya-green rounded-full animate-bounce"></div>
                                  <div className="w-1 h-1 bg-kenya-green rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                  <div className="w-1 h-1 bg-kenya-green rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span>{group.typingUsers[0]} is typing...</span>
                              </div>
                            )}
                            {!group.isTyping && (
                              <p className="text-sm text-gray-600 truncate">{group.lastMessage}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{group.members.toLocaleString()} members</span>
                              {group.type === 'channel' && <Hash className="w-3 h-3 text-gray-400" />}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              {!sidebarCollapsed && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentGroup ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={currentGroup.avatar}
                            alt={currentGroup.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {currentGroup.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-gray-900">{currentGroup.name}</h2>
                            {currentGroup.type === 'channel' && <Hash className="w-4 h-4 text-gray-500" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{currentGroup.members.toLocaleString()} members</span>
                            <span>•</span>
                            <span>{currentGroup.description}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Search className="w-5 h-5 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Info className="w-5 h-5 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {currentGroup.messages.map((message, index) => {
                      const showAvatar = index === 0 || currentGroup.messages[index - 1].userId !== message.userId;

                      return (
                        <div key={message.id}>
                          <div className={`flex gap-3 ${message.isOwn ? 'justify-end' : 'justify-start'} group`}>
                            {!message.isOwn && showAvatar && (
                              <img
                                src={message.userAvatar}
                                alt={message.userName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            {!message.isOwn && !showAvatar && <div className="w-8"></div>}
                            
                            <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-1' : ''}`}>
                              {!message.isOwn && showAvatar && (
                                <p className="text-sm font-medium text-gray-900 mb-1">{message.userName}</p>
                              )}
                              
                              {/* Reply indicator */}
                              {message.replyTo && (
                                <div className="mb-2 p-2 bg-gray-200 rounded-lg border-l-2 border-kenya-green">
                                  <p className="text-xs text-gray-600">Replying to message</p>
                                </div>
                              )}
                              
                              <div
                                className={`rounded-lg px-4 py-2 relative ${
                                  message.isOwn
                                    ? 'bg-kenya-red text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                              >
                                {/* Message content */}
                                {message.messageType === 'text' && (
                                  <p className="text-sm">{message.message}</p>
                                )}
                                
                                {message.messageType === 'voice' && (
                                  <VoiceMessage message={message} />
                                )}
                                
                                {message.messageType === 'file' && (
                                  <FileMessage message={message} />
                                )}
                                
                                {message.messageType === 'image' && (
                                  <div className="max-w-xs">
                                    <img
                                      src={message.mediaUrl}
                                      alt="Shared image"
                                      className="rounded-lg max-w-full h-auto"
                                    />
                                    {message.message && message.message !== `Shared ${message.mediaUrl}` && (
                                      <p className="text-sm mt-2">{message.message}</p>
                                    )}
                                  </div>
                                )}

                                {/* Message status and time */}
                                <div className={`flex items-center justify-between mt-1 gap-2 ${
                                  message.isOwn ? 'text-white/70' : 'text-gray-500'
                                }`}>
                                  <div className="flex items-center gap-1 text-xs">
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {message.isEdited && <span>(edited)</span>}
                                  </div>
                                  {getMessageStatusIcon(message.status, message.isOwn || false)}
                                </div>
                              </div>

                              {/* Message reactions */}
                              {message.reactions && message.reactions.length > 0 && (
                                <MessageReactions reactions={message.reactions} />
                              )}
                            </div>
                            
                            {message.isOwn && showAvatar && (
                              <img
                                src={message.userAvatar}
                                alt={message.userName}
                                className="w-8 h-8 rounded-full object-cover order-2"
                              />
                            )}
                            {message.isOwn && !showAvatar && <div className="w-8 order-2"></div>}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Reply indicator */}
                  {replyingTo && (
                    <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Reply className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Replying to {replyingTo.userName}: {replyingTo.message.substring(0, 50)}...
                          </span>
                        </div>
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-end gap-3">
                      {/* Media picker */}
                      <div className="relative">
                        <button
                          onClick={() => setShowMediaPicker(!showMediaPicker)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        
                        {showMediaPicker && (
                          <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-col gap-2">
                            <button
                              onClick={() => {
                                fileInputRef.current?.click();
                                setShowMediaPicker(false);
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                            >
                              <Image className="w-4 h-4 text-blue-500" />
                              Photo
                            </button>
                            <button
                              onClick={() => {
                                fileInputRef.current?.click();
                                setShowMediaPicker(false);
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm"
                            >
                              <File className="w-4 h-4 text-purple-500" />
                              Document
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Message input */}
                      <div className="flex-1 relative">
                        <input
                          ref={messageInputRef}
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={`Message ${currentGroup.name}...`}
                          className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-kenya-red border-0 pr-12"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700">
                          <Smile className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Voice message */}
                      <button
                        onMouseDown={() => setIsRecording(true)}
                        onMouseUp={() => setIsRecording(false)}
                        onMouseLeave={() => setIsRecording(false)}
                        className={`p-3 rounded-full transition-colors ${
                          isRecording 
                            ? 'bg-red-500 text-white' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Mic className="w-5 h-5" />
                      </button>

                      {/* Send button */}
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-kenya-red text-white rounded-full hover:bg-kenya-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Recording indicator */}
                    {isRecording && (
                      <div className="mt-2 flex items-center gap-2 text-red-500">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm">Recording voice message...</span>
                      </div>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,application/pdf,.doc,.docx,.txt"
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Karibu Mazungumzo Hub</h3>
                    <p className="text-gray-500 max-w-md">
                      Select a conversation to start chatting with the KiNaP Ajira Digital community. 
                      Connect, learn, and grow together! 🚀
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage; 