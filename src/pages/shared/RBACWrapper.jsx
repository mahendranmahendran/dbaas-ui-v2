// shared/RBACWrapper.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { useRBAC } from '../../utils/hooks/useRBAC-new';
import { useAuth } from '../../utils/hooks/useAuth-new';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';

export default function RBACWrapper({ 
  children, 
  page,
  resource,
  action,
  fallback,
  requireAll = true,
  showError = true
}) {
  const location = useLocation();
  const { user } = useAuth();
  const { 
    hasPageAccess, 
    checkPermission, 
    checkMultiplePermissions,
    getCurrentRole 
  } = useRBAC();
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState(null);

  const checkAccess = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check page access first
      if (page && !hasPageAccess(page)) {
        setHasAccess(false);
        return;
      }

      // Handle multiple resource-action pairs
      if (Array.isArray(resource) && Array.isArray(action)) {
        if (resource.length !== action.length) {
          throw new Error('Resource and action arrays must have the same length');
        }

        const checks = resource.map((res, index) => ({
          resource: res,
          action: action[index]
        }));

        const hasPermission = await checkMultiplePermissions(checks, requireAll);
        setHasAccess(hasPermission);
        return;
      }

      // Handle single resource-action pair
      if (resource && action) {
        const hasPermission = await checkPermission(resource, action);
        setHasAccess(hasPermission);
        return;
      }

      // If no specific permissions needed, just check page access
      setHasAccess(true);
    } catch (err) {
      console.error('Permission check failed:', err);
      setError(err.message);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }, [page, resource, action, requireAll, hasPageAccess, checkPermission, checkMultiplePermissions]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return fallback;
    }

    if (!showError) {
      return null;
    }

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
        gap={2}
        textAlign="center"
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        
        <Typography color="textSecondary">
          {error || `You don't have the required permissions for this action.`}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Current Role: {getCurrentRole()}
        </Typography>
        
        {location.pathname !== '/' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        )}
      </Box>
    );
  }

  return children;
}