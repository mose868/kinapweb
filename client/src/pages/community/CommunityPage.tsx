import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MoreVertical, Send, Smile, Hash, MessageCircle, Settings, ChevronLeft, ChevronRight, Mic, Image, File, Plus, CheckCheck, Check, Volume2, Play, Pause, Download, Reply, X, Pin, Info } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../contexts/AuthContext';
import CommunityChat from '../../components/community/CommunityChat';
import Chatbot from '../../components/chatbot/Chatbot';
import { api } from '../../config/api';
import Modal from 'react-modal';

// Enhanced interfaces
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
  type?: 'system'; // Added for system messages
  content?: string; // Added for system messages
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

const INTEREST_OPTIONS = [
  'Web Development',
  'Mobile App Development',
  'Digital Marketing',
  'Data Science',
  'Content Creation',
  'Graphic Design',
  'Cybersecurity',
  'E-commerce',
  'Freelancing',
  'UI/UX Design',
  'Blockchain',
  'Cloud Computing',
  'Other'
];

const SOCKET_URL = 'http://localhost:5000';

const CommunityPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [currentGroup, setCurrentGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', members: [] });
  const [showSettings, setShowSettings] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || user?.fullname || '',
    avatar: user?.avatar || user?.photoURL || '',
    interests: user?.interests || [],
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);

  // Current user data
  const currentUser = {
    id: user?.uid || 'current-user',
    name: user?.displayName || 'You',
    avatar: user?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    isOnline: true,
    status: 'Online'
  };

  // Fetch groups and users on mount
  useEffect(() => {
    api.get('/groups').then(res => setGroups(res.data)).catch(console.error);
    api.get('/users').then(res => setUsers(res.data)).catch(console.error);
  }, []);

  // Connect to Socket.IO on mount
  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(s);
    return () => { s.disconnect(); };
  }, []);

  // Join all groups when groups/user are loaded
  useEffect(() => {
    if (socket && user && groups.length > 0) {
      const userId = user.id || user._id;
      if (!userId) {
        console.log('User object missing id and _id for join:', user);
        return;
      }
      groups.forEach(g => {
        console.log('Emitting join for group:', g.id || g._id, 'with userId:', userId);
        socket.emit('join', userId); // Optionally, join group rooms if implemented
      });
    }
  }, [socket, user, groups]);

  // Listen for real-time group messages
  useEffect(() => {
    if (!socket) return;
    const handler = (msg: any) => {
      if (msg.groupId === selectedGroup) {
        setMessages(prev => [...prev, { ...msg, isOwn: msg.sender === user?.id }]);
      }
    };
    socket.on('group_message', handler);
    return () => { socket.off('group_message', handler); };
  }, [socket, selectedGroup, user]);

  // Fetch messages when a group is selected
  useEffect(() => {
    if (selectedGroup) {
      api.get(`/messages/group/${selectedGroup}`)
        .then(res => setMessages(res.data))
        .catch(console.error);
      const group = groups.find(g => g._id === selectedGroup || g.id === selectedGroup);
      setCurrentGroup(group || null);
    }
  }, [selectedGroup, groups]);

  // When a group is selected, fetch its member user data
  useEffect(() => {
    if (currentGroup && currentGroup.members && currentGroup.members.length > 0) {
      // members may be array of user IDs or user objects
      const memberIds = currentGroup.members.map((m: any) => (typeof m === 'string' ? m : m._id || m.id));
      // Filter users in state
      const members = users.filter(u => memberIds.includes(u.id || u._id));
      setGroupMembers(members);
    } else {
      setGroupMembers([]);
    }
  }, [currentGroup, users]);

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
          key={reaction.emoji + index}
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
  }, [messages]);

  // Set currentGroup when selectedGroup or groups change
  useEffect(() => {
    if (selectedGroup) {
      const group = groups.find(g => g._id === selectedGroup || g.id === selectedGroup);
      setCurrentGroup(group || null);
    }
  }, [selectedGroup, groups]);

  // Clear unread count only when selectedGroup changes
  useEffect(() => {
    if (selectedGroup) {
      setGroups(prev =>
        prev.map(g =>
          g._id === selectedGroup || g.id === selectedGroup
            ? { ...g, unreadCount: 0 }
            : g
        )
      );
    }
  }, [selectedGroup]);

  // Format time helper
  const formatTime = useCallback((date: Date) => {
    const now = new Date();
    const dateObj = date ? new Date(date) : null;
    const diff = dateObj ? now.getTime() - dateObj.getTime() : 0;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (!dateObj) return '';
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return dateObj.toLocaleDateString();
  }, []);

  // Send group message
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !currentGroup || !socket || !user) return;
    const userId = user.id || user._id;
    if (!userId) {
      console.log('User object missing id and _id for group_message:', user);
      return;
    }
    const msg = {
      sender: userId,
      groupId: currentGroup._id || currentGroup.id,
      members: currentGroup.members,
      content: newMessage,
      type: 'text',
    };
    // Optimistically update UI
    setMessages(prev => [...prev, { ...msg, isOwn: true, userName: user.name, userAvatar: user.avatar, timestamp: new Date() }]);
    console.log('Emitting group_message:', msg);
    socket.emit('group_message', msg);
    setNewMessage('');
    setReplyingTo(null);
  }, [newMessage, currentGroup, socket, user, setMessages, setNewMessage, setReplyingTo]);

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
      group._id === currentGroup._id || group.id === currentGroup.id
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
    const aTime = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
    const bTime = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
    return bTime - aTime;
  });

  // Create group handler
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/groups/create', {
        ...newGroup,
        admins: [user.id],
        createdBy: user.id,
        avatar: '',
      });
      setGroups(prev => [...prev, res.data]);
      setShowCreateGroup(false);
      setNewGroup({ name: '', description: '', members: [] });
      setSelectedGroup(res.data._id || res.data.id);
    } catch (err) {
      alert('Failed to create group');
    }
  };

  // Fetch private messages
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>([]);
  useEffect(() => {
    if (selectedUser && user) {
      api.get(`/messages/private/${user.id}?otherUserId=${selectedUser}`)
        .then(res => setPrivateMessages(res.data))
        .catch(console.error);
    }
  }, [selectedUser, user]);

  // Send private message
  const sendPrivateMessage = (msg: string) => {
    if (!socket || !user || !selectedUser || !msg.trim()) return;
    const userId = user.id || user._id;
    if (!userId) {
      console.log('User object missing id and _id for private_message:', user);
      return;
    }
    const message = { sender: userId, recipient: selectedUser, content: msg, type: 'text' };
    console.log('Emitting private_message:', message);
    socket.emit('private_message', message);
    setPrivateMessages(prev => [...prev, { ...message, isOwn: true, userName: user.name, userAvatar: user.avatar, timestamp: new Date() }]);
  };

  // Listen for real-time private messages
  useEffect(() => {
    if (!socket) return;
    const handler = (msg: any) => {
      if (msg.sender === selectedUser || msg.sender === user?.id) {
        setPrivateMessages(prev => [...prev, { ...msg, isOwn: msg.sender === user?.id }]);
      }
    };
    socket.on('private_message', handler);
    return () => { socket.off('private_message', handler); };
  }, [socket, selectedUser, user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, options } = e.target;
    if (name === 'interests' && type === 'select-multiple') {
      setProfileForm(f => ({ ...f, interests: Array.from(options).filter(o => o.selected).map(o => o.value) }));
    } else {
      setProfileForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user?.id || user?._id}`, profileForm);
      setShowSettings(false);
      window.dispatchEvent(new Event('authUpdated'));
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 w-full">
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
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 mb-8 text-white w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
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
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full">
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

        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-300px)] w-full">
          <div className="flex flex-col md:flex-row h-full w-full">
            {/* Sidebar */}
            <div className={`${sidebarCollapsed ? 'w-16' : 'w-64 sm:w-80'} border-r border-gray-200 flex flex-col transition-all duration-300 bg-gray-50`}>
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
                {/* Direct Messages Section */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Direct Messages</h3>
                  <ul>
                    {users.map(u => (
                      <li key={u.id || u._id}>
                        <button onClick={() => setSelectedUser(u.id || u._id)} className={`w-full text-left px-2 py-1 rounded ${selectedUser === (u.id || u._id) ? 'bg-blue-100' : ''}`}>{u.name || u.username} {u.id === user?.id && '(You)'}</button>
                      </li>
                    ))}
                  </ul>
                </div>

                {filteredGroups.map((group) => (
                  <div
                    key={group._id || group.id}
                    onClick={() => setSelectedGroup(group._id || group.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors relative ${
                      selectedGroup === (group._id || group.id) ? 'bg-kenya-green bg-opacity-10 border-r-4 border-r-kenya-green' : ''
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
                              <span className="text-xs text-gray-500">{Array.isArray(group.members) ? group.members.length : 0} members</span>
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
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" onClick={() => setShowSettings(true)}>
                        <Settings className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col w-full">
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
                            <span>{groupMembers.length} member{groupMembers.length !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{currentGroup.description}</span>
                          </div>
                          {/* Show member avatars */}
                          <div className="flex -space-x-2 mt-1">
                            {groupMembers.slice(0, 5).map(member => (
                              <img
                                key={member.id || member._id}
                                src={member.avatar || member.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name || member.fullname || 'User')}
                                alt={member.name || member.fullname || 'User'}
                                className="w-7 h-7 rounded-full border-2 border-white shadow"
                                title={member.name || member.fullname || 'User'}
                              />
                            ))}
                            {groupMembers.length > 5 && (
                              <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border-2 border-white">+{groupMembers.length - 5}</span>
                            )}
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
                    {messages.map((message, index) => {
                      if (message.type === 'system' || message.messageType === 'system') {
                        return (
                          <div key={message.id || index} className="flex justify-center my-2">
                            <div className="bg-gray-200 text-gray-700 text-xs px-4 py-2 rounded-full shadow-sm">
                              {message.content || message.message}
                            </div>
                          </div>
                        );
                      }
                      const showAvatar = index === 0 || messages[index - 1].userId !== message.userId;

                      return (
                        <div key={message.id || index}>
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

        {/* Create Group Modal */}
        <Modal isOpen={showCreateGroup} onRequestClose={() => setShowCreateGroup(false)} ariaHideApp={false}>
          <form onSubmit={handleCreateGroup} className="p-4">
            <h2 className="text-lg font-bold mb-2">Create Group</h2>
            <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Group Name" value={newGroup.name} onChange={e => setNewGroup(g => ({ ...g, name: e.target.value }))} required />
            <input className="w-full border rounded px-2 py-1 mb-2" placeholder="Description" value={newGroup.description} onChange={e => setNewGroup(g => ({ ...g, description: e.target.value }))} />
            <div className="mb-2">
              <label className="block text-sm mb-1">Members</label>
              <select multiple className="w-full border rounded" value={newGroup.members} onChange={e => setNewGroup(g => ({ ...g, members: Array.from(e.target.selectedOptions, o => o.value) }))}>
                {users.map(u => (
                  <option key={u.id || u._id} value={u.id || u._id}>{u.name || u.username}</option>
                ))}
              </select>
      </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Create</button>
              <button type="button" className="bg-gray-300 px-4 py-1 rounded" onClick={() => setShowCreateGroup(false)}>Cancel</button>
            </div>
          </form>
        </Modal>

        {/* Edit Profile Modal */}
        <Modal isOpen={showSettings} onRequestClose={() => setShowSettings(false)} ariaHideApp={false}>
          <form onSubmit={handleProfileSave} className="p-4 max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-2">Edit Profile</h2>
            <input className="w-full border rounded px-2 py-1 mb-2" name="name" placeholder="Full Name" value={profileForm.name} onChange={handleProfileChange} required />
            <input className="w-full border rounded px-2 py-1 mb-2" name="avatar" placeholder="Avatar URL" value={profileForm.avatar} onChange={handleProfileChange} />
            <label className="block text-sm mb-1">Interests</label>
            <select multiple className="w-full border rounded mb-2" name="interests" value={profileForm.interests} onChange={handleProfileChange}>
              {INTEREST_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Save</button>
              <button type="button" className="bg-gray-300 px-4 py-1 rounded" onClick={() => setShowSettings(false)}>Cancel</button>
            </div>
          </form>
        </Modal>
      </div>
      {/* Floating Chatbot widget at bottom right */}
      <Chatbot />
    </div>
  );
};

export default CommunityPage; 