// src/utils/hooks/useRBAC-new.jsx
import { useContext, useCallback, useMemo } from 'react';
import { RBACContext } from '../../rbac/context-new';
import { PAGE_ACCESS } from '../../rbac/clickhouse-roles';
import { api } from './useAuth-new';

export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  
  const { permissions, currentRole, setPermissions } = context;

  // Cache permission checks to avoid unnecessary API calls
  const permissionCache = useMemo(() => new Map(), []);

  const checkPermission = useCallback(async (resource, action) => {
    const cacheKey = `${resource}:${action}`;
    
    // Check cache first
    if (permissionCache.has(cacheKey)) {
      return permissionCache.get(cacheKey);
    }

    try {
      const response = await api.post('/api/rbac/check-permission', {
        resource,
        action
      });
      
      const hasPermission = response.data.hasPermission;
      permissionCache.set(cacheKey, hasPermission);
      return hasPermission;
    } catch (error) {
      console.error('Permission check failed:', error);
      return false;
    }
  }, []);

  const hasPageAccess = useCallback((page) => {
    if (!currentRole || !page) return false;
    
    // First check static page access
    if (PAGE_ACCESS[page]?.includes(currentRole)) {
      return true;
    }

    // Then check dynamic permissions
    return permissions.some(permission => 
      permission.startsWith(`page:${page}:`)
    );
  }, [currentRole, permissions]);

  const hasClickHousePermission = useCallback(async (database, table, action) => {
    if (!database || !table || !action) return false;
    return checkPermission(`${database}.${table}`, action);
  }, [checkPermission]);

  const hasSystemPermission = useCallback(async (action) => {
    return checkPermission('system', action);
  }, [checkPermission]);

  const hasRole = useCallback((role) => {
    return currentRole === role;
  }, [currentRole]);

  const hasAnyRole = useCallback((roles) => {
    return roles.some(role => currentRole === role);
  }, [currentRole]);

  const refreshPermissions = useCallback(async () => {
    try {
      const response = await api.get('/api/rbac/permissions');
      setPermissions(response.data.permissions);
      permissionCache.clear(); // Clear cache on refresh
    } catch (error) {
      console.error('Failed to refresh permissions:', error);
    }
  }, [setPermissions]);

  const checkMultiplePermissions = useCallback(async (checks, requireAll = true) => {
    const results = await Promise.all(
      checks.map(({ resource, action }) => checkPermission(resource, action))
    );
    
    return requireAll 
      ? results.every(Boolean) 
      : results.some(Boolean);
  }, [checkPermission]);

  return {
    hasPageAccess,
    hasClickHousePermission,
    hasSystemPermission,
    hasRole,
    hasAnyRole,
    checkPermission,
    checkMultiplePermissions,
    refreshPermissions,
    getCurrentRole: () => currentRole,
    getPermissions: () => permissions
  };
}
