// src/utils/hooks/useRBAC-new.jsx
import { useContext } from 'react';
import { RBACContext } from '../../rbac/context-new';
import { PAGE_ACCESS } from '../../rbac/clickhouse-roles';
import { createClickhouseConnection } from '../clickhouse';

export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  
  const { permissions, currentRole, checkAccess } = context;

  const hasPageAccess = (page) => {
    if (!currentRole || !page) return false;
    return PAGE_ACCESS[page]?.includes(currentRole);
  };

  const hasClickHousePermission = async (database, table, action) => {
    if (!database || !table || !action) return false;
    return checkAccess(`${database}.${table}`, action);
  };

  const hasRole = (role) => {
    return currentRole === role;
  };

  const getCurrentRole = () => currentRole;
  const getPermissions = () => permissions;

  return {
    hasPageAccess,
    hasClickHousePermission,
    hasRole,
    getCurrentRole,
    getPermissions,
    checkAccess
  };
}
