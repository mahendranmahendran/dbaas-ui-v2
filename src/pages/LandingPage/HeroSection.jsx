// LandingPage/HeroSection.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography, Button } from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';

export default function HeroSection() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{
      py: 10,
      px: 4,
      maxWidth: '900px',
      mx: 'auto',
      textAlign: 'center'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <DnsIcon sx={{ 
          fontSize: 64,
          color: colors.clickhouseBlue[500],
          opacity: 0.7
        }} />
        <DnsIcon sx={{ 
          fontSize: 80,
          color: colors.clickhouseBlue[500]
        }} />
        <DnsIcon sx={{ 
          fontSize: 64,
          color: colors.clickhouseBlue[500],
          opacity: 0.7
        }} />
      </Box>
      
      <Typography variant="h2" sx={{ 
        mb: 3,
        fontWeight: 'bold',
        color: colors.grey[100]
      }}>
        ClickHouse DBaaS
      </Typography>
      
      <Typography variant="h5" sx={{ 
        mb: 5,
        color: colors.grey[300],
        maxWidth: '700px',
        mx: 'auto'
      }}>
        The fastest open-source analytical database as a service
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: colors.clickhouseBlue[500],
          '&:hover': { backgroundColor: colors.clickhouseBlue[600], opacity: 0.9 },
          px: 4,
          py: 1.5
        }}
      >
        Get Started
      </Button>
    </Box>
  );
}