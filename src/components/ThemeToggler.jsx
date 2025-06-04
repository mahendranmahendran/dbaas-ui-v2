import { IconButton } from '@mui/material';
import { useContext } from 'react';
import { ColorModeContext } from '../styles/theme';
import { LightModeOutlined, DarkModeOutlined } from '@mui/icons-material';

export default function ThemeToggler() {
  const colorMode = useContext(ColorModeContext);

  return (
    <IconButton 
      onClick={colorMode.toggleColorMode}
      color="inherit"
      sx={{ ml: 1 }}
    >
      {colorMode.mode === 'dark' ? (
        <LightModeOutlined />
      ) : (
        <DarkModeOutlined />
      )}
    </IconButton>
  );
}