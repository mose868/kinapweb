import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
// @ts-ignore
import Navbar from './Navbar.jsx'
// @ts-ignore
import Footer from './Footer.jsx'
import Chatbot from '../chatbot/Chatbot'
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NotificationBell } from '../notifications';
import { User } from 'lucide-react';
import React from 'react';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Ajira Digital KiNaP Club - Digital Skills & Opportunities</title>
        <meta name="description" content="Join Ajira Digital at Kiambu National Polytechnic. Learn digital skills, find online work opportunities, and build your digital career." />
        <meta name="keywords" content="Ajira Digital, KiNaP, digital skills, online work, freelancing, digital economy, Kiambu National Polytechnic" />
        <meta property="og:title" content="Ajira Digital KiNaP Club" />
        <meta property="og:description" content="Empowering youth through digital skills and online work opportunities at Kiambu National Polytechnic." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Ajira Digital KiNaP Club"
                className="h-8 w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/marketplace"
                className="text-gray-600 hover:text-ajira-primary"
              >
                Marketplace
              </Link>
              <Link
                to="/orders"
                className="text-gray-600 hover:text-ajira-primary"
              >
                Orders
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <NotificationBell />
                  <div className="relative group">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="w-8 h-8 p-1 rounded-full bg-gray-100" />
                      )}
                      <span className="hidden md:inline">
                        {user.displayName || 'User'}
                      </span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={signOut}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary-dark"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        {children ? children : <Outlet />}
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default Layout 