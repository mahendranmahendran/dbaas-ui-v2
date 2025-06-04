// PricingPage/PricingCard.jsx
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography, Button, List, ListItem, ListItemIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function PricingCard({ name, price, features }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box sx={{
      backgroundColor: colors.primary[500],
      border: `2px solid ${colors.blueAccent[500]}`,
      borderRadius: 2,
      p: 4,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.3s ease',
      '&:hover': {
        boxShadow: `0 10px 20px ${colors.primary[600]}`
      }
    }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold',
        color: colors.grey[100]
      }}>
        {name}
      </Typography>
      
      <Typography variant="h2" sx={{ 
        my: 3,
        color: colors.greenAccent[500],
        '& span': {
          fontSize: '1.5rem',
          ml: 0.5
        }
      }}>
        {price}<span>/month</span>
      </Typography>
      
      <List sx={{ flexGrow: 1 }}>
        {features.map((feature) => (
          <ListItem key={feature} sx={{ px: 0, py: 1 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckCircleIcon sx={{ color: colors.greenAccent[500] }} />
            </ListItemIcon>
            <Typography sx={{ color: colors.grey[300] }}>{feature}</Typography>
          </ListItem>
        ))}
      </List>
      
      <Button
        fullWidth
        sx={{
          mt: 3,
          backgroundColor: colors.blueAccent[500],
          color: colors.grey[100],
          py: 1.5,
          '&:hover': {
            backgroundColor: colors.blueAccent[500],
            opacity: 0.9
          }
        }}
      >
        Select Plan
      </Button>
    </Box>
  );
}