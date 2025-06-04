import { createContext, useContext, useMemo } from 'react';
import { buildPermissions } from './access.jsx';

const RBACContext = createContext();

// Provider component
export function RBACProvider({ user, children }) {
  const value = useMemo(() => ({
    permissions: buildPermissions(user?.role),
    currentRole: user?.role
  }), [user?.role]);

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

// Main hook
export function useRBAC() {
  return useContext(RBACContext);
}

// Specific permission check
export function usePermission(resource, action = 'read') {
  const { permissions } = useRBAC();
  if (!permissions || !resource) return false;
  return permissions[resource]?.includes(action) || false;
}

// Check for multiple permissions at once
export function useMultiplePermissions(checks) {
  const { permissions } = useRBAC();
  if (!permissions || !checks) return false;
  
  return checks.every(({ resource, action = 'read' }) => 
    permissions[resource]?.includes(action)
  );
}