import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Star, Heart, Share2, ChevronDown, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [deliveryTime, setDeliveryTime] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
  }, []);

  const categories = [
    'All',
    'Graphics & Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Business',
    'Lifestyle'
  ];

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'best_selling', label: 'Best Selling' },
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  // Extensive demo gigs like Fiverr
  const gigs = [
    {
      id: 1,
      title: "I will design a modern minimalist logo for your brand",
      description: "Professional logo design with unlimited revisions, source files, and commercial rights included.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/116438417/original/0a1c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c/design-a-modern-minimalist-logo.jpg",
      category: "Graphics & Design",
      subcategory: "Logo Design",
      price: 2500,
      originalPrice: 5000,
      rating: 4.9,
      reviews: 1247,
      orders: 3500,
      deliveryTime: "2 days",
      seller: {
        name: "Grace Wanjiku",
        username: "gracewanjiku_design",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        level: "Top Rated Seller",
        country: "Kenya",
        responseTime: "1 hour",
        lastSeen: "Online"
      },
      features: ["Logo transparency", "Vector file", "Printable file", "3D mockup", "Social media kit"],
      tags: ["logo", "branding", "minimalist", "modern", "business"],
      isFavorite: false,
      isChoice: true,
      badge: "Bestseller"
    },
    {
      id: 2,
      title: "I will write SEO optimized blog posts and articles",
      description: "High-quality, engaging content that ranks on Google. Research included, plagiarism-free guaranteed.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/123456789/original/seo-content-writing.jpg",
      category: "Writing & Translation",
      subcategory: "Articles & Blog Posts",
      price: 1500,
      originalPrice: 3000,
      rating: 4.8,
      reviews: 892,
      orders: 2100,
      deliveryTime: "3 days",
      seller: {
        name: "John Kamau",
        username: "johnkamau_writer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        level: "Level 2 Seller",
        country: "Kenya",
        responseTime: "2 hours",
        lastSeen: "2 hours ago"
      },
      features: ["SEO optimized", "Plagiarism free", "Unlimited revisions", "Fast delivery", "Research included"],
      tags: ["seo", "content", "blog", "article", "writing"],
      isFavorite: false,
      isChoice: false,
      badge: "New"
    },
    {
      id: 3,
      title: "I will create a professional website using WordPress",
      description: "Custom WordPress website with responsive design, SEO optimization, and admin training included.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/987654321/original/wordpress-website-design.jpg",
      category: "Programming & Tech",
      subcategory: "Website Development",
      price: 15000,
      originalPrice: 25000,
      rating: 4.9,
      reviews: 456,
      orders: 890,
      deliveryTime: "7 days",
      seller: {
        name: "Peter Mwangi",
        username: "petermwangi_dev",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        level: "Top Rated Seller",
        country: "Kenya",
        responseTime: "30 minutes",
        lastSeen: "Online"
      },
      features: ["Responsive design", "SEO optimized", "Admin training", "30 days support", "Source code"],
      tags: ["wordpress", "website", "responsive", "seo", "development"],
      isFavorite: true,
      isChoice: true,
      badge: "Pro"
    },
    {
      id: 4,
      title: "I will manage your social media accounts and create content",
      description: "Complete social media management including content creation, posting schedule, and engagement.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/555666777/original/social-media-management.jpg",
      category: "Digital Marketing",
      subcategory: "Social Media Marketing",
      price: 8000,
      originalPrice: 12000,
      rating: 4.7,
      reviews: 623,
      orders: 1200,
      deliveryTime: "1 day",
      seller: {
        name: "Sarah Njeri",
        username: "sarahnjeri_smm",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        level: "Level 2 Seller",
        country: "Kenya",
        responseTime: "1 hour",
        lastSeen: "Online"
      },
      features: ["Content calendar", "Daily posting", "Engagement", "Analytics report", "Hashtag research"],
      tags: ["social media", "marketing", "content", "instagram", "facebook"],
      isFavorite: false,
      isChoice: false,
      badge: "Bestseller"
    },
    {
      id: 5,
      title: "I will create stunning video animations and motion graphics",
      description: "Professional 2D animations, explainer videos, and motion graphics for your business needs.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/888999000/original/video-animation.jpg",
      category: "Video & Animation",
      subcategory: "Animation",
      price: 12000,
      originalPrice: 20000,
      rating: 4.8,
      reviews: 334,
      orders: 567,
      deliveryTime: "5 days",
      seller: {
        name: "David Kiprotich",
        username: "davidkip_animator",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        level: "Level 1 Seller",
        country: "Kenya",
        responseTime: "3 hours",
        lastSeen: "1 hour ago"
      },
      features: ["HD quality", "Background music", "Voice over", "Unlimited revisions", "Source files"],
      tags: ["animation", "video", "motion graphics", "explainer", "2d"],
      isFavorite: false,
      isChoice: true,
      badge: "Rising"
    },
    {
      id: 6,
      title: "I will do data entry and virtual assistant tasks efficiently",
      description: "Accurate data entry, email management, research, and administrative support services.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/111222333/original/data-entry-va.jpg",
      category: "Business",
      subcategory: "Virtual Assistant",
      price: 1000,
      originalPrice: 2000,
      rating: 4.6,
      reviews: 789,
      orders: 1500,
      deliveryTime: "1 day",
      seller: {
        name: "Mary Wanjiru",
        username: "marywanjiru_va",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        level: "Level 1 Seller",
        country: "Kenya",
        responseTime: "2 hours",
        lastSeen: "Online"
      },
      features: ["Fast delivery", "Accurate work", "24/7 availability", "Multiple formats", "Quality guarantee"],
      tags: ["data entry", "virtual assistant", "admin", "research", "excel"],
      isFavorite: false,
      isChoice: false,
      badge: "Budget Friendly"
    },
    {
      id: 7,
      title: "I will compose original music and jingles for your project",
      description: "Custom music composition, jingles, background music, and audio production services.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/444555666/original/music-composition.jpg",
      category: "Music & Audio",
      subcategory: "Music Production",
      price: 5000,
      originalPrice: 8000,
      rating: 4.9,
      reviews: 234,
      orders: 345,
      deliveryTime: "4 days",
      seller: {
        name: "James Ochieng",
        username: "jamesochieng_music",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        level: "Top Rated Seller",
        country: "Kenya",
        responseTime: "1 hour",
        lastSeen: "Online"
      },
      features: ["Original composition", "Commercial rights", "Multiple formats", "Mixing & mastering", "Revisions"],
      tags: ["music", "composition", "jingle", "audio", "production"],
      isFavorite: true,
      isChoice: true,
      badge: "Pro"
    },
    {
      id: 8,
      title: "I will provide business consulting and market research",
      description: "Professional business advice, market analysis, and strategic planning for startups and SMEs.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/777888999/original/business-consulting.jpg",
      category: "Business",
      subcategory: "Business Consulting",
      price: 10000,
      originalPrice: 15000,
      rating: 4.8,
      reviews: 156,
      orders: 234,
      deliveryTime: "3 days",
      seller: {
        name: "Catherine Muthoni",
        username: "catherinemuthoni_biz",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        level: "Level 2 Seller",
        country: "Kenya",
        responseTime: "1 hour",
        lastSeen: "2 hours ago"
      },
      features: ["Market research", "Business plan", "Financial projections", "Strategy document", "Follow-up support"],
      tags: ["business", "consulting", "market research", "strategy", "planning"],
      isFavorite: false,
      isChoice: false,
      badge: "Expert"
    },
    {
      id: 9,
      title: "I will teach you digital marketing and SEO strategies",
      description: "One-on-one coaching sessions to master digital marketing, SEO, and online business growth.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/123789456/original/digital-marketing-coaching.jpg",
      category: "Lifestyle",
      subcategory: "Online Tutoring",
      price: 3000,
      originalPrice: 5000,
      rating: 4.9,
      reviews: 445,
      orders: 678,
      deliveryTime: "1 day",
      seller: {
        name: "Michael Kipchoge",
        username: "michaelkip_coach",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        level: "Top Rated Seller",
        country: "Kenya",
        responseTime: "30 minutes",
        lastSeen: "Online"
      },
      features: ["1-on-1 session", "Screen sharing", "Course materials", "Follow-up support", "Certificate"],
      tags: ["coaching", "digital marketing", "seo", "tutoring", "online"],
      isFavorite: false,
      isChoice: true,
      badge: "Mentor"
    },
    {
      id: 10,
      title: "I will translate documents between English and Swahili",
      description: "Professional translation services with cultural context and native fluency guaranteed.",
      image: "https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/654321987/original/translation-services.jpg",
      category: "Writing & Translation",
      subcategory: "Translation",
      price: 2000,
      originalPrice: 3500,
      rating: 4.7,
      reviews: 567,
      orders: 890,
      deliveryTime: "2 days",
      seller: {
        name: "Fatuma Hassan",
        username: "fatumahassan_translate",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        level: "Level 2 Seller",
        country: "Kenya",
        responseTime: "1 hour",
        lastSeen: "Online"
      },
      features: ["Native fluency", "Cultural context", "Proofreading", "Fast delivery", "Confidentiality"],
      tags: ["translation", "english", "swahili", "documents", "localization"],
      isFavorite: false,
      isChoice: false,
      badge: "Verified"
    }
  ];

  // Filter and sort gigs
  const filteredGigs = React.useMemo(() => {
    let filtered = gigs.filter(gig => {
      const matchesSearch = !searchQuery || 
        gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || gig.category === selectedCategory;
      const matchesPrice = gig.price >= priceRange[0] && gig.price <= priceRange[1];
      const matchesDelivery = deliveryTime === 'all' || 
        (deliveryTime === '1day' && gig.deliveryTime.includes('1 day')) ||
        (deliveryTime === '3days' && parseInt(gig.deliveryTime) <= 3) ||
        (deliveryTime === '7days' && parseInt(gig.deliveryTime) <= 7);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesDelivery;
    });

    // Sort gigs
    switch (sortBy) {
      case 'best_selling':
        filtered.sort((a, b) => b.orders - a.orders);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Recommended - mix of rating and orders
        filtered.sort((a, b) => (b.rating * b.orders) - (a.rating * a.orders));
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, priceRange, deliveryTime, gigs]);

  const toggleFavorite = (gigId) => {
    // In real app, this would update the backend
    console.log('Toggle favorite for gig:', gigId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.jpeg" alt="KiNaP" className="h-8 w-auto rounded" />
                <span className="text-2xl font-bold text-green-600">KiNaP Gig Baze</span>
              </Link>
              <div className="hidden md:flex items-center space-x-4">
                {categories.slice(1, 6).map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`text-sm hover:text-green-600 transition-colors ${
                      selectedCategory === category ? 'text-green-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="What service are you looking for today?"
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {user && (
                <Link
                  to="/marketplace/create"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Become a Seller
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb & Filters */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-green-600">KiNaP Gig Baze</Link>
              <span>/</span>
              <span>{selectedCategory}</span>
              {searchQuery && (
                <>
                  <span>/</span>
                  <span>"{searchQuery}"</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600"
              >
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-green-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">Any time</option>
                    <option value="1day">Express 24H</option>
                    <option value="3days">Up to 3 days</option>
                    <option value="7days">Up to 7 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (KSh)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setDeliveryTime('all');
                      setPriceRange([0, 50000]);
                      setSearchQuery('');
                    }}
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-6">
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredGigs.length} services available
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Gigs Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
          : "space-y-4"
        }>
          {filteredGigs.map((gig) => (
            <motion.div
              key={gig.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Gig Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-video'}`}>
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleFavorite(gig.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                >
                  <Heart
                    size={16}
                    className={gig.isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}
                  />
                </button>
                {gig.badge && (
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      gig.badge === 'Bestseller' ? 'bg-orange-500 text-white' :
                      gig.badge === 'Pro' ? 'bg-purple-500 text-white' :
                      gig.badge === 'New' ? 'bg-green-500 text-white' :
                      gig.badge === 'Rising' ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {gig.badge}
                    </span>
                  </div>
                )}
                {gig.isChoice && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-orange-500 text-white px-2 py-1 text-xs font-medium rounded">
                      Fiverr's Choice
                    </span>
                  </div>
                )}
              </div>

              {/* Gig Content */}
              <div className="p-4 flex-1">
                {/* Seller Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <img
                    src={gig.seller.image}
                    alt={gig.seller.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{gig.seller.name}</p>
                    <p className="text-xs text-gray-500">{gig.seller.level}</p>
                  </div>
                  <div className="ml-auto">
                    <span className={`w-2 h-2 rounded-full ${
                      gig.seller.lastSeen === 'Online' ? 'bg-green-500' : 'bg-gray-300'
                    }`}></span>
                  </div>
                </div>

                {/* Gig Title */}
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 hover:text-green-600 cursor-pointer">
                  {gig.title}
                </h3>

                {/* Rating & Reviews */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 ml-1">{gig.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({gig.reviews})</span>
                </div>

                {/* Features (for list view) */}
                {viewMode === 'list' && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {gig.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    {gig.originalPrice > gig.price && (
                      <span className="text-xs text-gray-400 line-through">
                        KSh {gig.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-gray-500">Starting at</span>
                      <span className="text-lg font-bold text-gray-900">
                        KSh {gig.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {filteredGigs.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors">
              Load More Gigs
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredGigs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No gigs found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setPriceRange([0, 50000]);
                setDeliveryTime('all');
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace; 