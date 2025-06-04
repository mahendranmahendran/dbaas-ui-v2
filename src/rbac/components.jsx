import { Suspense, Component } from 'react';
import { useRBAC } from './context.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h4>Something went wrong</h4>
          <p>Please try refreshing the page</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading component for suspense fallback
function Loading() {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

// Access Denied component with customizable message
function AccessDenied({ message }) {
  return (
    <div className="access-denied">
      <h4>Permission Required</h4>
      <p>{message || "Your role doesn't have access to this resource"}</p>
    </div>
  );
}

// Enhanced Protection Wrapper with support for multiple permission checks
export function Protected({ 
  children, 
  checks, // Array of {resource, action} or single {resource, action}
  requireAll = false, // If true, all permissions must be satisfied
  fallback,
  loadingComponent,
  errorComponent,
  accessDeniedMessage 
}) {
  const { hasPermission, hasAllPermissions, hasAnyPermission, loading } = useRBAC();
  
  if (loading) {
    return loadingComponent || <Loading />;
  }

  // Handle single permission check
  if (!Array.isArray(checks)) {
    const { resource, action } = checks;
    if (!hasPermission(resource, action)) {
      return fallback || <AccessDenied message={accessDeniedMessage} />;
    }
    return (
      <ErrorBoundary fallback={errorComponent}>
        <Suspense fallback={loadingComponent || <Loading />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    );
  }
  
  // Handle multiple permission checks
  const hasAccess = requireAll ? 
    hasAllPermissions(checks) : 
    hasAnyPermission(checks);
  
  if (!hasAccess) {
    return fallback || (
      <AccessDenied 
        message={accessDeniedMessage || 
          `You need ${requireAll ? 'all' : 'any'} of the required permissions to access this resource`} 
      />
    );
  }
  
  return (
    <ErrorBoundary fallback={errorComponent}>
      <Suspense fallback={loadingComponent || <Loading />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}