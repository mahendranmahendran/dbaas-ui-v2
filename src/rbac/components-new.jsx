import React from 'react';
import { useRBAC } from './context-new';
import { PAGE_ACCESS } from './clickhouse-roles';
import { Navigate } from 'react-router-dom';

export function Protected({ children, page }) {
  const { currentRole, loading, error } = useRBAC();

  if (loading) {
    return <div>Loading permissions...</div>;
  }

  if (error) {
    return <Navigate to="/error" state={{ error }} />;
  }

  if (!currentRole || !PAGE_ACCESS[page]?.includes(currentRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
