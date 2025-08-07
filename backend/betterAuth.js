const { betterAuth } = require("better-auth");

// Create Better Auth instance with minimal configuration
const auth = betterAuth({
  // Basic configuration
  secret: process.env.JWT_SECRET || "your-secret-key",
  
  // Database configuration (using memory adapter for now)
  adapter: {
    type: "memory"
  },
  
  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  
  // Social providers (optional)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  
  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Callbacks for custom logic
  callbacks: {
    // Customize user data in session
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
        session.user.role = user.role || 'student';
        session.user.displayName = user.displayName || user.name;
      }
      return session;
    },
    
    // Customize JWT token
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'student';
        token.displayName = user.displayName || user.name;
      }
      return token;
    },
  },
});

module.exports = { auth }; 