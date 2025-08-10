const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const ChatMessage = require('../models/ChatMessage');

const router = express.Router();

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDhj7xhHayAaoFeL8QKkm7c4yhi9b8-lPU'; // Updated API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Debug API key status
console.log('🔑 Gemini API Key Status:', {
  hasKey: !!GEMINI_API_KEY,
  keyLength: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
  keyPrefix: GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT SET'
});

// Enhanced conversation memory with MongoDB persistence
const MAX_CONVERSATION_HISTORY = 10;
const API_TIMEOUT = 30000; // 30 seconds timeout for more reliable responses

// Sophisticated fallback responses with guaranteed emojis and lively language
const contextualResponses = {
  personal_intro: {
    responses: [
      "👋 Nice to meet you! I'm Kinap Ajira Assistant, your AI companion for the Ajira Digital KiNaP Club! ✨ I'm excited to get to know you and help you explore all the amazing opportunities here! 🌟",
      "🎉 Wonderful! I'm Kinap Ajira Assistant, and I'm here to be your personal guide through the Ajira Digital universe! 🚀 I love meeting new members of our community and helping them discover their potential! 💫",
      "✨ Fantastic! I'm Kinap Ajira Assistant, your AI-powered friend for all things Ajira Digital and Kinap Ajira Club! 🌟 I'm here to make your journey amazing and help you connect with incredible opportunities! 🎯"
    ],
    follow_up: "Now that we've met, what would you like to explore? I can help with mentorship 🎯, marketplace opportunities 💼, training programs 📚, or Kinap Ajira Club activities! 🚀",
    cta: "Let's start your amazing journey! What interests you most? ✨"
  },
  greeting: {
    responses: [
      "👋 Hello there! I'm Kinap Ajira Assistant, your AI-powered guide for the Ajira Digital KiNaP Club! ✨ Whether you're here for mentorship, marketplace opportunities, training programs, or Kinap Ajira Club activities, I've got you covered! 🚀",
      "🌟 Hi! Welcome to Ajira Digital and the Kinap Ajira Club! I'm buzzing with excitement 🔥 to help you navigate our amazing platform and unlock your potential! What adventure shall we embark on today? 🎯",
      "✨ Greetings, future superstar! 🌟 I'm Kinap Ajira Assistant, here to make your Ajira Digital and Kinap Ajira Club journey absolutely fantastic! From connecting with mentors 🎯 to exploring our marketplace 💼, let's make magic happen! ⚡"
    ],
    follow_up: "Feel free to ask me about Kinap Ajira Club activities 🎯, mentorship opportunities 🎯, marketplace services 💼, training programs 📚, or anything else about our platform! 🌐"
  },
  mentorship: {
    responses: [
      "🎯 Our mentorship program is like having a GPS for your career! 🗺️ We use smart matching to connect you with industry rockstars who'll accelerate your growth! 🚀 Ready to level up your professional game? ⭐",
      "💡 Think of mentorship as your career superpower! 🦸‍♂️ Our platform matches you with amazing professionals who've walked your path and are excited to guide you! 🌟 Whether you're seeking wisdom or sharing expertise, magic happens here! ✨",
      "🚀 Our mentorship ecosystem is where careers transform! 📈 Join as a mentor to multiply your impact 🌟, or find your guide to navigate the professional universe! 🌌 Our AI makes these connections seamless and meaningful! 🎯"
    ],
    follow_up: "Want to discover your perfect mentor match 🎯, learn about becoming a mentor yourself 🌟, or understand how our smart matching works? 🤖",
    cta: "Ready to supercharge your career with mentorship? Let's find your perfect match! 🚀✨"
  },
  marketplace: {
    responses: [
      "🏪 Welcome to our digital marketplace wonderland! 🌟 Here you'll find verified professionals crafting digital magic ✨ - from stunning websites 💻 to captivating content 📝, all at your fingertips! 🎯",
      "💼 Our marketplace is where talent meets opportunity! 🤝 Discover incredible freelancers who'll bring your vision to life 🎨, with transparent pricing and stellar reviews to guide your choice! ⭐ It's like having a team of experts on speed dial! 📞",
      "⚡ Dive into our curated marketplace where quality is king! 👑 Every service provider is thoroughly vetted 🔍, ensuring you get professional results that'll make you smile! 😊 Your perfect project partner is just a click away! 🖱️"
    ],
    follow_up: "Looking to hire amazing talent for your project 🎯, or ready to showcase your skills to the world? 🌟",
    cta: "Let's find the perfect professional match for your project! Your success story starts here! 🚀✨"
  },
  training: {
    responses: [
      "📚 Our training programs are like rocket fuel for your career! 🚀 From beginner-friendly courses to advanced certifications, we've crafted learning paths that adapt to YOU! 🎯 Get ready to unlock skills that'll make you unstoppable! ⚡",
      "🎓 Transform into the professional you've always dreamed of being! ✨ Our expert-designed programs combine hands-on projects 🛠️, peer collaboration 🤝, and mentor support 🎯 to ensure you don't just learn - you THRIVE! 🌟",
      "💪 Stay ahead in the digital race with our cutting-edge skill development! 🏃‍♂️ Our AI-powered recommendations ensure you're always building the most in-demand superpowers 🦸‍♂️ in your field! Ready to become unstoppable? 🔥"
    ],
    follow_up: "What incredible skills are you excited to develop? 🎯 I can recommend the perfect learning adventure for you! 🗺️",
    cta: "Ready to unlock your potential? Let's explore our most exciting programs! 🚀📚"
  },
  technical: {
    responses: [
      "🔧 Technical challenges? I'm your digital superhero! 🦸‍♂️ Whether it's account wizardry ⚡, profile optimization magic 🌟, or solving mysterious platform puzzles 🧩, I'll make everything smooth as silk! 💫",
      "⚙️ Don't let technical hiccups slow down your momentum! 🚀 I'm here to transform confusing problems into easy solutions! ✨ From login mysteries 🔐 to feature navigation 🗺️, we'll conquer it all together! 💪",
      "🛠️ Consider me your personal tech genie! 🧞‍♂️ Ready to grant your wishes for seamless platform experience! ✨ Let's turn those technical frowns upside down and get you back to achieving greatness! 🌟"
    ],
    follow_up: "What technical adventure can I help you conquer today? 🎯 No challenge is too big for us! 💪",
    cta: "Let's banish those technical troubles forever! Your smooth experience awaits! 🚀✨"
  },
  kinap_club: {
    responses: [
      "🎉 Welcome to the Kinap Ajira Club! We're the vibrant community at Kiambu National Polytechnic where digital dreams come alive! 🌟 Our club hosts weekly meetings, skill-building workshops, and networking events that connect you with industry professionals! 🚀",
      "🏫 The Kinap Ajira Club is your gateway to the digital world! We meet every Wednesday at 2 PM in the Computer Lab, where we share knowledge, work on projects, and build amazing connections! 💡 Ready to join our next session? 📅",
      "🌟 The Kinap Ajira Club is where innovation meets opportunity! We organize hackathons, design challenges, and mentorship programs that help you build real-world projects and connect with potential employers! 🎯"
    ],
    follow_up: "Want to know about our next meeting schedule 📅, upcoming events 🎪, or how to join our projects? 🚀",
    cta: "Join our next Kinap Ajira Club meeting and start building your digital future! 🎉"
  },
  skill_specific: {
    responses: [
      "💻 Great question about skills! At Kinap Ajira Club, we offer specialized training in React, JavaScript, Python, UI/UX design, and more! Our expert mentors provide hands-on projects that build real-world experience! 🚀",
      "🎨 Skill development is our specialty! Whether you're into web development, graphic design, or digital marketing, we have structured learning paths with industry-standard tools and real client projects! 💪",
      "🔧 We focus on in-demand skills that employers actually want! From React development to SEO optimization, our training programs include portfolio-building projects and industry connections! 🌟"
    ],
    follow_up: "Which specific skill interests you most? I can tell you about our training programs, project opportunities, and career paths! 🎯",
    cta: "Let's explore the perfect skill path for your career goals! 🚀"
  },
  pricing: {
    responses: [
      "💰 Pricing on our marketplace is competitive and transparent! Freelancers typically charge $15-50/hour depending on experience and skill level. We help you set the right rates to attract quality clients! 💼",
      "💵 Our marketplace uses a fair pricing model! New sellers start around $15-25/hour, while experienced professionals can charge $30-50/hour. We provide pricing guidance based on your skills and market demand! 📊",
      "🎯 Smart pricing is key to success! We recommend starting with competitive rates ($15-25/hour) to build your client base, then gradually increasing as you gain reviews and experience! 📈"
    ],
    follow_up: "Need help setting your rates? I can analyze your skills and experience to suggest the perfect pricing strategy! 💡",
    cta: "Let's optimize your pricing for maximum success! 💰"
  },
  portfolio: {
    responses: [
      "🎨 Your portfolio is your digital business card! We help you create stunning portfolios showcasing your best work. Include 5-10 high-quality projects with detailed descriptions and live links! 📱",
      "💼 A great portfolio should tell your story! Include diverse projects, client testimonials, and before/after examples. We offer portfolio review sessions to help you stand out! 🌟",
      "📂 Portfolio tips: Start with 3-5 strong projects, include case studies, add client feedback, and keep it updated! Our design team can help you create a professional portfolio website! 🎯"
    ],
    follow_up: "Want portfolio review, design help, or tips for showcasing your work? I'm here to help! 🎨",
    cta: "Let's make your portfolio irresistible to clients! ✨"
  },
  registration: {
    responses: [
      "🚀 Ready to join the Kinap Ajira Club? Registration is simple! Click the 'Sign Up' button in the top right, fill in your details, and you'll get instant access to our community and marketplace! ✨",
      "📝 Getting started is easy! Create your account in 2 minutes, complete your profile, and start exploring opportunities. We'll guide you through every step of your journey! 🌟",
      "🎉 Welcome aboard! Registration takes just a few clicks. Once you're in, you can browse mentors, explore marketplace opportunities, and join our community events! 🚀"
    ],
    follow_up: "Need help with registration, profile setup, or getting started? I'm here to guide you! 💡",
    cta: "Start your Kinap Ajira Club journey today! 🎯"
  },
  general: {
    responses: [
      "🌐 I'm your comprehensive AI companion for the entire Ajira Digital universe! 🌟 Whether you need insider tips, career strategy, or platform guidance, I'm loaded with knowledge and ready to make your journey extraordinary! 🚀✨",
      "🤖 Powered by advanced AI and bursting with enthusiasm! 🔥 I'm here to transform your Ajira Digital experience from good to absolutely phenomenal! 🌟 Let's explore every corner of opportunity together! 🗺️",
      "✨ Think of me as your digital career fairy godmother! 🧚‍♀️ I combine AI superpowers 🦸‍♂️ with deep platform wisdom to give you personalized, actionable insights that'll make your professional dreams come true! 🌟🎯"
    ],
    follow_up: "I'm buzzing with excitement 🔥 to help with mentorship connections 🎯, marketplace navigation 💼, training recommendations 📚, technical support 🛠️, or any other questions dancing in your mind! 💭",
    cta: "Let's make your Ajira Digital journey absolutely legendary! What shall we conquer first? 🚀⭐"
  }
};

// Enhanced intent analysis with more sophisticated pattern matching
const analyzeIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  const words = lowerMessage.split(' ');
  
  // Personal introduction and name patterns
  if (/^(i'?m|i am|my name is|call me|i'?m called|this is|it'?s me)/i.test(lowerMessage)) {
    return 'personal_intro';
  }
  
  // Greeting patterns
  if (/^(hello|hi|hey|greetings|good\s*(morning|afternoon|evening)|what'?s up)/i.test(lowerMessage)) {
    return 'greeting';
  }
  
  // Kinap Ajira Club specific patterns
  if (/kinap|ajira\s*club|club\s*activities|events|meetings|community/i.test(lowerMessage)) {
    return 'kinap_club';
  }
  
  // Mentorship patterns
  if (/mentor|mentorship|guide|coaching|advice|career\s*guidance|professional\s*development/i.test(lowerMessage)) {
    return 'mentorship';
  }
  
  // Marketplace patterns
  if (/marketplace|service|gig|hire|freelanc|project|work|job|client|seller|buyer|become\s*seller/i.test(lowerMessage)) {
    return 'marketplace';
  }
  
  // Training patterns
  if (/train|course|learn|skill|education|program|certification|workshop|tutorial/i.test(lowerMessage)) {
    return 'training';
  }
  
  // Technical support patterns
  if (/help|support|problem|issue|error|bug|technical|login|account|profile|payment/i.test(lowerMessage)) {
    return 'technical';
  }
  
  // Specific skill questions
  if (/react|javascript|python|photoshop|ui|ux|design|seo|content|writing|web\s*development/i.test(lowerMessage)) {
    return 'skill_specific';
  }
  
  // Pricing and rates
  if (/price|rate|cost|hourly|payment|money|earn|income/i.test(lowerMessage)) {
    return 'pricing';
  }
  
  // Portfolio and work
  if (/portfolio|work|project|sample|example|showcase/i.test(lowerMessage)) {
    return 'portfolio';
  }
  
  // Registration and signup
  if (/sign\s*up|register|join|create\s*account|sign\s*in|login/i.test(lowerMessage)) {
    return 'registration';
  }
  
  return 'general';
};

// Get contextual response with follow-up
const getContextualResponse = (intent) => {
  const context = contextualResponses[intent] || contextualResponses.general;
  const response = context.responses[Math.floor(Math.random() * context.responses.length)];
  const followUp = context.follow_up;
  const cta = context.cta;
  
  return {
    main: response,
    followUp: followUp,
    cta: cta
  };
};

// Enhanced Gemini API call with better error handling and faster responses
const callGeminiAPI = async (userMessage, conversationHistory = []) => {
  console.log('🚀 Attempting Gemini API call...');
  console.log('🔑 API Key length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 'NOT SET');
  console.log('🌐 API URL:', GEMINI_API_URL);
  
  try {
    // Create context-aware prompt for Gemini with mandatory emoji usage
    const systemContext = `You are Kinap Ajira Assistant, an enthusiastic and helpful AI assistant for the Ajira Digital KiNaP Club platform. 

CRITICAL REQUIREMENTS:
- ALWAYS start your response with a relevant emoji
- Use 2-3 emojis throughout your response to make it lively and engaging
- Be warm, friendly, and conversational - like talking to a knowledgeable friend
- Show genuine interest in users and their personal information
- Respond naturally to personal introductions and casual conversation
- Give actionable advice and guidance about Ajira Digital topics
- Keep responses concise but informative (2-3 sentences max)
- Always maintain a positive, supportive tone
- Make every response feel like it's coming from an enthusiastic, helpful friend

Platform Services:
- Kinap Ajira Club: Community activities and events 🎉
- Mentorship: Connect professionals for career guidance 👨‍🏫
- Marketplace: Digital services and freelance opportunities 🛒
- Training: Skill development programs and courses 📚
- Community: Professional networking and growth 🌐

Personal Interaction Guidelines:
- If someone introduces themselves or shares their name, acknowledge it warmly
- Show interest in their personal journey and goals
- Remember personal details they share and reference them naturally
- Handle casual conversation while staying focused on Ajira Digital topics
- Be encouraging and supportive of their aspirations

Conversation History: ${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

EMOJI GUIDELINES:
- Use relevant emojis that match the topic (🚀 for growth, 💡 for ideas, 🎯 for goals, ✨ for success, etc.)
- Place emojis naturally within sentences, not just at the end
- Make the response feel alive and dynamic with emoji placement`;

    const payload = {
      contents: [{
        parts: [{
          text: `${systemContext}\n\nUser Message: ${userMessage}\n\nProvide a helpful, lively response with mandatory emojis (start with an emoji and use 2-3 throughout):`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch {}
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorBody}`);
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const response = data.candidates[0].content.parts[0].text.trim();
        console.log('✅ Gemini API call successful!');
        console.log('📝 Response length:', response.length);
        return response;
      }
      
      throw new Error('Invalid response format from Gemini API');
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Gemini API request timed out');
      }
            throw error;
    }
  } catch (error) {
    console.error('🚨 Gemini API error:', error.message);
    throw error;
  }
};

// Enhanced emoji processing for Gemini responses
const enhanceWithEmojis = (text) => {
  // If response already has emojis, return as is
  if (/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(text)) {
    return text;
  }
  
  // Add emojis based on content keywords
  const emojiMap = {
    'hello|hi|hey|greet': '👋',
    'mentor|guide|coach': '🎯',
    'learn|train|skill|course': '📚',
    'marketplace|service|work|job': '💼',
    'help|support|assist': '🤝',
    'success|achieve|goal': '🚀',
    'digital|tech|platform': '💻',
    'career|professional|grow': '📈',
    'community|network|connect': '🌐',
    'welcome|join|start': '✨',
    'question|ask|wonder': '🤔',
    'great|awesome|excellent': '⭐',
    'thank|appreciate|grateful': '🙏',
    'ready|excited|eager': '🔥'
  };
  
  let enhancedText = text;
  
  // Add opening emoji if none exists
  if (!text.match(/^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u)) {
    for (const [keywords, emoji] of Object.entries(emojiMap)) {
      if (new RegExp(keywords, 'i').test(text)) {
        enhancedText = `${emoji} ${enhancedText}`;
        break;
      }
    }
    // Default opening emoji if no match
    if (!enhancedText.startsWith(text)) {
      enhancedText = `🤖 ${enhancedText}`;
    }
  }
  
  // Add mid-sentence emojis
  enhancedText = enhancedText
    .replace(/\b(mentor|mentorship|guide|coaching)\b/gi, '$1 🎯')
    .replace(/\b(learn|training|skill|course)\b/gi, '$1 📚')
    .replace(/\b(marketplace|service|work)\b/gi, '$1 💼')
    .replace(/\b(success|achieve|goal)\b/gi, '$1 🚀')
    .replace(/\b(community|network|connect)\b/gi, '$1 🌐')
    .replace(/\b(digital|platform|tech)\b/gi, '$1 💻');
  
  return enhancedText;
};

// Extract user name from message
const extractUserName = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Patterns for name extraction
  const patterns = [
    /i'?m\s+([a-zA-Z]+)/i,
    /i am\s+([a-zA-Z]+)/i,
    /my name is\s+([a-zA-Z]+)/i,
    /call me\s+([a-zA-Z]+)/i,
    /i'?m called\s+([a-zA-Z]+)/i,
    /this is\s+([a-zA-Z]+)/i,
    /it'?s me\s+([a-zA-Z]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    }
  }
  
  return null;
};

// Generate interactive follow-up questions based on intent
const generateFollowUpQuestions = (intent, userMessage) => {
  const followUpMap = {
    personal_intro: [
      "🎯 What brings you to Ajira Digital today?",
      "💼 Are you interested in our marketplace or mentorship programs?",
      "📚 Would you like to explore our training opportunities?"
    ],
    kinap_club: [
      "🎯 What interests you most about our club activities?",
      "📅 Would you like to know about our next meeting schedule?",
      "🚀 Are you interested in joining our upcoming projects?"
    ],
    skill_specific: [
      "💻 Which specific skill would you like to learn more about?",
      "🎯 Are you looking for training programs or project opportunities?",
      "📚 Would you like to see our current course offerings?"
    ],
    pricing: [
      "💰 What's your current experience level?",
      "💡 Would you like help setting competitive rates?",
      "📊 Should I show you market rate comparisons?"
    ],
    portfolio: [
      "🎨 Do you need help creating your portfolio?",
      "📱 Would you like portfolio review services?",
      "💼 Are you looking for portfolio design templates?"
    ],
    registration: [
      "🚀 Ready to create your account now?",
      "📝 Need help with profile setup?",
      "🎯 Want to explore our features first?"
    ],
    mentorship: [
      "🎯 What type of mentorship are you looking for?",
      "💡 Are you interested in becoming a mentor or finding one?",
      "📅 Would you like to see our current mentor profiles?"
    ],
    marketplace: [
      "💼 Are you looking to hire services or offer them?",
      "🎯 What type of project do you have in mind?",
      "📊 Would you like to see our top-rated sellers?"
    ],
    training: [
      "📚 What skills are you most interested in developing?",
      "🎯 Are you a beginner or have some experience?",
      "💻 Would you like to see our learning paths?"
    ]
  };

  const questions = followUpMap[intent] || [];
  if (questions.length === 0) return '';

  // Randomly select 2-3 questions
  const selectedQuestions = questions
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 2);

  return `\n\n💭 Quick questions to help you better:\n${selectedQuestions.map(q => `• ${q}`).join('\n')}`;
};

// Enhanced response generation with hybrid approach and MongoDB persistence
const generateResponse = async (userMessage, conversationId, userId = null) => {
  const startTime = Date.now();
  
  try {
    // Get conversation history from MongoDB
    const history = await getConversationHistory(conversationId, 'chatbot');
    
    // Analyze intent for better contextual responses
    const intent = analyzeIntent(userMessage);
    
    // Extract user name if this is a personal introduction
    const userName = intent === 'personal_intro' ? extractUserName(userMessage) : null;
    
    // Prefer Gemini if enabled; otherwise try Gemini
    if (GEMINI_API_KEY) {
      try {
        // Add user name to context if available
        const enhancedMessage = userName 
          ? `${userMessage}\n\n[User's name is ${userName} - please acknowledge this warmly]`
          : userMessage;
        
        const geminiResponse = await callGeminiAPI(enhancedMessage, history);
        
        // Enhance with emojis if needed
        const livelyResponse = enhanceWithEmojis(geminiResponse);
        
        // Add interactive follow-up questions based on intent
        const followUpQuestions = generateFollowUpQuestions(intent, userMessage);
        
        const fullResponse = followUpQuestions.length > 0 
          ? `${livelyResponse}\n\n${followUpQuestions}`
          : livelyResponse;
        
        // Save messages to MongoDB
        await saveMessage(conversationId, userId, 'user', userMessage, 'chatbot');
        await saveMessage(conversationId, userId, 'assistant', fullResponse, 'chatbot', {
          source: 'gemini-ai',
          confidence: 'high',
          responseTime: Date.now() - startTime,
          model: 'gemini-1.5-flash'
        });
        
        const responseTime = Date.now() - startTime;
        console.log(`🚀 Gemini response generated in ${responseTime}ms`);
        
        return {
          message: fullResponse,
          source: 'gemini-ai',
          responseTime: responseTime,
          confidence: 'high'
        };
        
      } catch (geminiError) {
        console.log('⚠️ Gemini API failed, switching to intelligent fallback');
        console.error('Gemini error details:', geminiError.message);
        
        // Better error handling with specific messages
        if (geminiError.name === 'AbortError' || geminiError.message.includes('timeout')) {
          console.log('🕐 Gemini API timeout, using fallback');
        } else if (geminiError.message.includes('403') || geminiError.message.includes('401')) {
          console.log('🔐 Gemini API authentication error');
        } else if (geminiError.message.includes('429')) {
          console.log('📊 Gemini API rate limit exceeded');
        }
        
        // Fall through to contextual fallback
      }
    }
    
    // Enhanced fallback with contextual awareness
    const fallbackIntent = analyzeIntent(userMessage);
    const contextualResp = getContextualResponse(fallbackIntent);
    
    // Create a more dynamic response
    let fallbackResponse = contextualResp.main;
    
    // Add follow-up if appropriate
    if (Math.random() > 0.6 && contextualResp.followUp) {
      fallbackResponse += `\n\n${contextualResp.followUp}`;
    }
    
    // Save messages to MongoDB
    await saveMessage(conversationId, userId, 'user', userMessage, 'chatbot');
    await saveMessage(conversationId, userId, 'assistant', fallbackResponse, 'chatbot', {
      source: 'contextual-ai',
      confidence: 'medium',
      responseTime: Date.now() - startTime,
      model: 'contextual-ai'
    });
    
    const responseTime = Date.now() - startTime;
    console.log(`⚡ Contextual fallback response in ${responseTime}ms`);
    
    return {
      message: fallbackResponse,
      source: 'contextual-ai',
      responseTime: responseTime,
      confidence: 'medium'
    };
    
  } catch (error) {
    console.error('❌ Response generation failed:', error);
    
    // Ultimate fallback
    const fallbackMessage = "🤖 I'm here to help you with Ajira Digital! I can assist with mentorship, marketplace services, training programs, and more. What would you like to know?";
    
    // Save fallback messages to MongoDB
    try {
      await saveMessage(conversationId, userId, 'user', userMessage, 'chatbot');
      await saveMessage(conversationId, userId, 'assistant', fallbackMessage, 'chatbot', {
        source: 'fallback',
        confidence: 'low',
        responseTime: Date.now() - startTime,
        model: 'fallback'
      });
    } catch (saveError) {
      console.error('❌ Error saving fallback messages:', saveError);
    }
    
    const responseTime = Date.now() - startTime;
    return {
      message: fallbackMessage,
      source: 'fallback',
      responseTime: responseTime,
      confidence: 'low'
    };
  }
};

// Generate conversation ID
const generateConversationId = () => {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Save message to MongoDB
const saveMessage = async (conversationId, userId, role, content, messageType = 'chatbot', metadata = {}) => {
  try {
    // Ensure required fields for ChatMessage schema are present
    const messageId = Date.now().toString();
    const groupId = messageType === 'kinap-ai' ? 'kinap-ai-fallback' : 'chatbot-fallback';

    const message = new ChatMessage({
      messageId,
      groupId,
      conversationId,
      userId,
      role,
      // Mirror content into `message` to satisfy schema while keeping a single source of truth
      message: content,
      content,
      messageType,
      // Mark AI messages for analytics/filters
      isAIMessage: role !== 'user',
      metadata
    });
    await message.save();
    return message;
  } catch (error) {
    console.error('❌ Error saving message to MongoDB:', error);
    throw error;
  }
};

// Get conversation history from MongoDB
const getConversationHistory = async (conversationId, messageType = 'chatbot', limit = MAX_CONVERSATION_HISTORY) => {
  try {
    const messages = await ChatMessage.find({
      conversationId,
      messageType
    })
    .sort({ timestamp: 1 })
    .limit(limit)
    .lean();
    
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp
    }));
  } catch (error) {
    console.error('❌ Error retrieving conversation history:', error);
    return [];
  }
};

// Clear conversation from MongoDB
const clearConversation = async (conversationId, messageType = 'chatbot') => {
  try {
    await ChatMessage.deleteMany({
      conversationId,
      messageType
    });
    return true;
  } catch (error) {
    console.error('❌ Error clearing conversation:', error);
    return false;
  }
};

// Enhanced chat endpoint with better performance monitoring and MongoDB persistence
router.post('/chat', async (req, res) => {
  const requestStart = Date.now();
  
  try {
    const { message, conversationId, userId } = req.body;

    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Please provide a valid message',
        timestamp: new Date().toISOString()
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({ 
        error: 'Message too long. Please keep it under 1000 characters.',
        timestamp: new Date().toISOString()
      });
    }

    const convId = conversationId || generateConversationId();
    console.log(`💬 Processing message (${message.length} chars) for conversation: ${convId}`);

    const result = await generateResponse(message.trim(), convId, userId);
    
    const totalTime = Date.now() - requestStart;
    
    console.log(`✅ Total request processed in ${totalTime}ms using ${result.source}`);

    res.json({
      message: result.message,
      conversationId: convId,
      metadata: {
        source: result.source,
        confidence: result.confidence,
        responseTime: result.responseTime,
        totalTime: totalTime,
        timestamp: new Date().toISOString(),
        model: result.source === 'gemini-ai' ? 'gemini-1.5-flash' : 'contextual-ai'
      }
    });

  } catch (error) {
    console.error('❌ Chat endpoint error:', error);
    
    const totalTime = Date.now() - requestStart;
    
    res.status(500).json({
      message: "🤖 I'm experiencing some technical difficulties, but I'm still here to help! Please try asking your question again.",
      error: 'Internal server error',
      metadata: {
        source: 'error-fallback',
        confidence: 'low',
        totalTime: totalTime,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Get conversation history endpoint with MongoDB
router.get('/conversation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const history = await getConversationHistory(id, 'chatbot');
    
    res.json({
      conversationId: id,
      history: history,
      messageCount: history.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Conversation retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve conversation',
      timestamp: new Date().toISOString()
    });
  }
});

// Clear conversation endpoint with MongoDB
router.delete('/conversation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await clearConversation(id, 'chatbot');
    
    if (success) {
      res.json({
        message: 'Conversation cleared successfully',
        conversationId: id,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: 'Failed to clear conversation',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('❌ Conversation clearing error:', error);
    res.status(500).json({ 
      error: 'Failed to clear conversation',
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced health check with system status and MongoDB persistence
router.get('/health', async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  try {
    // Get conversation counts from MongoDB
    const chatbotCount = await ChatMessage.countDocuments({ messageType: 'chatbot' });
    const kinapAICount = await ChatMessage.countDocuments({ messageType: 'kinap-ai' });
    const uniqueConversations = await ChatMessage.distinct('conversationId');
    
    res.json({
      status: 'healthy',
      system: {
        model: 'gemini-1.5-flash',
        fallbackEnabled: true,
        apiConfigured: !!GEMINI_API_KEY,
        databaseConnected: true,
        totalMessages: chatbotCount + kinapAICount,
        uniqueConversations: uniqueConversations.length,
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        }
      },
      features: {
        geminiIntegration: !!GEMINI_API_KEY,
        contextualFallbacks: true,
        persistentStorage: true,
        conversationMemory: true,
        fastResponse: true,
        errorRecovery: true
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Performance metrics endpoint with MongoDB
router.get('/metrics', async (req, res) => {
  try {
    const chatbotCount = await ChatMessage.countDocuments({ messageType: 'chatbot' });
    const kinapAICount = await ChatMessage.countDocuments({ messageType: 'kinap-ai' });
    const uniqueConversations = await ChatMessage.distinct('conversationId');
    
    res.json({
      conversations: {
        total: chatbotCount + kinapAICount,
        chatbot: chatbotCount,
        kinapAI: kinapAICount,
        uniqueConversations: uniqueConversations.length
      },
      system: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Metrics error:', error);
    res.status(500).json({
      error: 'Failed to retrieve metrics',
      timestamp: new Date().toISOString()
    });
  }
});

// Kinap AI Chat Endpoint with MongoDB persistence
router.post('/kinap-ai', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { message, conversationId, userId } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        error: 'Message is required',
        timestamp: new Date().toISOString()
      });
    }

    // Generate conversation ID if not provided
    const convId = conversationId || generateConversationId();
    
    // Get conversation history from MongoDB
    const conversationHistory = await getConversationHistory(convId, 'kinap-ai');
    
    // Save user message to MongoDB
    await saveMessage(convId, userId, 'user', message, 'kinap-ai');

    // Create optimized system prompt for Kinap AI
    const systemPrompt = `You are Kinap AI, a friendly AI assistant for Ajira Digital KiNaP Club. Be helpful, use emojis, keep responses concise (2-3 sentences), and be engaging. Help with mentorship, marketplace, training, and community topics.`;

    // Call Gemini
    let aiResponse;
    if (GEMINI_API_KEY) {
      try {
        // Create a single prompt with system context and user message
        const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nKinap AI:`;
        
        // Create AbortController for timeout (compatible with older Node.js versions)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout for faster response
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: fullPrompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 512, // Reduced for faster responses
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          aiResponse = data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('Invalid response from Gemini API');
        }
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Gemini API error:', error.message);
        
        // Better error handling with specific messages
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          aiResponse = "I'm taking a bit longer than usual to respond. Let me try again with a simpler approach! 😊 What would you like to know about Ajira Digital?";
        } else if (error.message.includes('403') || error.message.includes('401')) {
          aiResponse = "I'm having authentication issues with my AI service. Let me help you with what I know about Ajira Digital! 🚀";
        } else if (error.message.includes('429')) {
          aiResponse = "I'm getting too many requests right now. Let me help you with Ajira Digital information while I wait! 💡";
        } else {
          aiResponse = "I'm having trouble connecting to my advanced AI capabilities right now, but I'm still here to help! 😊 What would you like to chat about?";
        }
      }
    } else {
      // Fallback when API key is not configured
      aiResponse = "I'm Kinap AI, your friendly assistant! I'm currently in basic mode, but I'd love to chat with you about anything! 😊 What's on your mind?";
    }

    // Save AI response to MongoDB
    await saveMessage(convId, userId, 'model', aiResponse, 'kinap-ai', {
      source: GEMINI_API_KEY ? 'gemini-api' : 'fallback',
      confidence: 'high',
      responseTime: Date.now() - startTime,
      model: GEMINI_API_KEY ? 'gemini-1.5-flash' : 'fallback'
    });

    const totalTime = Date.now() - startTime;

    res.json({
      response: aiResponse,
      conversationId: convId,
      metadata: {
        source: GEMINI_API_KEY ? 'gemini-api' : 'fallback',
        confidence: 'high',
        totalTime: `${totalTime}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Kinap AI error:', error);
    const totalTime = Date.now() - startTime;
    
    res.status(500).json({
      response: "I'm experiencing some technical difficulties, but I'm still here to help! 😊 Please try asking your question again.",
      error: 'Internal server error',
      metadata: {
        source: 'error-fallback',
        confidence: 'low',
        totalTime: `${totalTime}ms`,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Get Kinap AI conversation history with MongoDB
router.get('/kinap-ai/conversation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const history = await getConversationHistory(id, 'kinap-ai');
    
    res.json({
      conversationId: id,
      history: history,
      messageCount: history.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Kinap AI conversation retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve conversation',
      timestamp: new Date().toISOString()
    });
  }
});

// Clear Kinap AI conversation with MongoDB
router.delete('/kinap-ai/conversation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await clearConversation(id, 'kinap-ai');
    
    if (success) {
      res.json({
        message: 'Kinap AI conversation cleared successfully',
        conversationId: id,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        error: 'Failed to clear conversation',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('❌ Kinap AI conversation clearing error:', error);
    res.status(500).json({ 
      error: 'Failed to clear conversation',
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint for debugging Gemini API
router.get('/test-gemini', async (req, res) => {
  try {
    res.json({
      status: 'Gemini API Test',
      geminiKey: {
        configured: !!GEMINI_API_KEY,
        length: GEMINI_API_KEY ? GEMINI_API_KEY.length : 0,
        prefix: GEMINI_API_KEY ? GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT SET'
      },
      apiUrl: GEMINI_API_URL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Test failed',
      message: error.message
    });
  }
});

// Simple Gemini test endpoint
router.post('/test-gemini-call', async (req, res) => {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'AIzaSyDhj7xhHayAaoFeL8QKkm7c4yhi9b8-lPU') {
      return res.status(400).json({
        error: 'Gemini API key not configured',
        message: 'Please set GEMINI_API_KEY environment variable'
      });
    }

    const testResponse = await callGeminiAPI('Hello, this is a test message');
    
    res.json({
      success: true,
      response: testResponse,
      source: 'gemini-ai'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Gemini API test failed',
      message: error.message,
      source: 'fallback'
    });
  }
});

module.exports = router;