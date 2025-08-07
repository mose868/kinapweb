import httpClient from './http';

// Chat API using our backend Gemini implementation
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const systemPrompt = `You are Kinap Ajira Assistant, a helpful assistant for the Ajira Digital KiNaP Club website. You can help users with:

1. Information about Ajira Digital and the KiNaP club (primary focus)
2. Details about Kinap Ajira Club activities, events, and programs
3. How to sign up and use the marketplace
4. Tips for creating good gig listings
5. Best practices for freelancing
6. Technical support for video uploads
7. General questions about digital skills and online work

Please focus primarily on Kinap Ajira Club related questions and be friendly, professional, and concise in your responses. If you don't know something, say so and suggest where they might find the information.`

type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export const generateChatResponse = async (messages: Message[]) => {
  try {
    // Get the last user message
    const lastUserMessage = messages
      .filter(msg => msg.role === 'user')
      .pop()?.content || '';

    if (!lastUserMessage) {
      throw new Error('No user message found');
    }

    // Call our backend Gemini API
    const response = await fetch('/api/chatbot/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: lastUserMessage
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      message: data.message || 'Sorry, I could not generate a response.',
    }
  } catch (error) {
    console.error('Error generating chat response:', error)
    throw error
  }
}

// Kinap AI API functions
export const kinapAIApi = {
  // Send message to Kinap AI
  sendMessage: async (message: string, conversationId?: string) => {
    try {
      const response = await httpClient.post('/chatbot/kinap-ai', {
        message,
        conversationId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to Kinap AI:', error);
      throw error;
    }
  },

  // Get conversation history
  getConversation: async (conversationId: string) => {
    try {
      const response = await httpClient.get(`/chatbot/kinap-ai/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting Kinap AI conversation:', error);
      throw error;
    }
  },

  // Clear conversation
  clearConversation: async (conversationId: string) => {
    try {
      const response = await httpClient.delete(`/chatbot/kinap-ai/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error clearing Kinap AI conversation:', error);
      throw error;
    }
  }
}; 