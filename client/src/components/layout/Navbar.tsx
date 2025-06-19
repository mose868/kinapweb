import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, X, User, LogOut, Settings, Bell, Menu, ChevronDown } from 'lucide-react';
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

  // Dropdown menu structure (removed duplicate mazungumzo)
  const dropdownMenus = [
    {
      id: 'about',
      label: 'About',
      items: [
        { label: 'About Us', to: '/about' },
        { label: 'Team', to: '/team' },
        { label: 'Updates', to: '/updates' },
        { label: 'FAQ', to: '/faq' },
        { label: 'Contact', to: '/contact' }
      ]
    },
    {
      id: 'community',
      label: 'Community',
      items: [
        { label: 'Community Hub', to: '/community' },
        { label: 'Testimonials', to: '/testimonials' },
        { label: 'Showcase', to: '/showcase' },
        { label: 'Ambassador Program', to: '/ambassador' }
      ]
    },
    {
      id: 'learning',
      label: 'Learning',
      items: [
        { label: 'Training', to: '/training' },
        { label: 'Mentorship', to: '/mentorship' },
        { label: 'Events', to: '/events' },
        { label: 'Blog', to: '/blog' }
      ]
    },
    {
      id: 'services',
      label: 'Services',
      items: [
        { label: 'Marketplace', to: '/marketplace' },
        { label: 'Become Seller', to: '/become-seller' },
        { label: 'Media Upload', to: '/media-upload' }
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

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <nav className="bg-gradient-to-r from-kenya-black via-kenya-red to-kenya-green shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3" onClick={closeAllDropdowns}>
              <img 
                src="/images/ajira-logo-white.png" 
                alt="KiNaP Ajira Club Logo" 
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">
                  KiNaP Ajira Club
                </span>
                <span className="text-xs text-gray-300 font-medium -mt-1">
                  Digital Skills Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-kenya-green border-b-2 border-kenya-green'
                    : 'text-white hover:text-kenya-green'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/videos"
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-kenya-green border-b-2 border-kenya-green'
                    : 'text-white hover:text-kenya-green'
                }`
              }
            >
              Videos
            </NavLink>

            {/* Dropdown Menus */}
            {dropdownMenus.map((menu) => (
              <div key={menu.id} className="relative">
                <button
                  className="flex items-center px-3 py-2 text-sm font-medium text-white hover:text-kenya-green transition-colors duration-200"
                  onClick={() => handleDropdownToggle(menu.id)}
                  onMouseEnter={() => setActiveDropdown(menu.id)}
                >
                  {menu.label}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === menu.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === menu.id && (
                  <div
                    className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-xl py-2 z-50 border border-gray-100"
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {menu.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `block px-4 py-3 text-sm text-gray-700 hover:bg-kenya-green hover:text-white transition-colors duration-200 ${
                            isActive ? 'bg-kenya-green text-white font-medium' : ''
                          }`
                        }
                        onClick={closeAllDropdowns}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side: Search and User */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block relative" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-10 py-2 bg-kenya-black bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-300 hover:text-white" />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {showSearchResults && searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {Object.keys(groupedSearchResults).length > 0 ? (
                    Object.entries(groupedSearchResults).map(([category, items]) => (
                      <div key={category} className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-kenya-red uppercase tracking-wider">
                          {category}
                        </div>
                        {items.map((item) => (
                          <Link
                            key={item.url}
                            to={item.url}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-kenya-green hover:text-white rounded-md transition-colors"
                            onClick={handleSearchSelect}
                          >
                            <div className="font-medium">{item.title}</div>
                            <div className="text-gray-500 text-xs hover:text-gray-200">{item.description}</div>
                          </Link>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <div className="text-sm">No results found for "{searchQuery}"</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile or Sign In */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-kenya-black hover:bg-opacity-30 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-kenya-green"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-kenya-red to-kenya-green rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-white max-w-32 truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-white transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-2 border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-kenya-green hover:text-white transition-colors"
                      onClick={closeAllDropdowns}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>

                    <Link
                      to="/notifications"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-kenya-green hover:text-white transition-colors"
                      onClick={closeAllDropdowns}
                    >
                      <Bell className="w-4 h-4 mr-3" />
                      Notifications
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-kenya-green hover:text-white transition-colors"
                      onClick={closeAllDropdowns}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Orders
                    </Link>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-kenya-red hover:bg-kenya-red hover:text-white transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-gradient-to-r from-kenya-red to-kenya-green text-white px-4 py-2 rounded-lg hover:from-kenya-green hover:to-kenya-red transition-all duration-200 font-medium text-sm"
                onClick={closeAllDropdowns}
              >
                Join / Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md text-white hover:bg-kenya-black hover:bg-opacity-30 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-kenya-black to-kenya-red border-t border-kenya-green">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 bg-kenya-black bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {showSearchResults && searchQuery.trim() !== '' && (
              <div className="bg-kenya-black bg-opacity-50 rounded-lg max-h-64 overflow-y-auto">
                {Object.keys(groupedSearchResults).length > 0 ? (
                  Object.entries(groupedSearchResults).map(([category, items]) => (
                    <div key={category} className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-kenya-green uppercase tracking-wider">
                        {category}
                      </div>
                      {items.map((item) => (
                        <Link
                          key={item.url}
                          to={item.url}
                          className="block px-3 py-2 text-sm text-white hover:bg-kenya-green rounded-md transition-colors"
                          onClick={handleSearchSelect}
                        >
                          <div className="font-medium">{item.title}</div>
                          <div className="text-gray-300 text-xs">{item.description}</div>
                        </Link>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-300">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-500" />
                    <div className="text-sm">No results found</div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-kenya-green bg-kenya-black bg-opacity-30 border-l-4 border-kenya-green'
                      : 'text-white hover:text-kenya-green hover:bg-kenya-black hover:bg-opacity-30'
                  }`
                }
                onClick={closeAllDropdowns}
              >
                Home
              </NavLink>

              <NavLink
                to="/videos"
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-kenya-green bg-kenya-black bg-opacity-30 border-l-4 border-kenya-green'
                      : 'text-white hover:text-kenya-green hover:bg-kenya-black hover:bg-opacity-30'
                  }`
                }
                onClick={closeAllDropdowns}
              >
                Videos
              </NavLink>

              {/* Mobile Dropdown Sections */}
              {dropdownMenus.map((menu) => (
                <div key={menu.id} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-semibold text-kenya-green uppercase tracking-wider">
                    {menu.label}
                  </div>
                  {menu.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-6 py-2 text-sm transition-colors ${
                          isActive
                            ? 'text-kenya-green bg-kenya-black bg-opacity-30 border-l-4 border-kenya-green'
                            : 'text-gray-300 hover:text-kenya-green hover:bg-kenya-black hover:bg-opacity-30'
                        }`
                      }
                      onClick={closeAllDropdowns}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>

            {/* Mobile User Section */}
            {user ? (
              <div className="border-t border-kenya-green pt-4 mt-4">
                <div className="flex items-center px-3 py-2 space-x-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-kenya-green"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-kenya-red to-kenya-green rounded-full flex items-center justify-center text-white font-medium">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-300 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <Link
                    to="/profile"
                    className="flex items-center px-6 py-2 text-sm text-gray-300 hover:text-kenya-green hover:bg-kenya-black hover:bg-opacity-30 transition-colors"
                    onClick={closeAllDropdowns}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>

                  <Link
                    to="/notifications"
                    className="flex items-center px-6 py-2 text-sm text-gray-300 hover:text-kenya-green hover:bg-kenya-black hover:bg-opacity-30 transition-colors"
                    onClick={closeAllDropdowns}
                  >
                    <Bell className="w-4 h-4 mr-3" />
                    Notifications
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center px-6 py-2 text-sm text-gray-300 hover:text-kenya-green hover:bg-kenya-black hover:bg-opacity-30 transition-colors"
                    onClick={closeAllDropdowns}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Orders
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-6 py-2 text-sm text-kenya-red hover:bg-kenya-red hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-kenya-green pt-4 mt-4">
                <Link
                  to="/auth"
                  className="block mx-3 bg-gradient-to-r from-kenya-red to-kenya-green text-white px-4 py-3 rounded-lg text-center font-medium hover:from-kenya-green hover:to-kenya-red transition-all"
                  onClick={closeAllDropdowns}
                >
                  Join / Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 