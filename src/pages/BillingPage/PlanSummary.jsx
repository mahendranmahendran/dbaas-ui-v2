// BillingPage/PlanSummary.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Button, Typography, Box, Divider } from '@mui/material';

export default function PlanSummary({ plan = "Pro Plan", price = "$29/month", renewal = "May 31, 2024" }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{
      border: `1px solid ${colors.primary[600]}`,
      borderRadius: 2,
      p: 4,
      backgroundColor: colors.primary[500],
      position: 'sticky',
      top: 24
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: colors.grey[100] }}>
        Plan Summary
      </Typography>
      
      <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', mb: 2 } }}>
        <div>
          <Typography sx={{ color: colors.grey[300] }}>Current Plan:</Typography>
          <Typography sx={{ fontWeight: 'medium' }}>{plan}</Typography>
        </div>
        
        <div>
          <Typography sx={{ color: colors.grey[300] }}>Price:</Typography>
          <Typography sx={{ fontWeight: 'medium' }}>{price}</Typography>
        </div>
        
        <div>
          <Typography sx={{ color: colors.grey[300] }}>Renews:</Typography>
          <Typography sx={{ fontWeight: 'medium' }}>{renewal}</Typography>
        </div>
      </Box>
      
      <Divider sx={{ my: 3, borderColor: colors.primary[600] }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'medium', mb: 3 }}>
        <Typography>Total:</Typography>
        <Typography>{price}</Typography>
      </Box>
      
      <Button
        fullWidth
        variant="contained"
        sx={{
          backgroundColor: colors.clickhouseBlue[500],
          '&:hover': { backgroundColor: colors.clickhouseBlue[600], opacity: 0.9 },
          py: 1.5,
          mb: 2
        }}
      >
        Change Plan
      </Button>
      
      <Button
        fullWidth
        variant="outlined"
        sx={{
          borderColor: colors.primary[600],
          color: colors.grey[100],
          '&:hover': { backgroundColor: colors.primary[600] },
          py: 1.5
        }}
      >
        Cancel Subscription
      </Button>
    </Box>
  );
}