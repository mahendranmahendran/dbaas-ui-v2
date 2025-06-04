// pages/admin/SystemSettings.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { useRBAC } from '../../utils/hooks/useRBAC';
import { Card, CardContent, Typography } from '@mui/material';

function SystemInfoCard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card sx={{ backgroundColor: colors.primary[500] }}>
      <CardContent>
        <Typography variant="h6" color={colors.grey[100]}>
          System Information
        </Typography>
        {/* System info content */}
      </CardContent>
    </Card>
  );
}

function UpdateSettingsForm() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Card sx={{ backgroundColor: colors.primary[500] }}>
      <CardContent>
        <Typography variant="h6" color={colors.grey[100]}>
          Update Settings
        </Typography>
        {/* Settings form */}
      </CardContent>
    </Card>
  );
}

export default function SystemSettings() {
  const { hasPermission } = useRBAC();
  
  return (
    <div className="space-y-6">
      {hasPermission('read:settings') && <SystemInfoCard />}
      {hasPermission('write:settings') && <UpdateSettingsForm />}
    </div>
  );
}