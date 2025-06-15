import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

/**
 * @returns {JSX.Element}
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef(null)
  const userMenuRef = useRef(null)

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdowns when route changes
  useEffect(() => {
    setActiveDropdown(null)
    setUserMenuOpen(false)
    setIsOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    {
      name: 'Home',
      type: 'link',
      path: '/'
    },
    {
      name: 'About',
      type: 'dropdown',
      items: [
        { name: 'Our Team', path: '/team' },
        { name: 'FAQ', path: '/faq' }
      ]
    },
    {
      name: 'Programs',
      type: 'dropdown',
      items: [
        { name: 'Training', path: '/training' },
        { name: 'Mentorship', path: '/mentorship' },
        { name: 'Ambassador Program', path: '/ambassador' },
        { name: 'Events', path: '/events' }
      ]
    },
    {
      name: 'Marketplace',
      type: 'link',
      path: '/marketplace'
    },
    {
      name: 'Showcase',
      type: 'link',
      path: '/showcase'
    },
    {
      name: 'Videos',
      type: 'link',
      path: '/videos'
    },
    {
      name: 'Community',
      type: 'dropdown',
      items: [
        { name: 'Updates', path: '/updates' },
        { name: 'Share Story', path: '/media-upload' },
        { name: 'Testimonials', path: '/testimonials' }
      ]
    }
  ]

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index)
  }

  return (
    <nav className="bg-ajira-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="container-custom">
        <div className="flex justify-between h-20">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4">
              <img 
                src="/logo.jpeg" 
                alt="Club Logo" 
                className="h-12 w-auto rounded-lg"
              />
              <div className="hidden sm:block">
                <span className="text-white text-xl font-bold leading-tight">Ajira Digital</span>
                <div className="text-white/80 text-sm">KiNaP Club</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
            {navLinks.map((link, index) => (
              link.type === 'dropdown' ? (
                <div key={index} className="relative group">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition
                      ${activeDropdown === index 
                        ? 'bg-ajira-primary-dark text-white' 
                        : 'hover:bg-ajira-primary-dark hover:text-white'}`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                      ${activeDropdown === index ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === index && (
                    <div className="absolute top-full left-0 w-48 bg-white rounded-lg shadow-lg py-2 mt-1 border border-gray-100">
                      {link.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.path}
                          className={`block px-4 py-2 text-gray-800 hover:bg-ajira-primary hover:text-white transition-colors
                            ${isActive(item.path) ? 'bg-ajira-primary/10 text-ajira-primary' : ''}`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={index}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg transition-colors
                    ${isActive(link.path) 
                      ? 'bg-ajira-primary-dark text-white' 
                      : 'hover:bg-ajira-primary-dark hover:text-white'}`}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            <a
              href="https://ajiradigital.go.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ajira-accent hover:bg-ajira-accent/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-4"
            >
              Official Portal
            </a>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center" ref={userMenuRef}>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-ajira-accent focus:outline-none focus:ring-2 focus:ring-ajira-accent/20 rounded-md p-2"
                >
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="text-sm font-medium">{user.displayName || user.email}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    <div className="px-4 py-2 text-sm text-gray-600 border-b">
                      {user.email}
                    </div>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-ajira-primary hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-ajira-primary hover:text-white transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings size={16} className="mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-ajira-primary hover:text-white transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-ajira-accent hover:bg-ajira-accent/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-ajira-accent focus:outline-none focus:ring-2 focus:ring-ajira-accent/20 p-2 rounded-md"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="py-2">
            {navLinks.map((link, index) => (
              link.type === 'dropdown' ? (
                <div key={index} className="py-2">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="w-full flex items-center justify-between px-3 py-2 text-gray-700 rounded-md hover:bg-ajira-primary hover:text-white transition-colors"
                  >
                    <span>{link.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 
                      ${activeDropdown === index ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === index && (
                    <div className="mt-2 space-y-1 pl-4">
                      {link.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.path}
                          className={`block px-3 py-2 rounded-md text-sm ${
                            isActive(item.path)
                              ? 'bg-ajira-primary text-white'
                              : 'text-gray-700 hover:bg-ajira-primary hover:text-white'
                          }`}
                          onClick={() => {
                            setActiveDropdown(null)
                            setIsOpen(false)
                          }}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={index}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-sm ${
                    isActive(link.path)
                      ? 'bg-ajira-primary text-white'
                      : 'text-gray-700 hover:bg-ajira-primary hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* Mobile User Menu */}
          {user ? (
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-ajira-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-ajira-primary" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user.displayName || user.email}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-ajira-primary hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-ajira-primary hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <Link
                to="/auth"
                className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-ajira-accent text-white hover:bg-ajira-accent/90"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar 