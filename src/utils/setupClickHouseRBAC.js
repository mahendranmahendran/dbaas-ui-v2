// src/utils/setupClickHouseRBAC.js
import { createClickhouseConnection } from './clickhouse';
import { createRoleSQL, CLICKHOUSE_ROLES } from '../rbac/clickhouse-roles';

export async function setupClickHouseRBAC(adminCredentials) {
  const client = await createClickhouseConnection(
    adminCredentials.username,
    adminCredentials.password
  );

  // Create roles
  for (const [role, sql] of Object.entries(createRoleSQL)) {
    try {
      await client.query({ query: sql });
      console.log(`Created role: ${role}`);
    } catch (error) {
      console.error(`Error creating role ${role}:`, error);
    }
  }

  // Set up role hierarchy
  const roleHierarchy = [
    { parent: CLICKHOUSE_ROLES.PRODUCT_OWNER, child: CLICKHOUSE_ROLES.PRODUCT_DEVELOPER },
    { parent: CLICKHOUSE_ROLES.CLIENT_ACCOUNT_OWNER, child: CLICKHOUSE_ROLES.CLIENT_ADMIN },
    { parent: CLICKHOUSE_ROLES.CLIENT_ADMIN, child: CLICKHOUSE_ROLES.CLIENT_ANALYST },
    { parent: CLICKHOUSE_ROLES.CLIENT_ANALYST, child: CLICKHOUSE_ROLES.CLIENT_USER }
  ];

  for (const { parent, child } of roleHierarchy) {
    try {
      await client.query({
        query: `GRANT ${child} TO ${parent}`
      });
      console.log(`Granted ${child} to ${parent}`);
    } catch (error) {
      console.error(`Error setting up role hierarchy for ${parent} -> ${child}:`, error);
    }
  }
}

export async function setupClientDatabase(adminCredentials, clientId) {
  const client = await createClickhouseConnection(
    adminCredentials.username,
    adminCredentials.password
  );

  const database = `client_${clientId}`;

  try {
    // Create client database
    await client.query({
      query: `CREATE DATABASE IF NOT EXISTS ${database}`
    });

    // Set up row-level security policy
    await client.query({
      query: `
        ALTER TABLE ${database}.*
        ADD ROW POLICY IF NOT EXISTS tenant_isolation
        ON SELECT, INSERT, UPDATE, DELETE
        FOR ALL
        USING tenant_id = '${clientId}'
      `
    });

    console.log(`Set up database and policies for client: ${clientId}`);
    return true;
  } catch (error) {
    console.error(`Error setting up client database:`, error);
    return false;
  }
}
