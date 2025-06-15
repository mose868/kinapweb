import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // All searchable pages and content
  const searchableContent = [
    // Pages
    { title: 'Home', description: 'Main landing page', url: '/', type: 'page' },
    { title: 'About Us', description: 'Learn about Ajira Digital KiNaP Club', url: '/about', type: 'page' },
    { title: 'Team', description: 'Meet our team members', url: '/team', type: 'page' },
    { title: 'Events', description: 'Upcoming workshops and events', url: '/events', type: 'page' },
    { title: 'Community Hub', description: 'Connect with other members', url: '/community', type: 'page' },
    { title: 'Showcase', description: 'Member projects and achievements', url: '/showcase', type: 'page' },
    { title: 'Testimonials', description: 'Success stories from members', url: '/testimonials', type: 'page' },
    { title: 'Training', description: 'Digital skills training programs', url: '/training', type: 'page' },
    { title: 'Mentorship', description: 'Find mentors and mentees', url: '/mentorship', type: 'page' },
    { title: 'Videos', description: 'Educational video content', url: '/videos', type: 'page' },
    { title: 'Blog', description: 'Latest articles and insights', url: '/blog', type: 'page' },
    { title: 'Marketplace', description: 'Digital services marketplace', url: '/marketplace', type: 'page' },
    { title: 'Profile', description: 'Your personal profile', url: '/profile', type: 'page' },
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

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const filtered = searchableContent.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8); // Limit to 8 results

    setSearchResults(filtered);
    setShowSearchResults(true);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (item: any) => {
    navigate(item.url);
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
        { label: 'Mazungumzo', to: '/mazungumzo' },
        { label: 'Showcase', to: '/showcase' },
        { label: 'Testimonials', to: '/testimonials' },
        { label: 'Ambassador Program', to: '/ambassador' },
        { label: 'Events', to: '/events' },
      ],
    },
    {
      label: 'Learning',
      items: [
        { label: 'Training', to: '/training' },
        { label: 'Mentorship', to: '/mentorship' },
        { label: 'Videos', to: '/videos' },
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
        { label: 'Profile', to: '/profile' },
        { label: 'Orders', to: '/orders' },
        { label: 'Notifications', to: '/notifications' },
      ],
    },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container-custom flex items-center justify-between py-3 px-4">
        <Link to="/" className="text-2xl font-bold text-ajira-primary flex items-center gap-2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ajira Digital
          </span>
          <span className="text-sm text-gray-600 font-normal">KiNaP</span>
        </Link>
        
        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative" ref={searchRef}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search pages, skills, or actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
              <div className="p-2">
                <div className="text-xs text-gray-500 px-3 py-2 font-semibold uppercase tracking-wide">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchSelect(item)}
                    className="w-full text-left px-3 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getTypeIcon(item.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {item.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {item.type === 'page' ? 'Page' : item.type === 'skill' ? 'Skill' : 'Action'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {showSearchResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <div className="font-medium">No results found</div>
                <div className="text-sm">Try searching for pages, skills, or actions</div>
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
                      'block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-ajira-accent transition-all ' +
                      (isActive ? 'font-semibold text-ajira-accent bg-gradient-to-r from-blue-50 to-purple-50' : '')
                    }
                    onClick={() => setDropdown(null)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
          
          <Link
            to="/contact"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
          >
            Contact
          </Link>
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
            {/* Mobile Search */}
            <div className="mb-4 relative" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
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
              
              {/* Mobile Search Results */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="mt-2 bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  {searchResults.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        handleSearchSelect(item);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-white transition-all border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getTypeIcon(item.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
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
                      'block px-6 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-ajira-accent transition-all ' +
                      (isActive ? 'font-semibold text-ajira-accent bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-ajira-accent' : '')
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
            
            <Link
              to="/contact"
              className="block mx-4 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg text-center font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 