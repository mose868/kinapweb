import { Outlet } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from './Navbar'
import Footer from './Footer.jsx'
import Chatbot from '../chatbot/Chatbot'
import React from 'react';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

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
      <Navbar />
      <main className="flex-1">
        {children ? children : <Outlet />}
      </main>
      <Footer />
      <Chatbot />
    </div>
  )
}

export default Layout 