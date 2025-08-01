# Gemini AI Setup for KiNaP Community Hub

This guide explains how to set up Gemini AI for the KiNaP AI chatbot in the Community Hub.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account
2. **Gemini API Access**: Enable the Gemini API in your Google Cloud Console
3. **API Key**: Generate an API key for the Gemini API

## Setup Steps

### 1. Enable Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env` file in the `client` directory with the following content:

```env
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here

# Other API Configuration
VITE_API_URL=http://localhost:5000/api
```

**Important**: Replace `your_actual_gemini_api_key_here` with your actual Gemini API key.

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
# or
yarn dev
```

## Features

### What KiNaP AI Can Do

With Gemini AI integration, KiNaP AI can now:

- **Programming Help**: Assist with React, JavaScript, Python, Node.js, and other programming languages
- **Study Guidance**: Provide study tips, resources, and academic support
- **Project Ideas**: Suggest project ideas based on your skills and interests
- **Career Advice**: Offer career guidance and professional development tips
- **General Support**: Help with any questions about the KiNaP Ajira Digital Club
- **Contextual Responses**: Remember conversation history and user profile information

### Smart Features

- **User Context**: Uses your profile information (name, course, year, skills) to provide personalized responses
- **Conversation Memory**: Remembers recent conversation history for better context
- **Fallback System**: If Gemini is unavailable, falls back to pre-programmed responses
- **Safety Filters**: Implements Google's safety settings to ensure appropriate responses

## Testing

1. Go to the Community Hub
2. Click on "Kinap AI" in the chat list
3. Send a message like:
   - "Hello, how can you help me?"
   - "I need help with React programming"
   - "What project ideas do you have for a beginner?"
   - "How can I improve my study habits?"

## Troubleshooting

### Common Issues

1. **"I'm currently in offline mode"**
   - Check that your API key is correctly set in the `.env` file
   - Ensure the environment variable name is `VITE_GEMINI_API_KEY`
   - Restart the development server after adding the API key

2. **"I'm experiencing technical difficulties"**
   - Check the browser console for error messages
   - Verify your internet connection
   - Ensure the Gemini API is enabled in your Google Cloud Console

3. **Slow responses**
   - This is normal for AI responses
   - The system includes typing indicators to show the AI is thinking
   - Responses typically take 2-5 seconds

### API Key Security

- **Never commit your API key to version control**
- **Keep your `.env` file in `.gitignore`**
- **Use environment variables for production deployment**
- **Monitor your API usage in Google Cloud Console**

## Production Deployment

For production deployment, set the environment variable in your hosting platform:

- **Vercel**: Add `VITE_GEMINI_API_KEY` in the Environment Variables section
- **Netlify**: Add `VITE_GEMINI_API_KEY` in the Environment Variables section
- **Railway**: Add `VITE_GEMINI_API_KEY` in the Variables section

## Cost Considerations

- Gemini API has a free tier with generous limits
- Monitor your usage in Google Cloud Console
- Set up billing alerts to avoid unexpected charges
- Consider implementing rate limiting for production use

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key is working in Google AI Studio
3. Test with a simple message first
4. Contact the development team if problems persist

---

**Note**: The KiNaP AI chatbot is designed to be helpful and educational while maintaining appropriate content standards. All responses are filtered through Google's safety settings. 