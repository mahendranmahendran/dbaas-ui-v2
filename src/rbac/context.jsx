import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/hooks/useAuth-new';

export const RBACContext = createContext(null);

export function RBACProvider({ children }) {
  const [permissions, setPermissions] = useState([]);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize RBAC state
  useEffect(() => {
    const initializeRBAC = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user role and permissions
        const [roleResponse, permissionsResponse] = await Promise.all([
          api.get('/api/rbac/role'),
          api.get('/api/rbac/permissions')
        ]);

        setCurrentRole(roleResponse.data.role);
        setPermissions(permissionsResponse.data.permissions);
      } catch (err) {
        console.error('Failed to initialize RBAC:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeRBAC();
  }, []);

  // Update role
  const updateRole = async (newRole) => {
    try {
      setLoading(true);
      setError(null);

      await api.post('/api/rbac/role', { role: newRole });
      
      // Fetch updated permissions for the new role
      const [permissionsResponse] = await Promise.all([
        api.get('/api/rbac/permissions')
      ]);

      setCurrentRole(newRole);
      setPermissions(permissionsResponse.data.permissions);
    } catch (err) {
      console.error('Failed to update role:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset RBAC state
  const resetRBAC = () => {
    setPermissions([]);
    setCurrentRole(null);
    setError(null);
  };

  const value = {
    permissions,
    setPermissions,
    currentRole,
    updateRole,
    loading,
    error,
    resetRBAC
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          RBAC Initialization Error
        </h1>
        <p className="text-gray-600 text-center mb-4">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

export function usePermission(resource, action) {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('usePermission must be used within an RBACProvider');
  }
  return context.checkPermission(resource, action);
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return {
    role: context.role,
    permissions: context.permissions,
    checkPermission: context.checkPermission
  };
}
