import DnsIcon from '@mui/icons-material/Dns';
import Typography from '@mui/material/Typography';

// App.jsx
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { tokens } from './styles/theme';
import { Box, AppBar, Toolbar, Button } from '@mui/material';
import ThemeToggler from './components/ThemeToggler';
import { useEffect } from 'react';
import { useAuth } from './utils/hooks/useAuth-new';

export default function App() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/pricing', label: 'Pricing' },
  ];

  const privateLinks = [
    { path: '/playground', label: 'Playground' },
    { path: '/billing', label: 'Billing' },
    { path: '/profile', label: 'Profile' }
  ];

  const navLinks = [...publicLinks, ...(user ? privateLinks : [])];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: colors.primary[400],
      display: 'flex',
      flexDirection: 'column'
    }}>
      <AppBar 
        position="sticky"
        sx={{ 
          backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : '#ffffff',
          boxShadow: theme.palette.mode === 'dark' 
            ? `0 2px 10px ${colors.primary[700]}`
            : '0 2px 10px rgba(0, 0, 0, 0.1)',
          py: 1
        }}
      >
        <Toolbar sx={{ 
          maxWidth: 'xl',
          mx: 'auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            <DnsIcon sx={{ 
              fontSize: 32,
              color: colors.clickhouseBlue[500] 
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.primary[500]
            }}>
              ClickHouse DBaaS
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexGrow: 1,
            justifyContent: 'center' 
          }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  color: location.pathname === link.path 
                    ? colors.clickhouseBlue[500]
                    : theme.palette.mode === 'dark' 
                      ? colors.grey[100]
                      : colors.primary[500],
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: colors.clickhouseBlue[400]
                  }
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Auth Actions */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            ml: 'auto'
          }}>
            {!user ? (
              <>
                <Button
                  component={Link}
                  to="/register"
                  variant="outlined"
                  size="small"
                  sx={{
                    color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.primary[500],
                    borderColor: theme.palette.mode === 'dark' ? colors.grey[700] : colors.primary[300],
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: theme.palette.mode === 'dark' ? colors.grey[500] : colors.primary[400]
                    }
                  }}
                >
                  Register
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: colors.clickhouseBlue[500],
                    color: '#ffffff',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: colors.clickhouseBlue[600]
                    }
                  }}
                >
                  Login
                </Button>
              </>
            ) : (
              <>
                <Typography sx={{ 
                  color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.primary[500],
                  fontSize: '0.875rem'
                }}>
                  {user.name}
                </Typography>
                <Button
                  onClick={logout}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: theme.palette.mode === 'dark' ? colors.grey[100] : colors.primary[500],
                    borderColor: theme.palette.mode === 'dark' ? colors.grey[700] : colors.primary[300],
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: theme.palette.mode === 'dark' ? colors.grey[500] : colors.primary[400]
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            )}
            <ThemeToggler />
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ 
        py: 4,
        backgroundColor: colors.primary[600],
        mt: 'auto'
      }}>
        <Typography variant="body2" sx={{ 
          textAlign: 'center',
          color: colors.grey[300]
        }}>
          © {new Date().getFullYear()} ClickHouse DBaaS. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}