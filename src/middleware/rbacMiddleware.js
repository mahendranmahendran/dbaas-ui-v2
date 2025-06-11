const { ROLE_PERMISSIONS } = require('../rbac/access');
const { ForbiddenError } = require('./errorMiddleware');

// Role hierarchy definition
const ROLE_HIERARCHY = {
  'product_owner': ['product_developer', 'client_admin', 'client_analyst'],
  'product_developer': ['client_admin', 'client_analyst'],
  'client_admin': ['client_analyst'],
  'client_analyst': []
};

// Helper to get all permissions including inherited ones
const getAllPermissions = (role) => {
  const permissions = new Set(ROLE_PERMISSIONS[role] || []);
  
  // Add inherited permissions
  const inheritedRoles = ROLE_HIERARCHY[role] || [];
  for (const inheritedRole of inheritedRoles) {
    const inheritedPermissions = ROLE_PERMISSIONS[inheritedRole] || [];
    inheritedPermissions.forEach(permission => permissions.add(permission));
  }
  
  return Array.from(permissions);
};

// Check if role has permission including inheritance
const hasPermission = (role, requiredPermission) => {
  const allPermissions = getAllPermissions(role);
  return allPermissions.includes(requiredPermission);
};

// Middleware creator for single permission check
const rbacMiddleware = (resource, action) => {
  return (req, res, next) => {
    const { role } = req.user;
    const requiredPermission = `${resource}:${action}`;

    if (!hasPermission(role, requiredPermission)) {
      throw new ForbiddenError(`Access denied. Required permission: ${requiredPermission}`);
    }

    next();
  };
};

// Middleware creator for checking multiple permissions
const rbacMultipleMiddleware = (checks, requireAll = true) => {
  return (req, res, next) => {
    const { role } = req.user;

    const results = checks.map(({ resource, action }) => {
      const permission = `${resource}:${action}`;
      return hasPermission(role, permission);
    });

    const hasAccess = requireAll
      ? results.every(Boolean)
      : results.some(Boolean);

    if (!hasAccess) {
      const required = checks
        .map(({ resource, action }) => `${resource}:${action}`)
        .join(', ');
      throw new ForbiddenError(
        `Access denied. Required permission(s): ${required}`
      );
    }

    next();
  };
};

// Middleware for database-specific permissions
const rbacDatabaseMiddleware = (action) => {
  return async (req, res, next) => {
    const { role, clientId } = req.user;
    const { databaseName } = req.params;

    // Check if database belongs to client
    if (!databaseName.startsWith(`client_${clientId}`)) {
      throw new ForbiddenError('Access denied. Database does not belong to client');
    }

    // Check action permission
    const requiredPermission = `database:${action}`;
    if (!hasPermission(role, requiredPermission)) {
      throw new ForbiddenError(`Access denied. Required permission: ${requiredPermission}`);
    }

    next();
  };
};

module.exports = {
  rbacMiddleware,
  rbacMultipleMiddleware,
  rbacDatabaseMiddleware,
  hasPermission,
  getAllPermissions
};
