const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Enhanced conversation memory with better structure
const conversations = new Map();
const MAX_CONVERSATION_HISTORY = 10;
const API_TIMEOUT = 8000; // 8 seconds timeout for faster responses

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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
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
        maxOutputTokens: 200, // Shorter responses for speed
        stopSequences: []
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
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return data.candidates[0].content.parts[0].text.trim();
    }
    
    throw new Error('Invalid response format from Gemini API');
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.log('🕐 Gemini API timeout, using fallback');
    } else {
      console.error('🚨 Gemini API error:', error.message);
    }
    
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

// Enhanced response generation with hybrid approach
const generateResponse = async (userMessage, conversationId) => {
  const startTime = Date.now();
  
  try {
    // Get conversation history
    const history = conversations.get(conversationId) || [];
    
    // Analyze intent for better contextual responses
    const intent = analyzeIntent(userMessage);
    
    // Extract user name if this is a personal introduction
    const userName = intent === 'personal_intro' ? extractUserName(userMessage) : null;
    
    // Try Gemini API first for more sophisticated responses
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
        
        // Update conversation history
        const updatedHistory = [
          ...history,
          { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
          { role: 'assistant', content: fullResponse, timestamp: new Date().toISOString() }
        ].slice(-MAX_CONVERSATION_HISTORY);
        
        conversations.set(conversationId, updatedHistory);
        
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
    
    // Update conversation history
    const updatedHistory = [
      ...history,
      { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
      { role: 'assistant', content: fallbackResponse, timestamp: new Date().toISOString() }
    ].slice(-MAX_CONVERSATION_HISTORY);
    
    conversations.set(conversationId, updatedHistory);
    
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
    const responseTime = Date.now() - startTime;
    return {
      message: "🤖 I'm here to help you with Ajira Digital! I can assist with mentorship, marketplace services, training programs, and more. What would you like to know?",
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

// Enhanced chat endpoint with better performance monitoring
router.post('/chat', async (req, res) => {
  const requestStart = Date.now();
  
  try {
    const { message, conversationId } = req.body;

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

    const result = await generateResponse(message.trim(), convId);
    
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

// Get conversation history endpoint
router.get('/conversation/:id', (req, res) => {
  try {
    const { id } = req.params;
    const history = conversations.get(id) || [];
    
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

// Clear conversation endpoint
router.delete('/conversation/:id', (req, res) => {
  try {
    const { id } = req.params;
    conversations.delete(id);
    
    res.json({
      message: 'Conversation cleared successfully',
      conversationId: id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Conversation clearing error:', error);
    res.status(500).json({ 
      error: 'Failed to clear conversation',
      timestamp: new Date().toISOString()
    });
  }
});

// Enhanced health check with system status
router.get('/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  res.json({
    status: 'healthy',
    system: {
      model: 'gemini-1.5-flash',
      fallbackEnabled: true,
      apiConfigured: !!GEMINI_API_KEY,
      activeConversations: conversations.size,
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
      }
    },
    features: {
      geminiIntegration: !!GEMINI_API_KEY,
      contextualFallbacks: true,
      conversationMemory: true,
      fastResponse: true,
      errorRecovery: true
    },
    timestamp: new Date().toISOString()
  });
});

// Performance metrics endpoint
router.get('/metrics', (req, res) => {
  res.json({
    conversations: {
      active: conversations.size,
      total: conversations.size // In production, you'd track this separately
    },
    system: process.memoryUsage(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;