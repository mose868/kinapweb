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
import HistoryPage from './pages/content/HistoryPage';
import ShortsPage from './pages/content/ShortsPage';
import PlaylistsPage from './pages/content/PlaylistsPage';
import SubscriptionsPage from './pages/content/SubscriptionsPage';
import WatchLaterPage from './pages/content/WatchLaterPage';
import LikedVideosPage from './pages/content/LikedVideosPage';
import YourVideosPage from './pages/content/YourVideosPage';

// Import admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AboutUsAdmin from './pages/admin/AboutUsAdmin';
import TeamAdmin from './pages/admin/TeamAdmin';
import UpdatesAdmin from './pages/admin/UpdatesAdmin';
import FAQAdmin from './pages/admin/FAQAdmin';
import ContactAdmin from './pages/admin/ContactAdmin';
import TrainingAdmin from './pages/admin/TrainingAdmin';
import MentorshipAdmin from './pages/admin/MentorshipAdmin';
import EventsAdmin from './pages/admin/EventsAdmin';
import MentorApplicationsAdmin from './pages/admin/MentorApplicationsAdmin';

// Import mentorship-specific pages
import ApplyAsMentor from './pages/mentorship/ApplyAsMentor';
import MentorDashboard from './pages/mentorship/MentorDashboard';

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
    path: '/mentorship/apply',
    element: (
      <Layout>
        <ApplyAsMentor />
      </Layout>
    )
  },
  {
    path: '/mentor/dashboard',
    element: (
      <Layout>
        <MentorDashboard />
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
    path: '/history',
    element: (
      <Layout>
        <HistoryPage />
      </Layout>
    )
  },
  {
    path: '/shorts',
    element: (
      <Layout>
        <ShortsPage />
      </Layout>
    )
  },
  {
    path: '/playlists',
    element: (
      <Layout>
        <PlaylistsPage />
      </Layout>
    )
  },
  {
    path: '/subscriptions',
    element: (
      <Layout>
        <SubscriptionsPage />
      </Layout>
    )
  },
  {
    path: '/watch-later',
    element: (
      <Layout>
        <WatchLaterPage />
      </Layout>
    )
  },
  {
    path: '/liked-videos',
    element: (
      <Layout>
        <LikedVideosPage />
      </Layout>
    )
  },
  {
    path: '/your-videos',
    element: (
      <Layout>
        <YourVideosPage />
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
  },
  {
    path: '/admin/about-us',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AboutUsAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/team',
    element: (
      <ProtectedRoute requiredRole="admin">
        <TeamAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/updates',
    element: (
      <ProtectedRoute requiredRole="admin">
        <UpdatesAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/faq',
    element: (
      <ProtectedRoute requiredRole="admin">
        <FAQAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/contact',
    element: (
      <ProtectedRoute requiredRole="admin">
        <ContactAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/training',
    element: (
      <ProtectedRoute requiredRole="admin">
        <TrainingAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/mentorship',
    element: (
      <ProtectedRoute requiredRole="admin">
        <MentorshipAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/events',
    element: (
      <ProtectedRoute requiredRole="admin">
        <EventsAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: '/admin/mentor-applications',
    element: (
      <ProtectedRoute requiredRole="admin">
        <MentorApplicationsAdmin />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    )
  }
]; 