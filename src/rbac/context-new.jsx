import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClickhouseConnection } from '../utils/clickhouse';

const RBACContext = createContext();

export function RBACProvider({ children, user }) {
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

  const checkAccess = async (resource) => {
    if (!user || !permissions) return false;

    try {
      const client = await createClickhouseConnection(user.username, user.password);
      const { data } = await client.query({
        query: `CHECK ACCESS TO ${resource}`
      });
      return data[0].result === 1;
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
    currentRole: permissions?.currentRole
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
