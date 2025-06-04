import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: colors.primary[400],
        p: 4,
        textAlign: 'center'
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: '6rem',
          fontWeight: 700,
          color: colors.redAccent[500],
          mb: 2
        }}
      >
        404
      </Typography>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: colors.grey[100]
        }}
      >
        Oops! Page Not Found
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: colors.grey[300],
          maxWidth: '600px'
        }}
      >
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{
          backgroundColor: colors.blueAccent[500],
          '&:hover': {
            backgroundColor: colors.blueAccent[600]
          }
        }}
      >
        Return to Home
      </Button>
    </Box>
  );
}