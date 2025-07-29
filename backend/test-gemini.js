const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...');
  console.log('API Key configured:', !!GEMINI_API_KEY);
  console.log('API URL:', GEMINI_API_URL);
  
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('Please add GEMINI_API_KEY=your_api_key to your .env file');
    return;
  }

  try {
    const testPrompt = 'Hello! I am testing the Gemini API. Please respond with a simple greeting.';
    
    console.log('📤 Sending test request...');
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: testPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 100,
        }
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Full response:', JSON.stringify(result, null, 2));
    
    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      const generatedText = result.candidates[0].content.parts[0].text;
      console.log('✅ Gemini API is working!');
      console.log('Response:', generatedText);
    } else {
      console.log('⚠️  Unexpected response format:', JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    
    if (error.message.includes('400')) {
      console.log('This might be due to invalid API key or quota exceeded');
    } else if (error.message.includes('403')) {
      console.log('API key might be invalid or restricted');
    } else if (error.message.includes('404')) {
      console.log('API endpoint might be incorrect');
    }
  }
}

// Test chatbot endpoint
async function testChatbotEndpoint() {
  console.log('\n🤖 Testing chatbot endpoint...');
  
  try {
    const response = await fetch('http://localhost:5000/api/chatbot/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, can you help me with digital skills?'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Chatbot endpoint is working!');
    console.log('Response:', result.message);

  } catch (error) {
    console.error('❌ Chatbot endpoint test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testGeminiAPI();
  await testChatbotEndpoint();
}

runTests(); 