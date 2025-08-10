export type UserRole = 'buyer' | 'seller' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  bio: string;
  location: string;
  skills: string[];
  joinedAt: Date;
  rating: number;
  reviews: number;
  completedOrders: number;
  languages: string[];
  id?: string;
  // Club member specific fields
  course?: string;
  year?: string;
  preferredPlatforms?: string[];
  experienceLevel?: string;
  ajiraGoals?: string;
  preferredLearningMode?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  phoneNumber?: string;
  idNumber?: string;
  achievements?: string[];
  completedProjects?: number;
  mentorshipInterest?: boolean;
  availableForFreelance?: boolean;
  joinedDate?: string;
  lastActive?: string;
  stats?: {
    rating: number;
    reviews: number;
    views: number;
    completedOrders: number;
  };
}

export type GigStatus = 'active' | 'paused' | 'draft' | 'under_review';
export type OrderStatus =
  | 'pending'
  | 'active'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'released';

export interface GigPackage {
  name: 'basic' | 'standard' | 'premium';
  price: number;
  description: string;
  deliveryTime: number;
  revisions: number;
  features: string[];
}

export interface Gig {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  packages: GigPackage[];
  images: string[];
  video?: string;
  documents?: string[];
  tags: string[];
  requirements: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  status: GigStatus;
  stats: {
    views: number;
    orders: number;
    rating: number;
    reviews: number;
    completionRate: number;
  };
  completedOrders?: number;
  views?: number;
  saves?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  gigId: string;
  gigTitle: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  packageId: string;
  packageName: string;
  price: number;
  requirements?: string;
  status: 'active' | 'delivered' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveryDate: string;
  deliveredDate?: string;
  completedDate?: string;
  cancelledDate?: string;
  messages?: Message[];
  deliverables?: Deliverable[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id?: string;
  orderId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
}

export interface Deliverable {
  id?: string;
  orderId: string;
  title: string;
  description: string;
  files: string[];
  status: 'pending' | 'accepted' | 'rejected';
  feedback?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  gigId: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  comment: string;
  response?: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  raisedBy: string;
  reason: string;
  description: string;
  evidence?: string[];
  status: 'open' | 'resolved' | 'closed';
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
  }>;
  featured: boolean;
  order: number;
}

export interface SavedGig {
  id: string;
  userId: string;
  gigId: string;
  createdAt: string;
}

export interface GigView {
  id: string;
  gigId: string;
  userId?: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'message' | 'order' | 'review' | 'payment' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  fee: number;
  type: 'payment' | 'refund' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  languages?: string[];
  skills?: string[];
  rating?: number;
  reviews?: number;
  completedOrders?: number;
  memberSince: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  features: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Report {
  id: string;
  userId: string;
  gigId: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'rejected';
  createdAt: string;
  resolvedAt?: string;
}

export interface Statistics {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  responseTime: number;
  onTimeDelivery: number;
  orderCompletion: number;
}

export interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  paymentMethod: string;
  paymentMethodDetails?: {
    type: string;
    last4?: string;
    expiryDate?: string;
  };
  billingDetails: {
    name: string;
    email: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
  };
  status: PaymentStatus;
  escrowDetails: {
    releaseDate?: string;
    releaseTrigger: 'auto' | 'manual' | 'dispute';
    holdPeriod: number; // in days
  };
  createdAt: string;
  updatedAt: string;
}

export interface EscrowTransaction {
  id: string;
  paymentId: string;
  orderId: string;
  amount: number;
  status: 'held' | 'released' | 'refunded' | 'disputed';
  holdStartDate: string;
  releaseDate?: string;
  releasedTo: string; // userId of recipient
  disputeId?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethodType = 'card' | 'bank' | 'mpesa';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  details: {
    type: PaymentMethodType;
    last4?: string;
    expiryDate?: string;
    bankName?: string;
    accountNumber?: string;
    phoneNumber?: string;
  };
  createdAt: string;
}

export interface PaymentAnalytics {
  id: string;
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  metrics: {
    totalEarnings: number;
    totalSpent: number;
    platformFeesPaid: number;
    pendingBalance: number;
    availableBalance: number;
    successfulTransactions: number;
    failedTransactions: number;
    disputedTransactions: number;
    averageOrderValue: number;
    topEarningServices: Array<{
      gigId: string;
      title: string;
      earnings: number;
      ordersCount: number;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingTime?: number; // in hours
  estimatedArrival?: string;
  transactionFee: number;
  netAmount: number;
  reason?: string; // In case of failure
  createdAt: string;
  updatedAt: string;
}

export interface AutomaticPayoutSettings {
  id: string;
  userId: string;
  isEnabled: boolean;
  threshold: number; // Minimum amount for automatic payout
  frequency: 'daily' | 'weekly' | 'monthly';
  preferredPaymentMethod: string; // Reference to PaymentMethod
  lastPayout?: string;
  nextScheduledPayout?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MilestonePayment {
  id: string;
  orderId: string;
  name: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'funded' | 'released' | 'disputed';
  completionRequirements: string[];
  deliverables?: string[];
  escrowTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}
