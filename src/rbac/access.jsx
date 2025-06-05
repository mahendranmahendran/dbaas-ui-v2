import { CLICKHOUSE_ROLES } from './clickhouse-roles';

// Resource definitions mapped to ClickHouse permissions
export const RESOURCES = {
  DASHBOARD: {
    VIEW: 'dashboard:view',
    METRICS: 'dashboard:metrics',
    ALERTS: 'dashboard:alerts'
  },
  SQL_PLAYGROUND: {
    VIEW: 'sql_playground:view',
    EXECUTE: 'sql_playground:execute',
    SAVE: 'sql_playground:save',
    SHARE: 'sql_playground:share'
  },
  BILLING: {
    VIEW: 'billing:view',
    PAYMENT: 'billing:payment',
    HISTORY: 'billing:history',
    MANAGE: 'billing:manage'
  },
  ADMIN: {
    VIEW: 'admin:view',
    USERS: 'admin:users',
    SETTINGS: 'admin:settings',
    SYSTEM: 'admin:system'
  },
  USER: {
    PROFILE: 'user:profile',
    PREFERENCES: 'user:preferences'
  }
};

// Actions available for resources
export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  EXECUTE: 'execute',
  MANAGE: 'manage'
};

// Permission rules mapped to ClickHouse roles
export const PERMISSIONS = {
  [CLICKHOUSE_ROLES.PRODUCT_OWNER]: {
    // Full access to everything
    ...Object.values(RESOURCES).reduce((acc, section) => ({
      ...acc,
      ...Object.values(section).reduce((actions, resource) => ({
        ...actions,
        [resource]: Object.values(ACTIONS)
      }), {})
    }), {})
  },
  [CLICKHOUSE_ROLES.PRODUCT_DEVELOPER]: {
    [RESOURCES.DASHBOARD.VIEW]: [ACTIONS.VIEW],
    [RESOURCES.DASHBOARD.METRICS]: [ACTIONS.VIEW],
    [RESOURCES.DASHBOARD.ALERTS]: [ACTIONS.VIEW, ACTIONS.UPDATE],
    [RESOURCES.SQL_PLAYGROUND.VIEW]: [ACTIONS.VIEW],
    [RESOURCES.SQL_PLAYGROUND.EXECUTE]: [ACTIONS.EXECUTE],
    [RESOURCES.SQL_PLAYGROUND.SAVE]: [ACTIONS.CREATE, ACTIONS.UPDATE],
    [RESOURCES.ADMIN.VIEW]: [ACTIONS.VIEW],
    [RESOURCES.USER.PROFILE]: [ACTIONS.VIEW, ACTIONS.UPDATE],
    [RESOURCES.USER.PREFERENCES]: [ACTIONS.VIEW, ACTIONS.UPDATE]
  },
  [CLICKHOUSE_ROLES.CLIENT_ADMIN]: {
    [RESOURCES.DASHBOARD.VIEW]: [ACTIONS.VIEW],
    [RESOURCES.DASHBOARD.METRICS]: [ACTIONS.VIEW],
    [RESOURCES.DASHBOARD.ALERTS]: [ACTIONS.VIEW, ACTIONS.UPDATE],
    [RESOURCES.SQL_PLAYGROUND.VIEW]: [ACTIONS.VIEW],
    [RESOURCES.SQL_PLAYGROUND.EXECUTE]: [ACTIONS.EXECUTE],
    [RESOURCES.SQL_PLAYGROUND.SAVE]: [ACTIONS.CREATE, ACTIONS.UPDATE],
    [RESOURCES.BILLING.VIEW]: [ACTIONS.VIEW],
    [RESOURCES.BILLING.PAYMENT]: [ACTIONS.VIEW, ACTIONS.UPDATE],
    [RESOURCES.BILLING.HISTORY]: [ACTIONS.VIEW],
    [RESOURCES.USER.PROFILE]: [ACTIONS.VIEW, ACTIONS.UPDATE],
    [RESOURCES.USER.PREFERENCES]: [ACTIONS.VIEW, ACTIONS.UPDATE]
  },
  [CLICKHOUSE_ROLES.CLIENT_ANALYST]: {
    [RESOURCES.DASHBOARD.VIEW]: [ACTIONS.VIEW],
    [RESOURCES.DASHBOARD.METRICS]: [ACTIONS.VIEW],
    [RESOURCES.SQL_PLAYGROUND.VIEW]: [ACTIONS.VIEW],
    [RESOURCES.SQL_PLAYGROUND.EXECUTE]: [ACTIONS.EXECUTE],
    [RESOURCES.SQL_PLAYGROUND.SAVE]: [ACTIONS.CREATE],
    [RESOURCES.USER.PROFILE]: [ACTIONS.VIEW, ACTIONS.UPDATE],
    [RESOURCES.USER.PREFERENCES]: [ACTIONS.VIEW, ACTIONS.UPDATE]
  },
  [CLICKHOUSE_ROLES.CLIENT_USER]: {
    [RESOURCES.DASHBOARD.VIEW]: [ACTIONS.VIEW],
    [RESOURCES.DASHBOARD.METRICS]: [ACTIONS.VIEW],
    [RESOURCES.USER.PROFILE]: [ACTIONS.VIEW, ACTIONS.UPDATE],
    [RESOURCES.USER.PREFERENCES]: [ACTIONS.VIEW, ACTIONS.UPDATE]
  }
};

// Role hierarchy mapped to ClickHouse roles
const ROLE_HIERARCHY = {
  [CLICKHOUSE_ROLES.PRODUCT_OWNER]: [CLICKHOUSE_ROLES.PRODUCT_DEVELOPER],
  [CLICKHOUSE_ROLES.CLIENT_ACCOUNT_OWNER]: [CLICKHOUSE_ROLES.CLIENT_ADMIN],
  [CLICKHOUSE_ROLES.CLIENT_ADMIN]: [CLICKHOUSE_ROLES.CLIENT_ANALYST],
  [CLICKHOUSE_ROLES.CLIENT_ANALYST]: [CLICKHOUSE_ROLES.CLIENT_USER]
};

// Helper to get inherited permissions based on role hierarchy
function getInheritedPermissions(role) {
  const inheritedRoles = ROLE_HIERARCHY[role] || [];
  return inheritedRoles.reduce((acc, inheritedRole) => {
    return {
      ...acc,
      ...PERMISSIONS[inheritedRole],
      ...getInheritedPermissions(inheritedRole)
    };
  }, {});
}

// Build permission tree with inheritance and caching
export function buildPermissions(role) {
  if (!role) return {};
  
  // Get direct permissions for the role
  const directPermissions = PERMISSIONS[role] || {};
  
  // Get inherited permissions
  const inheritedPermissions = getInheritedPermissions(role);
  
  // Merge permissions, with direct permissions taking precedence
  const allPermissions = {
    ...inheritedPermissions,
    ...directPermissions
  };
  
  // Convert to a normalized format for easier checking
  return Object.entries(allPermissions).reduce((acc, [resource, actions]) => {
    acc[resource] = Array.from(new Set(actions)); // Remove duplicates
    return acc;
  }, {});
}
