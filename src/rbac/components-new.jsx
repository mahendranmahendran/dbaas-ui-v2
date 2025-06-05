import React, { useEffect } from 'react';
import { useRBAC } from './context-new';
import { PAGE_ACCESS } from './clickhouse-roles';
import { Navigate } from 'react-router-dom';

export function Protected({ children, page, database, resource, action }) {
  const { currentRole, checkAccess, isLoading, hasError } = useRBAC();

  useEffect(() => {
    const verifyAccess = async () => {
      if (database && resource && action) {
        const hasAccess = await checkAccess(database, resource, action);
        if (!hasAccess) {
          return <Navigate to="/unauthorized" />;
        }
      }
    };
    verifyAccess();
  }, [database, resource, action, checkAccess]);

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  if (hasError) {
    return <Navigate to="/error" state={{ error: hasError }} />;
  }

  if (!currentRole || !PAGE_ACCESS[page]?.includes(currentRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
