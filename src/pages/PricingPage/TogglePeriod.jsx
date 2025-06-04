// PricingPage/TogglePeriod.jsx
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography, Switch } from '@mui/material';

export default function TogglePeriod() {
  const [isAnnual, setIsAnnual] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      my: 4
    }}>
      <Typography 
        sx={{ 
          mr: 2,
          fontWeight: !isAnnual ? 'bold' : 'normal',
          color: !isAnnual ? colors.blueAccent[500] : colors.grey[300]
        }}
      >
        Monthly
      </Typography>
      
      <Switch
        checked={isAnnual}
        onChange={() => setIsAnnual(!isAnnual)}
        sx={{
          '& .MuiSwitch-thumb': {
            backgroundColor: colors.grey[100]
          },
          '& .MuiSwitch-track': {
            backgroundColor: colors.primary[600]
          },
          '& .Mui-checked': {
            '& .MuiSwitch-thumb': {
              backgroundColor: colors.grey[100]
            },
            '& + .MuiSwitch-track': {
              backgroundColor: colors.blueAccent[500]
            }
          }
        }}
      />
      
      <Typography 
        sx={{ 
          ml: 2,
          fontWeight: isAnnual ? 'bold' : 'normal',
          color: isAnnual ? colors.blueAccent[500] : colors.grey[300],
          '& span': {
            color: colors.greenAccent[500],
            fontSize: '0.875rem',
            ml: 0.5
          }
        }}
      >
        Annual <span>(Save 20%)</span>
      </Typography>
    </Box>
  );
}