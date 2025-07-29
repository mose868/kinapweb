const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Intelligent fallback responses
const fallbackResponses = {
  greeting: [
    "Hello! I'm here to help you with your questions about Ajira Digital. How can I assist you today?",
    "Hi there! Welcome to Ajira Digital. What would you like to know about our services?",
    "Greetings! I'm Kinap AI, your assistant for Ajira Digital. How can I help you today?"
  ],
  mentorship: [
    "Our mentorship program connects you with experienced professionals in your field. You can apply to become a mentor or find one to guide your career.",
    "We offer personalized mentorship opportunities. Apply to become a mentor or browse available mentors to accelerate your career growth.",
    "Mentorship is a key part of our community. Join as a mentor to share your expertise or find a mentor to guide your journey."
  ],
  marketplace: [
    "Our marketplace offers digital services from verified professionals. Browse gigs, hire experts, or create your own service offerings.",
    "The Ajira Digital marketplace connects talented professionals with clients. Find services you need or offer your skills to others.",
    "Explore our marketplace for digital services, from web development to content creation. Quality work from verified professionals."
  ],
  training: [
    "We offer comprehensive training programs to enhance your digital skills. Check our training section for current programs.",
    "Our training programs help you develop in-demand digital skills. Browse available courses to advance your career.",
    "Skill development is crucial in the digital economy. Explore our training programs to stay competitive."
  ],
  general: [
    "I'm here to help you navigate Ajira Digital's services. Feel free to ask about mentorship, marketplace, training, or any other features.",
    "Ajira Digital is your platform for career growth. I can help you with mentorship, marketplace services, training, and more.",
    "Welcome to Ajira Digital! I can assist you with information about our various services and features."
  ]
};

// Get random response from array
const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

// Analyze user message to determine intent
const analyzeIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'greeting';
  }
  
  if (lowerMessage.includes('mentor') || lowerMessage.includes('mentorship') || lowerMessage.includes('guide')) {
    return 'mentorship';
  }
  
  if (lowerMessage.includes('marketplace') || lowerMessage.includes('service') || lowerMessage.includes('gig') || lowerMessage.includes('hire')) {
    return 'marketplace';
  }
  
  if (lowerMessage.includes('train') || lowerMessage.includes('course') || lowerMessage.includes('learn') || lowerMessage.includes('skill')) {
    return 'training';
  }
  
  return 'general';
};

// Generate response using instant responses instead of API calls
const generateResponse = async (userMessage) => {
  try {
    const intent = analyzeIntent(userMessage);
    
    // Instant responses based on intent
    const instantResponses = {
      greeting: [
        "Hello! I'm here to help you with your questions about Ajira Digital. How can I assist you today?",
        "Hi there! Welcome to Ajira Digital. What would you like to know about our services?",
        "Greetings! I'm Kinap AI, your assistant for Ajira Digital. How can I help you today?"
      ],
      mentorship: [
        "Our mentorship program connects you with experienced professionals in your field. You can apply to become a mentor or find one to guide your career.",
        "We offer personalized mentorship opportunities. Apply to become a mentor or browse available mentors to accelerate your career growth.",
        "Mentorship is a key part of our community. Join as a mentor to share your expertise or find a mentor to guide your journey."
      ],
      marketplace: [
        "Our marketplace offers digital services from verified professionals. Browse gigs, hire experts, or create your own service offerings.",
        "The Ajira Digital marketplace connects talented professionals with clients. Find services you need or offer your skills to others.",
        "Explore our marketplace for digital services, from web development to content creation. Quality work from verified professionals."
      ],
      training: [
        "We offer comprehensive training programs to enhance your digital skills. Check our training section for current programs.",
        "Our training programs help you develop in-demand digital skills. Browse available courses to advance your career.",
        "Skill development is crucial in the digital economy. Explore our training programs to stay competitive."
      ],
      general: [
        "I'm here to help you navigate Ajira Digital's services. Feel free to ask about mentorship, marketplace, training, or any other features.",
        "Ajira Digital is your platform for career growth. I can help you with mentorship, marketplace services, training, and more.",
        "Welcome to Ajira Digital! I can assist you with information about our various services and features."
      ]
    };

    // Get instant response
    const responses = instantResponses[intent] || instantResponses.general;
    return getRandomResponse(responses);
    
  } catch (error) {
    console.error('Response generation error:', error);
    
    // Fallback response
    return "I'm here to help you with Ajira Digital services. How can I assist you today?";
  }
};

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        message: 'Please provide a valid message' 
      });
    }

    console.log('🤖 Processing chat message:', message);

    const response = await generateResponse(message);

    console.log('✅ Chat response generated:', response);

    res.json({
      message: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Chat error:', error);
    
    // Always provide a fallback response
    const fallbackResponse = getRandomResponse(fallbackResponses.general);
    
    res.json({
      message: fallbackResponse,
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    model: 'gemini-pro',
    apiConfigured: !!GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 