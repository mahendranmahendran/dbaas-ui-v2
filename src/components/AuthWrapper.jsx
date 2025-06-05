// components/AuthWrapper.jsx
import { useAuth } from '../utils/hooks/useAuth-new';
import { Navigate, useLocation } from 'react-router-dom';

export default function AuthWrapper({ children }) {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Preserve the current URL as returnTo parameter
    return <Navigate 
      to={`/login?returnTo=${encodeURIComponent(location.pathname)}`}
      replace
    />;
  }
  
  return children;
}