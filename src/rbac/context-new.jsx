import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClickhouseConnection } from '../utils/clickhouse-browser';

const RBACContext = createContext();

import { useAuth } from '../utils/hooks/useAuth-new';

export function RBACProvider({ children }) {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions(null);
        setLoading(false);
        return;
      }

      try {
        const client = await createClickhouseConnection(user.username, user.password);
        const grants = await client.query({
          query: 'SHOW GRANTS FOR CURRENT_USER'
        });
        
        const role = await client.query({
          query: 'SELECT getCurrentRole() as role'
        });

        setPermissions({
          grants: grants.data,
          currentRole: role.data[0].role
        });
      } catch (err) {
        setError(err);
        console.error('Failed to fetch ClickHouse permissions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const checkAccess = async (database, resource, action) => {
    if (!user || !permissions) return false;

    try {
      const client = await createClickhouseConnection(
        user.username, 
        user.password, 
        database
      );
      
      const { data } = await client.query({
        query: `
          SELECT count() > 0 as has_access
          FROM system.grants 
          WHERE access_type = '${action}' 
          AND database = '${database}'
          AND table = '${resource}'
        `
      });
      
      return data[0]?.has_access || false;
    } catch (err) {
      console.error('Failed to check access:', err);
      return false;
    }
  };

  const value = {
    permissions,
    loading,
    error,
    checkAccess,
    currentRole: permissions?.currentRole,
    isLoading: loading,
    hasError: !!error
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
}

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};
