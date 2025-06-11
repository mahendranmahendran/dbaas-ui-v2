// RBAC Resources and Actions definitions
export const RESOURCES = {
  ADMIN: {
    VIEW: 'admin:view',
    USERS: 'admin:users',
    SYSTEM: 'admin:system',
    DATABASE: 'admin:database'
  },
  BILLING: {
    VIEW: 'billing:view',
    MODIFY: 'billing:modify'
  },
  PLAYGROUND: {
    VIEW: 'playground:view',
    EXECUTE: 'playground:execute'
  },
  MONITORING: {
    VIEW: 'monitoring:view',
    ALERTS: 'monitoring:alerts'
  },
  SETTINGS: {
    VIEW: 'settings:view',
    MODIFY: 'settings:modify'
  }
};

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
  EXECUTE: 'execute'
};

// Role-based permission mappings
export const ROLE_PERMISSIONS = {
  'client_admin': [
    RESOURCES.ADMIN.VIEW,
    RESOURCES.ADMIN.USERS,
    RESOURCES.BILLING.VIEW,
    RESOURCES.BILLING.MODIFY,
    RESOURCES.PLAYGROUND.VIEW,
    RESOURCES.PLAYGROUND.EXECUTE,
    RESOURCES.MONITORING.VIEW,
    RESOURCES.MONITORING.ALERTS,
    RESOURCES.SETTINGS.VIEW,
    RESOURCES.SETTINGS.MODIFY
  ],
  'client_analyst': [
    RESOURCES.PLAYGROUND.VIEW,
    RESOURCES.PLAYGROUND.EXECUTE,
    RESOURCES.MONITORING.VIEW,
    RESOURCES.SETTINGS.VIEW
  ],
  'product_owner': [
    RESOURCES.ADMIN.VIEW,
    RESOURCES.ADMIN.USERS,
    RESOURCES.ADMIN.SYSTEM,
    RESOURCES.ADMIN.DATABASE,
    RESOURCES.BILLING.VIEW,
    RESOURCES.BILLING.MODIFY,
    RESOURCES.PLAYGROUND.VIEW,
    RESOURCES.PLAYGROUND.EXECUTE,
    RESOURCES.MONITORING.VIEW,
    RESOURCES.MONITORING.ALERTS,
    RESOURCES.SETTINGS.VIEW,
    RESOURCES.SETTINGS.MODIFY
  ],
  'product_developer': [
    RESOURCES.PLAYGROUND.VIEW,
    RESOURCES.PLAYGROUND.EXECUTE,
    RESOURCES.MONITORING.VIEW,
    RESOURCES.SETTINGS.VIEW
  ]
};