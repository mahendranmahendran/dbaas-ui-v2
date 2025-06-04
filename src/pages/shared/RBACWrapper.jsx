// shared/RBACWrapper.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { useRBAC } from '../../utils/hooks/useRBAC-new';
import { Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

export default function RBACWrapper({ 
  children, 
  page,
  database,
  table,
  action
}) {
  const { hasPageAccess, hasClickHousePermission } = useRBAC();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [hasAccess, setHasAccess] = React.useState(false);
  
  React.useEffect(() => {
    const checkPermissions = async () => {
      const pageAccess = page ? hasPageAccess(page) : true;
      const dbAccess = database && table && action ? 
        await hasClickHousePermission(database, table, action) : true;
      
      setHasAccess(pageAccess && dbAccess);
    };
    
    checkPermissions();
  }, [page, database, table, action]);

  if (!hasAccess) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)',
        backgroundColor: colors.primary[400]
      }}>
        <Typography variant="h4" sx={{ color: colors.grey[100], mb: 2 }}>
          Unauthorized Access
        </Typography>
        <Typography sx={{ color: colors.grey[300] }}>
          You don't have permission to view this page
        </Typography>
      </Box>
    );
  }

  return children;
}