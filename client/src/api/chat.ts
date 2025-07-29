// Chat API using our backend Hugging Face implementation
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const systemPrompt = `You are Kinap AI, a helpful assistant for the Ajira Digital KiNaP Club website. You can help users with:

1. Information about Ajira Digital and the KiNaP club
2. How to sign up and use the marketplace
3. Tips for creating good gig listings
4. Best practices for freelancing
5. Technical support for video uploads
6. General questions about digital skills and online work

Please be friendly, professional, and concise in your responses. If you don't know something, say so and suggest where they might find the information.`

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

    // Call our backend Hugging Face API
    const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
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
      message: data.response || 'Sorry, I could not generate a response.',
    }
  } catch (error) {
    console.error('Error generating chat response:', error)
    throw error
  }
} 