// Gemini AI Service for KiNaP Community Hub

interface GeminiResponse {
  text: string;
  error?: string;
}

interface ChatContext {
  userMessage: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  userProfile?: {
    name?: string;
    course?: string;
    year?: string;
    skills?: string[];
  };
}

class GeminiAIService {
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  private async makeRequest(prompt: string, context?: ChatContext): Promise<GeminiResponse> {
    if (!this.apiKey) {
      return {
        text: "I'm sorry, but I'm currently in offline mode. Please check back later or contact support if you need immediate assistance.",
        error: "No API key configured"
      };
    }

    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const fullPrompt = `${systemPrompt}\n\nUser: ${prompt}\n\nKiNaP AI:`;

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
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
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return {
          text: data.candidates[0].content.parts[0].text.trim()
        };
      } else {
        throw new Error('Invalid response format from Gemini API');
      }

    } catch (error) {
      console.error('Gemini AI Error:', error);
      return {
        text: "I'm experiencing some technical difficulties right now. Please try again in a moment, or feel free to ask me something else!",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildSystemPrompt(context?: ChatContext): string {
    return `You are KiNaP AI, a friendly and knowledgeable AI assistant for the KiNaP (Kiambu National Polytechnic) Ajira Digital Club community. You help students with:

**Your Role:**
- Programming and technical questions (React, JavaScript, Python, Node.js, etc.)
- Study guidance and academic support
- Project ideas and development help
- Career advice and professional development
- General chat and community support
- Ajira Digital program information

**Your Personality:**
- Friendly, encouraging, and supportive
- Use emojis occasionally to keep conversations engaging
- Be patient and explain concepts clearly
- Encourage learning and growth
- Be helpful but also promote community engagement

**Context:**
- You're part of the KiNaP Ajira Digital Club
- You help students develop digital skills
- You promote the Ajira Digital program
- You encourage collaboration and community building

**Response Guidelines:**
- Keep responses conversational and helpful
- Use appropriate emojis to make responses engaging
- Provide practical, actionable advice
- Encourage students to explore and learn
- Be supportive of their learning journey
- If you don't know something, be honest and suggest resources

**User Context:**
${context?.userProfile ? `
- User Name: ${context.userProfile.name || 'Student'}
- Course: ${context.userProfile.course || 'Not specified'}
- Year: ${context.userProfile.year || 'Not specified'}
- Skills: ${context.userProfile.skills?.join(', ') || 'Not specified'}
` : '- No specific user profile available'}

Remember: You're here to help KiNaP students succeed in their digital skills journey! 🌟`;
  }

  public async generateResponse(userMessage: string, context?: ChatContext): Promise<GeminiResponse> {
    return await this.makeRequest(userMessage, context);
  }

  public async generateProgrammingHelp(code: string, language: string, question: string): Promise<GeminiResponse> {
    const prompt = `I need help with ${language} programming. Here's my code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nQuestion: ${question}\n\nPlease help me understand and improve this code.`;
    return await this.makeRequest(prompt);
  }

  public async generateStudyAdvice(topic: string, difficulty: string): Promise<GeminiResponse> {
    const prompt = `I'm studying ${topic} and finding it ${difficulty}. Can you give me some study tips and resources to help me understand this better?`;
    return await this.makeRequest(prompt);
  }

  public async generateProjectIdeas(skills: string[], interests: string): Promise<GeminiResponse> {
    const prompt = `I have skills in: ${skills.join(', ')} and I'm interested in ${interests}. Can you suggest some project ideas that would help me practice and showcase these skills?`;
    return await this.makeRequest(prompt);
  }

  public async generateCareerAdvice(goal: string, currentSkills: string[]): Promise<GeminiResponse> {
    const prompt = `My career goal is to ${goal}. My current skills include: ${currentSkills.join(', ')}. What advice do you have for me to achieve this goal?`;
    return await this.makeRequest(prompt);
  }
}

// Create singleton instance
export const geminiAI = new GeminiAIService();

// Fallback responses for when Gemini is not available
export const fallbackResponses = {
  greeting: [
    "Hello! 👋 I'm Kinap AI, your friendly assistant! How can I help you today?",
    "Hi there! 🌟 I'm here to help you with programming, studying, and more. What's on your mind?",
    "Hey! 😊 Welcome to the KiNaP community. How can I assist you today?"
  ],
  programming: [
    "I'd love to help you with programming! 💻 What specific language or framework are you working with?",
    "Programming is exciting! 🚀 Tell me more about what you're building or learning.",
    "Great! Let's dive into some code! 💪 What programming challenge are you facing?"
  ],
  study: [
    "Learning is a journey! 📚 What are you currently studying? I can help you with strategies and resources.",
    "Education is the key to success! 🎓 What subject or topic are you working on?",
    "Studying can be challenging but rewarding! 📖 How can I help you with your studies?"
  ],
  project: [
    "Building projects is the best way to learn! 💡 What kind of project are you working on?",
    "Projects are where theory meets practice! 🔨 Tell me about what you're building.",
    "Creating something new is always exciting! 🎨 What project are you developing?"
  ],
  career: [
    "Career development is important! 🚀 What are your professional goals?",
    "Building a career in tech is exciting! 💼 How can I help you with your career path?",
    "Your future is bright! ⭐ What career advice are you looking for?"
  ],
  default: [
    "That's interesting! 🤔 Tell me more about that.",
    "I'd love to help you with that! 💪 What specific questions do you have?",
    "Great question! 🎯 Let me think about that...",
    "I'm here to help! 😊 Could you give me a bit more context?",
    "That sounds fascinating! 🌟 I'd be happy to discuss this further.",
    "Thanks for sharing! 🙏 How can I assist you with this?",
    "I'm all ears! 👂 What would you like to explore together?",
    "That's a good point! 👍 Let's dive deeper into this topic."
  ]
};

export default geminiAI; 