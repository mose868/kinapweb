const { betterAuth } = require('better-auth');
const { mongodbAdapter } = require('better-auth/adapters/mongodb');
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ajira_digital_kinap');
    console.log('MongoDB connected for Better Auth');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

const auth = betterAuth({
  // Database configuration
  database: mongodbAdapter(mongoose.connection.db),
  
  // Base URL configuration
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  
  // Secret key for encryption
  secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-this-in-production",
  
  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true if you want email verification
  },
  
  // Social providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  
  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  
  // User configuration
  user: {
    additionalFields: {
      displayName: { type: "string", required: false },
      phoneNumber: { type: "string", required: false },
      course: { type: "string", required: false },
      year: { type: "string", required: false },
      experienceLevel: { type: "string", required: false },
      skills: { type: "array", required: false },
      bio: { type: "string", required: false },
      role: { type: "string", required: false, default: "student" },
      isVerified: { type: "boolean", required: false, default: false },
      avatar: { type: "string", required: false },
      location: {
        country: { type: "string", required: false },
        city: { type: "string", required: false },
      },
      languages: { type: "array", required: false },
      portfolio: { type: "array", required: false },
      rating: { type: "number", required: false, default: 0 },
    },
  },
  
  // Callbacks
  callbacks: {
    onSignIn: async (user) => {
      // Log successful sign in
      console.log(`User ${user.email} signed in successfully`);
      return user;
    },
    onSignUp: async (user) => {
      // Log new user registration
      console.log(`New user ${user.email} registered successfully`);
      return user;
    },
  },
  
  // Pages configuration
  pages: {
    signIn: "/auth",
    signUp: "/auth",
    error: "/auth",
  },
});

module.exports = { auth }; 