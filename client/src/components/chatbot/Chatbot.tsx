import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Paperclip,
  Smile,
  Mic,
  Trash2,
  Image,
  File,
  Video,
  Music,
} from 'lucide-react';
import EmojiPicker from '../common/EmojiPicker';
import FileUpload from '../common/FileUpload';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  messageType?: 'text' | 'image' | 'file' | 'voice' | 'video' | 'system';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
}

const Chatbot: React.FC = () => {
  const { user } = useBetterAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Generate user-specific storage keys and conversation ID
  const getUserStorageKey = () => {
    const userId = user?.id || user?.email || 'anonymous';
    return `kinap-chatbot-messages-${userId}`;
  };

  const getConversationId = () => {
    const userId = user?.id || user?.email || 'anonymous';
    return `conv_${userId}_${Date.now()}`;
  };

  // Load messages from localStorage on component mount
  useEffect(() => {
    if (!user) return; // Wait for user to load
    
    const userStorageKey = getUserStorageKey();
    const savedMessages = localStorage.getItem(userStorageKey);
    
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(parsedMessages);
    } else {
      // Initialize with welcome message if no saved messages
      const welcomeMessage: Message = {
        id: '1',
        text: `Hello${user?.name ? ` ${user.name}` : ''}! I'm your Ajira Digital assistant. How can I help you today? 🚀`,
        sender: 'bot',
        timestamp: new Date(),
        status: 'read',
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(userStorageKey, JSON.stringify([welcomeMessage]));
    }

    // Set conversation ID for this user
    if (!conversationId) {
      setConversationId(getConversationId());
    }
  }, [user]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && user) {
      const userStorageKey = getUserStorageKey();
      localStorage.setItem(userStorageKey, JSON.stringify(messages));
    }
  }, [messages, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading || isTyping) {
      scrollToBottom();
    }
  }, [isLoading, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleEmojiSelect = (emoji: string) => {
    setInputMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (files: any[]) => {
    setSelectedFiles(files);
    setShowFileUpload(false);
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && selectedFiles.length === 0) || isLoading)
      return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      messageType: selectedFiles.length > 0 ? 'file' : 'text',
      mediaUrl: selectedFiles[0]?.downloadUrl,
      fileName: selectedFiles[0]?.originalName,
      fileSize: selectedFiles[0]?.fileSize,
      fileType: selectedFiles[0]?.fileType,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setSelectedFiles([]);
    setIsLoading(true);

    // Update message status to sent
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    try {
      const response = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMessage.text,
          userId: user?.id || user?.email || null,
          conversationId: conversationId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`);
      }

      const data = await response.json();

      // Show typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
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
      }, 1500);
    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);

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

  const clearChat = () => {
    const welcomeMessage: Message = {
      id: '1',
      text: `Hello${user?.name ? ` ${user.name}` : ''}! I'm your Ajira Digital assistant. How can I help you today? 🚀`,
      sender: 'bot',
      timestamp: new Date(),
      status: 'read',
    };
    setMessages([welcomeMessage]);
    if (user) {
      const userStorageKey = getUserStorageKey();
      localStorage.setItem(userStorageKey, JSON.stringify([welcomeMessage]));
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return (
          <div className='w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin'></div>
        );
      case 'sent':
        return (
          <svg
            className='w-4 h-4 text-gray-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' />
          </svg>
        );
      case 'delivered':
        return (
          <svg
            className='w-4 h-4 text-gray-400'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
        );
      case 'read':
        return (
          <svg
            className='w-4 h-4 text-blue-500'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <div className='fixed left-6 bottom-6 z-50'>
        <button
          onClick={() => setIsOpen(true)}
          className='bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110'
          aria-label='Open chat'
        >
          <MessageCircle className='w-6 h-6' />
        </button>
      </div>
    );
  }

  return (
    <div className='fixed left-6 bottom-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden chat-container chat-fixed no-shake'>
      {/* Header - WhatsApp Style */}
      <div className='bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white p-4 flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
            <Bot className='w-5 h-5' />
          </div>
          <div>
            <h3 className='font-semibold text-sm'>Kinap Ajira Assistant</h3>
            <p className='text-xs opacity-90 flex items-center gap-1'>
              <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
              Online
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2'>
          <button
            onClick={clearChat}
            className='text-white/80 hover:text-white transition-colors p-1'
            aria-label='Clear chat'
            title='Clear chat history'
          >
            <Trash2 className='w-4 h-4' />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className='text-white/80 hover:text-white transition-colors p-1'
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? (
              <Maximize2 className='w-4 h-4' />
            ) : (
              <Minimize2 className='w-4 h-4' />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className='text-white/80 hover:text-white transition-colors p-1'
            aria-label='Close chat'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages - WhatsApp Style */}
          <div
            ref={messagesContainerRef}
            className='flex-1 h-80 overflow-y-auto bg-gray-50 p-4 space-y-3 chat-messages chat-scroll no-shake'
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
              backgroundSize: '20px 20px',
              minHeight: '320px',
              maxHeight: '320px',
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm relative ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                  }`}
                >
                  <div className='flex items-start space-x-2'>
                    {message.sender === 'bot' && (
                      <div className='w-8 h-8 bg-ajira-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <Bot className='w-4 h-4 text-white' />
                      </div>
                    )}
                    <div className='flex-1'>
                      {/* File Attachment */}
                      {message.messageType === 'file' && message.mediaUrl && (
                        <div className='mb-2'>
                          {message.fileType?.startsWith('image') ? (
                            <img
                              src={message.mediaUrl}
                              alt={message.fileName || 'Image'}
                              className='max-w-full rounded-lg'
                            />
                          ) : (
                            <div className='flex items-center space-x-2 p-2 bg-white/10 rounded-lg'>
                              {message.fileType?.startsWith('video') ? (
                                <Video className='w-4 h-4' />
                              ) : message.fileType?.startsWith('audio') ? (
                                <Music className='w-4 h-4' />
                              ) : (
                                <File className='w-4 h-4' />
                              )}
                              <div className='flex-1 min-w-0'>
                                <p className='text-xs font-medium truncate'>
                                  {message.fileName}
                                </p>
                                <p className='text-xs opacity-70'>
                                  {message.fileSize}
                                </p>
                              </div>
                              <a
                                href={message.mediaUrl}
                                download={message.fileName}
                                className='text-xs underline hover:no-underline'
                              >
                                Download
                              </a>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Message Text */}
                      {message.text && (
                        <p className='text-sm leading-relaxed'>
                          {message.text}
                        </p>
                      )}

                      <div
                        className={`flex items-center justify-between mt-1 ${
                          message.sender === 'user'
                            ? 'text-white/70'
                            : 'text-gray-500'
                        }`}
                      >
                        <span className='text-xs'>
                          {formatTime(message.timestamp)}
                        </span>
                        {message.sender === 'user' && (
                          <div className='flex items-center ml-2'>
                            {getStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                        <User className='w-4 h-4 text-white' />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className='flex justify-start'>
                <div className='bg-white text-gray-800 max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm border border-gray-200 rounded-bl-md'>
                  <div className='flex items-center space-x-2'>
                    <div className='w-8 h-8 bg-ajira-primary rounded-full flex items-center justify-center'>
                      <Bot className='w-4 h-4 text-white' />
                    </div>
                    <div className='flex space-x-1'>
                      <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input - WhatsApp Style */}
          <div className='bg-white border-t border-gray-200 p-4 relative chat-input no-shake'>
            {/* File Upload Modal */}
            {showFileUpload && (
              <div className='absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4'>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  multiple={false}
                  maxFiles={1}
                  maxSize={50}
                  uploadContext='chat'
                  uploadedBy='user'
                />
              </div>
            )}

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className='mb-3 p-2 bg-gray-50 rounded-lg'>
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className='flex items-center space-x-2 text-sm'
                  >
                    {file.mimeType?.startsWith('image') ? (
                      <Image className='w-4 h-4 text-blue-500' />
                    ) : file.mimeType?.startsWith('video') ? (
                      <Video className='w-4 h-4 text-purple-500' />
                    ) : file.mimeType?.startsWith('audio') ? (
                      <Music className='w-4 h-4 text-green-500' />
                    ) : (
                      <File className='w-4 h-4 text-gray-500' />
                    )}
                    <span className='flex-1 truncate'>{file.originalName}</span>
                    <button
                      onClick={() =>
                        setSelectedFiles(
                          selectedFiles.filter((_, i) => i !== index)
                        )
                      }
                      className='text-red-500 hover:text-red-700'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className='flex items-end gap-3'>
              <div className='relative'>
                <button
                  onClick={() => setShowFileUpload(!showFileUpload)}
                  className='p-2 text-gray-500 hover:text-gray-700 transition-colors'
                >
                  <Paperclip className='w-5 h-5' />
                </button>
              </div>

              <div className='flex-1 relative'>
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Type a message...'
                  rows={1}
                  className='w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent text-sm leading-relaxed bg-gray-50 placeholder-gray-500 transition-all duration-200 chat-textarea'
                  disabled={isLoading}
                />

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className='absolute bottom-full left-0 mb-2'>
                    <EmojiPicker
                      onEmojiSelect={handleEmojiSelect}
                      onClose={() => setShowEmojiPicker(false)}
                      position='top'
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className='p-2 text-gray-500 hover:text-gray-700 transition-colors'
              >
                <Smile className='w-5 h-5' />
              </button>

              {inputMessage.trim() || selectedFiles.length > 0 ? (
                <button
                  onClick={sendMessage}
                  disabled={isLoading}
                  className='p-3 bg-gradient-to-r from-ajira-primary to-ajira-secondary text-white rounded-full hover:from-ajira-primary/90 hover:to-ajira-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
                  aria-label='Send message'
                >
                  <Send className='w-5 h-5' />
                </button>
              ) : (
                <button className='p-3 text-gray-500 hover:text-gray-700 transition-colors'>
                  <Mic className='w-5 h-5' />
                </button>
              )}
            </div>
            <div className='mt-2 flex items-center justify-between text-xs text-gray-500'>
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span className='flex items-center gap-1'>
                <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
                Online
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
