// components/AuthWrapper.jsx
import { useAuth } from '../utils/hooks/useAuth-new';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function AuthWrapper({ children, requiredRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Update page title based on authentication status
    document.title = `${import.meta.env.VITE_APP_NAME || 'ClickHouse DBaaS'} ${
      !isAuthenticated ? '- Login Required' : ''
    }`;
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve the current URL and any query parameters as returnTo
    const returnTo = encodeURIComponent(
      location.pathname + location.search + location.hash
    );
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  // Check for required roles if specified
  if (
    requiredRoles.length > 0 &&
    !requiredRoles.some(role => user.role === role)
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 text-center mb-4">
          You don't have the required permissions to access this page.
          Required roles: {requiredRoles.join(', ')}
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  // User is authenticated and has required roles
  return children;
}