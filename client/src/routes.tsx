import { ReactNode } from 'react';
import Layout from './components/layout/Layout';
import MarketplaceLayout from './components/marketplace/MarketplaceLayout';
import HomePage from './pages/Home';
import MarketplacePage from './pages/marketplace/MarketplacePage';
import GigDetailPage from './pages/marketplace/GigDetailPage';
import CreateGigPage from './pages/marketplace/CreateGigPage';
import SearchResults from './pages/marketplace/SearchResults';
import OrderPage from './pages/orders/OrderPage';
import OrdersList from './pages/orders/OrdersList';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';


// Import organized pages
import CommunityPage from './pages/community/CommunityPage';

import TestimonialsPage from './pages/community/TestimonialsPage';
import AmbassadorPage from './pages/community/AmbassadorPage';
import ShowcasePage from './pages/community/ShowcasePage';
import Videos from './pages/content/Videos';
import EventsPage from './pages/content/EventsPage';
import Blog from './pages/content/Blog';
import TrainingPage from './pages/content/TrainingPage';
import MentorshipPage from './pages/content/MentorshipPage';
import UpdatesPage from './pages/about/UpdatesPage';
import TeamPage from './pages/about/TeamPage';
import FaqPage from './pages/about/FaqPage';
import About from './pages/about/About';
import Contact from './pages/about/Contact';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';
import BecomeSeller from './pages/BecomeSeller';
import MediaUpload from './pages/MediaUpload';

// Import admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

export interface RouteConfig {
  path: string;
  element: ReactNode;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: (
      <Layout>
        <HomePage />
      </Layout>
    )
  },
  {
    path: '/about',
    element: (
      <Layout>
        <About />
      </Layout>
    )
  },
  {
    path: '/community',
    element: (
      <Layout>
        <CommunityPage />
      </Layout>
    )
  },

  {
    path: '/videos',
    element: (
      <Layout>
        <Videos />
      </Layout>
    )
  },
  {
    path: '/events',
    element: (
      <Layout>
        <EventsPage />
      </Layout>
    )
  },
  {
    path: '/testimonials',
    element: (
      <Layout>
        <TestimonialsPage />
      </Layout>
    )
  },
  {
    path: '/blog',
    element: (
      <Layout>
        <Blog />
      </Layout>
    )
  },
  {
    path: '/ambassador',
    element: (
      <Layout>
        <AmbassadorPage />
      </Layout>
    )
  },
  {
    path: '/showcase',
    element: (
      <Layout>
        <ShowcasePage />
      </Layout>
    )
  },
  {
    path: '/updates',
    element: (
      <Layout>
        <UpdatesPage />
      </Layout>
    )
  },
  {
    path: '/team',
    element: (
      <Layout>
        <TeamPage />
      </Layout>
    )
  },
  {
    path: '/training',
    element: (
      <Layout>
        <TrainingPage />
      </Layout>
    )
  },
  {
    path: '/mentorship',
    element: (
      <Layout>
        <MentorshipPage />
      </Layout>
    )
  },
  {
    path: '/faq',
    element: (
      <Layout>
        <FaqPage />
      </Layout>
    )
  },
  {
    path: '/contact',
    element: (
      <Layout>
        <Contact />
      </Layout>
    )
  },
  {
    path: '/media-upload',
    element: (
      <Layout>
        <ProtectedRoute>
          <MediaUpload />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: '/become-seller',
    element: (
      <Layout>
        <BecomeSeller />
      </Layout>
    )
  },
  {
    path: '/privacy',
    element: (
      <Layout>
        <PrivacyPolicy />
      </Layout>
    )
  },
  {
    path: '/terms',
    element: (
      <Layout>
        <Terms />
      </Layout>
    )
  },
  {
    path: '/marketplace',
    element: (
      <Layout>
        <MarketplaceLayout>
          <MarketplacePage />
        </MarketplaceLayout>
      </Layout>
    )
  },
  {
    path: '/marketplace/gigs/:gigId',
    element: (
      <Layout>
        <MarketplaceLayout>
          <GigDetailPage />
        </MarketplaceLayout>
      </Layout>
    )
  },
  {
    path: '/marketplace/create',
    element: (
      <Layout>
        <MarketplaceLayout>
          <ProtectedRoute>
            <CreateGigPage />
          </ProtectedRoute>
        </MarketplaceLayout>
      </Layout>
    )
  },
  {
    path: '/marketplace/search',
    element: (
      <Layout>
        <MarketplaceLayout>
          <SearchResults />
        </MarketplaceLayout>
      </Layout>
    )
  },
  {
    path: '/orders',
    element: (
      <Layout>
        <ProtectedRoute>
          <OrdersList />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: '/orders/:orderId',
    element: (
      <Layout>
        <ProtectedRoute>
          <OrderPage />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: '/notifications',
    element: (
      <Layout>
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: '/auth',
    element: <AuthPage />
  },

  {
    path: '/profile',
    element: (
      <Layout>
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    )
  }
]; 