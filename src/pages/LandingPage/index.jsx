// LandingPage/index.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box } from '@mui/material';
import HeroSection from './HeroSection';
import FeatureGrid from './FeatureGrid';

export default function LandingPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: colors.primary[400]
    }}>
      <HeroSection />
      <FeatureGrid />
    </Box>
  );
}