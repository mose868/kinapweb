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

// Import all other pages
import CommunityPage from './pages/CommunityPage';
import MazungumzoHub from './pages/MazungumzoHub';
import Videos from './pages/Videos';
import EventsPage from './pages/EventsPage';
import TestimonialsPage from './pages/TestimonialsPage';
import Blog from './pages/Blog';
import AmbassadorPage from './pages/AmbassadorPage';
import ShowcasePage from './pages/ShowcasePage';
import UpdatesPage from './pages/UpdatesPage';
import TeamPage from './pages/TeamPage';
import TrainingPage from './pages/TrainingPage';
import MentorshipPage from './pages/MentorshipPage';
import FaqPage from './pages/FaqPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BecomeSeller from './pages/BecomeSeller';
import About from './pages/About';
import Terms from './pages/Terms';
import MediaUpload from './pages/MediaUpload';
import Contact from './pages/Contact';

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
    path: '/mazungumzo',
    element: (
      <Layout>
        <MazungumzoHub />
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
  }
]; 