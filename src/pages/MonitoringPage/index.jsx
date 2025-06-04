import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography } from '@mui/material';
import { Protected } from '../../rbac/components.jsx';
import MetricsDashboard from './MetricsDashboard';
import QueryPerformance from './QueryPerformance';
import SystemHealth from './SystemHealth';

export default function MonitoringPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Protected resource="monitoring" action="view">
      <Box sx={{ 
        backgroundColor: colors.primary[400],
        minHeight: 'calc(100vh - 64px)',
        p: 4
      }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Typography variant="h4" sx={{ mb: 4, color: colors.grey[100] }}>
            Database Monitoring
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <SystemHealth />
            <MetricsDashboard />
            <QueryPerformance />
          </Box>
        </Box>
      </Box>
    </Protected>
  );
}