import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
// In production, these should be environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ajira-digital-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ajira-digital-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ajira-digital-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456789"
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  GIGS: 'gigs',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  MESSAGES: 'messages'
}

// Storage paths
export const STORAGE_PATHS = {
  PROFILE_IMAGES: 'profile-images',
  GIG_IMAGES: 'gig-images'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app)

export default app 