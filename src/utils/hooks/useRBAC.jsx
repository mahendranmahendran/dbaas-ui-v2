// src/utils/hooks/useRBAC.jsx
import { useAuth } from './useAuth.jsx';
import { RESOURCES, ACTIONS } from '../../rbac/access.jsx';

export function useRBAC() {
  const { user } = useAuth();
  
  const hasPermission = (resource, action) => {
    if (!user?.permissions || !resource) return false;
    const permissions = user.permissions[resource];
    return permissions?.includes(action);
  };

  const hasAnyPermission = (checks) => {
    return checks.some(({ resource, action }) => hasPermission(resource, action));
  };

  const hasAllPermissions = (checks) => {
    return checks.every(({ resource, action }) => hasPermission(resource, action));
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const getCurrentPermissions = () => {
    if (!user?.permissions) return {};
    return user.permissions;
  };

  return { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    hasRole,
    getCurrentPermissions,
    RESOURCES,
    ACTIONS
  };
}
