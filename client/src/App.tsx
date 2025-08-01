import { Routes, Route, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import ErrorBoundary from './components/common/ErrorBoundary';
import Chatbot from './components/chatbot/Chatbot';
import { routes } from './routes';
import type { RouteConfig } from './routes';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import BetterAuthProvider from './contexts/BetterAuthContext';

const RouteErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {error.status} - {error.statusText}
          </h1>
          <p className="text-gray-600">{error.data?.message || 'An error occurred'}</p>
        </div>
      </div>
    );
  }

  // Handle other types of errors
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Error</h1>
        <p className="text-gray-600">{errorMessage}</p>
      </div>
    </div>
  );
};

const App = () => {
  return (
    // Using BetterAuthProvider as the single source of truth for authentication
    <BetterAuthProvider>
      <ThemeProvider>
        <NotificationProvider>
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
        </NotificationProvider>
      </ThemeProvider>
    </BetterAuthProvider>
  );
};

export default App; 