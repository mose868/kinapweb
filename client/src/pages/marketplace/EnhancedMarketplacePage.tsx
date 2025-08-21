import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Award,
  Zap,
  Shield,
  Play,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Users,
  TrendingUp,
  Verified,
  Heart,
  Share2,
  BookOpen,
  Code,
  Palette,
  Smartphone,
  Globe,
  Edit3,
  Megaphone,
  Database,
  PlayCircle,
  Mic,
  Languages,
  Video,
  Camera,
  X,
  Plus,
  Send,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import toast from 'react-hot-toast';

interface SellerProfile {
  id: string;
  sellerId: string;
  fullName: string;
  professionalTitle: string;
  bio: string;
  profileImageUrl: string;
  location: string;
  languages: string[];
  skills: string[];
  experience: string;
  portfolio: PortfolioItem[];
  showcaseVideoUrl?: string;
  services: ServicePackage[];
  hourlyRate: number;
  availability: string;
  responseTime: string;
  rating: number;
  totalReviews: number;
  completedOrders: number;
  views: number;
  isVerified: boolean;
  isFeatured: boolean;
  lastActive: string;
  aiScore: number;
  marketplaceReadiness: boolean;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  videoUrl?: string;
  liveUrl?: string;
  technologies: string[];
}

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: number;
  features: string[];
  revisions: number;
}

interface BookingRequest {
  sellerId: string;
  serviceId: string;
  projectTitle: string;
  projectDescription: string;
  requirements: string[];
  expectedDelivery: string;
  agreedPrice: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  paymentMethod: string;
}

const categories = [
  { id: 'all', name: 'All Categories', icon: Globe, count: 0 },
  { id: 'web-development', name: 'Web Development', icon: Code, count: 45 },
  { id: 'mobile-development', name: 'Mobile Development', icon: Smartphone, count: 23 },
  { id: 'graphic-design', name: 'Graphic Design', icon: Palette, count: 67 },
  { id: 'digital-marketing', name: 'Digital Marketing', icon: Megaphone, count: 34 },
  { id: 'content-writing', name: 'Content Writing', icon: Edit3, count: 29 },
  { id: 'data-analysis', name: 'Data Analysis', icon: Database, count: 18 },
  { id: 'video-editing', name: 'Video Editing', icon: PlayCircle, count: 31 },
  { id: 'voice-over', name: 'Voice Over', icon: Mic, count: 12 },
  { id: 'translation', name: 'Translation', icon: Languages, count: 25 },
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner (0-1 years)' },
  { value: 'intermediate', label: 'Intermediate (1-3 years)' },
  { value: 'advanced', label: 'Advanced (3-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' },
];

const availabilityOptions = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'evenings', label: 'Evenings' },
];

const EnhancedMarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useBetterAuthContext();
  
  // State management
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [featuredSellers, setFeaturedSellers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [filters, setFilters] = useState({
    experience: '',
    minRate: '',
    maxRate: '',
    location: '',
    availability: '',
    skills: [] as string[],
    rating: '',
    responseTime: '',
  });
  
  // Modals
  const [selectedSeller, setSelectedSeller] = useState<SellerProfile | null>(null);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServicePackage | null>(null);
  
  // Booking form
  const [bookingForm, setBookingForm] = useState<BookingRequest>({
    sellerId: '',
    serviceId: '',
    projectTitle: '',
    projectDescription: '',
    requirements: [],
    expectedDelivery: '',
    agreedPrice: 0,
    urgency: 'medium',
    paymentMethod: 'mpesa',
  });

  // Load sellers and featured sellers
  useEffect(() => {
    loadSellers();
    loadFeaturedSellers();
  }, [selectedCategory, filters, currentPage, searchQuery]);

  const loadSellers = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });
      
      if (searchQuery) {
        params.append('q', searchQuery);
      }
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      if (filters.experience) {
        params.append('experience', filters.experience);
      }
      
      if (filters.minRate && filters.maxRate) {
        params.append('minRate', filters.minRate);
        params.append('maxRate', filters.maxRate);
      }
      
      if (filters.location) {
        params.append('location', filters.location);
      }
      
      if (filters.skills.length > 0) {
        params.append('skills', filters.skills.join(','));
      }
      
      const response = await fetch(`/api/sellers/search?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setSellers(data.sellers);
        setTotalPages(data.pagination.pages);
      } else {
        toast.error('Failed to load sellers');
      }
    } catch (error) {
      console.error('Error loading sellers:', error);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedSellers = async () => {
    try {
      const response = await fetch('/api/sellers/featured?limit=6');
      const data = await response.json();
      
      if (data.success) {
        setFeaturedSellers(data.sellers);
      }
    } catch (error) {
      console.error('Error loading featured sellers:', error);
    }
  };

  const handleSellerClick = (seller: SellerProfile) => {
    setSelectedSeller(seller);
    setShowSellerModal(true);
  };

  const handleBookNow = (seller: SellerProfile, service: ServicePackage) => {
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/auth');
      return;
    }
    
    setSelectedSeller(seller);
    setSelectedService(service);
    setBookingForm({
      ...bookingForm,
      sellerId: seller.sellerId,
      serviceId: service.id,
      agreedPrice: service.price,
    });
    setShowBookingModal(true);
  };

  const handleContactSeller = async (seller: SellerProfile) => {
    if (!user) {
      toast.error('Please login to contact seller');
      navigate('/auth');
      return;
    }
    
    try {
      // Create or find existing conversation
      const conversationId = `seller_${seller.sellerId}_client_${user.id}_${Date.now()}`;
      
      // Navigate to community hub with seller conversation
      navigate(`/community?conversation=${conversationId}&seller=${seller.sellerId}`);
      
      toast.success('Opening conversation with seller...');
    } catch (error) {
      console.error('Error opening conversation:', error);
      toast.error('Failed to open conversation');
    }
  };

  const submitBooking = async () => {
    if (!selectedSeller || !selectedService) return;
    
    try {
      setLoading(true);
      
      const bookingData = {
        ...bookingForm,
        clientId: user?.id || user?.email,
        expectedDelivery: new Date(bookingForm.expectedDelivery).toISOString(),
      };
      
      const response = await fetch(`/api/sellers/book/${selectedSeller.sellerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Booking created successfully!');
        setShowBookingModal(false);
        
        // Navigate to community hub with booking conversation
        navigate(`/community?conversation=${data.conversationId}`);
      } else {
        toast.error(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const renderSellerCard = (seller: SellerProfile, featured = false) => (
    <motion.div
      key={seller.id}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border hover:shadow-xl transition-all duration-300 ${
        featured ? 'border-ajira-primary/30' : 'border-gray-200'
      }`}
      whileHover={{ y: -4 }}
      layout
    >
      {/* Card Header */}
      <div className="relative">
        {seller.showcaseVideoUrl ? (
          <div className="relative h-48 bg-gray-900">
            <video
              src={seller.showcaseVideoUrl}
              className="w-full h-full object-cover"
              muted
              loop
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
            <div className="absolute inset-0 bg-black/20" />
            <button className="absolute top-4 right-4 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white transition-colors">
              <Play className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-ajira-primary/10 to-ajira-accent/10" />
        )}
        
        {/* Status badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {seller.isFeatured && (
            <span className="bg-ajira-accent text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {seller.isVerified && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
        
        {/* Profile image */}
        <div className="absolute -bottom-8 left-6">
          <img
            src={seller.profileImageUrl || '/default-avatar.png'}
            alt={seller.fullName}
            className="w-16 h-16 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>
      
      {/* Card Content */}
      <div className="pt-10 p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {seller.fullName}
            </h3>
            <p className="text-ajira-primary font-medium text-sm">
              {seller.professionalTitle}
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{seller.rating.toFixed(1)}</span>
            <span className="text-gray-500">({seller.totalReviews})</span>
          </div>
        </div>
        
        {/* Location and response time */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          {seller.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{seller.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{seller.responseTime.replace('-', ' ')}</span>
          </div>
        </div>
        
        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {seller.bio}
        </p>
        
        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {seller.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="bg-ajira-primary/10 text-ajira-primary px-2 py-1 rounded text-xs"
            >
              {skill}
            </span>
          ))}
          {seller.skills.length > 3 && (
            <span className="text-gray-500 text-xs px-2 py-1">
              +{seller.skills.length - 3} more
            </span>
          )}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 py-3 border-t border-gray-100">
          <div className="text-center">
            <div className="font-bold text-ajira-primary">{seller.completedOrders}</div>
            <div className="text-xs text-gray-500">Orders</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-ajira-primary">{seller.views}</div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-ajira-primary">${seller.hourlyRate}</div>
            <div className="text-xs text-gray-500">Per hour</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSellerClick(seller)}
            className="flex-1 bg-ajira-primary text-white py-2 px-4 rounded-lg hover:bg-ajira-primary/90 transition-colors text-sm font-medium"
          >
            View Profile
          </button>
          <button
            onClick={() => handleContactSeller(seller)}
            className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ajira-primary mb-2">
                Ajira Digital Marketplace
              </h1>
              <p className="text-gray-600">
                Find skilled professionals for your projects
              </p>
            </div>
            
            {/* Search */}
            <div className="flex gap-4 max-w-xl w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-ajira-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                  {category.count > 0 && (
                    <span className="bg-black/10 px-2 py-0.5 rounded-full text-xs">
                      {category.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border-b overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                  >
                    <option value="">Any experience</option>
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate ($)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minRate}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxRate}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxRate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                  >
                    <option value="">Any availability</option>
                    {availabilityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setFilters({
                    experience: '',
                    minRate: '',
                    maxRate: '',
                    location: '',
                    availability: '',
                    skills: [],
                    rating: '',
                    responseTime: '',
                  })}
                  className="text-ajira-primary hover:text-ajira-primary/80 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Sellers */}
        {featuredSellers.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Sellers</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-ajira-accent" />
                <span>Top performers this month</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSellers.map((seller) => renderSellerCard(seller, true))}
            </div>
          </section>
        )}

        {/* All Sellers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Sellers</h2>
            <div className="text-sm text-gray-600">
              {sellers.length} sellers found
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : sellers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sellers found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setFilters({
                    experience: '',
                    minRate: '',
                    maxRate: '',
                    location: '',
                    availability: '',
                    skills: [],
                    rating: '',
                    responseTime: '',
                  });
                }}
                className="bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sellers.map((seller) => renderSellerCard(seller))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === page
                              ? 'bg-ajira-primary text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Seller Profile Modal */}
      <AnimatePresence>
        {showSellerModal && selectedSeller && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="relative p-6 border-b">
                <button
                  onClick={() => setShowSellerModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-start gap-6">
                  <img
                    src={selectedSeller.profileImageUrl || '/default-avatar.png'}
                    alt={selectedSeller.fullName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedSeller.fullName}
                      </h2>
                      {selectedSeller.isVerified && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Verified className="w-3 h-3" />
                          Verified
                        </div>
                      )}
                    </div>
                    <p className="text-ajira-primary font-medium text-lg mb-2">
                      {selectedSeller.professionalTitle}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{selectedSeller.rating.toFixed(1)}</span>
                        <span>({selectedSeller.totalReviews} reviews)</span>
                      </div>
                      {selectedSeller.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{selectedSeller.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-8">
                {/* About */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedSeller.bio}</p>
                </section>

                {/* Skills */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeller.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-ajira-primary/10 text-ajira-primary px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                {/* Portfolio */}
                {selectedSeller.portfolio.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedSeller.portfolio.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          {item.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Services */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSeller.services.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-900">{service.name}</h4>
                          <span className="text-ajira-primary font-bold">${service.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span>{service.deliveryTime} days delivery</span>
                          <span>{service.revisions} revisions</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBookNow(selectedSeller, service)}
                            className="flex-1 bg-ajira-primary text-white py-2 px-4 rounded-lg hover:bg-ajira-primary/90 transition-colors text-sm font-medium"
                          >
                            Book Now
                          </button>
                          <button
                            onClick={() => handleContactSeller(selectedSeller)}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedSeller && selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-ajira-primary">Book Service</h3>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Service Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{selectedService.name}</h4>
                      <span className="text-ajira-primary font-bold">${selectedService.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{selectedService.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{selectedService.deliveryTime} days delivery</span>
                      <span>{selectedService.revisions} revisions included</span>
                    </div>
                  </div>

                  {/* Booking Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={bookingForm.projectTitle}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, projectTitle: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="Enter your project title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Description *
                      </label>
                      <textarea
                        value={bookingForm.projectDescription}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, projectDescription: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="Describe your project requirements in detail..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expected Delivery *
                        </label>
                        <input
                          type="date"
                          value={bookingForm.expectedDelivery}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Urgency
                        </label>
                        <select
                          value={bookingForm.urgency}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, urgency: e.target.value as any }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        >
                          <option value="low">Low Priority</option>
                          <option value="medium">Medium Priority</option>
                          <option value="high">High Priority</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={bookingForm.paymentMethod}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      >
                        <option value="mpesa">M-Pesa</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                        <option value="stripe">Credit/Debit Card</option>
                      </select>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-ajira-primary/5 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Booking Summary</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Service Price:</span>
                        <span>${selectedService.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee (5%):</span>
                        <span>${(selectedService.price * 0.05).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${(selectedService.price * 1.05).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitBooking}
                      disabled={!bookingForm.projectTitle || !bookingForm.projectDescription || !bookingForm.expectedDelivery || loading}
                      className="flex-1 bg-ajira-primary text-white py-3 px-6 rounded-lg hover:bg-ajira-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Create Booking
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedMarketplacePage;
