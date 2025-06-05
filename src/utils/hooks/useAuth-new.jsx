import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClickhouseConnection } from '../clickhouse-browser';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const login = async (credentials) => {
    try {
      // Create ClickHouse connection with provided credentials
      const client = await createClickhouseConnection(
        credentials.username,
        credentials.password,
        credentials.database || 'default'
      );

      // Verify connection and get role information
      const { data: roleData } = await client.query('SELECT currentRole() as role');
      const { data: grantsData } = await client.query('SHOW GRANTS FOR CURRENT_USER');
      
      const role = roleData[0]?.role;
      const grants = grantsData;

      const userData = {
        username: credentials.username,
        password: credentials.password, // Consider encrypting or using a token
        database: credentials.database,
        role,
        grants,
        tenantId: credentials.tenantId
      };

      localStorage.setItem('clickhouse_user', JSON.stringify(userData));
      setUser(userData);
      
      // Redirect based on role
      if (role.includes('product_owner') || role.includes('product_developer')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('clickhouse_user');
    setUser(null);
    navigate('/login');
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {typeof children === 'function' ? children({ user }) : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
