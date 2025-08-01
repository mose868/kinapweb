# Google OAuth Setup Guide

## Prerequisites
1. A Google Cloud Console account
2. A Google Cloud Project

## Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

### 2. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "Ajira Digital KiNaP Club"
   - User support email: kinapajira@gmail.com
   - Developer contact information: kinapajira@gmail.com
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses)

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)
6. Copy the Client ID

### 4. Environment Variables
Add the following to your `.env` file:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 5. Frontend Configuration
The Google OAuth script is already included in `client/index.html`:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### 6. Backend Configuration
The Google OAuth routes are already set up in `backend/routes/auth.js`:
- `POST /api/auth/google` - Handles Google OAuth login/signup

## Usage
Users can now:
1. Click "Sign in with Google" or "Sign up with Google" button
2. Choose their Google account
3. Grant permissions
4. Get automatically logged in/signed up

## Security Notes
- Google accounts are automatically verified
- No password required for Google OAuth users
- Users can link existing accounts with Google accounts
- Login history is tracked for security monitoring

## Troubleshooting
1. **"Google OAuth not available"** - Check if the Google script is loading
2. **"Invalid client ID"** - Verify your Google Client ID in environment variables
3. **"OAuth consent screen not configured"** - Complete the OAuth consent screen setup
4. **"Redirect URI mismatch"** - Add your domain to authorized redirect URIs 