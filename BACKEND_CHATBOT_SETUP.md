# Backend Chatbot Setup Guide

This guide will help you get the KiNaP AI chatbot working with Gemini AI in the Community Hub.

## Prerequisites

1. **Backend Server Running**: Make sure your backend server is running on port 5000
2. **Gemini API Key**: Get a Gemini API key from Google AI Studio
3. **Environment Variables**: Configure the backend environment

## Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Step 2: Configure Backend Environment

Create or update your `.env` file in the `backend` directory:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Other backend configurations
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Step 3: Start Backend Server

In the `backend` directory, run:

```bash
npm start
# or
node server.js
```

You should see output like:
```
Server running on port 5000
MongoDB connected
```

## Step 4: Test Backend Connection

1. Open your browser and go to: `http://localhost:5000/api/chatbot/health`
2. You should see a JSON response with system status
3. If you see an error, check that:
   - Backend server is running
   - Gemini API key is correctly set
   - No firewall blocking port 5000

## Step 5: Test Chatbot API

You can test the chatbot API directly:

```bash
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how can you help me?"}'
```

## Step 6: Test in Community Hub

1. Start your frontend development server:
   ```bash
   cd client
   npm run dev
   ```

2. Go to the Community Hub in your application
3. Click on "Kinap AI" in the chat list
4. Send a test message like "Hello"

## Troubleshooting

### Backend Not Starting
- Check if port 5000 is already in use
- Verify all dependencies are installed: `npm install`
- Check for syntax errors in server.js

### API Key Issues
- Verify the API key is correct
- Check that `GEMINI_API_KEY` is set in your `.env` file
- Restart the backend server after adding the API key

### CORS Issues
- The backend is configured to accept requests from `http://localhost:5173`
- If using a different port, update the CORS configuration in `server.js`

### Network Issues
- Ensure both frontend and backend are running
- Check that the frontend is making requests to the correct backend URL
- Verify no firewall is blocking the connection

## Expected Behavior

When working correctly:

1. **Backend Health Check**: Returns system status with Gemini integration info
2. **Chatbot Responses**: Intelligent, contextual responses with emojis
3. **Conversation Memory**: Remembers previous messages in the conversation
4. **Fallback System**: Uses pre-programmed responses if Gemini is unavailable

## Features

The backend chatbot includes:

- **Gemini AI Integration**: Uses Google's Gemini 1.5 Flash model
- **Contextual Responses**: Understands user intent and provides relevant answers
- **Conversation Memory**: Remembers up to 10 previous messages
- **Fallback System**: Graceful degradation when AI is unavailable
- **Safety Filters**: Implements Google's content safety settings
- **Performance Monitoring**: Tracks response times and system health

## API Endpoints

- `GET /api/chatbot/health` - System health check
- `POST /api/chatbot/chat` - Send message and get response
- `GET /api/chatbot/conversation/:id` - Get conversation history
- `DELETE /api/chatbot/conversation/:id` - Clear conversation
- `GET /api/chatbot/metrics` - Performance metrics

## Cost Considerations

- Gemini API has a generous free tier
- Monitor usage in Google Cloud Console
- Set up billing alerts to avoid unexpected charges
- Consider implementing rate limiting for production

## Production Deployment

For production:

1. Set environment variables in your hosting platform
2. Update CORS configuration for your domain
3. Implement proper error handling and logging
4. Consider adding rate limiting and authentication
5. Monitor API usage and costs

---

**Note**: The chatbot is designed to be helpful and educational while maintaining appropriate content standards. All responses are filtered through Google's safety settings. 