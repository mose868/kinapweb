import { Outlet } from 'react-router-dom'
import { Search, Filter, SortAsc } from 'lucide-react'
import React from 'react';

interface MarketplaceLayoutProps {
  children?: React.ReactNode;
}

const MarketplaceLayout: React.FC<MarketplaceLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-ajira-primary text-ajira-light py-16">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Ajira Digital Marketplace</h1>
          <p className="text-lg text-ajira-light/80 mb-8">
            Connect with talented freelancers and find opportunities in the digital economy
          </p>
          
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for services..."
                className="w-full px-4 py-3 pl-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-ajira-accent/50"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
            </div>
            <button className="px-6 py-3 bg-ajira-accent hover:bg-ajira-accent/90 text-white rounded-lg flex items-center space-x-2">
              <Filter size={20} />
              <span>Filters</span>
            </button>
            <button className="px-6 py-3 bg-ajira-accent hover:bg-ajira-accent/90 text-white rounded-lg flex items-center space-x-2">
              <SortAsc size={20} />
              <span>Sort</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-6 overflow-x-auto scrollbar-hide">
            <button className="text-ajira-primary hover:text-ajira-accent whitespace-nowrap px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">
              All Categories
            </button>
            <button className="text-ajira-primary hover:text-ajira-accent whitespace-nowrap px-4 py-2 rounded-full hover:bg-gray-100">
              Digital Marketing
            </button>
            <button className="text-ajira-primary hover:text-ajira-accent whitespace-nowrap px-4 py-2 rounded-full hover:bg-gray-100">
              Web Development
            </button>
            <button className="text-ajira-primary hover:text-ajira-accent whitespace-nowrap px-4 py-2 rounded-full hover:bg-gray-100">
              Content Writing
            </button>
            <button className="text-ajira-primary hover:text-ajira-accent whitespace-nowrap px-4 py-2 rounded-full hover:bg-gray-100">
              Graphic Design
            </button>
            <button className="text-ajira-primary hover:text-ajira-accent whitespace-nowrap px-4 py-2 rounded-full hover:bg-gray-100">
              Virtual Assistant
            </button>
            <button className="text-ajira-primary hover:text-ajira-accent whitespace-nowrap px-4 py-2 rounded-full hover:bg-gray-100">
              Data Entry
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container-custom py-8">
        {children ? children : <Outlet />}
      </main>

      {/* Action Button */}
      <div className="fixed bottom-8 right-8">
        <button className="bg-ajira-accent hover:bg-ajira-accent/90 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
          <span>Post a Gig</span>
        </button>
      </div>
    </div>
  )
}

export default MarketplaceLayout 