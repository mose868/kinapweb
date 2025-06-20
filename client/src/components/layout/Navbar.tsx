import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, X, User, LogOut, Settings, Bell, Menu, ChevronDown, Info, Users, BookOpen, Briefcase, Globe, Star, Award, MessageCircle, UserCheck, HelpCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Searchable content organized by categories
  const searchableContent = [
    // Main Pages
    { title: 'Home', description: 'Welcome to KiNaP Ajira Club', url: '/', category: 'Pages' },
    { title: 'Community Hub', description: 'Connect with other members and join discussions', url: '/community', category: 'Community' },
    { title: 'Videos', description: 'Educational video content and tutorials', url: '/videos', category: 'Learning' },
    { title: 'Marketplace', description: 'Digital services marketplace', url: '/marketplace', category: 'Services' },
    { title: 'Profile', description: 'Manage your personal profile', url: '/profile', category: 'Account' },
    
    // About Pages
    { title: 'About Us', description: 'Learn about KiNaP Ajira Club', url: '/about', category: 'About' },
    { title: 'Team', description: 'Meet our team members', url: '/team', category: 'About' },
    { title: 'Updates', description: 'Latest news and updates', url: '/updates', category: 'About' },
    { title: 'FAQ', description: 'Frequently asked questions', url: '/faq', category: 'About' },
    
    // Community Pages
    { title: 'Testimonials', description: 'Success stories from members', url: '/testimonials', category: 'Community' },
    { title: 'Ambassador Program', description: 'Join our ambassador program', url: '/ambassador', category: 'Community' },
    { title: 'Showcase', description: 'Member projects and achievements', url: '/showcase', category: 'Community' },
    
    // Learning & Content
    { title: 'Training', description: 'Digital skills training programs', url: '/training', category: 'Learning' },
    { title: 'Mentorship', description: 'Find mentors and mentees', url: '/mentorship', category: 'Learning' },
    { title: 'Blog', description: 'Latest articles and insights', url: '/blog', category: 'Learning' },
    { title: 'Events', description: 'Upcoming workshops and events', url: '/events', category: 'Learning' },
    
    // Services
    { title: 'Become Seller', description: 'Start offering digital services', url: '/become-seller', category: 'Services' },
    { title: 'Media Upload', description: 'Share your content', url: '/media-upload', category: 'Services' },
    
    // Account
    { title: 'Orders', description: 'View your orders and transactions', url: '/orders', category: 'Account' },
    { title: 'Notifications', description: 'Manage your notifications', url: '/notifications', category: 'Account' },
    { title: 'Sign In', description: 'Access your account', url: '/auth', category: 'Account' },
    
    // Contact
    { title: 'Contact', description: 'Get in touch with us', url: '/contact', category: 'Support' }
  ];

  // Professional dropdown menu structure
  const dropdownMenus = [
    {
      id: 'about',
      label: 'About',
      icon: Info,
      items: [
        { label: 'About KiNaP', to: '/about', icon: Info, description: 'Learn about our mission' },
        { label: 'Our Team', to: '/team', icon: Users, description: 'Meet our dedicated team' },
        { label: 'Latest Updates', to: '/updates', icon: Star, description: 'News and announcements' },
        { label: 'FAQ', to: '/faq', icon: HelpCircle, description: 'Common questions' },
        { label: 'Contact Us', to: '/contact', icon: MessageCircle, description: 'Get in touch' }
      ]
    },
    {
      id: 'programs',
      label: 'Programs',
      icon: BookOpen,
      items: [
        { label: 'Digital Training', to: '/training', icon: BookOpen, description: 'Skill development courses' },
        { label: 'Mentorship', to: '/mentorship', icon: UserCheck, description: 'Connect with mentors' },
        { label: 'Events & Workshops', to: '/events', icon: Award, description: 'Live learning sessions' },
        { label: 'Videos & Resources', to: '/videos', icon: Globe, description: 'Educational content' }
      ]
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      items: [
        { label: 'Community Hub', to: '/community', icon: Users, description: 'Join discussions' },
        { label: 'Success Stories', to: '/testimonials', icon: Star, description: 'Member achievements' },
        { label: 'Project Showcase', to: '/showcase', icon: Award, description: 'Featured work' },
        { label: 'Ambassador Program', to: '/ambassador', icon: UserCheck, description: 'Become a leader' }
      ]
    },
    {
      id: 'services',
      label: 'Services',
      icon: Briefcase,
      items: [
        { label: 'Marketplace', to: '/marketplace', icon: Briefcase, description: 'Digital services hub' },
        { label: 'Become a Seller', to: '/become-seller', icon: UserCheck, description: 'Offer your skills' },
        { label: 'Content Creation', to: '/media-upload', icon: MessageCircle, description: 'Share your work' }
      ]
    }
  ];

  // Filter and group search results
  const filteredSearchResults = searchableContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedSearchResults = filteredSearchResults.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof searchableContent>);

  // Handle search visibility
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setShowSearchResults(false);
    } else {
      setShowSearchResults(true);
    }
  }, [searchQuery]);

  // Enhanced click outside handlers with better mobile support
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchResults(false);
        setUserDropdownOpen(false);
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Enhanced mobile menu handling
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleSearchSelect = () => {
    setSearchQuery('');
    setShowSearchResults(false);
    setMobileMenuOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDropdownToggle = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Professional KiNaP Branding */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <img 
                src="/logo.jpeg" 
                alt="KiNaP Ajira Club Logo" 
                className="h-10 w-auto drop-shadow-md rounded-md"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="ml-3 flex flex-col">
                <span className="text-lg font-bold text-gray-900 group-hover:text-kenya-red transition-colors leading-tight">
                  KiNaP Ajira Club
                </span>
                <span className="text-xs text-kenya-green leading-tight font-medium">
                  Digital Skills Hub
                </span>
              </div>
            </Link>
          </div>
          
          {/* Navigation Links with Professional Styling */}
          <div className="hidden lg:flex items-center space-x-1">
            {dropdownMenus.map((menu) => (
              <div key={menu.id} className="relative">
                <button
                  onClick={() => handleDropdownToggle(menu.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeDropdown === menu.id
                      ? 'text-kenya-red bg-kenya-green/10 shadow-sm'
                      : 'text-gray-700 hover:text-kenya-red hover:bg-gray-50'
                  }`}
                >
                  <menu.icon className="w-4 h-4 mr-2" />
                  {menu.label}
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${activeDropdown === menu.id ? 'rotate-180' : ''}`} />
                </button>
                {activeDropdown === menu.id && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {menu.items.map((item, index) => (
                      <Link
                        key={index}
                        to={item.to}
                        className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-kenya-green/5 hover:text-kenya-black transition-colors"
                        onClick={closeAllDropdowns}
                      >
                        <item.icon className="w-4 h-4 mt-0.5 mr-3 text-kenya-green flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Professional Search Bar */}
          <div className="hidden md:flex items-center mx-6 flex-1 max-w-md">
            <div ref={searchRef} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search programs, services..."
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-kenya-red/20 focus:border-kenya-red transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-kenya-red transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Enhanced Search Results */}
              {showSearchResults && filteredSearchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                  {Object.entries(groupedSearchResults).map(([category, items]) => (
                    <div key={category} className="mb-2 last:mb-0">
                      <div className="px-4 py-2 text-xs font-semibold text-kenya-red uppercase tracking-wide border-b border-gray-100">
                        {category}
                      </div>
                      {items.map((item, index) => (
                        <Link
                          key={index}
                          to={item.url}
                          onClick={handleSearchSelect}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-kenya-red">
                              {item.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {item.description}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced User Section with Separate Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-kenya-red hover:bg-gray-50 rounded-lg transition-colors">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-kenya-red rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                </Link>
                
                {/* User Dropdown */}
                <div ref={userDropdownRef} className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-kenya-red to-kenya-green rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user.displayName || user.email}</div>
                      <UserVerificationBadge user={user} />
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">{user.displayName || user.email}</div>
                        <div className="text-xs text-gray-500 mt-1">{user.email}</div>
                        <div className="mt-2">
                          <UserVerificationBadge user={user} />
                        </div>
                      </div>
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <User className="h-4 w-4 mr-3 text-kenya-green" />
                        Profile
                      </Link>
                      <Link to="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings className="h-4 w-4 mr-3 text-kenya-green" />
                        Orders
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-kenya-red hover:bg-kenya-red/5 transition-colors">
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Sign In Button */}
                <Link
                  to="/auth"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-kenya-red border border-gray-300 rounded-lg hover:border-kenya-red transition-all duration-200"
                >
                  Sign In
                </Link>
                
                {/* Register Button - Primary CTA */}
                <Link
                  to="/auth?mode=register"
                  className="bg-gradient-to-r from-kenya-red to-kenya-green hover:from-kenya-green hover:to-kenya-red text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden ml-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-kenya-red hover:bg-gray-50 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      {/* Enhanced Mobile Menu with better animations */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-kenya-green/10 bg-white shadow-xl animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Mobile Search */}
            <div ref={searchRef} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search KiNaP Ajira..."
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border-2 border-kenya-green/30 rounded-lg text-kenya-black placeholder-kenya-green focus:outline-none focus:ring-2 focus:ring-kenya-red/40 focus:border-kenya-red transition-all duration-200 shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-kenya-green hover:text-kenya-red transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Mobile Navigation Links */}
            <div className="space-y-3">
              {dropdownMenus.map((menu) => (
                <div key={menu.id} className="space-y-1">
                  <button
                    onClick={() => handleDropdownToggle(menu.id)}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-lg font-semibold transition-all duration-200 ${
                      activeDropdown === menu.id
                        ? 'text-kenya-red bg-kenya-green/10 border-kenya-green'
                        : 'text-kenya-black hover:text-kenya-red hover:bg-kenya-green/10 hover:border-kenya-green/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <menu.icon className="w-5 h-5" />
                      {menu.label}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === menu.id ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === menu.id && (
                    <div className="ml-4 space-y-1 animate-in slide-in-from-top duration-200">
                      {menu.items.map((item, index) => (
                        <Link
                          key={index}
                          to={item.to}
                          className="flex items-center gap-3 px-6 py-3 text-base text-kenya-black hover:bg-kenya-green/10 hover:text-kenya-red rounded-lg transition-colors mx-2"
                          onClick={closeAllDropdowns}
                        >
                          <item.icon className="w-4 h-4 text-kenya-green" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-gray-600">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile User Section */}
            <div className="border-t border-kenya-green/10 pt-4 mt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-kenya-red to-kenya-green rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-kenya-black">{user.displayName || user.email}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-kenya-black hover:bg-kenya-green/10 rounded-lg transition-colors" onClick={closeAllDropdowns}>
                      <User className="h-4 w-4 text-kenya-green" />
                      Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-kenya-black hover:bg-kenya-green/10 rounded-lg transition-colors" onClick={closeAllDropdowns}>
                      <Settings className="h-4 w-4 text-kenya-green" />
                      Orders
                    </Link>
                    <Link to="/notifications" className="flex items-center gap-3 px-4 py-2 text-kenya-black hover:bg-kenya-green/10 rounded-lg transition-colors" onClick={closeAllDropdowns}>
                      <Bell className="h-4 w-4 text-kenya-green" />
                      Notifications
                    </Link>
                    <button 
                      onClick={handleSignOut} 
                      className="flex items-center gap-3 w-full px-4 py-2 text-kenya-red hover:bg-kenya-red/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/auth"
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:text-kenya-red hover:border-kenya-red transition-all duration-200"
                    onClick={closeAllDropdowns}
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                  <Link
                    to="/auth?mode=register"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-kenya-red to-kenya-green hover:from-kenya-green hover:to-kenya-red text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={closeAllDropdowns}
                  >
                    <Star className="w-5 h-5" />
                    Join Now
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Search Results */}
            {showSearchResults && filteredSearchResults.length > 0 && (
              <div className="border-t border-kenya-green/10 pt-4 mt-4">
                <div className="text-sm font-semibold text-kenya-red mb-3">Search Results</div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(groupedSearchResults).map(([category, items]) => (
                    <div key={category}>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        {category}
                      </div>
                      {items.map((item, index) => (
                        <Link
                          key={index}
                          to={item.url}
                          onClick={handleSearchSelect}
                          className="block px-3 py-2 hover:bg-kenya-green/10 rounded-lg transition-colors"
                        >
                          <div className="font-medium text-kenya-black">{item.title}</div>
                          <div className="text-xs text-gray-600">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// User Verification Badge Component
const UserVerificationBadge = ({ user }: { user: any }) => {
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 bg-kenya-accent rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      <span className="text-xs text-kenya-text-muted">Verified Member</span>
    </div>
  );
};

export default Navbar; 