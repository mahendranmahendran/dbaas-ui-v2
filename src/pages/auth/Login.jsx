// pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { useAuth, ROLES } from '../../utils/hooks/useAuth-new';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

export default function Login() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Get the return URL from the location search params
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnTo') || '/';

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    navigate('/');
    return null;
  }
  
  // Valid email domains for different roles
  const VALID_DOMAINS = {
    [ROLES.CLIENT_ADMIN]: ['admin'],
    [ROLES.CLIENT_ANALYST]: ['analyst'],
    [ROLES.PRODUCT_OWNER]: ['owner'],
    [ROLES.PRODUCT_DEVELOPER]: ['dev', 'developer']
  };

  // Helper function to validate email format
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper function to detect and validate role from email
  const detectRole = (email) => {
    if (!email) return null;
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return null;

    for (const [role, validDomains] of Object.entries(VALID_DOMAINS)) {
      if (validDomains.some(d => domain.startsWith(d + '.'))) {
        return role;
      }
    }
    return ROLES.PRODUCT_DEVELOPER; // Default role
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    const role = detectRole(formData.email);
    if (!role) {
      setError('Invalid email domain. Please use a valid company email address.');
      return;
    }
    
    setLoading(true);
    
    try {
      await login({
        email: formData.email,
        password: formData.password,
        role
      });
      navigate(returnTo);
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: colors.primary[400],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        width: 400,
        p: 4,
        backgroundColor: colors.primary[500],
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Typography variant="h4" sx={{ 
          mb: 3,
          color: colors.grey[100],
          textAlign: 'center'
        }}>
          ClickHouse DBaaS
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              style: { color: colors.grey[100] }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ mb: 3 }}
            InputProps={{
              style: { color: colors.grey[100] }
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: colors.clickhouseBlue[500],
              '&:hover': {
                backgroundColor: colors.clickhouseBlue[600],
                opacity: 0.9
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography sx={{ color: colors.grey[300] }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: colors.clickhouseBlue[500],
                textDecoration: 'none'
              }}
            >
              Register here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}