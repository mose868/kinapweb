# Kinap AI Setup Guide

This guide will help you get the Kinap AI chatbot working in the Community Hub.

## Prerequisites

1. **Backend Server**: Make sure your backend server is running on port 5000
2. **Gemini API Key**: Get a Gemini API key from Google AI Studio
3. **Environment Variables**: Configure both frontend and backend

## Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Configure Backend Environment

Create a `.env` file in the `backend` directory:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Step 3: Configure Frontend Environment

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Other configurations as needed
```

## Step 4: Start Backend Server

In the `backend` directory, run:

```bash
npm install
npm start
```

You should see:
```
MongoDB connected
Server running on port 5000
```

## Step 5: Start Frontend Server

In the `client` directory, run:

```bash
npm install
npm run dev
```

## Step 6: Test Kinap AI

1. Go to the Community Hub in your application
2. Click on "Kinap AI" in the chat list
3. Send a test message like "Hello, how can you help me?"

## Troubleshooting

### Backend Issues

1. **"MongoDB connection error"**
   - Check your MongoDB URI in the `.env` file
   - Ensure MongoDB is running

2. **"GEMINI_API_KEY is not defined"**
   - Check that your `.env` file is in the backend directory
   - Verify the API key is correct
   - Restart the backend server

3. **"Port 5000 already in use"**
   - Change the PORT in your `.env` file
   - Update the frontend API URL accordingly

### Frontend Issues

1. **"Failed to fetch" errors**
   - Check that the backend is running on port 5000
   - Verify the API URL in your frontend `.env` file
   - Check browser console for CORS errors

2. **"No response from AI"**
   - Check backend console for Gemini API errors
   - Verify your Gemini API key is working
   - Check network tab in browser dev tools

### API Key Issues

1. **"I'm currently in offline mode"**
   - Check that your API key is correctly set in the backend `.env` file
   - Ensure the environment variable name is `GEMINI_API_KEY`
   - Restart the backend server after adding the API key

2. **"I'm experiencing technical difficulties"**
   - Check the backend console for error messages
   - Verify your internet connection
   - Ensure the Gemini API is enabled in your Google Cloud Console

## Expected Behavior

When working correctly:

1. **Backend Health Check**: Visit `http://localhost:5000/api/chatbot/health`
2. **Chatbot Responses**: Intelligent, contextual responses with emojis
3. **Conversation Memory**: Remembers previous messages in the conversation
4. **Fallback System**: Uses pre-programmed responses if Gemini is unavailable

## Features

The Kinap AI chatbot includes:

- **Gemini AI Integration**: Uses Google's Gemini 1.5 Flash model
- **Contextual Responses**: Understands user intent and provides relevant answers
- **Conversation Memory**: Remembers up to 10 previous messages
- **Fallback System**: Graceful degradation when AI is unavailable
- **Safety Filters**: Implements Google's content safety settings
- **User Context**: Uses profile information for personalized responses
- **Persistent Storage**: All chat messages are saved to MongoDB and persist across sessions
- **Chat Management**: Delete entire chat conversations with confirmation
- **Message Search**: Search through chat history (coming soon)
- **Real-time Updates**: Messages sync across different sessions

## API Endpoints

### Chatbot API
- `GET /api/chatbot/health` - System health check
- `POST /api/chatbot/chat` - Send message and get response
- `GET /api/chatbot/conversation/:id` - Get conversation history
- `DELETE /api/chatbot/conversation/:id` - Clear conversation

### Chat Messages API (MongoDB)
- `GET /api/chat-messages/group/:groupId` - Get all messages for a group
- `POST /api/chat-messages` - Save a new message
- `DELETE /api/chat-messages/group/:groupId` - Delete all messages for a group
- `GET /api/chat-messages/recent` - Get recent messages for all groups
- `GET /api/chat-messages/group/:groupId/stats` - Get message statistics
- `GET /api/chat-messages/group/:groupId/search` - Search messages in a group

## Cost Considerations

- Gemini API has a generous free tier
- Monitor usage in Google Cloud Console
- Set up billing alerts to avoid unexpected charges

## Production Deployment

For production:

1. Set environment variables in your hosting platform
2. Update CORS configuration for your domain
3. Implement proper error handling and logging
4. Consider adding rate limiting and authentication
5. Monitor API usage and costs

---

**Note**: The chatbot is designed to be helpful and educational while maintaining appropriate content standards. All responses are filtered through Google's safety settings. 