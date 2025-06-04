// BillingPage/PaymentMethod.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography, Radio, Button } from '@mui/material';
import PlusIcon from './PlusIcon';

export default function PaymentMethod() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{
      border: `1px solid ${colors.primary[600]}`,
      borderRadius: 2,
      p: 4,
      backgroundColor: colors.primary[500]
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'semibold', color: colors.grey[100] }}>
        Payment Method
      </Typography>
      
      <Box sx={{ '& > *': { mb: 2 } }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          border: `1px solid ${colors.primary[600]}`,
          borderRadius: 1,
          p: 3
        }}>
          <Radio defaultChecked sx={{ color: colors.clickhouseBlue[500] }} />
          <Box sx={{ ml: 2 }}>
            <Typography>Credit Card</Typography>
            <Typography sx={{ fontSize: 14, color: colors.grey[300] }}>
              Visa •••• 4242
            </Typography>
          </Box>
        </Box>
        
        <Button
          startIcon={<PlusIcon sx={{ color: colors.clickhouseBlue[500] }} />}
          sx={{
            color: colors.clickhouseBlue[500],
            '&:hover': { backgroundColor: 'transparent' }
          }}
        >
          Add New Payment Method
        </Button>
      </Box>
    </Box>
  );
}