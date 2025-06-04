import { ClickHouseClient } from '@clickhouse/client';

export const createClickhouseConnection = async (username, password, database = 'default') => {
  const client = new ClickHouseClient({
    host: import.meta.env.VITE_CLICKHOUSE_HOST || 'http://localhost:8123',
    username,
    password,
    database
  });

  return client;
};

export const checkDatabaseAccess = async (client, database) => {
  try {
    await client.query({
      query: `SHOW TABLES FROM ${database}`
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const getCurrentUserGrants = async (client) => {
  const { data } = await client.query({
    query: 'SHOW GRANTS FOR CURRENT_USER'
  });
  return data;
};

export const getCurrentRole = async (client) => {
  const { data } = await client.query({
    query: 'SELECT currentRole() as role'
  });
  return data[0]?.role;
};

export const setupTenantIsolation = async (client, database, tenantId) => {
  await client.query({
    query: `
      ALTER TABLE ${database}.*
      ADD ROW POLICY IF NOT EXISTS tenant_isolation
      ON SELECT, INSERT, UPDATE, DELETE
      FOR ALL
      USING tenant_id = '${tenantId}'
    `
  });
};
