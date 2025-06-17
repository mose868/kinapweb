import { useState, useRef, useEffect } from 'react';
import { Search, Phone, MoreVertical, Send, Paperclip, Smile, MessageCircle, Settings, Bell, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  isOwn?: boolean;
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
}

const MazungumzoHub = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Demo groups with Kenyan/Swahili names and realistic conversations
  const demoGroups: ChatGroup[] = [
    {
      id: 'tech-wizards',
      name: 'Tech Wizards KE 🇰🇪',
      description: 'Kenyan developers sharing code, opportunities & tech trends',
      avatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop&crop=face',
      members: 1247,
      lastMessage: 'Grace: Nimeget gig ya React project, anyone interested in collaboration?',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      unreadCount: 3,
      isOnline: true,
      messages: [
        {
          id: '1',
          userId: 'user1',
          userName: 'Kevin Mwangi',
          userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          message: 'Mambo vipi wasee! Anyone working on Flutter projects hii 2025?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Grace Wanjiku',
          userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          message: 'Poa Kevin! Niko na React Native project, lakini Flutter pia ni poa. Unaeza share resources?',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        },
        {
          id: '3',
          userId: 'user3',
          userName: 'James Kamau',
          userAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          message: 'Haya wasee, nimeona job posting ya senior dev - KSh 180K. DM nikupeleke link',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          id: '4',
          userId: 'user2',
          userName: 'Grace Wanjiku',
          userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          message: 'Nimeget gig ya React project, anyone interested in collaboration? Client analipa vizuri',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
        }
      ]
    },
    {
      id: 'freelance-masters',
      name: 'Freelance Masters 💰',
      description: 'Kenyan freelancers sharing gigs, tips & success stories',
      avatar: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=100&h=100&fit=crop&crop=face',
      members: 892,
      lastMessage: 'Peter: Just closed a $2000 project! Celebration time 🎉',
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 7,
      isOnline: true,
      messages: [
        {
          id: '1',
          userId: 'user4',
          userName: 'Peter Ochieng',
          userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          message: 'Wasee, nimemaliza project ya web design - client from US. $2000! 🔥',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
          id: '2',
          userId: 'user5',
          userName: 'Mary Njeri',
          userAvatar: 'https://randomuser.me/api/portraits/women/23.jpg',
          message: 'Congratulations Peter! Uliget wapi hio client? Upwork ama Kinaps?',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
        },
        {
          id: '3',
          userId: 'user4',
          userName: 'Peter Ochieng',
          userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          message: 'LinkedIn actually! Nilipost portfolio yangu na client akareach out directly',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
        },
        {
          id: '4',
          userId: 'user4',
          userName: 'Peter Ochieng',
          userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
          message: 'Just closed a $2000 project! Celebration time 🎉',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
        }
      ]
    },
    {
      id: 'digital-marketing',
      name: 'Digital Marketing Pros 📱',
      description: 'Social media managers, content creators & digital marketers',
      avatar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop&crop=face',
      members: 634,
      lastMessage: 'Sarah: TikTok algorithm imebadilika, new strategies needed',
      lastMessageTime: new Date(Date.now() - 45 * 60 * 1000),
      unreadCount: 12,
      messages: [
        {
          id: '1',
          userId: 'user6',
          userName: 'Sarah Muthoni',
          userAvatar: 'https://randomuser.me/api/portraits/women/56.jpg',
          message: 'Guys, TikTok algorithm imebadilika sana. Content yangu haipati reach kama before',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '2',
          userId: 'user7',
          userName: 'David Kiprop',
          userAvatar: 'https://randomuser.me/api/portraits/men/78.jpg',
          message: 'True Sarah! Nimenotice pia. Lazima tuchange strategy. Consistency na engagement ni key',
          timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        },
        {
          id: '3',
          userId: 'user8',
          userName: 'Linda Akinyi',
          userAvatar: 'https://randomuser.me/api/portraits/women/89.jpg',
          message: 'Nimestart using Instagram Reels zaidi. Better engagement than TikTok currently',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          id: '4',
          userId: 'user6',
          userName: 'Sarah Muthoni',
          userAvatar: 'https://randomuser.me/api/portraits/women/56.jpg',
          message: 'TikTok algorithm imebadilika, new strategies needed. Let\'s brainstorm solutions',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
        }
      ]
    },
    {
      id: 'ajira-success',
      name: 'Ajira Success Stories 🏆',
      description: 'Share your wins, celebrate achievements & inspire others',
      avatar: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=100&h=100&fit=crop&crop=face',
      members: 2156,
      lastMessage: 'John: From zero to KSh 200K monthly income in 8 months!',
      lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      unreadCount: 5,
      messages: [
        {
          id: '1',
          userId: 'user9',
          userName: 'John Mutua',
          userAvatar: 'https://randomuser.me/api/portraits/men/12.jpg',
          message: 'Wasee, nilanza Ajira Digital training January 2024. Leo niko na consistent KSh 200K monthly!',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        },
        {
          id: '2',
          userId: 'user10',
          userName: 'Faith Wanjala',
          userAvatar: 'https://randomuser.me/api/portraits/women/34.jpg',
          message: 'Wow John! That\'s inspiring! What skills ulifocus on mostly?',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        },
        {
          id: '3',
          userId: 'user9',
          userName: 'John Mutua',
          userAvatar: 'https://randomuser.me/api/portraits/men/12.jpg',
          message: 'Web development na digital marketing. Nilianza na small projects then nikagraduate to bigger clients',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '4',
          userId: 'user9',
          userName: 'John Mutua',
          userAvatar: 'https://randomuser.me/api/portraits/men/12.jpg',
          message: 'From zero to KSh 200K monthly income in 8 months! Ajira Digital changed my life completely',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        }
      ]
    },
    {
      id: 'women-in-tech',
      name: 'Women in Tech KE 👩‍💻',
      description: 'Empowering Kenyan women in technology & digital careers',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c9c0e8e0?w=100&h=100&fit=crop&crop=face',
      members: 445,
      lastMessage: 'Alice: Mentorship program starting next week, register now!',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 2,
      messages: [
        {
          id: '1',
          userId: 'user11',
          userName: 'Alice Nyambura',
          userAvatar: 'https://randomuser.me/api/portraits/women/67.jpg',
          message: 'Ladies! Tunaanza mentorship program next week. Focus ni on career growth na technical skills',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
        {
          id: '2',
          userId: 'user12',
          userName: 'Rose Chebet',
          userAvatar: 'https://randomuser.me/api/portraits/women/78.jpg',
          message: 'That sounds amazing Alice! How do we register? I\'m interested in backend development mentorship',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        },
        {
          id: '3',
          userId: 'user11',
          userName: 'Alice Nyambura',
          userAvatar: 'https://randomuser.me/api/portraits/women/67.jpg',
          message: 'Mentorship program starting next week, register now! Link in bio. Limited slots available',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        }
      ]
    },
    {
      id: 'job-alerts',
      name: 'Job Alerts & Opportunities 💼',
      description: 'Latest remote jobs, gigs & career opportunities',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      members: 3421,
      lastMessage: 'Admin: 5 new remote developer positions posted today',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 15,
      messages: [
        {
          id: '1',
          userId: 'admin',
          userName: 'Job Bot',
          userAvatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop&crop=face',
          message: '🚨 NEW JOB ALERT: Senior React Developer - Remote - $3000-5000/month - US Company',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: '2',
          userId: 'admin',
          userName: 'Job Bot',
          userAvatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop&crop=face',
          message: '💼 Digital Marketing Manager - Part-time - KSh 80K/month - Nairobi based startup',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          id: '3',
          userId: 'admin',
          userName: 'Job Bot',
          userAvatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop&crop=face',
          message: '5 new remote developer positions posted today. Check pinned message for details!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
        }
      ]
    }
  ];

  const [groups] = useState<ChatGroup[]>(demoGroups);
  const [currentGroup, setCurrentGroup] = useState<ChatGroup | null>(null);

  // Auto-select first group on load for fast experience
  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0].id);
      setCurrentGroup(groups[0]);
    }
  }, [groups, selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      const group = groups.find(g => g.id === selectedGroup);
      setCurrentGroup(group || null);
    }
  }, [selectedGroup, groups]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentGroup?.messages]);

  const formatTime = (date: Date) => {
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
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentGroup) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      message: newMessage,
      timestamp: new Date(),
      isOwn: true
    };

    // Update the group's messages (in a real app, this would be handled by state management)
    if (currentGroup) {
      currentGroup.messages.push(message);
      currentGroup.lastMessage = `You: ${newMessage}`;
      currentGroup.lastMessageTime = new Date();
    }
    setNewMessage('');
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-red-600">Mazungumzo Hub</h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedGroup === group.id ? 'bg-red-50 border-r-2 border-r-red-500' : ''
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
                </div>
                
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{group.name}</h3>
                      <span className="text-xs text-gray-500">{formatTime(group.lastMessageTime)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{group.lastMessage}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{group.members} members</span>
                      {group.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {group.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              <User className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentGroup ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={currentGroup.avatar}
                    alt={currentGroup.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-900">{currentGroup.name}</h2>
                    <p className="text-sm text-gray-500">{currentGroup.members} members • {currentGroup.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                  <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentGroup.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.isOwn && (
                    <img
                      src={message.userAvatar}
                      alt={message.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-1' : ''}`}>
                    {!message.isOwn && (
                      <p className="text-sm font-medium text-gray-900 mb-1">{message.userName}</p>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.isOwn
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</p>
                  </div>
                  {message.isOwn && (
                    <img
                      src={message.userAvatar}
                      alt={message.userName}
                      className="w-8 h-8 rounded-full object-cover order-2"
                    />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Welcome to Mazungumzo Hub</h3>
              <p className="text-gray-500">Select a group to start chatting with the community</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MazungumzoHub; 