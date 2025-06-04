import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography } from '@mui/material';
import { usePermission } from '../../rbac/context.jsx';
import GeneralSettings from './GeneralSettings';
import DatabaseSettings from './DatabaseSettings';
import UserPreferences from './UserPreferences';

export default function SettingsPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const canChangeDatabase = usePermission('settings', 'database_modify');

  return (
    <Box sx={{ 
      backgroundColor: colors.primary[400],
      minHeight: 'calc(100vh - 64px)',
      p: 4
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 4, color: colors.grey[100] }}>
          Settings
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          <GeneralSettings />
          <UserPreferences />
          {canChangeDatabase && <DatabaseSettings />}
        </Box>
      </Box>
    </Box>
  );
}