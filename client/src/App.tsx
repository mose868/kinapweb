import { BrowserRouter as Router, Routes, Route, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import Chatbot from './components/chatbot/Chatbot';
import { routes } from './routes';
import type { RouteConfig } from './routes';

const queryClient = new QueryClient();

const RouteErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {error.status} - {error.statusText}
          </h1>
          <p className="text-gray-600">{error.data?.message}</p>
        </div>
      </div>
    );
  }

  return <div className="text-center p-4">An unexpected error occurred</div>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Helmet>
              <title>Ajira Digital KiNaP Club</title>
              <meta name="description" content="Ajira Digital KiNaP Club - Your trusted marketplace for digital services" />
            </Helmet>
            <ErrorBoundary>
              <Routes>
                {routes.map((route: RouteConfig) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                    errorElement={<RouteErrorBoundary />}
                  />
                ))}
              </Routes>
            </ErrorBoundary>
            <Chatbot />
            <Toaster position="top-right" />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App; 