import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
  },
  users: {
    list: '/users',
    profile: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
  },
  marketplace: {
    gigs: '/marketplace/gigs',
    gig: (id: string) => `/marketplace/gigs/${id}`,
    search: '/marketplace/search',
  },
  orders: {
    list: '/orders',
    create: '/orders',
    details: (id: string) => `/orders/${id}`,
    update: (id: string) => `/orders/${id}`,
  },
  reviews: {
    list: '/reviews',
    create: '/reviews',
    update: (id: string) => `/reviews/${id}`,
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
  },
} as const; 