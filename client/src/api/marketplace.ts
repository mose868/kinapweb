// Marketplace API service for connecting to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  pricing: {
    type: 'fixed' | 'hourly';
    amount: number;
    currency: string;
  };
  packages: Array<{
    name: 'basic' | 'standard' | 'premium';
    title: string;
    description?: string;
    price: number;
    deliveryTime: number;
    revisions: number;
    features: string[];
  }>;
  images: Array<{
    url: string;
    alt: string;
  }>;
  requirements: Array<{
    question: string;
    type: 'text' | 'file' | 'choice';
    required: boolean;
    options?: string[];
  }>;
  stats: {
    views: number;
    orders: number;
    rating: number;
    reviews: number;
  };
  status: 'draft' | 'active' | 'paused' | 'rejected';
  featured: boolean;
  verified: boolean;
  location?: {
    country: string;
    city: string;
  };
  languages: string[];
  skills: string[];
  portfolio?: Array<{
    title: string;
    description: string;
    image: string;
    url: string;
  }>;
  availability: 'available' | 'busy' | 'unavailable';
  responseTime: number;
  completionRate: number;
  seller: {
    _id: string;
    displayName: string;
    avatar?: string;
    rating?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceStats {
  totalGigs: number;
  totalOrders: number;
  totalReviews: number;
  topCategories: Array<{
    _id: string;
    count: number;
  }>;
  averagePrice: number;
}

export interface SearchFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  deliveryTime?: number;
  search?: string;
  sort?: 'newest' | 'price-low' | 'price-high' | 'rating' | 'orders';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  gigs: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Fetch all gigs with optional filters
export const fetchGigs = async (filters: SearchFilters = {}): Promise<PaginatedResponse<Gig>> => {
  try {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/marketplace/gigs?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching gigs:', error);
    throw error;
  }
};

// Fetch featured gigs
export const fetchFeaturedGigs = async (): Promise<Gig[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/marketplace/gigs/featured`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching featured gigs:', error);
    throw error;
  }
};

// Fetch gig by ID
export const fetchGigById = async (id: string): Promise<Gig> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/marketplace/gigs/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching gig:', error);
    throw error;
  }
};

// Search gigs
export const searchGigs = async (query: string, filters: Omit<SearchFilters, 'search'> = {}): Promise<Gig[]> => {
  try {
    const params = new URLSearchParams({ q: query });
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/marketplace/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching gigs:', error);
    throw error;
  }
};

// Fetch marketplace statistics
export const fetchMarketplaceStats = async (): Promise<MarketplaceStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/marketplace/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    throw error;
  }
};

// Create new gig (requires authentication)
export const createGig = async (gigData: Partial<Gig>, token: string): Promise<Gig> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/marketplace/gigs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(gigData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating gig:', error);
    throw error;
  }
};

// Update gig (requires authentication)
export const updateGig = async (id: string, gigData: Partial<Gig>, token: string): Promise<Gig> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/marketplace/gigs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(gigData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating gig:', error);
    throw error;
  }
};

// Delete gig (requires authentication)
export const deleteGig = async (id: string, token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/marketplace/gigs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting gig:', error);
    throw error;
  }
};

// Get gigs by category
export const fetchGigsByCategory = async (category: string, limit: number = 20): Promise<Gig[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/marketplace/gigs?category=${category}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.gigs;
  } catch (error) {
    console.error('Error fetching gigs by category:', error);
    throw error;
  }
};

// Get gigs by seller
export const fetchGigsBySeller = async (sellerId: string): Promise<Gig[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/marketplace/gigs?seller=${sellerId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.gigs;
  } catch (error) {
    console.error('Error fetching gigs by seller:', error);
    throw error;
  }
}; 