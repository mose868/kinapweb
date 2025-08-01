import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import { FaPaperclip, FaSmile } from 'react-icons/fa';

const SOCKET_URL = 'http://localhost:5000';

const demoChats = [
  {
    id: '1',
    name: 'Risk-reward ratio 1:2',
    lastMessage: 'Watch the 12th...',
    unread: 115,
    avatar: 'https://ui-avatars.com/api/?name=Risk&background=1B4F72&color=fff',
  },
  {
    id: '2',
    name: 'JPY MANIACC',
    lastMessage: 'Photo',
    unread: 1000,
    avatar: 'https://ui-avatars.com/api/?name=JPY&background=2E8B57&color=fff',
  },
  {
    id: '3',
    name: 'NASDQ&US30 BULL',
    lastMessage: 'Hello',
    unread: 510,
    avatar: 'https://ui-avatars.com/api/?name=NASDQ&background=FF6B35&color=fff',
  },
];

const CommunityChat: React.FC = () => {
  const { user, isLoading } = useBetterAuthContext();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedChat, setSelectedChat] = useState(demoChats[0]);
  const prevMessagesLength = useRef(messages.length);

  // Debug log for user object
  useEffect(() => {
    console.log('Auth user object:', user);
  }, [user]);

  // Connect to socket only if user and user.id or user._id are valid
  useEffect(() => {
    if (!user) {
      console.log('No user object, not connecting socket.');
      return;
    }
    const userId = user.id || user._id;
    if (!userId) {
      console.log('User object missing id and _id:', user);
      return;
    }
    const s = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(s);
    s.emit('join', userId);
    s.on('private_message', (msg) => {
      setMessages((prev) => [...prev, { ...msg, type: 'private' }]);
    });
    s.on('group_message', (msg) => {
      setMessages((prev) => [...prev, { ...msg, type: 'group' }]);
    });
    return () => { s.disconnect(); };
  }, [user]);

  // Only scroll when a new message is added
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const sendPrivateMessage = () => {
    const userId = user?.id || user?._id;
    if (socket && input.trim() && userId) {
      const msg = { sender: userId, recipient: 'user2', content: input, type: 'text' };
      socket.emit('private_message', msg);
      setMessages((prev) => [...prev, { ...msg, self: true, type: 'private' }]);
      setInput('');
    }
  };

  if (isLoading) return <div>Loading chat...</div>;
  if (!user) return <div>Please log in to use chat.</div>;

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-x-hidden" style={{ minHeight: '600px' }}>
      {/* Sidebar */}
      <aside className="flex flex-col w-full md:w-80 border-r h-64 md:h-full bg-white">
        {/* Search */}
        <div className="p-3 border-b">
          <input
            className="w-full px-3 py-2 rounded bg-gray-100"
            placeholder="Search"
          />
        </div>
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {demoChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${selectedChat.id === chat.id ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <div className="font-semibold text-sm">{chat.name}</div>
                <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
              </div>
              {chat.unread > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-2 min-w-[28px] text-center">{chat.unread > 999 ? '999+' : chat.unread}</span>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[url('https://www.transparenttextures.com/patterns/symphony.png')] bg-repeat relative w-full" style={{ minHeight: '400px' }}>
        {/* Header */}
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b bg-white sticky top-0 z-10 w-full">
          <div>
            <h2 className="font-bold text-base sm:text-lg flex items-center gap-2">{selectedChat.name} <span className="text-xs text-gray-500">1:2📊📈</span></h2>
            <span className="text-xs text-gray-500">265 members</span>
          </div>
          <div className="text-xs text-blue-600 cursor-pointer">Pinned message #50</div>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-0 py-4 sm:py-6 w-full" style={{ background: 'none', minHeight: '200px' }}>
          {/* Unread separator */}
          <div className="flex justify-center my-2">
            <span className="bg-green-200 px-3 py-1 rounded text-xs font-bold shadow">Unread Messages</span>
          </div>
          {/* Date separator */}
          <div className="flex justify-center my-2">
            <span className="bg-white px-3 py-1 rounded text-xs text-gray-500 shadow">July 7</span>
          </div>
          {/* Messages */}
          {messages.length === 0 && (
            <div className="flex justify-center items-center h-40 text-gray-400">No messages yet.</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`mb-2 flex ${msg.self ? 'justify-end' : 'justify-start'} px-2 sm:px-6`}>
              <div className={`max-w-[90vw] sm:max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow ${msg.self ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
                <span className="block text-xs font-semibold mb-1">{msg.self ? 'You' : msg.sender}</span>
                <span>{msg.content}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
        {/* Input */}
        <div className="h-20 px-2 sm:px-6 py-3 bg-white flex items-center gap-2 border-t sticky bottom-0 z-10 w-full">
          <button className="text-xl text-gray-500 hover:text-blue-500"><FaSmile /></button>
          <button className="text-xl text-gray-500 hover:text-blue-500"><FaPaperclip /></button>
        <input
            className="flex-1 px-3 py-2 rounded bg-gray-100 border focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
          value={input}
          onChange={e => setInput(e.target.value)}
            placeholder="Message"
          onKeyDown={e => { if (e.key === 'Enter') sendPrivateMessage(); }}
        />
          <button className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded font-semibold hover:bg-blue-600 text-sm sm:text-base" onClick={sendPrivateMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat; 