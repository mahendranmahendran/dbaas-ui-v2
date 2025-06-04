// BillingPage/index.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Grid } from '@mui/material';
import { usePermission } from '../../rbac/context.jsx';
import PlanSummary from './PlanSummary';
import PaymentMethod from './PaymentMethod';

export default function BillingPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const canModifyBilling = usePermission('billing', 'modify');

  return (
    <Box sx={{ 
      backgroundColor: colors.primary[400],
      minHeight: 'calc(100vh - 64px)',
      py: 6,
      px: 4
    }}>
      <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {canModifyBilling && (
          <Grid item xs={12} md={8}>
            <PaymentMethod />
          </Grid>
        )}
        <Grid item xs={12} md={canModifyBilling ? 4 : 12}>
          <PlanSummary />
        </Grid>
      </Grid>
    </Box>
  );
}