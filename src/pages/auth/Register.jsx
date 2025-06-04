// pages/auth/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { useAuth } from '../../utils/hooks/useAuth';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function Register() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    register(formData.name, formData.email, formData.password);
    navigate('/');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: colors.primary[400],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        width: 400,
        p: 4,
        backgroundColor: colors.primary[500],
        borderRadius: 2,
        boxShadow: 3
      }}>
        <Typography variant="h4" sx={{ 
          mb: 3,
          color: colors.grey[100],
          textAlign: 'center'
        }}>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              style: { color: colors.grey[100] }
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              style: { color: colors.grey[100] }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              style: { color: colors.grey[100] }
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            sx={{ mb: 3 }}
            InputProps={{
              style: { color: colors.grey[100] }
            }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: colors.clickhouseBlue[500],
              '&:hover': {
                backgroundColor: colors.clickhouseBlue[600],
                opacity: 0.9
              }
            }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Box>
  );
}
