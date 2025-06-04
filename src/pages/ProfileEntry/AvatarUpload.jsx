// ProfileEntry/AvatarUpload.jsx
import { useState, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Typography, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

export default function AvatarUpload() {
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
      <Box
        sx={{
          position: 'relative',
          width: 96,
          height: 96,
          borderRadius: '50%',
          backgroundColor: colors.primary[600],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.9
          }
        }}
        onClick={() => fileInputRef.current.click()}
      >
        {avatar ? (
          <Box
            component="img"
            src={avatar}
            alt="Avatar"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <PersonIcon sx={{ fontSize: 48, color: colors.grey[300] }} />
        )}
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: 'none' }}
        accept="image/*"
      />
      <Button
        onClick={() => fileInputRef.current.click()}
        sx={{
          mt: 1,
          color: colors.blueAccent[500],
          '&:hover': {
            backgroundColor: 'transparent',
            color: colors.blueAccent[400]
          }
        }}
      >
        {avatar ? 'Change Avatar' : 'Upload Avatar'}
      </Button>
    </Box>
  );
}