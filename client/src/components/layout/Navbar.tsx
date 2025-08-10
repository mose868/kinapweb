import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  User,
  LogOut,
  Settings,
  Bell,
  Menu,
  ChevronDown,
  Info,
  Users,
  BookOpen,
  Briefcase,
  Globe,
  Star,
  Award,
  MessageCircle,
  UserCheck,
  HelpCircle,
  ChevronRight,
  Camera,
  Moon,
  Sun,
} from 'lucide-react';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New message from Sarah',
      message: 'Hey! I loved your portfolio work. Can we discuss a project?',
      time: '2 min ago',
      type: 'message',
      unread: true,
    },
    {
      id: 2,
      title: 'Order completed',
      message: 'Your graphic design project has been delivered successfully.',
      time: '1 hour ago',
      type: 'order',
      unread: true,
    },
    {
      id: 3,
      title: 'New review received',
      message: 'Michael gave you a 5-star review for web development.',
      time: '3 hours ago',
      type: 'review',
      unread: false,
    },
    {
      id: 4,
      title: 'Payment received',
      message: 'KSh 15,000 has been credited to your account.',
      time: '1 day ago',
      type: 'payment',
      unread: true,
    },
    {
      id: 5,
      title: 'Profile verification',
      message: 'Your KiNaP student verification is complete!',
      time: '2 days ago',
      type: 'system',
      unread: false,
    },
  ]);
  const searchRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const navigate = useNavigate();
  const { user, signOut } = useBetterAuthContext();
  const { theme, setTheme, isDark } = useTheme();

  // Calculate unread notifications count
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Mark notification as read
  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, unread: false } : n))
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'order':
        return '📦';
      case 'review':
        return '⭐';
      case 'payment':
        return '💰';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (user: any) => {
    if (!user) return 'U';
    const name = user.displayName || user.email || 'User';
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user avatar
  const getUserAvatar = (user: any) => {
    if (user?.photoURL) return user.photoURL;
    return null;
  };

  // Searchable content organized by categories
  const searchableContent = [
    // Main Pages
    {
      title: 'Home',
      description: 'Welcome to KiNaP Ajira Club',
      url: '/',
      category: 'Pages',
    },
    {
      title: 'Community Hub',
      description: 'Connect with other members and join discussions',
      url: '/community',
      category: 'Community',
    },
    {
      title: 'Videos',
      description: 'Educational video content and tutorials',
      url: '/videos',
      category: 'Learning',
    },
    {
      title: 'Marketplace',
      description: 'Digital services marketplace',
      url: '/marketplace',
      category: 'Services',
    },
    {
      title: 'Profile',
      description: 'Manage your personal profile',
      url: '/profile',
      category: 'Account',
    },

    // About Pages
    {
      title: 'About Us',
      description: 'Learn about KiNaP Ajira Club',
      url: '/about',
      category: 'About',
    },
    {
      title: 'Team',
      description: 'Meet our team members',
      url: '/team',
      category: 'About',
    },
    {
      title: 'Updates',
      description: 'Latest news and updates',
      url: '/updates',
      category: 'About',
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions',
      url: '/faq',
      category: 'About',
    },

    // Community Pages
    {
      title: 'Testimonials',
      description: 'Success stories from members',
      url: '/testimonials',
      category: 'Community',
    },
    {
      title: 'Ambassador Program',
      description: 'Join our ambassador program',
      url: '/ambassador',
      category: 'Community',
    },
    {
      title: 'Showcase',
      description: 'Member projects and achievements',
      url: '/showcase',
      category: 'Community',
    },

    // Learning & Content
    {
      title: 'Training',
      description: 'Digital skills training programs',
      url: '/training',
      category: 'Learning',
    },
    {
      title: 'Mentorship',
      description: 'Find mentors and mentees',
      url: '/mentorship',
      category: 'Learning',
    },
    {
      title: 'Blog',
      description: 'Latest articles and insights',
      url: '/blog',
      category: 'Learning',
    },
    {
      title: 'Events',
      description: 'Upcoming workshops and events',
      url: '/events',
      category: 'Learning',
    },

    // Services
    {
      title: 'Become Seller',
      description: 'Start offering digital services',
      url: '/become-seller',
      category: 'Services',
    },

    // Account
    {
      title: 'Orders',
      description: 'View your orders and transactions',
      url: '/orders',
      category: 'Account',
    },
    {
      title: 'Notifications',
      description: 'Manage your notifications',
      url: '/notifications',
      category: 'Account',
    },
    {
      title: 'Sign In',
      description: 'Access your account',
      url: '/auth',
      category: 'Account',
    },

    // Contact
    {
      title: 'Contact',
      description: 'Get in touch with us',
      url: '/contact',
      category: 'Support',
    },
  ];

  // Professional dropdown menu structure
  const dropdownMenus = [
    {
      id: 'about',
      label: 'About',
      icon: Info,
      items: [
        {
          label: 'About KiNaP',
          to: '/about',
          icon: Info,
          description: 'Learn about our mission',
        },
        {
          label: 'Our Team',
          to: '/team',
          icon: Users,
          description: 'Meet our dedicated team',
        },
        {
          label: 'Latest Updates',
          to: '/updates',
          icon: Star,
          description: 'News and announcements',
        },
        {
          label: 'FAQ',
          to: '/faq',
          icon: HelpCircle,
          description: 'Common questions',
        },
        {
          label: 'Contact Us',
          to: '/contact',
          icon: MessageCircle,
          description: 'Get in touch',
        },
      ],
    },
    {
      id: 'programs',
      label: 'Programs',
      icon: BookOpen,
      items: [
        {
          label: 'Digital Training',
          to: '/training',
          icon: BookOpen,
          description: 'Skill development courses',
        },
        {
          label: 'Mentorship',
          to: '/mentorship',
          icon: UserCheck,
          description: 'Connect with mentors',
        },
        {
          label: 'Events & Workshops',
          to: '/events',
          icon: Award,
          description: 'Live learning sessions',
        },
        {
          label: 'Videos & Resources',
          to: '/videos',
          icon: Globe,
          description: 'Educational content',
        },
      ],
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      items: [
        {
          label: 'Community Hub',
          to: '/community',
          icon: Users,
          description: 'Join discussions',
        },
        {
          label: 'Success Stories',
          to: '/testimonials',
          icon: Star,
          description: 'Member achievements',
        },
        {
          label: 'Project Showcase',
          to: '/showcase',
          icon: Award,
          description: 'Featured work',
        },
        {
          label: 'Ambassador Program',
          to: '/ambassador',
          icon: UserCheck,
          description: 'Become a leader',
        },
      ],
    },
    {
      id: 'services',
      label: 'Services',
      icon: Briefcase,
      items: [
        {
          label: 'Marketplace',
          to: '/marketplace',
          icon: Briefcase,
          description: 'Digital services hub',
        },
        {
          label: 'Become a Seller',
          to: '/become-seller',
          icon: UserCheck,
          description: 'Offer your skills',
        },
      ],
    },
  ];

  // Filter and group search results
  const filteredSearchResults = searchableContent.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedSearchResults = filteredSearchResults.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof searchableContent>
  );

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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchResults(false);
        setUserDropdownOpen(false);
        setNotificationDropdownOpen(false);
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
      setNotificationDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const handleDropdownToggle = (dropdownId: string, index?: number) => {
    if (activeDropdown === dropdownId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownId);
      // Focus first menu item after opening
      setTimeout(() => {
        const safeIndex = index ?? 0;
        if (dropdownRefs.current[safeIndex]) {
          const firstLink =
            dropdownRefs.current[safeIndex].querySelector('a, button');
          if (firstLink) (firstLink as HTMLElement).focus();
        }
      }, 50);
    }
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setUserDropdownOpen(false);
    setNotificationDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className='bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm w-full'>
      <div className='max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8'>
        <div className='flex flex-wrap items-center justify-between min-h-16 w-full gap-y-2'>
          {/* Logo with Professional KiNaP Branding */}
          <div className='flex-shrink-0 flex items-center w-full sm:w-auto mb-2 sm:mb-0 min-w-0'>
            <Link to='/' className='flex items-center group' aria-label='Home'>
              <img
                src='/logo.jpeg'
                alt='KiNaP Ajira Club Logo'
                className='h-10 w-auto drop-shadow-md rounded-md min-w-10'
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className='ml-3 flex flex-col min-w-0'>
                <span
                  className='text-lg font-bold leading-tight truncate transition-colors duration-700'
                  style={{
                    animation: 'kinapColorCycle 3s infinite',
                    WebkitAnimation: 'kinapColorCycle 3s infinite',
                  }}
                >
                  KiNaP Ajira Club
                </span>
                <span className='text-xs text-kenya-green leading-tight font-medium truncate'>
                  Digital Skills Hub
                </span>
              </div>
            </Link>
          </div>
          {/* Navigation Links with Professional Styling */}
          <div className='hidden lg:flex items-center space-x-1 w-full lg:w-auto min-w-0'>
            {dropdownMenus.map((menu, index) => (
              <div key={menu.id} className='relative flex-shrink-0'>
                <button
                  onMouseEnter={() => {
                    if (window.innerWidth >= 1024)
                      handleDropdownToggle(menu.id, index);
                  }}
                  onMouseLeave={() => {
                    /* Only close on leave if not focused/clicked */
                  }}
                  onClick={() => handleDropdownToggle(menu.id, index)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 min-w-0 truncate ${
                    activeDropdown === menu.id
                      ? 'text-kenya-red bg-kenya-green/10 shadow-sm'
                      : 'text-gray-700 hover:text-kenya-red hover:bg-gray-50'
                  }`}
                  aria-label={menu.label}
                  aria-haspopup='true'
                  aria-expanded={activeDropdown === menu.id}
                  aria-controls={`dropdown-menu-${menu.id}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' && activeDropdown === menu.id) {
                      const firstLink =
                        dropdownRefs.current[index]?.querySelector('a, button');
                      if (firstLink) (firstLink as HTMLElement).focus();
                    }
                  }}
                >
                  <menu.icon className='w-4 h-4 mr-2 flex-shrink-0' />
                  <span className='truncate'>{menu.label}</span>
                  <ChevronDown
                    className={`w-3 h-3 ml-1 transition-transform flex-shrink-0 ${activeDropdown === menu.id ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeDropdown === menu.id && (
                  <div
                    onMouseEnter={() => {
                      if (window.innerWidth >= 1024) setActiveDropdown(menu.id);
                    }}
                    // Remove onMouseLeave to allow click selection
                    id={`dropdown-menu-${menu.id}`}
                    ref={(el) => (dropdownRefs.current[index] = el)}
                    className='absolute left-0 mt-2 w-[370px] bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-[9999] animate-in slide-in-from-top-2 duration-200 focus:outline-none'
                    role='menu'
                    aria-label={menu.label}
                    tabIndex={-1}
                    onKeyDown={(e) => {
                      const links = Array.from(
                        dropdownRefs.current[index]?.querySelectorAll(
                          'a, button'
                        ) || []
                      );
                      const current = document.activeElement;
                      const idx = links.indexOf(current as HTMLElement);
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const next = links[(idx + 1) % links.length];
                        if (next) (next as HTMLElement).focus();
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        const prev =
                          links[(idx - 1 + links.length) % links.length];
                        if (prev) (prev as HTMLElement).focus();
                      } else if (e.key === 'Escape') {
                        setActiveDropdown(null);
                        (
                          dropdownRefs.current[index]
                            ?.previousElementSibling as HTMLElement
                        )?.focus();
                      }
                    }}
                  >
                    {menu.items.map((item, itemIdx) => (
                      <Link
                        key={itemIdx}
                        to={item.to}
                        className='flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors rounded-xl mb-2 last:mb-0'
                        onClick={closeAllDropdowns}
                        tabIndex={0}
                        role='menuitem'
                        aria-label={item.label}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            closeAllDropdowns();
                          }
                        }}
                      >
                        <item.icon className='w-7 h-7 text-ajira-accent flex-shrink-0' />
                        <div className='flex flex-col'>
                          <span className='text-base font-semibold text-gray-900 mb-1'>
                            {item.label}
                          </span>
                          <span className='text-sm text-gray-500'>
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Professional Search Bar */}
          <div className='hidden md:flex items-center mx-6 flex-1 max-w-md w-full min-w-0'>
            <div ref={searchRef} className='relative w-full min-w-0'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search programs, services...'
                  className='w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-kenya-red/20 focus:border-kenya-red transition-all duration-200'
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-kenya-red transition-colors'
                  >
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>

              {/* Enhanced Search Results */}
              {showSearchResults && filteredSearchResults.length > 0 && (
                <div className='absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto'>
                  {Object.entries(groupedSearchResults).map(
                    ([category, items]) => (
                      <div key={category} className='mb-2 last:mb-0'>
                        <div className='px-4 py-2 text-xs font-semibold text-kenya-red uppercase tracking-wide border-b border-gray-100'>
                          {category}
                        </div>
                        {items.map((item, index) => (
                          <Link
                            key={index}
                            to={item.url}
                            onClick={handleSearchSelect}
                            className='flex items-center px-4 py-3 hover:bg-gray-50 transition-colors group'
                          >
                            <div className='flex-1'>
                              <div className='text-sm font-medium text-gray-900 group-hover:text-kenya-red'>
                                {item.title}
                              </div>
                              <div className='text-xs text-gray-500 mt-0.5'>
                                {item.description}
                              </div>
                            </div>
                            <ChevronRight className='w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                          </Link>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced User Section with Separate Auth Buttons */}
          <div className='flex items-center space-x-4 w-full lg:w-auto justify-end min-w-0'>
            {user ? (
              <div className='flex items-center space-x-3'>
                {/* Enhanced Notifications with Dropdown */}
                <div ref={notificationRef} className='relative'>
                  <button
                    onClick={() =>
                      setNotificationDropdownOpen(!notificationDropdownOpen)
                    }
                    className='relative p-2 text-gray-600 hover:text-kenya-red hover:bg-gray-50 rounded-lg transition-colors group'
                    aria-label='Notifications'
                  >
                    <Bell className='h-5 w-5 group-hover:animate-pulse' />
                    {unreadCount > 0 && (
                      <div className='absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-kenya-red to-kenya-green rounded-full flex items-center justify-center shadow-lg animate-pulse'>
                        <span className='text-white text-xs font-bold'>
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notificationDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[9999] max-h-96'>
                      {/* Header */}
                      <div className='px-4 py-3 bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-b border-gray-100'>
                        <div className='flex items-center justify-between'>
                          <h3 className='text-sm font-semibold text-gray-900 flex items-center gap-2'>
                            <Bell className='h-4 w-4' />
                            Notifications
                          </h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className='text-xs text-kenya-red hover:text-kenya-green transition-colors font-medium'
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <p className='text-xs text-gray-600 mt-1'>
                            {unreadCount} new notification
                            {unreadCount > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className='max-h-64 overflow-y-auto'>
                        {notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className={`p-3 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                              notification.unread
                                ? 'bg-blue-50/50 border-l-kenya-red'
                                : 'border-l-transparent'
                            }`}
                          >
                            <div className='flex items-start gap-3'>
                              <span className='text-lg flex-shrink-0 mt-0.5'>
                                {getNotificationIcon(notification.type)}
                              </span>
                              <div className='flex-1 min-w-0'>
                                <p
                                  className={`text-sm truncate ${
                                    notification.unread
                                      ? 'font-semibold text-gray-900'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                <p className='text-xs text-gray-600 line-clamp-2 mt-1'>
                                  {notification.message}
                                </p>
                                <p className='text-xs text-gray-500 mt-1 flex items-center gap-1'>
                                  <span className='w-1 h-1 bg-gray-400 rounded-full'></span>
                                  {notification.time}
                                </p>
                              </div>
                              {notification.unread && (
                                <div className='w-2 h-2 bg-kenya-red rounded-full flex-shrink-0 mt-2'></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className='px-4 py-3 bg-gray-50 text-center border-t border-gray-100'>
                        <Link
                          to='/notifications'
                          onClick={() => setNotificationDropdownOpen(false)}
                          className='text-sm font-medium text-kenya-red hover:text-kenya-green transition-colors'
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced User Profile Dropdown */}
                <div ref={userDropdownRef} className='relative'>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className='flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors group'
                    aria-label='User profile'
                  >
                    {/* Profile Picture */}
                    <div className='relative'>
                      {getUserAvatar(user) ? (
                        <img
                          src={getUserAvatar(user)}
                          alt={user.displayName || user.email}
                          className='w-9 h-9 rounded-full object-cover border-2 border-gray-200 group-hover:border-kenya-red transition-colors shadow-sm'
                        />
                      ) : (
                        <div className='w-9 h-9 bg-gradient-to-br from-kenya-red via-kenya-green to-kenya-red rounded-full flex items-center justify-center shadow-sm border-2 border-gray-200 group-hover:border-kenya-green transition-colors'>
                          <span className='text-white text-sm font-bold'>
                            {getUserInitials(user)}
                          </span>
                        </div>
                      )}
                      {/* Online Status Indicator */}
                      <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse'></div>
                    </div>

                    <div className='hidden sm:block text-left'>
                      <div className='text-sm font-medium text-gray-900 truncate max-w-32'>
                        {user.displayName ||
                          user.email?.split('@')[0] ||
                          'User'}
                      </div>
                      <UserVerificationBadge user={user} />
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[9999] overflow-hidden'>
                      {/* User Info Header */}
                      <div className='px-4 py-3 bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 border-b border-gray-100'>
                        <div className='flex items-center gap-3'>
                          {getUserAvatar(user) ? (
                            <img
                              src={getUserAvatar(user)}
                              alt={user.displayName || user.email}
                              className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg'
                            />
                          ) : (
                            <div className='w-12 h-12 bg-gradient-to-br from-kenya-red via-kenya-green to-kenya-red rounded-full flex items-center justify-center shadow-lg border-2 border-white'>
                              <span className='text-white text-lg font-bold'>
                                {getUserInitials(user)}
                              </span>
                            </div>
                          )}
                          <div className='flex-1 min-w-0'>
                            <div className='text-sm font-semibold text-gray-900 truncate'>
                              {user.displayName ||
                                user.email?.split('@')[0] ||
                                'User'}
                            </div>
                            <div className='text-xs text-gray-600 truncate'>
                              {user.email}
                            </div>
                            <div className='mt-1'>
                              <UserVerificationBadge user={user} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className='py-2'>
                        <Link
                          to='/profile'
                          className='flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group'
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className='h-4 w-4 mr-3 text-kenya-green group-hover:text-kenya-red transition-colors' />
                          My Profile
                        </Link>
                        <Link
                          to='/orders'
                          className='flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group'
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Settings className='h-4 w-4 mr-3 text-kenya-green group-hover:text-kenya-red transition-colors' />
                          My Orders
                        </Link>
                        <Link
                          to='/notifications'
                          className='flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group'
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Bell className='h-4 w-4 mr-3 text-kenya-green group-hover:text-kenya-red transition-colors' />
                          Notifications
                          {unreadCount > 0 && (
                            <span className='ml-auto bg-kenya-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </Link>
                        <button
                          onClick={toggleTheme}
                          className='flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group'
                        >
                          {isDark ? (
                            <Sun className='h-4 w-4 mr-3 text-kenya-green group-hover:text-kenya-red transition-colors' />
                          ) : (
                            <Moon className='h-4 w-4 mr-3 text-kenya-green group-hover:text-kenya-red transition-colors' />
                          )}
                          {isDark ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        <div className='border-t border-gray-100 mt-2 pt-2'>
                          <button
                            onClick={handleSignOut}
                            className='flex items-center w-full px-4 py-2.5 text-sm text-kenya-red hover:bg-kenya-red/5 transition-colors group'
                          >
                            <LogOut className='h-4 w-4 mr-3 group-hover:animate-pulse' />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='flex items-center space-x-3'>
                {/* Sign In Button */}
                <Link
                  to='/auth'
                  className='px-4 py-2 text-sm font-medium text-gray-700 hover:text-kenya-red border border-gray-300 rounded-lg hover:border-kenya-red transition-all duration-200'
                  aria-label='Sign in'
                >
                  Sign In
                </Link>

                {/* Register Button - Primary CTA */}
                <Link
                  to='/auth?mode=register'
                  className='bg-gradient-to-r from-kenya-red to-kenya-green hover:from-kenya-green hover:to-kenya-red text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105'
                  aria-label='Join now'
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='lg:hidden ml-4 w-full flex justify-end min-w-0'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='p-2 rounded-lg text-gray-600 hover:text-kenya-red hover:bg-gray-50 transition-colors'
              aria-label='Open mobile menu'
            >
              <Menu className='h-6 w-6' />
            </button>
          </div>
        </div>
      </div>
      {/* Enhanced Mobile Menu with better animations */}
      {mobileMenuOpen && (
        <div className='lg:hidden border-t border-kenya-green/10 bg-white dark:bg-gray-900 shadow-xl animate-in slide-in-from-top duration-300 z-[9999]'>
          <div className='px-4 pt-4 pb-6 space-y-4'>
            {/* Mobile Navigation Links with Dropdowns */}
            <div className='space-y-3'>
              {/* Mobile Dropdown Menus */}
              {dropdownMenus.map((menu, index) => (
                <div key={menu.id} className='space-y-2'>
                  <button
                    onClick={() => handleDropdownToggle(menu.id, index)}
                    className='flex items-center justify-between w-full px-4 py-3 text-lg font-semibold text-kenya-black dark:text-white hover:bg-kenya-green/10 hover:text-kenya-red rounded-lg transition-colors'
                    aria-expanded={activeDropdown === menu.id}
                    aria-controls={`mobile-dropdown-${menu.id}`}
                  >
                    <div className='flex items-center gap-3'>
                      <menu.icon className='w-5 h-5 text-kenya-green' />
                      {menu.label}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === menu.id ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {/* Mobile Dropdown Content */}
                  {activeDropdown === menu.id && (
                    <div
                      id={`mobile-dropdown-${menu.id}`}
                      className='ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200'
                    >
                      {menu.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.to}
                          className='flex items-center gap-3 px-4 py-3 text-base text-kenya-black dark:text-white hover:bg-kenya-green/10 hover:text-kenya-red rounded-lg transition-colors'
                          onClick={closeAllDropdowns}
                        >
                          <item.icon className='w-4 h-4 text-kenya-green' />
                          <div className='flex flex-col'>
                            <span className='font-medium'>{item.label}</span>
                            <span className='text-xs text-gray-500'>{item.description}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Enhanced Mobile User Section */}
            <div className='border-t border-kenya-green/10 pt-4 mt-4'>
              {user ? (
                <div className='space-y-3'>
                  <div className='flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-kenya-green/10 to-kenya-red/10 rounded-lg'>
                    {getUserAvatar(user) ? (
                      <img
                        src={getUserAvatar(user)}
                        alt={user.displayName || user.email}
                        className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg'
                      />
                    ) : (
                      <div className='w-12 h-12 bg-gradient-to-br from-kenya-red via-kenya-green to-kenya-red rounded-full flex items-center justify-center shadow-lg border-2 border-white'>
                        <span className='text-white text-lg font-bold'>
                          {getUserInitials(user)}
                        </span>
                      </div>
                    )}
                    <div className='flex-1'>
                      <div className='font-semibold text-kenya-black'>
                        {user.displayName ||
                          user.email?.split('@')[0] ||
                          'User'}
                      </div>
                      <div className='text-sm text-gray-600 truncate'>
                        {user.email}
                      </div>
                      <div className='mt-1'>
                        <UserVerificationBadge user={user} />
                      </div>
                    </div>
                    {/* Online Status */}
                    <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                  </div>
                  <div className='space-y-1'>
                    <Link
                      to='/profile'
                      className='flex items-center gap-3 px-4 py-3 text-kenya-black hover:bg-kenya-green/10 rounded-lg transition-colors group'
                      onClick={closeAllDropdowns}
                    >
                      <User className='h-4 w-4 text-kenya-green group-hover:text-kenya-red transition-colors' />
                      My Profile
                    </Link>
                    <Link
                      to='/orders'
                      className='flex items-center gap-3 px-4 py-3 text-kenya-black hover:bg-kenya-green/10 rounded-lg transition-colors group'
                      onClick={closeAllDropdowns}
                    >
                      <Settings className='h-4 w-4 text-kenya-green group-hover:text-kenya-red transition-colors' />
                      My Orders
                    </Link>
                    <Link
                      to='/notifications'
                      className='flex items-center gap-3 px-4 py-3 text-kenya-black hover:bg-kenya-green/10 rounded-lg transition-colors group'
                      onClick={closeAllDropdowns}
                    >
                      <Bell className='h-4 w-4 text-kenya-green group-hover:text-kenya-red transition-colors' />
                      Notifications
                      {unreadCount > 0 && (
                        <span className='ml-auto bg-kenya-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={() => {
                        toggleTheme();
                        closeAllDropdowns();
                      }}
                      className='flex items-center gap-3 px-4 py-3 text-kenya-black hover:bg-kenya-green/10 rounded-lg transition-colors group w-full'
                    >
                      {isDark ? (
                        <Sun className='h-4 w-4 text-kenya-green group-hover:text-kenya-red transition-colors' />
                      ) : (
                        <Moon className='h-4 w-4 text-kenya-green group-hover:text-kenya-red transition-colors' />
                      )}
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button
                      onClick={handleSignOut}
                      className='flex items-center gap-3 w-full px-4 py-3 text-kenya-red hover:bg-kenya-red/10 rounded-lg transition-colors group'
                    >
                      <LogOut className='h-4 w-4 group-hover:animate-pulse' />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className='space-y-3'>
                  <Link
                    to='/auth'
                    className='flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:text-kenya-red hover:border-kenya-red transition-all duration-200'
                    onClick={closeAllDropdowns}
                  >
                    <User className='w-5 h-5' />
                    Sign In
                  </Link>
                  <Link
                    to='/auth?mode=register'
                    className='flex items-center justify-center gap-2 w-full bg-gradient-to-r from-kenya-red to-kenya-green hover:from-kenya-green hover:to-kenya-red text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200'
                    onClick={closeAllDropdowns}
                  >
                    <Star className='w-5 h-5' />
                    Join Now
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Search Results */}
            {showSearchResults && filteredSearchResults.length > 0 && (
              <div className='border-t border-kenya-green/10 pt-4 mt-4'>
                <div className='text-sm font-semibold text-kenya-red mb-3'>
                  Search Results
                </div>
                <div className='space-y-2 max-h-64 overflow-y-auto'>
                  {Object.entries(groupedSearchResults).map(
                    ([category, items]) => (
                      <div key={category}>
                        <div className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2'>
                          {category}
                        </div>
                        {items.map((item, index) => (
                          <Link
                            key={index}
                            to={item.url}
                            onClick={handleSearchSelect}
                            className='block px-3 py-2 hover:bg-kenya-green/10 rounded-lg transition-colors'
                          >
                            <div className='font-medium text-kenya-black'>
                              {item.title}
                            </div>
                            <div className='text-xs text-gray-600'>
                              {item.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )
                  )}
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
    <div className='flex items-center gap-1'>
      <div className='w-4 h-4 bg-kenya-accent rounded-full flex items-center justify-center'>
        <div className='w-2 h-2 bg-white rounded-full'></div>
      </div>
      <span className='text-xs text-kenya-text-muted'>Verified Member</span>
    </div>
  );
};

export default Navbar;
