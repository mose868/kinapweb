import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, X, User, Bot, Phone, Mail, ExternalLink, Clock, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot' | 'system'
  timestamp: Date
  type: 'text' | 'options' | 'contact' | 'escalation'
  options?: string[]
  isTyping?: boolean
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentStep, setCurrentStep] = useState('welcome')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [showContactForm, setShowContactForm] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // FAQ Database
  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I register for Ajira Digital KiNaP Club?',
      answer: 'To register, click on the "Join Ajira Digital" button on our homepage or go to the Auth page. Fill in your details including your KiNaP course, academic level, and skills interests. You\'ll receive a verification email to complete your registration.',
      category: 'Registration',
      keywords: ['register', 'sign up', 'join', 'account', 'create account']
    },
    {
      id: '2',
      question: 'What digital skills can I learn?',
      answer: 'We offer training in Web Development, Mobile Apps, Digital Marketing, Graphic Design, Data Entry, Content Writing, Virtual Assistance, Social Media Management, Video Editing, Financial Markets & Trading, E-commerce, and Freelancing.',
      category: 'Skills',
      keywords: ['skills', 'learn', 'training', 'courses', 'web development', 'design', 'marketing']
    },
    {
      id: '3',
      question: 'How do I access training materials?',
      answer: 'Once registered, go to the Training page from the navigation menu. You can also access Videos for tutorials and Blog for articles. Your progress is tracked in your Profile.',
      category: 'Training',
      keywords: ['training', 'materials', 'access', 'videos', 'tutorials', 'learn']
    },
    {
      id: '4',
      question: 'Can I earn money through Ajira Digital?',
      answer: 'Yes! You can earn through our Marketplace by offering digital services, participating in projects, freelancing opportunities, and by developing your skills to work with clients online.',
      category: 'Earning',
      keywords: ['earn', 'money', 'income', 'freelance', 'marketplace', 'projects']
    },
    {
      id: '5',
      question: 'What events do you organize?',
      answer: 'We organize workshops, training sessions, networking events, and skill-building seminars. Check our Events page for upcoming activities like Financial Markets workshops and Graphic Design masterclasses.',
      category: 'Events',
      keywords: ['events', 'workshops', 'seminars', 'networking', 'training sessions']
    },
    {
      id: '6',
      question: 'How do I become a mentor?',
      answer: 'Visit our Mentorship page to apply as a mentor. You need to have expertise in digital skills and be willing to guide other students. Fill out the mentor application form.',
      category: 'Mentorship',
      keywords: ['mentor', 'mentorship', 'teach', 'guide', 'help others']
    },
    {
      id: '7',
      question: 'I forgot my password, how do I reset it?',
      answer: 'On the login page, click "Forgot Password" and enter your email. You\'ll receive a password reset link. If you don\'t receive it, check your spam folder or contact support.',
      category: 'Account',
      keywords: ['password', 'reset', 'forgot', 'login', 'access']
    },
    {
      id: '8',
      question: 'How do I join the community discussions?',
      answer: 'Visit our Community Hub and Mazungumzo pages to participate in discussions. You can share experiences, ask questions, and connect with other members.',
      category: 'Community',
      keywords: ['community', 'discussions', 'mazungumzo', 'connect', 'chat']
    }
  ]

  // Quick action options
  const quickActions = [
    'Registration Help',
    'Training Information',
    'Account Issues',
    'Technical Support',
    'Event Information',
    'Speak to Agent'
  ]

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addMessage({
        id: Date.now().toString(),
        content: "👋 Hello! I'm your Ajira Digital KiNaP Club Assistant. I'm here to help you with registration, training, events, and general support.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      })

      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          content: "How can I assist you today?",
          sender: 'bot',
          timestamp: new Date(),
          type: 'options',
          options: quickActions
        })
      }, 1000)
    }
  }, [isOpen])

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  const simulateTyping = (callback: () => void, delay = 1500) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      callback()
    }, delay)
  }

  const findBestFAQ = (query: string): FAQ | null => {
    const lowerQuery = query.toLowerCase()
    
    // Find FAQ with matching keywords
    const matchedFAQ = faqs.find(faq => 
      faq.keywords.some(keyword => lowerQuery.includes(keyword.toLowerCase()))
    )
    
    return matchedFAQ || null
  }

  const handleQuickAction = (action: string) => {
    addMessage({
      id: Date.now().toString(),
      content: action,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    })

    simulateTyping(() => {
      switch (action) {
        case 'Registration Help':
          addMessage({
            id: Date.now().toString(),
            content: "I can help you with registration! Here's what you need to know:\n\n• Go to our homepage and click 'Join Ajira Digital'\n• Fill in your KiNaP course details\n• Select your skills interests\n• Verify your email\n\nNeed specific help with any step?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
          })
          break

        case 'Training Information':
          addMessage({
            id: Date.now().toString(),
            content: "We offer comprehensive training in:\n\n💻 Web Development\n🎨 Graphic Design\n📱 Digital Marketing\n💰 Financial Markets\n✍️ Content Writing\n🎥 Video Editing\n\nVisit our Training page or ask me about any specific skill!",
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
          })
          break

        case 'Account Issues':
          addMessage({
            id: Date.now().toString(),
            content: "I can help with common account issues:\n\n🔐 Password reset\n📧 Email verification\n👤 Profile updates\n🔔 Notification settings\n\nWhat specific issue are you experiencing?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
          })
          break

        case 'Technical Support':
          addMessage({
            id: Date.now().toString(),
            content: "For technical issues, I can help with:\n\n🌐 Website navigation\n📱 Mobile access\n🔄 Loading problems\n💾 File uploads\n\nDescribe your technical issue and I'll provide guidance!",
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
          })
          break

        case 'Event Information':
          addMessage({
            id: Date.now().toString(),
            content: "Upcoming events:\n\n📊 Financial Markets & Trading Workshop\n📅 Feb 15-16, 2025\n📍 KiNaP Finance Lab\n\n🎨 Graphic Design Mastery\n📅 March 8-9, 2025\n📍 KiNaP Design Studio\n\nCheck our Events page for more details and registration!",
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
          })
          break

        case 'Speak to Agent':
          handleAgentEscalation()
          break

        default:
          addMessage({
            id: Date.now().toString(),
            content: "I'm here to help! Please describe your question or issue, and I'll do my best to assist you.",
            sender: 'bot',
            timestamp: new Date(),
            type: 'text'
          })
      }
    })
  }

  const handleAgentEscalation = () => {
    addMessage({
      id: Date.now().toString(),
      content: "I'll connect you with a human agent for personalized assistance.",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    })

    setTimeout(() => {
      addMessage({
        id: Date.now().toString(),
        content: "Please choose how you'd like to contact our support team:",
        sender: 'bot',
        timestamp: new Date(),
        type: 'contact'
      })
    }, 1000)
  }

  const handleUserMessage = (message: string) => {
    addMessage({
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    })

    // Find relevant FAQ
    const matchedFAQ = findBestFAQ(message)

    simulateTyping(() => {
      if (matchedFAQ) {
        addMessage({
          id: Date.now().toString(),
          content: `${matchedFAQ.answer}\n\nWas this helpful? If you need more specific assistance, I can connect you with an agent.`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        })
      } else {
        addMessage({
          id: Date.now().toString(),
          content: "I understand you're looking for help, but I couldn't find a specific answer to your question. Let me connect you with one of our support agents who can provide personalized assistance.",
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        })
        
        setTimeout(() => {
          handleAgentEscalation()
        }, 1500)
      }
    })
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    handleUserMessage(input)
    setInput('')
  }

  const ContactOptions = () => (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
            <h4 className="font-semibold text-red-900 mb-3 flex items-center">
        <User className="w-4 h-4 mr-2" />
        Contact Our Support Team
      </h4>
      <div className="space-y-3">
        <a
          href="https://wa.me/254792343958"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-3 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
        >
          <Phone className="w-5 h-5 text-green-600 mr-3" />
          <div>
            <div className="font-medium text-green-800">WhatsApp Support</div>
            <div className="text-sm text-green-600">+254 792 343 958</div>
          </div>
          <ExternalLink className="w-4 h-4 text-green-600 ml-auto" />
        </a>
        
        <a
          href="mailto:support@ajiradigital.kinap.ac.ke"
          className="flex items-center p-3 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
        >
          <Mail className="w-5 h-5 text-red-600 mr-3" />
          <div>
            <div className="font-medium text-red-800">Email Support</div>
            <div className="text-sm text-red-600">support@ajiradigital.kinap.ac.ke</div>
          </div>
        </a>
        
        <div className="flex items-center p-3 bg-yellow-100 rounded-lg">
          <Clock className="w-5 h-5 text-yellow-600 mr-3" />
          <div>
            <div className="font-medium text-yellow-800">Support Hours</div>
            <div className="text-sm text-yellow-600">Mon-Fri: 8AM-6PM EAT</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-black text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'scale-0' : 'scale-100'
        } z-40 group`}
      >
        <MessageSquare className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Need Help?
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-0 right-0 w-full sm:w-96 bg-white shadow-2xl transition-all duration-300 ease-in-out transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } z-50 max-h-[90vh] flex flex-col rounded-t-xl sm:bottom-6 sm:right-6 sm:max-h-[600px] sm:rounded-xl border border-gray-200`}
      >
        {/* Header */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-black text-white p-4 rounded-t-xl">
          <div className="flex items-center">
            <div className="relative">
              <Bot className="w-6 h-6 mr-3" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <div className="font-semibold">Ajira Digital Assistant</div>
              <div className="text-xs text-red-100">KiNaP Club Support</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%]`}>
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-black rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-red-600 to-black text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-line">{message.content}</div>
                  
                  {message.type === 'options' && message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickAction(option)}
                          className="block w-full text-left p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium text-red-700"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {message.type === 'contact' && <ContactOptions />}
                  
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-black rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-xl">
          <form onSubmit={handleSend} className="flex items-center space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-r from-red-600 to-black text-white p-3 rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          <div className="mt-2 text-center">
            <button
              onClick={() => handleQuickAction('Speak to Agent')}
              className="text-xs text-red-600 hover:text-red-800 transition-colors"
            >
              Need to speak with a human agent? Click here
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chatbot 