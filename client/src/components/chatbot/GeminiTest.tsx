import React, { useState, useEffect, useRef } from 'react';
import { geminiAI } from '../../services/geminiAI';
import { Loader2, Send, CheckCircle, XCircle, Paperclip, Smile, Star, Users, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

const demoChannels = [
  {
    id: '1',
    name: 'Starred messages',
    lastMessage: '',
    unread: 0,
    avatar: '⭐',
    type: 'starred'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    lastMessage: 'No messages yet',
    unread: 0,
    avatar: '📱',
    type: 'channel'
  },
  {
    id: '3',
    name: 'Data Science',
    lastMessage: 'hi',
    unread: 0,
    avatar: '📊',
    type: 'channel'
  },
  {
    id: '4',
    name: 'Kinap AI',
    lastMessage: 'Hey there! Jonah is one of our amazing Ajira Digital mentors! 💡',
    unread: 0,
    avatar: '🤖',
    type: 'ai',
    isActive: true
  },
  {
    id: '5',
    name: 'UI/UX Design',
    lastMessage: 'No messages yet',
    unread: 0,
    avatar: '🎨',
    type: 'channel'
  },
  {
    id: '6',
    name: 'E-Commerce',
    lastMessage: 'No messages yet',
    unread: 0,
    avatar: '🛒',
    type: 'channel'
  },
  {
    id: '7',
    name: 'Blockchain',
    lastMessage: 'No messages yet',
    unread: 0,
    avatar: '⛓️',
    type: 'channel'
  }
];

const GeminiTest: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [selectedChannel, setSelectedChannel] = useState(demoChannels[3]); // Kinap AI by default
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, []);

  // Only scroll when a new message is added
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  const testConnection = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await geminiAI.generateResponse(
        'Hello, this is a test message.'
      );

      if (result.error) {
        setError(`Connection failed: ${result.error}`);
        setIsConnected(false);
      } else {
        setIsConnected(true);
        setError('');
      }
    } catch (err) {
      setError(
        `Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    // Update message status to sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    try {
      const result = await geminiAI.generateResponse(userMessage.text);

      if (result.error) {
        setError(`Error: ${result.error}`);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble connecting right now. Please try again later. 😔",
          sender: 'bot',
          timestamp: new Date(),
          status: 'read',
        };
        setMessages((prev) => [...prev, errorMessage]);
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.text,
          sender: 'bot',
          timestamp: new Date(),
          status: 'read',
        };
        setMessages((prev) => [...prev, botMessage]);

        // Update user message status to delivered
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        );
      }
    } catch (err) {
      setError(
        `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later. 😔",
        sender: 'bot',
        timestamp: new Date(),
        status: 'read',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-hidden chat-container no-shake" style={{ minHeight: '600px' }}>
      {/* Sidebar */}
      <aside className="flex flex-col w-full md:w-80 border-r h-64 md:h-full bg-white">
        {/* Search */}
        <div className="p-3 border-b">
          <input
            className="w-full px-3 py-2 rounded bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-ajira-primary"
            placeholder="Search"
          />
        </div>
        
        {/* Channel List */}
        <div className="flex-1 overflow-y-auto">
          {demoChannels.map((channel) => (
            <div
              key={channel.id}
              className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                selectedChannel.id === channel.id ? 'bg-ajira-primary bg-opacity-10 border-r-2 border-ajira-primary' : ''
              }`}
              onClick={() => setSelectedChannel(channel)}
            >
              <div className="w-10 h-10 rounded-full mr-3 flex items-center justify-center text-lg bg-gray-200">
                {channel.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-gray-900 truncate">
                  {channel.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {channel.lastMessage}
                </div>
              </div>
              {channel.unread > 0 && (
                <span className="bg-ajira-accent text-white text-xs px-2 py-1 rounded-full ml-2 min-w-[28px] text-center">
                  {channel.unread > 999 ? '999+' : channel.unread}
                </span>
              )}
              {channel.isActive && (
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2"></div>
              )}
            </div>
          ))}
          
          {/* User Status */}
          <div className="p-3 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full mr-3 bg-ajira-secondary flex items-center justify-center text-white text-sm font-semibold">
                MK
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-gray-900">Moses Kimani</div>
                <div className="text-xs text-green-600">Online</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-gray-50 relative">
        {/* Header */}
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b bg-white sticky top-0 z-10">
          <div>
            <h2 className="font-bold text-base sm:text-lg flex items-center gap-2 text-gray-900">
              {selectedChannel.name}
              {selectedChannel.isActive && (
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </h2>
            <span className="text-xs text-gray-500">1 member</span>
          </div>
          <div className="text-xs text-ajira-primary cursor-pointer">
            Connection: {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-0 py-4 sm:py-6 chat-messages chat-scroll no-shake">
          {messages.length === 0 && (
            <div className="flex justify-center items-center h-40 text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} px-2 sm:px-6`}
            >
              <div
                className={`max-w-[90vw] sm:max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-ajira-primary text-white rounded-br-none' 
                    : 'bg-white text-gray-900 rounded-bl-none border'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="block text-xs font-semibold">
                    {msg.sender === 'user' ? 'You' : 'Kinap AI'}
                  </span>
                  <span className="text-xs opacity-70">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className="text-sm leading-relaxed">{msg.text}</div>
                {msg.status && (
                  <div className="text-xs opacity-70 mt-1">
                    {msg.status === 'sending' && 'Sending...'}
                    {msg.status === 'sent' && '✓ Sent'}
                    {msg.status === 'delivered' && '✓ Delivered'}
                    {msg.status === 'read' && '✓ Read'}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start px-2 sm:px-6 mb-4">
              <div className="bg-white text-gray-900 rounded-2xl rounded-bl-none border px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Kinap AI is typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="h-20 px-2 sm:px-6 py-3 bg-white flex items-center gap-2 border-t sticky bottom-0 z-10 chat-input no-shake">
          <button className="text-xl text-gray-500 hover:text-ajira-primary transition-colors duration-200">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="text-xl text-gray-500 hover:text-ajira-primary transition-colors duration-200">
            <Smile className="w-5 h-5" />
          </button>
          <input
            className="flex-1 px-3 py-2 rounded-lg bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-ajira-primary text-sm sm:text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Kinap AI anything..."
            disabled={isLoading}
          />
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 ${
              isLoading || !input.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-ajira-primary text-white hover:bg-ajira-primary-dark'
            }`}
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Connection Status */}
        <div className="px-2 sm:px-6 py-2 bg-gray-50 border-t text-xs text-gray-500">
          Enter to send • Shift+Enter for new line
          {isConnected !== null && (
            <span className={`ml-4 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? '● Online' : '○ Offline'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiTest;
