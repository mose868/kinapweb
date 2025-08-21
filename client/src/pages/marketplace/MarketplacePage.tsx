import React, { useState, useEffect } from 'react';
import GigCard from '../../components/marketplace/GigCard';
import LoadingState from '../../components/common/LoadingState';
import {
  fetchGigs,
  fetchFeaturedGigs,
  fetchMarketplaceStats,
  type Gig,
  type SearchFilters,
} from '../../api/marketplace';
import {
  Award,
  Filter,
  Search,
  Star,
  ChevronDown,
  Grid,
  List,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  CategoryShowcase,
  TrustedBySection,
  TestimonialsSection,
  HowItWorksSection,
  PopularServicesSection,
} from '../../components/marketplace/FiverrLikeFeatures';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import ProfileCompletionBanner from '../../components/common/ProfileCompletionBanner';
import { checkProfileRequirements } from '../../utils/profileCompletion';

// Exact Fiverr-like categories with subcategories - Updated with Ajira colors
const fiverCategories = [
  {
    name: 'Graphics & Design',
    value: 'Graphics & Design',
    subcategories: [
      'Logo Design',
      'Brand Style Guides',
      'Business Cards',
      'Flyer Design',
      'Poster Design',
      'Brochure Design',
      'Social Media Design',
      'Web & Mobile Design',
      'Package & Label Design',
      'Illustration',
      'Pattern Design',
      'Presentations',
      'Infographic Design',
      'Vector Tracing',
      'Resume Design',
    ],
    icon: '🎨',
    color: 'from-ajira-primary to-ajira-blue-600',
  },
  {
    name: 'Digital Marketing',
    value: 'Digital Marketing',
    subcategories: [
      'Social Media Marketing',
      'SEO',
      'Content Marketing',
      'Video Marketing',
      'Email Marketing',
      'Search Engine Marketing',
      'Marketing Strategy',
      'Web Analytics',
      'Influencer Marketing',
      'Public Relations',
      'Local SEO',
      'E-Commerce Marketing',
      'Mobile App Marketing',
      'Music Promotion',
      'Podcast Marketing',
    ],
    icon: '📊',
    color: 'from-ajira-secondary to-ajira-green-600',
  },
  {
    name: 'Writing & Translation',
    value: 'Writing & Translation',
    subcategories: [
      'Content Writing',
      'Copywriting',
      'Technical Writing',
      'Creative Writing',
      'Translation',
      'Proofreading & Editing',
      'Resume Writing',
      'Cover Letters',
      'LinkedIn Profiles',
      'Product Descriptions',
      'Press Releases',
      'Speechwriting',
      'Grant Writing',
      'Book Writing',
      'Script Writing',
    ],
    icon: '✍️',
    color: 'from-ajira-accent to-ajira-orange-600',
  },
  {
    name: 'Video & Animation',
    value: 'Video & Animation',
    subcategories: [
      'Video Editing',
      'Visual Effects',
      'Intro & Outro Videos',
      'Video Ads',
      'Lyric & Music Videos',
      'Slideshow Videos',
      'Live Action Explainer',
      'Animation',
      'Character Animation',
      'Logo Animation',
      'Lottie & Web Animation',
      'NFT Animation',
      'Article to Video',
      'App & Website Previews',
      'Crowdfunding Videos',
    ],
    icon: '🎬',
    color: 'from-ajira-info to-ajira-blue-500',
  },
  {
    name: 'Music & Audio',
    value: 'Music & Audio',
    subcategories: [
      'Voice Over',
      'Music Production',
      'Audio Editing',
      'Sound Design',
      'Mixing & Mastering',
      'Jingles & Intros',
      'Audiobook Production',
      'Podcast Production',
      'Audio Ads',
      'Custom Songs',
      'Online Music Lessons',
      'Audio Logo & Sonic Branding',
      'DJ Drops & Tags',
      'Singer-Songwriter',
      'Session Musicians',
    ],
    icon: '🎵',
    color: 'from-purple-500 to-ajira-primary',
  },
  {
    name: 'Programming & Tech',
    value: 'Programming & Tech',
    subcategories: [
      'Website Development',
      'Website Platforms',
      'Website Maintenance',
      'Mobile Apps',
      'Desktop Applications',
      'Chatbot Development',
      'Game Development',
      'Web Programming',
      'E-Commerce Development',
      'Database',
      'User Testing',
      'QA & Review',
      'DevOps & Cloud',
      'Cybersecurity',
      'Data Processing',
    ],
    icon: '💻',
    color: 'from-ajira-dark to-ajira-primary',
  },
  {
    name: 'Business',
    value: 'Business',
    subcategories: [
      'Virtual Assistant',
      'Data Entry',
      'Market Research',
      'Business Plans',
      'Legal Consulting',
      'Financial Consulting',
      'HR Consulting',
      'Customer Care',
      'Project Management',
      'CRM Management',
      'ERP Management',
      'Supply Chain Management',
      'Event Management',
      'Sales',
      'Lead Generation',
    ],
    icon: '💼',
    color: 'from-ajira-secondary to-ajira-green-700',
  },
  {
    name: 'Lifestyle',
    value: 'Lifestyle',
    subcategories: [
      'Gaming',
      'Fitness',
      'Nutrition',
      'Cooking Lessons',
      'Arts & Crafts',
      'Relationship Advice',
      'Travel Itineraries',
      'Astrology',
      'Spiritual & Healing',
      'Family & Genealogy',
      'Career Counseling',
      'Life Coaching',
      'Fashion Advice',
      'Beauty',
      'Wellness',
    ],
    icon: '🌟',
    color: 'from-ajira-accent to-ajira-orange-700',
  },
];

// Fiverr-like sort options
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'kinapChoice', label: "KiNaP's Choice" },
  { value: 'bestSelling', label: 'Best Selling' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'topRated', label: 'Top Rated' },
  { value: 'priceLow', label: 'Price: Low to High' },
  { value: 'priceHigh', label: 'Price: High to Low' },
];

// Fiverr-like price ranges
const PRICE_RANGES = [
  { value: 'all', label: 'Any Price', min: 0, max: Infinity },
  { value: 'under500', label: 'Under KES 500', min: 0, max: 500 },
  { value: '500to2000', label: 'KES 500 - KES 2,000', min: 500, max: 2000 },
  { value: '2000to5000', label: 'KES 2,000 - KES 5,000', min: 2000, max: 5000 },
  {
    value: '5000to10000',
    label: 'KES 5,000 - KES 10,000',
    min: 5000,
    max: 10000,
  },
  { value: 'over10000', label: 'KES 10,000+', min: 10000, max: Infinity },
];

// Delivery time filters
const DELIVERY_OPTIONS = [
  { value: 'all', label: 'Any Time' },
  { value: '1day', label: 'Express 24H' },
  { value: '3days', label: 'Up to 3 days' },
  { value: '7days', label: 'Up to 7 days' },
  { value: '14days', label: 'Up to 14 days' },
];

const GIGS_PER_PAGE = 20;

const MarketplacePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState('all');
  const [deliveryTime, setDeliveryTime] = useState('all');
  const [showKinapChoiceOnly, setShowKinapChoiceOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [showMarketplaceBanner, setShowMarketplaceBanner] = useState(true);

  // Profile completion check
  const { user } = useBetterAuthContext();
  const [profileData, setProfileData] = useState({});
  const [showProfileBanner, setShowProfileBanner] = useState(true);

  // Check profile completion for marketplace access
  const profileCheck = checkProfileRequirements(profileData, 'marketplace');

  // Fetch gigs from API
  useEffect(() => {
    // Initialize stability banner from localStorage
    try {
      const dismissed = localStorage.getItem('marketplaceStabilityBannerDismissed') === 'true';
      if (dismissed) setShowMarketplaceBanner(false);
    } catch {}

    const loadGigs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const filters: SearchFilters = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          subcategory:
            selectedSubcategory !== 'all' ? selectedSubcategory : undefined,
          minPrice:
            priceRange !== 'all'
              ? PRICE_RANGES.find((r) => r.value === priceRange)?.min
              : undefined,
          maxPrice:
            priceRange !== 'all'
              ? PRICE_RANGES.find((r) => r.value === priceRange)?.max
              : undefined,
          search: search || undefined,
          sort:
            sortBy === 'newest'
              ? 'newest'
              : sortBy === 'priceLow'
                ? 'price-low'
                : sortBy === 'priceHigh'
                  ? 'price-high'
                  : sortBy === 'topRated'
                    ? 'rating'
                    : sortBy === 'bestSelling'
                      ? 'orders'
                      : 'newest',
          page,
          limit: GIGS_PER_PAGE,
        };

        const response = await fetchGigs(filters);
        setGigs(response.gigs);

        // Load stats
        const statsData = await fetchMarketplaceStats();
        setStats(statsData);
      } catch (err) {
        console.error('Error loading gigs:', err);
        setError('Failed to load gigs. Please try again.');
        setGigs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGigs();
  }, [
    selectedCategory,
    selectedSubcategory,
    search,
    sortBy,
    priceRange,
    deliveryTime,
    page,
  ]);

  // Get current category data
  const currentCategory = fiverCategories.find(
    (cat) => cat.value === selectedCategory
  );
  const subcategories = currentCategory?.subcategories || [];

  // Filter gigs based on remaining client-side filters
  let filteredGigs = gigs.filter((gig: Gig) => {
    // Delivery time filter (not handled by API)
    const gigDeliveryDays = gig.packages?.[0]?.deliveryTime || 999;
    const matchesDelivery =
      deliveryTime === 'all' ||
      (deliveryTime === '1day' && gigDeliveryDays <= 1) ||
      (deliveryTime === '3days' && gigDeliveryDays <= 3) ||
      (deliveryTime === '7days' && gigDeliveryDays <= 7) ||
      (deliveryTime === '14days' && gigDeliveryDays <= 14);

    // KiNaP's Choice filter (featured gigs)
    const matchesKinapChoice = !showKinapChoiceOnly || gig.featured;

    return matchesDelivery && matchesKinapChoice;
  });

  // Client-side sorting for remaining options
  filteredGigs = filteredGigs.sort((a: Gig, b: Gig) => {
    const getPrice = (gig: Gig) =>
      gig.packages?.[0]?.price || gig.pricing.amount || 0;
    const getRating = (gig: Gig) => gig.stats.rating || 0;
    const getOrders = (gig: Gig) => gig.stats.orders || 0;
    const getReviews = (gig: Gig) => gig.stats.reviews || 0;

    switch (sortBy) {
      case 'recommended':
        // Featured gigs first, then by rating and orders
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const scoreA =
          getRating(a) * 0.4 +
          Math.log(getOrders(a) + 1) * 0.3 +
          Math.log(getReviews(a) + 1) * 0.3;
        const scoreB =
          getRating(b) * 0.4 +
          Math.log(getOrders(b) + 1) * 0.3 +
          Math.log(getReviews(b) + 1) * 0.3;
        return scoreB - scoreA;
      case 'kinapChoice':
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return getRating(b) - getRating(a);
      case 'bestSelling':
        return getOrders(b) - getOrders(a);
      case 'newest':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'topRated':
        if (getRating(b) !== getRating(a)) return getRating(b) - getRating(a);
        return getReviews(b) - getReviews(a);
      case 'priceLow':
        return getPrice(a) - getPrice(b);
      case 'priceHigh':
        return getPrice(b) - getPrice(a);
      default:
        return 0;
    }
  });

  // Pagination - now handled by API, but we can still slice for client-side filtering
  const paginatedGigs = filteredGigs;

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [
    selectedCategory,
    selectedSubcategory,
    search,
    sortBy,
    priceRange,
    deliveryTime,
    showKinapChoiceOnly,
  ]);

  // Loading state
  if (isLoading) {
    return (
      <LoadingState
        message='Loading marketplace'
        description='Please wait while we fetch the latest gigs'
      />
    );
  }

  return (
    <div className='bg-ajira-light min-h-screen'>
      {showMarketplaceBanner && (
        <div className='max-w-7xl mx-auto px-4 pt-4'>
          <div className='mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-yellow-800'>
            <div className='flex items-start gap-3'>
              <AlertCircle className='w-4 h-4 mt-0.5' />
              <div className='flex-1'>
                <p className='text-sm'>
                  Marketplace uploads are currently limited. Our team is working on enabling service publishing and payments. Some actions may not work yet.
                </p>
              </div>
              <button
                type='button'
                onClick={() => {
                  setShowMarketplaceBanner(false);
                  try { localStorage.setItem('marketplaceStabilityBannerDismissed', 'true'); } catch {}
                }}
                className='text-yellow-700 hover:text-yellow-900'
                aria-label='Dismiss'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Enhanced Ajira Digital Hero Section - Single Search */}
      <section className='relative bg-gradient-ajira text-white py-24 px-4 overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full'></div>
          <div className='absolute top-32 right-20 w-16 h-16 border-2 border-ajira-orange-300 rounded-lg rotate-45'></div>
          <div className='absolute bottom-20 left-1/4 w-12 h-12 bg-ajira-green-300 rounded-full'></div>
          <div className='absolute bottom-32 right-1/3 w-24 h-24 border-2 border-ajira-blue-300 rounded-full'></div>
        </div>

        <div className='max-w-6xl mx-auto text-center relative z-10'>
          <div className='flex items-center justify-center gap-2 mb-6'>
            <Sparkles className='w-8 h-8 text-ajira-orange-300 animate-spin-slow' />
            <span className='text-ajira-orange-200 text-lg font-medium'>
              KiNaP Digital Marketplace
            </span>
            <Sparkles className='w-8 h-8 text-ajira-orange-300 animate-spin-slow' />
          </div>

          <h1 className='text-5xl md:text-7xl font-bold mb-6 leading-tight'>
            Find the{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-ajira-orange-200 to-ajira-green-200'>
              perfect
            </span>
            <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-ajira-green-200 to-ajira-blue-200'>
              freelance service
            </span>
          </h1>

          <p className='text-xl md:text-2xl text-ajira-blue-200 mb-12 max-w-3xl mx-auto'>
            Connect with top Kenyan talent and get your projects done with
            quality and speed
          </p>

          {/* Main Search Bar */}
          <div className='max-w-4xl mx-auto mb-12'>
            <div className='flex items-center bg-white/10 backdrop-blur-md rounded-2xl shadow-ajira-xl overflow-hidden border border-white/20'>
              <Search className='w-6 h-6 text-ajira-blue-200 ml-6' />
              <input
                type='text'
                placeholder='What service are you looking for today?'
                className='flex-1 px-6 py-6 text-lg text-white placeholder-ajira-blue-200 bg-transparent outline-none'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className='bg-ajira-accent hover:bg-ajira-orange-600 text-white px-10 py-6 font-semibold text-lg transition-all duration-200 hover:scale-105'
                onClick={() => {
                  // Trigger search or navigate to results
                  if (search.trim()) {
                    document
                      .getElementById('results-section')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Popular Tags */}
          <div className='flex flex-wrap justify-center gap-3 mb-8'>
            <span className='text-ajira-orange-200 text-lg'>Popular:</span>
            {[
              'Logo Design',
              'WordPress',
              'Voice Over',
              'Video Editing',
              'Data Entry',
              'Social Media',
              'SEO',
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearch(tag)}
                className='bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-all duration-200 border border-white/20 hover:border-ajira-accent/50 hover:scale-105'
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-16'>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold text-ajira-orange-200'>
                1000+
              </div>
              <div className='text-ajira-blue-200'>Active Services</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold text-ajira-green-200'>
                50+
              </div>
              <div className='text-ajira-blue-200'>Expert Freelancers</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold text-ajira-orange-200'>
                98%
              </div>
              <div className='text-ajira-blue-200'>Satisfaction Rate</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold text-ajira-green-200'>
                24H
              </div>
              <div className='text-ajira-blue-200'>Avg Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Completion Banner */}
      {showProfileBanner && !profileCheck.allowed && (
        <section className='bg-white border-b border-ajira-gray-200'>
          <div className='max-w-7xl mx-auto px-4 py-4'>
            <ProfileCompletionBanner
              profileData={profileData}
              feature='marketplace'
              onComplete={() => setShowProfileBanner(false)}
            />
          </div>
        </section>
      )}

      {/* Enhanced Category Navigation */}
      <section className='bg-white border-b border-ajira-gray-200 sticky top-0 z-40 shadow-ajira'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex items-center overflow-x-auto py-4 space-x-6'>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubcategory('all');
              }}
              className={`flex items-center whitespace-nowrap px-6 py-3 rounded-xl transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-ajira-blue text-white font-semibold shadow-ajira-lg scale-105'
                  : 'text-ajira-text-secondary hover:text-ajira-primary hover:bg-ajira-light'
              }`}
            >
              <span className='mr-2 text-lg'>🏠</span>
              All Categories
            </button>
            {fiverCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => {
                  setSelectedCategory(category.value);
                  setSelectedSubcategory('all');
                }}
                className={`flex items-center whitespace-nowrap px-6 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                  selectedCategory === category.value
                    ? `bg-gradient-to-r ${category.color} text-white font-semibold shadow-ajira-lg scale-105`
                    : 'text-ajira-text-secondary hover:text-ajira-primary hover:bg-ajira-light hover:scale-105'
                }`}
              >
                <span className='mr-2 text-lg'>{category.icon}</span>
                {category.name}
                {selectedCategory === category.value && (
                  <div className='absolute inset-0 bg-white/10 animate-pulse'></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Subcategory Navigation */}
      {selectedCategory !== 'all' && subcategories.length > 0 && (
        <section className='bg-ajira-light border-b border-ajira-gray-200'>
          <div className='max-w-7xl mx-auto px-4 py-4'>
            <div className='flex items-center overflow-x-auto space-x-3'>
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  selectedSubcategory === 'all'
                    ? 'bg-ajira-primary text-white shadow-ajira'
                    : 'text-ajira-text-secondary hover:text-ajira-primary hover:bg-white'
                }`}
              >
                All {currentCategory?.name}
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                    selectedSubcategory === sub
                      ? 'bg-ajira-primary text-white shadow-ajira'
                      : 'text-ajira-text-secondary hover:text-ajira-primary hover:bg-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KiNaP's Choice Banner - Enhanced with Ajira colors */}
      {gigs.filter((g: any) => g.isKinapChoice).length > 0 &&
        !showKinapChoiceOnly && (
          <section className='bg-gradient-ajira-orange text-white py-16 relative overflow-hidden'>
            <div className='absolute inset-0 bg-black/10'></div>
            <div className='max-w-7xl mx-auto px-4 text-center relative z-10'>
              <div className='flex items-center justify-center gap-4 mb-6'>
                <Award className='w-12 h-12 animate-bounce-slow' />
                <h2 className='text-5xl font-bold'>KiNaP's Choice</h2>
                <Award className='w-12 h-12 animate-bounce-slow' />
              </div>
              <p className='text-xl mb-8 max-w-3xl mx-auto'>
                Premium services hand-picked by our team for exceptional quality
                and customer satisfaction. Work with the best talent in Kenya.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                <button
                  onClick={() => setShowKinapChoiceOnly(true)}
                  className='bg-white text-ajira-accent px-8 py-4 rounded-xl font-semibold hover:bg-ajira-gray-100 transition-all duration-200 shadow-ajira-lg hover:scale-105'
                >
                  Explore KiNaP's Choice
                </button>
                <div className='flex items-center gap-2 text-ajira-orange-200'>
                  <Shield className='w-5 h-5' />
                  <span>Quality Guaranteed</span>
                </div>
              </div>
            </div>
          </section>
        )}

      {/* Main Content */}
      <section id='results-section' className='max-w-7xl mx-auto px-4 py-12'>
        {/* Enhanced Filters and Results Header */}
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6'>
          <div>
            <h1 className='text-3xl font-bold text-ajira-text-primary mb-2'>
              {showKinapChoiceOnly ? (
                <span className='flex items-center gap-3'>
                  <Award className='w-8 h-8 text-ajira-accent' />
                  KiNaP's Choice Services
                </span>
              ) : (
                `${filteredGigs.length.toLocaleString()} services available`
              )}
              {selectedCategory !== 'all' && (
                <span className='text-xl font-normal text-ajira-text-secondary ml-3'>
                  in {currentCategory?.name}
                  {selectedSubcategory !== 'all' && ` > ${selectedSubcategory}`}
                </span>
              )}
            </h1>
            <div className='flex items-center gap-6 text-sm text-ajira-text-muted'>
              <div className='flex items-center gap-2'>
                <Users className='w-4 h-4' />
                <span>{gigs.length.toLocaleString()} freelancers</span>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4' />
                <span>Kenya</span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4' />
                <span>Growing daily</span>
              </div>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row items-center gap-4'>
            {/* KiNaP's Choice Toggle */}
            <button
              onClick={() => setShowKinapChoiceOnly(!showKinapChoiceOnly)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 ${
                showKinapChoiceOnly
                  ? 'bg-ajira-accent text-white border-ajira-accent shadow-ajira-lg'
                  : 'bg-white text-ajira-text-primary border-ajira-gray-300 hover:border-ajira-accent hover:shadow-ajira'
              }`}
            >
              <Award className='w-5 h-5' />
              <span className='font-medium'>KiNaP's Choice</span>
            </button>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='flex items-center gap-2 px-6 py-3 rounded-xl border border-ajira-gray-300 bg-white text-ajira-text-primary hover:border-ajira-secondary hover:shadow-ajira transition-all duration-200'
            >
              <Filter className='w-5 h-5' />
              <span className='font-medium'>Filter</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className='px-6 py-3 border border-ajira-gray-300 rounded-xl bg-white text-ajira-text-primary focus:outline-none focus:ring-2 focus:ring-ajira-secondary focus:border-transparent shadow-ajira hover:shadow-ajira-lg transition-all duration-200'
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className='flex border border-ajira-gray-300 rounded-xl overflow-hidden shadow-ajira'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-all duration-200 ${viewMode === 'grid' ? 'bg-ajira-primary text-white' : 'bg-white text-ajira-text-secondary hover:bg-ajira-light'}`}
              >
                <Grid className='w-5 h-5' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-all duration-200 ${viewMode === 'list' ? 'bg-ajira-primary text-white' : 'bg-white text-ajira-text-secondary hover:bg-ajira-light'}`}
              >
                <List className='w-5 h-5' />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Advanced Filters Panel */}
        {showFilters && (
          <div className='bg-white border border-ajira-gray-200 rounded-2xl p-8 mb-8 shadow-ajira-lg'>
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              <div>
                <label className='block text-sm font-semibold text-ajira-text-primary mb-3'>
                  Price Range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className='w-full px-4 py-3 border border-ajira-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ajira-secondary transition-all duration-200'
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className='block text-sm font-semibold text-ajira-text-primary mb-3'>
                  Delivery Time
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className='w-full px-4 py-3 border border-ajira-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ajira-secondary transition-all duration-200'
                >
                  {DELIVERY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className='md:col-span-2 lg:col-span-2'>
                <div className='flex items-center justify-end space-x-4 h-full'>
                  <button
                    onClick={() => {
                      setPriceRange('all');
                      setDeliveryTime('all');
                      setShowKinapChoiceOnly(false);
                    }}
                    className='px-6 py-3 text-ajira-text-muted hover:text-ajira-text-primary transition-colors'
                  >
                    Clear all filters
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className='px-8 py-3 bg-ajira-primary text-white rounded-xl hover:bg-ajira-blue-600 transition-all duration-200 shadow-ajira'
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {paginatedGigs.length > 0 ? (
          <>
            {/* Active Filters Display */}
            {(showKinapChoiceOnly ||
              priceRange !== 'all' ||
              deliveryTime !== 'all' ||
              selectedCategory !== 'all') && (
              <div className='flex flex-wrap items-center gap-3 mb-8'>
                <span className='text-sm text-ajira-text-muted font-medium'>
                  Active filters:
                </span>
                {showKinapChoiceOnly && (
                  <span className='inline-flex items-center gap-2 bg-ajira-orange-100 text-ajira-orange-800 px-4 py-2 rounded-full text-sm font-medium'>
                    <Award className='w-4 h-4' />
                    KiNaP's Choice
                    <button
                      onClick={() => setShowKinapChoiceOnly(false)}
                      className='ml-1 hover:text-ajira-orange-900 text-lg'
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className='inline-flex items-center gap-2 bg-ajira-green-100 text-ajira-green-800 px-4 py-2 rounded-full text-sm font-medium'>
                    {currentCategory?.name}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className='ml-1 hover:text-ajira-green-900 text-lg'
                    >
                      ×
                    </button>
                  </span>
                )}
                {priceRange !== 'all' && (
                  <span className='inline-flex items-center gap-2 bg-ajira-blue-100 text-ajira-blue-800 px-4 py-2 rounded-full text-sm font-medium'>
                    {PRICE_RANGES.find((r) => r.value === priceRange)?.label}
                    <button
                      onClick={() => setPriceRange('all')}
                      className='ml-1 hover:text-ajira-blue-900 text-lg'
                    >
                      ×
                    </button>
                  </span>
                )}
                {deliveryTime !== 'all' && (
                  <span className='inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium'>
                    <Clock className='w-4 h-4' />
                    {
                      DELIVERY_OPTIONS.find((d) => d.value === deliveryTime)
                        ?.label
                    }
                    <button
                      onClick={() => setDeliveryTime('all')}
                      className='ml-1 hover:text-purple-900 text-lg'
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Quality Assurance Banner */}
            <div className='bg-gradient-to-r from-ajira-green-50 to-ajira-blue-50 border border-ajira-green-200 rounded-2xl p-6 mb-8'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <Shield className='w-8 h-8 text-ajira-secondary' />
                  <div>
                    <h4 className='font-bold text-ajira-green-800 text-lg'>
                      Quality Guaranteed
                    </h4>
                    <p className='text-ajira-green-600'>
                      All services are verified and quality-checked by our team
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-8 text-sm text-ajira-green-700'>
                  <div className='flex items-center gap-2'>
                    <Zap className='w-5 h-5' />
                    <span className='font-medium'>Fast delivery</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Award className='w-5 h-5' />
                    <span className='font-medium'>Expert freelancers</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Shield className='w-5 h-5' />
                    <span className='font-medium'>Secure payments</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i}
                    className='bg-white rounded-2xl p-6 shadow-ajira animate-pulse'
                  >
                    <div className='w-full h-48 bg-ajira-gray-200 rounded-xl mb-4'></div>
                    <div className='h-4 bg-ajira-gray-200 rounded mb-2'></div>
                    <div className='h-3 bg-ajira-gray-200 rounded mb-4'></div>
                    <div className='h-6 bg-ajira-gray-200 rounded mb-2'></div>
                    <div className='h-4 bg-ajira-gray-200 rounded'></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className='text-center py-20'>
                <div className='max-w-md mx-auto'>
                  <div className='w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <Search className='w-12 h-12 text-red-500' />
                  </div>
                  <h3 className='text-2xl font-semibold text-ajira-text-primary mb-4'>
                    Error loading gigs
                  </h3>
                  <p className='text-ajira-text-muted mb-8'>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className='px-8 py-4 bg-ajira-primary text-white rounded-xl hover:bg-ajira-blue-600 transition-all duration-200 shadow-ajira-lg'
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Gigs Grid */}
            {!isLoading && !error && (
              <div
                className={`grid gap-8 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {paginatedGigs.map((gig: Gig) => (
                  <GigCard key={gig._id} gig={gig} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            <div className='mt-16'>
              <div className='text-center text-sm text-ajira-text-muted mb-8'>
                Showing {(page - 1) * GIGS_PER_PAGE + 1} -{' '}
                {Math.min(page * GIGS_PER_PAGE, filteredGigs.length)} of{' '}
                {filteredGigs.length.toLocaleString()} results
              </div>

              {totalPages > 1 && (
                <div className='flex justify-center items-center gap-3'>
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className='px-6 py-3 border border-ajira-gray-300 rounded-xl text-ajira-text-primary bg-white hover:bg-ajira-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-ajira'
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (page <= 4) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = page - 3 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-4 py-3 border rounded-xl transition-all duration-200 ${
                          page === pageNum
                            ? 'bg-ajira-primary text-white border-ajira-primary shadow-ajira-lg'
                            : 'border-ajira-gray-300 text-ajira-text-primary bg-white hover:bg-ajira-gray-50 shadow-ajira'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className='px-6 py-3 border border-ajira-gray-300 rounded-xl text-ajira-text-primary bg-white hover:bg-ajira-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-ajira'
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='text-center py-20'>
            <div className='max-w-md mx-auto'>
              <div className='w-24 h-24 bg-ajira-light rounded-full flex items-center justify-center mx-auto mb-6'>
                <Search className='w-12 h-12 text-ajira-text-muted' />
              </div>
              <h3 className='text-2xl font-semibold text-ajira-text-primary mb-4'>
                No services found
              </h3>
              <p className='text-ajira-text-muted mb-8'>
                Try adjusting your search or filter criteria to find what you're
                looking for.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  setPriceRange('all');
                  setDeliveryTime('all');
                  setShowKinapChoiceOnly(false);
                }}
                className='px-8 py-4 bg-ajira-primary text-white rounded-xl hover:bg-ajira-blue-600 transition-all duration-200 shadow-ajira-lg'
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Additional Fiverr-like sections */}
      {!showKinapChoiceOnly && (
        <>
          <CategoryShowcase />
          <PopularServicesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <TrustedBySection />
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
