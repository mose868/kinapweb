import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, X, User, LogOut, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [userDropdown, setUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // All searchable pages and content
  const searchableContent = [
    // Pages
    { title: 'Home', description: 'Main landing page', url: '/', type: 'page' },
    { title: 'About Us', description: 'Learn about Ajira Digital KiNaP Club', url: '/about', type: 'page' },
    { title: 'Team', description: 'Meet our team members', url: '/team', type: 'page' },
    { title: 'Events', description: 'Upcoming workshops and events', url: '/events', type: 'page' },
    { title: 'Community Hub', description: 'Connect with other members', url: '/community', type: 'page' },
    { title: 'Mazungumzo Hub', description: 'Live chat and discussions with community', url: '/mazungumzo', type: 'page' },
    { title: 'Showcase', description: 'Member projects and achievements', url: '/showcase', type: 'page' },
    { title: 'Testimonials', description: 'Success stories from members', url: '/testimonials', type: 'page' },
    { title: 'Training', description: 'Digital skills training programs', url: '/training', type: 'page' },
    { title: 'Mentorship', description: 'Find mentors and mentees', url: '/mentorship', type: 'page' },
    { title: 'Videos', description: 'Educational video content', url: '/videos', type: 'page' },
    { title: 'Blog', description: 'Latest articles and insights', url: '/blog', type: 'page' },
    { title: 'Marketplace', description: 'Digital services marketplace', url: '/marketplace', type: 'page' },
    { title: 'Profile', description: 'Your personal profile - complete to 100%', url: '/profile', type: 'page' },
    { title: 'Sign In', description: 'Access your account and profile', url: '/auth', type: 'page' },
    { title: 'Sign Up', description: 'Create account and build your profile', url: '/auth', type: 'page' },
    { title: 'Contact', description: 'Get in touch with us', url: '/contact', type: 'page' },
    
    // Skills and topics
    { title: 'Web Development', description: 'Learn HTML, CSS, JavaScript, React', url: '/training', type: 'skill' },
    { title: 'Graphic Design', description: 'Adobe Creative Suite, Logo Design', url: '/events', type: 'skill' },
    { title: 'Financial Markets', description: 'Trading, Forex, Cryptocurrency', url: '/events', type: 'skill' },
    { title: 'Digital Marketing', description: 'SEO, Social Media, Content Marketing', url: '/training', type: 'skill' },
    { title: 'Freelancing', description: 'Start your freelancing career', url: '/training', type: 'skill' },
    { title: 'Data Entry', description: 'Data processing and management', url: '/training', type: 'skill' },
    { title: 'Content Writing', description: 'Blog writing, copywriting', url: '/training', type: 'skill' },
    { title: 'Video Editing', description: 'Video production and editing', url: '/training', type: 'skill' },
    
    // Quick actions
    { title: 'Join Ajira Digital', description: 'Create your account', url: '/auth', type: 'action' },
    { title: 'Sign In', description: 'Access your account', url: '/auth', type: 'action' },
    { title: 'Become Seller', description: 'Start offering services', url: '/become-seller', type: 'action' },
    { title: 'Upload Media', description: 'Share your content', url: '/media-upload', type: 'action' },
  ];

  // Search functionality - simplified
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setShowSearchResults(false);
      return;
    }
    setShowSearchResults(true);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return '📄';
      case 'skill': return '💻';
      case 'action': return '🚀';
      default: return '🔍';
    }
  };

  // Dropdown groupings with all pages
  const dropdowns = [
    {
      label: 'About',
      items: [
        { label: 'About Us', to: '/about' },
        { label: 'Team', to: '/team' },
        { label: 'Updates', to: '/updates' },
        { label: 'FAQ', to: '/faq' },
      ],
    },
    {
      label: 'Community',
      items: [
        { label: 'Community Hub', to: '/community' },
        { label: 'Mazungumzo Hub', to: '/mazungumzo' },
        { label: 'Testimonials', to: '/testimonials' },
        { label: 'Ambassador Program', to: '/ambassador' },
      ],
    },
    {
      label: 'Showcase',
      items: [
        { label: 'Member Showcase', to: '/showcase' },
        { label: 'Success Stories', to: '/testimonials' },
        { label: 'Portfolio Gallery', to: '/showcase' },
        { label: 'Featured Projects', to: '/showcase' },
      ],
    },
    {
      label: 'Events',
      items: [
        { label: 'Upcoming Events', to: '/events' },
        { label: 'Workshops', to: '/training' },
        { label: 'Webinars', to: '/events' },
        { label: 'Community Meetups', to: '/events' },
      ],
    },
    {
      label: 'Learning',
      items: [
        { label: 'Training', to: '/training' },
        { label: 'Mentorship', to: '/mentorship' },
        { label: 'Blog', to: '/blog' },
      ],
    },
    {
      label: 'Services',
      items: [
        { label: 'Marketplace', to: '/marketplace' },
        { label: 'Become Seller', to: '/become-seller' },
        { label: 'Media Upload', to: '/media-upload' },
      ],
    },
    {
      label: 'Account',
      items: [
        { label: 'Sign In / Sign Up', to: '/auth' },
        { label: 'Profile', to: '/profile' },
        { label: 'Orders', to: '/orders' },
        { label: 'Notifications', to: '/notifications' },
      ],
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="text-2xl font-bold text-ajira-primary flex items-center gap-2">
          <span className="bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
            Ajira Digital
          </span>
          <span className="text-sm text-gray-600 font-normal">KiNaP</span>
        </Link>
        
        {/* Search Bar - Always Visible */}
        <div className="flex items-center flex-1 max-w-lg mx-4 relative" ref={searchRef}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search pages, skills, or actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Search Results Dropdown - Simplified */}
          {showSearchResults && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <div className="font-medium">Search functionality temporarily disabled</div>
                <div className="text-sm">Navigation dropdowns are now available</div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive 
                ? 'text-ajira-accent font-semibold border-b-2 border-ajira-accent pb-1' 
                : 'text-gray-700 hover:text-ajira-accent transition-colors'
            }
          >
            Home
          </NavLink>
          
          <NavLink 
            to="/videos" 
            className={({ isActive }) => 
              isActive 
                ? 'text-ajira-accent font-semibold border-b-2 border-ajira-accent pb-1' 
                : 'text-gray-700 hover:text-ajira-accent transition-colors'
            }
          >
            Videos
          </NavLink>
          
          {dropdowns.map((dd) => (
            <div key={dd.label} className="relative group">
              <button
                className="text-gray-700 hover:text-ajira-accent font-semibold px-2 py-1 focus:outline-none transition-colors flex items-center gap-1"
                onMouseEnter={() => setDropdown(dd.label)}
                onMouseLeave={() => setDropdown(null)}
                onClick={() => setDropdown(dropdown === dd.label ? null : dd.label)}
              >
                {dd.label}
                <svg 
                  className={`w-4 h-4 transition-transform ${dropdown === dd.label ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown menu */}
              <div
                className={`absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 transition-all duration-200 ${
                  dropdown === dd.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
                onMouseEnter={() => setDropdown(dd.label)}
                onMouseLeave={() => setDropdown(null)}
              >
                {dd.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                                      'block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-gray-50 hover:text-ajira-accent transition-all ' +
                (isActive ? 'font-semibold text-ajira-accent bg-gradient-to-r from-red-50 to-gray-50' : '')
                    }
                    onClick={() => setDropdown(null)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
          
          {/* User Profile Section or Sign In Button */}
          {user ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
{user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform ${userDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* User Dropdown Menu */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setUserDropdown(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  
                  <Link
                    to="/notifications"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setUserDropdown(false)}
                  >
                    <Bell className="w-4 h-4" />
                    Notifications
                  </Link>
                  
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setUserDropdown(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Orders
                  </Link>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-gradient-to-r from-red-600 to-black text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
            >
              Join / Sign In
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="px-4 py-2">
            {/* Removed duplicate mobile search bar for clarity */}
            
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? 'block py-3 text-ajira-accent font-semibold border-l-4 border-ajira-accent pl-4' 
                  : 'block py-3 text-gray-700 hover:text-ajira-accent pl-4'
              } 
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>
            
            <NavLink 
              to="/videos" 
              className={({ isActive }) => 
                isActive 
                  ? 'block py-3 text-ajira-accent font-semibold border-l-4 border-ajira-accent pl-4' 
                  : 'block py-3 text-gray-700 hover:text-ajira-accent pl-4'
              } 
              onClick={() => setMenuOpen(false)}
            >
              Videos
            </NavLink>
            
            {dropdowns.map((dd) => (
              <div key={dd.label} className="mb-4">
                <div className="font-semibold text-gray-800 mb-2 px-4 py-2 bg-gray-50 rounded">
                  {dd.label}
                </div>
                {dd.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                                        'block px-6 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-gray-50 hover:text-ajira-accent transition-all ' +
                  (isActive ? 'font-semibold text-ajira-accent bg-gradient-to-r from-red-50 to-gray-50 border-l-4 border-ajira-accent' : '')
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
            
            {/* Mobile User Section */}
            {user ? (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-black rounded-full flex items-center justify-center text-white font-semibold">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  
                  <Link
                    to="/notifications"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Bell className="w-4 h-4" />
                    Notifications
                  </Link>
                  
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Orders
                  </Link>
                  
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="block mx-4 mb-4 bg-gradient-to-r from-red-600 to-black text-white px-4 py-3 rounded-lg text-center font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Join / Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 