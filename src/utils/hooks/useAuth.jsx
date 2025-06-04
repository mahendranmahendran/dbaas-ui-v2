// src/utils/hooks/useAuth.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Supported roles
export const ROLES = {
  PRODUCT_OWNER: 'product_owner',
  PRODUCT_DEVELOPER: 'product_developer',
  CLIENT_ADMIN: 'client_admin',
  CLIENT_ANALYST: 'client_analyst'
};

// Default permissions for each role
const ROLE_PERMISSIONS = {
  [ROLES.PRODUCT_OWNER]: ['*'],
  [ROLES.PRODUCT_DEVELOPER]: ['read', 'execute', 'debug'],
  [ROLES.CLIENT_ADMIN]: ['read', 'write', 'manage_users'],
  [ROLES.CLIENT_ANALYST]: ['read', 'query']
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const storedUser = localStorage.getItem('clickhouse_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('clickhouse_user');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login handler for all user types
   * @param {Object} credentials - { email, password, role? }
   * @param {string} redirect - Route to navigate after login
   */
  const login = async (credentials, redirect = '/') => {
    // In a real app, this would be an API call
    const mockUsers = {
      'owner@company.com': { 
        role: ROLES.PRODUCT_OWNER,
        name: 'Product Owner',
        permissions: ROLE_PERMISSIONS[ROLES.PRODUCT_OWNER]
      },
      'dev@company.com': {
        role: ROLES.PRODUCT_DEVELOPER,
        name: 'Database Developer',
        permissions: ROLE_PERMISSIONS[ROLES.PRODUCT_DEVELOPER]
      },
      'admin@client.com': {
        role: ROLES.CLIENT_ADMIN,
        name: 'Client Administrator',
        permissions: ROLE_PERMISSIONS[ROLES.CLIENT_ADMIN]
      },
      'analyst@client.com': {
        role: ROLES.CLIENT_ANALYST,
        name: 'Data Analyst',
        permissions: ROLE_PERMISSIONS[ROLES.CLIENT_ANALYST]
      }
    };

    // Mock authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userData = mockUsers[credentials.email];
        
        if (userData && credentials.password === 'demo123') {
          const authUser = {
            ...userData,
            email: credentials.email,
            token: `mock-token-${Math.random().toString(36).slice(2)}`
          };
          
          setUser(authUser);
          localStorage.setItem('clickhouse_user', JSON.stringify(authUser));
          navigate(redirect);
          resolve(authUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clickhouse_user');
    navigate('/login');
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = { 
    user,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}