# Better Auth Integration Setup Guide

This guide will help you properly integrate Better Auth with your existing Kinap AI project.

## 🎯 **What We've Implemented**

✅ **Backend Better Auth Server** (`backend/betterAuth.js`)
✅ **Better Auth API Routes** (`backend/routes/betterAuth.js`)
✅ **Frontend Better Auth Client** (`client/src/services/betterAuth.ts`)
✅ **Real Better Auth Context** (`client/src/contexts/BetterAuthContext.tsx`)
✅ **Test Components** (`client/src/components/auth/BetterAuthTest.tsx`)
✅ **Test Page** (`client/src/pages/BetterAuthTestPage.tsx`)

## 📋 **Prerequisites**

1. **Install Better Auth Dependencies**
2. **Set up Environment Variables**
3. **Configure Database (Prisma)**
4. **Update Frontend Configuration**

## 🔧 **Step 1: Install Dependencies**

### Backend Dependencies
```bash
cd backend
npm install better-auth
```

### Frontend Dependencies
```bash
cd client
npm install better-auth
```

## 🔧 **Step 2: Environment Variables**

Create/update your `.env` files:

### Backend `.env`
```env
# Better Auth Configuration
JWT_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:5000

# Social Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email Configuration (for verification, password reset)
EMAIL_FROM=noreply@kinapweb.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Database (using existing MongoDB)
MONGODB_URI=your-mongodb-connection-string
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_BETTER_AUTH_URL=http://localhost:5000
```

## 🔧 **Step 3: Database Setup**

Better Auth will work with your existing MongoDB setup. No additional database configuration is required.

## 🔧 **Step 4: Update Frontend Configuration**

### Update `client/src/services/betterAuth.ts`
```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || "http://localhost:5000",
  authPath: "/api/better-auth",
});
```

## 🔧 **Step 5: Update Your Auth Pages**

### Update `client/src/pages/AuthPage.tsx`
```typescript
import { useBetterAuthContext } from '../contexts/BetterAuthContext';

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, isLoading, error } = useBetterAuthContext();
  
  // Use the Better Auth methods instead of the old ones
  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      // Redirect or show success
    } catch (error) {
      // Handle error
    }
  };
  
  // ... rest of your component
}
```

## 🔧 **Step 6: Update CommunityPage Integration**

### Update `client/src/pages/community/CommunityPage.tsx`
```typescript
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';

export default function CommunityPage() {
  const { user, isAuthenticated } = useBetterAuthContext();
  
  // Use Better Auth user data
  const activeUser = {
    id: user?.id || 'anonymous',
    name: user?.displayName || user?.name || 'Anonymous',
    avatar: user?.image || 'https://via.placeholder.com/40'
  };
  
  // ... rest of your component
}
```

## 🚀 **Step 7: Test the Integration**

1. **Start the Backend Server**
```bash
cd backend
npm start
```

2. **Start the Frontend**
```bash
cd client
npm run dev
```

3. **Test Authentication**
   - Try signing up with email/password
   - Try signing in with existing credentials
   - Test Google sign-in (if configured)
   - Verify session persistence

## 🔍 **Troubleshooting**

### Common Issues:

1. **CORS Errors**
   - Ensure your backend CORS configuration includes the frontend URL
   - Check that credentials are enabled

2. **Database Connection Issues**
   - Verify your database connection string
   - Ensure the database is running
   - Check Prisma schema if using PostgreSQL

3. **Social Provider Issues**
   - Verify OAuth credentials are correct
   - Check redirect URIs in provider settings
   - Ensure environment variables are set

4. **Session Issues**
   - Check JWT secret configuration
   - Verify cookie settings
   - Ensure proper domain configuration

## 📚 **Better Auth Features Available**

✅ **Email & Password Authentication**
✅ **Social Provider Integration (Google, GitHub)**
✅ **Session Management**
✅ **JWT Tokens**
✅ **Email Verification**
✅ **Password Reset**
✅ **User Profile Management**
✅ **Plugin System (2FA, Magic Links, etc.)**

## 🔄 **Migration from Old Auth System**

If you want to migrate existing users:

1. **Export existing user data**
2. **Transform data to Better Auth format**
3. **Import using Better Auth API**
4. **Update frontend to use Better Auth exclusively**

## 📖 **Next Steps**

1. **Add Two-Factor Authentication**
2. **Implement Magic Link Authentication**
3. **Add Role-Based Access Control**
4. **Set up Email Templates**
5. **Configure Advanced Security Features**

## 🆘 **Support**

- **Better Auth Documentation**: https://better-auth.com/docs
- **GitHub Issues**: https://github.com/better-auth/better-auth/issues
- **Discord Community**: https://discord.gg/better-auth

---

**Note**: This integration maintains compatibility with your existing Kinap AI features while providing a more robust authentication system. The Better Auth system will handle all authentication logic while your existing business logic remains unchanged. 