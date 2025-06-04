// LandingPage/FeatureCard.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography } from '@mui/material';

export default function FeatureCard({ icon, title, description }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{
      backgroundColor: colors.primary[500],
      p: 4,
      borderRadius: 2,
      height: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Box sx={{ 
        width: 80,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary[400],
        borderRadius: '50%',
        mb: 3,
        color: colors.greenAccent[500]
      }}>
        {icon}
      </Box>
      <Typography variant="h5" sx={{ 
        mb: 2,
        fontWeight: 'semibold',
        color: colors.greenAccent[500]
      }}>
        {title}
      </Typography>
      <Typography sx={{ color: colors.grey[300] }}>
        {description}
      </Typography>
    </Box>
  );
}