// LandingPage/FeatureGrid.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Grid } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SecurityIcon from '@mui/icons-material/Security';
import SyncIcon from '@mui/icons-material/Sync';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: <RocketLaunchIcon sx={{ fontSize: 40 }} />,
    title: "Blazing Fast",
    description: "Optimized performance for your queries"
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: "Enterprise Security",
    description: "Bank-grade encryption for your data"
  },
  {
    icon: <SyncIcon sx={{ fontSize: 40 }} />,
    title: "Real-time Sync",
    description: "Instant updates across all devices"
  }
];

export default function FeatureGrid() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{
      maxWidth: '1200px',
      mx: 'auto',
      py: 10,
      px: 4
    }}>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FeatureCard 
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}