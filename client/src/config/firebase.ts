import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Get Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Configure storage settings for long-term storage
const storageRef = storage
storageRef.maxOperationRetryTime = 120000 // 2 minutes
storageRef.maxUploadRetryTime = 120000 // 2 minutes

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  TESTIMONIALS: 'testimonials',
  STORIES: 'stories',
  CHATBOT_MESSAGES: 'chatbot_messages',
  MARKETPLACE_ITEMS: 'marketplace_items',
  ORDERS: 'orders',
  NOTIFICATIONS: 'notifications',
  VIDEOS: 'videos',
  GIGS: 'gigs',
  REVIEWS: 'reviews',
  MESSAGES: 'messages',
  DISPUTES: 'disputes',
  PAYMENTS: 'payments',
  ESCROW: 'escrow_transactions',
  PAYMENT_METHODS: 'payment_methods',
  PAYMENT_ANALYTICS: 'payment_analytics',
  WITHDRAWALS: 'withdrawals',
  PAYOUT_SETTINGS: 'payout_settings',
  MILESTONES: 'milestones'
} as const

// Storage paths
export const STORAGE_PATHS = {
  PROFILE_IMAGES: 'profile_images',
  PROJECT_FILES: 'project_files',
  STORY_IMAGES: 'story_images',
  MARKETPLACE_IMAGES: 'marketplace_images',
  VIDEOS: 'videos',
  THUMBNAILS: 'thumbnails'
} as const

// Firestore security rules
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    function isAdmin() {
      return hasRole('admin');
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Gigs collection
    match /gigs/{gigId} {
      allow read: if true;
      allow create: if isAuthenticated() && (hasRole('seller') || hasRole('admin'));
      allow update: if isAuthenticated() && 
        (resource.data.sellerId == request.auth.uid || isAdmin());
      allow delete: if isAuthenticated() && 
        (resource.data.sellerId == request.auth.uid || isAdmin());
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if isAuthenticated() && 
        (resource.data.buyerId == request.auth.uid || 
         resource.data.sellerId == request.auth.uid || 
         isAdmin());
      allow create: if isAuthenticated() && hasRole('buyer');
      allow update: if isAuthenticated() && 
        (resource.data.buyerId == request.auth.uid || 
         resource.data.sellerId == request.auth.uid || 
         isAdmin());
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if isAuthenticated() && 
        (resource.data.senderId == request.auth.uid || 
         get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.buyerId == request.auth.uid || 
         get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.sellerId == request.auth.uid);
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.senderId);
      allow delete: if isAdmin();
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated() && 
        exists(/databases/$(database)/documents/orders/$(request.resource.data.orderId)) &&
        get(/databases/$(database)/documents/orders/$(request.resource.data.orderId)).data.buyerId == request.auth.uid;
      allow update: if isAuthenticated() && 
        (resource.data.buyerId == request.auth.uid || 
         resource.data.sellerId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Categories and Subcategories
    match /{path=**}/categories/{categoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /{path=**}/subcategories/{subcategoryId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Deliverables
    match /deliverables/{deliverableId} {
      allow read: if isAuthenticated() && 
        (get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.buyerId == request.auth.uid || 
         get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.sellerId == request.auth.uid);
      allow create: if isAuthenticated() && 
        get(/databases/$(database)/documents/orders/$(request.resource.data.orderId)).data.sellerId == request.auth.uid;
      allow update: if isAuthenticated() && 
        (get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.buyerId == request.auth.uid || 
         get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.sellerId == request.auth.uid);
      allow delete: if isAdmin();
    }
  }
}
*/

export default app 