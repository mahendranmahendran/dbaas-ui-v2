// PricingPage/index.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography, Grid } from '@mui/material';
import PricingCard from './PricingCard';
import TogglePeriod from './TogglePeriod';

export default function PricingPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const plans = [
    {
      name: "Starter",
      price: "$0",
      features: ["5GB Storage", "Basic Support", "Up to 3 Users"]
    },
    {
      name: "Pro",
      price: "$29",
      features: ["50GB Storage", "Priority Support", "Unlimited Users"]
    }
  ];

  return (
    <Box sx={{ 
      maxWidth: '1200px',
      mx: 'auto',
      py: 8,
      px: 4,
      backgroundColor: colors.primary[400],
      minHeight: 'calc(100vh - 64px)'
    }}>
      <Typography variant="h3" sx={{ 
        textAlign: 'center',
        mb: 6,
        fontWeight: 'bold',
        color: colors.grey[100]
      }}>
        Choose Your Plan
      </Typography>
      
      <TogglePeriod />
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} key={plan.name}>
            <PricingCard {...plan} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}