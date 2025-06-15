import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import MediaUpload from './pages/MediaUpload'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import AuthPage from './pages/AuthPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
import Videos from './pages/Videos'
import Marketplace from './pages/Marketplace'
import BecomeSeller from './pages/BecomeSeller'
import FaqPage from './pages/FaqPage'
import CommunityPage from './pages/CommunityPage'
import UpdatesPage from './pages/UpdatesPage'
import TeamPage from './pages/TeamPage'
import ShowcasePage from './pages/ShowcasePage'
import TrainingPage from './pages/TrainingPage'
import MentorshipPage from './pages/MentorshipPage'
import AmbassadorPage from './pages/AmbassadorPage'
import EventsPage from './pages/EventsPage'
import ProfilePage from './pages/ProfilePage'
import TestimonialsPage from './pages/TestimonialsPage'
import GigDetailPage from './pages/marketplace/GigDetailPage'
import CreateGigPage from './pages/marketplace/CreateGigPage'
import SearchResults from './pages/marketplace/SearchResults'
import OrdersList from './pages/orders/OrdersList'
import OrderPage from './pages/orders/OrderPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import AdminLayout from './pages/admin/AdminLayout'

// Components
import Chatbot from './components/chatbot/Chatbot'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import VideoPage from './components/video/VideoPage'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Ajira Digital Club - Kiambu National Polytechnic Portfolio</title>
          <meta name="description" content="Portfolio showcasing digital skills and achievements of Ajira Digital Club at Kiambu National Polytechnic" />
          <meta property="og:title" content="Ajira Digital Club - Kiambu Portfolio" />
          <meta property="og:description" content="Discover our journey in digital skills development and online opportunities" />
          <meta property="og:type" content="website" />
        </Helmet>

        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/*" element={<Home />} />
            <Route path="/about/*" element={<About />} />
            <Route path="/team/*" element={<TeamPage />} />
            <Route path="/media-upload/*" element={<MediaUpload />} />
            <Route path="/blog/*" element={<Blog />} />
            <Route path="/videos/*" element={<Videos />} />
            <Route path="/video/:id/*" element={<VideoPage />} />
            <Route path="/contact/*" element={<Contact />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/privacy/*" element={<PrivacyPolicy />} />
            <Route path="/terms/*" element={<Terms />} />
            <Route path="/faq/*" element={<FaqPage />} />
            <Route path="/community/*" element={<CommunityPage />} />
            <Route path="/updates/*" element={<UpdatesPage />} />
            <Route path="/showcase/*" element={<ShowcasePage />} />
            <Route path="/training/*" element={<TrainingPage />} />
            <Route path="/mentorship/*" element={<MentorshipPage />} />
            <Route path="/ambassador/*" element={<AmbassadorPage />} />
            <Route path="/events/*" element={<EventsPage />} />
            <Route path="/profile/*" element={<ProfilePage />} />
            <Route path="/testimonials/*" element={<TestimonialsPage />} />
            
            {/* Marketplace Routes */}
            <Route path="/marketplace/*" element={<Marketplace />} />
            <Route path="/marketplace/gigs/:gigId" element={<GigDetailPage />} />
            <Route path="/marketplace/create" element={
              <ProtectedRoute>
                <CreateGigPage />
              </ProtectedRoute>
            } />
            <Route path="/marketplace/search" element={<SearchResults />} />
            <Route path="/marketplace/become-seller/*" element={
              <ProtectedRoute>
                <BecomeSeller />
              </ProtectedRoute>
            } />
            
            {/* Orders & Notifications */}
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersList />
              </ProtectedRoute>
            } />
            <Route path="/orders/:orderId" element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        <Footer />
        <Chatbot />
      </div>
    </AuthProvider>
  )
}

export default App 