// LandingPage/index.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box } from '@mui/material';
import HeroSection from './HeroSection';
import FeatureGrid from './FeatureGrid';
import Footer from './Footer';

export default function LandingPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: colors.primary[400],
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ flex: 1 }}>
        <HeroSection />
        <FeatureGrid />
      </Box>
      <Footer />
    </Box>
  );
}