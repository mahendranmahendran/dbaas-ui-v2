export const ADMIN_FEATURES = {
  product_owner: {
    sections: ['users', 'database', 'audit'],
    capabilities: {
      users: ['create', 'delete', 'modify'],
      database: ['full_access']
    }
  },
  client_admin: {
    sections: ['database'],
    capabilities: {
      database: ['read_only']
    }
  }
};

export function getAdminFeatures(role) {
  return ADMIN_FEATURES[role] || {};
}

// Example usage in components:
// const { sections } = getAdminFeatures(user.role);