// ProfileEntry/ProgressSteps.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography } from '@mui/material';

export default function ProgressSteps({ current = 1 }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const steps = ['Account', 'Company'];
  
  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'space-between',
      position: 'relative',
      mb: 4
    }}>
      {/* Progress line */}
      <Box sx={{
        position: 'absolute',
        height: 2,
        backgroundColor: colors.primary[600],
        top: 20,
        left: 0,
        right: 0,
        zIndex: 0
      }}>
        <Box 
          sx={{
            height: '100%',
            backgroundColor: colors.blueAccent[500],
            transition: 'width 0.3s ease',
            width: `${(current - 1) * 100}%`
          }}
        />
      </Box>
      
      {steps.map((step, index) => (
        <Box key={step} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
          <Box sx={{ 
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: current > index ? colors.blueAccent[500] : colors.primary[600],
            color: current > index ? colors.grey[100] : colors.grey[300],
            fontWeight: 'medium'
          }}>
            {index + 1}
          </Box>
          <Typography 
            sx={{ 
              mt: 1,
              fontSize: '0.875rem',
              fontWeight: current === index + 1 ? 'medium' : 'normal',
              color: colors.grey[100]
            }}
          >
            {step}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}