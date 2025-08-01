# Better Auth Integration Setup Guide

## 🚀 Overview

This guide will help you set up Better Auth, a modern authentication library that provides:
- **Email/Password Authentication**
- **Google OAuth Integration**
- **Session Management**
- **User Management**
- **Security Features**

## 📋 Prerequisites

### 1. Install Dependencies

Run these commands in your terminal:

```bash
# Backend dependencies
cd backend
npm install better-auth

# Frontend dependencies
cd ../client
npm install better-auth
```

### 2. Environment Variables

Update your `.env` file in the backend directory:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production
BETTER_AUTH_URL=http://localhost:5000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ajira_digital_kinap

# Other configurations...
```

### 3. Generate Secret Key

Generate a secure secret key for Better Auth:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use an online generator
# https://generate-secret.vercel.app/32
```

## 🔧 Backend Setup

### 1. Better Auth Configuration

The Better Auth configuration is already set up in `backend/auth.ts` with:
- MongoDB adapter
- Email/password authentication
- Google OAuth support
- Custom user fields
- Session management

### 2. API Routes

Better Auth routes are mounted at `/api/better-auth/*` in `backend/server.js`.

### 3. Database Schema

Better Auth will automatically create the required database tables when you first run the application.

## 🎨 Frontend Setup

### 1. Better Auth Client

The Better Auth client is configured in `client/src/services/betterAuth.ts` with:
- React integration
- Custom hooks
- Helper functions
- Error handling

### 2. Context Provider

The Better Auth context provider is set up in `client/src/contexts/BetterAuthContext.tsx` to:
- Manage authentication state
- Provide auth methods
- Handle session management

### 3. Authentication Page

A new authentication page is created in `client/src/pages/BetterAuthPage.tsx` with:
- Email/password sign in/up
- Google OAuth integration
- Biometric authentication
- Form validation
- Error handling

## 🔄 Migration Steps

### 1. Update App.tsx

Replace the old AuthContext with BetterAuthProvider:

```tsx
// In App.tsx
import BetterAuthProvider from './contexts/BetterAuthContext';

function App() {
  return (
    <BetterAuthProvider>
      {/* Your app content */}
    </BetterAuthProvider>
  );
}
```

### 2. Update Routes

Replace the old AuthPage with BetterAuthPage:

```tsx
// In your routes
import BetterAuthPage from './pages/BetterAuthPage';

// Replace AuthPage with BetterAuthPage in your routes
```

### 3. Update Components

Replace the old useAuth hook with useBetterAuthContext:

```tsx
// Old
import { useAuth } from './contexts/AuthContext';

// New
import { useBetterAuthContext } from './contexts/BetterAuthContext';

// In your components
const { user, isAuthenticated, signOut } = useBetterAuthContext();
```

## 🔐 Google OAuth Setup

### 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure OAuth consent screen:
   - App name: "Ajira Digital KiNaP Club"
   - User support email: kinapajira@gmail.com
   - Developer contact information: kinapajira@gmail.com

### 2. OAuth Client Configuration

1. Application type: Web application
2. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:3000`
3. Authorized redirect URIs:
   - `http://localhost:5000/api/better-auth/callback/google`
   - `http://localhost:3000/api/better-auth/callback/google`

### 3. Environment Variables

Add your Google OAuth credentials to `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🚀 Testing

### 1. Start the Application

```bash
# Start backend
cd backend
npm start

# Start frontend (in new terminal)
cd client
npm run dev
```

### 2. Test Authentication

1. Navigate to `/auth` or `/better-auth`
2. Test email/password sign up
3. Test email/password sign in
4. Test Google OAuth
5. Test biometric authentication

### 3. Verify Features

- ✅ User registration
- ✅ User login
- ✅ Google OAuth
- ✅ Session persistence
- ✅ User profile management
- ✅ Logout functionality

## 🔧 Configuration Options

### Better Auth Configuration

You can customize Better Auth in `backend/auth.ts`:

```typescript
export const auth = betterAuth({
  // Session duration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  
  // Email verification
  emailAndPassword: {
    requireEmailVerification: true, // Enable email verification
  },
  
  // Custom callbacks
  callbacks: {
    onSignIn: async (user) => {
      // Custom sign in logic
      return user;
    },
    onSignUp: async (user) => {
      // Custom sign up logic
      return user;
    },
  },
});
```

### Frontend Configuration

Customize the frontend in `client/src/services/betterAuth.ts`:

```typescript
export const authClient = createAuthClient({
  baseURL: "http://localhost:5000",
  authPath: "/api/better-auth",
  // Add custom configuration
});
```

## 🛡️ Security Features

Better Auth provides several security features:

1. **CSRF Protection**: Built-in CSRF token validation
2. **Session Management**: Secure session handling
3. **Password Hashing**: Automatic password hashing
4. **Rate Limiting**: Built-in rate limiting
5. **Input Validation**: Automatic input sanitization
6. **Secure Headers**: Security headers configuration

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Google OAuth Error**
   - Verify Google OAuth credentials
   - Check redirect URIs configuration
   - Ensure Google+ API is enabled

3. **Session Not Persisting**
   - Check cookie settings
   - Verify domain configuration
   - Check CORS settings

4. **Better Auth Routes Not Working**
   - Ensure routes are mounted correctly
   - Check server configuration
   - Verify Better Auth installation

### Debug Mode

Enable debug logging:

```typescript
// In backend/auth.ts
export const auth = betterAuth({
  debug: true, // Enable debug mode
  // ... other config
});
```

## 📚 Additional Resources

- [Better Auth Documentation](https://better-auth.com/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🎉 Next Steps

After setting up Better Auth:

1. **Test all authentication flows**
2. **Customize user fields as needed**
3. **Add additional social providers**
4. **Implement email verification**
5. **Add password reset functionality**
6. **Set up user profile management**

## 📞 Support

For technical support:
- Email: kinapajira@gmail.com
- Phone: +254 792 343 958
- Check Better Auth documentation
- Review error logs

---

**Better Auth is now successfully integrated into your Ajira Digital KiNaP Club platform!** 🚀 