import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';

export default function QueryEditor() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [query, setQuery] = useState('');

  return (
    <Box sx={{ 
      backgroundColor: colors.primary[500],
      borderRadius: '4px',
      p: 3,
      height: '500px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h6" sx={{ mb: 2, color: colors.grey[100] }}>
        SQL Editor
      </Typography>
      <TextField
        multiline
        fullWidth
        minRows={15}
        maxRows={15}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your SQL query here..."
        sx={{
          flexGrow: 1,
          '& .MuiInputBase-root': {
            height: '100%',
            alignItems: 'flex-start',
            color: colors.grey[100],
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.grey[700],
            },
            '&:hover fieldset': {
              borderColor: colors.grey[600],
            },
          },
        }}
      />
    </Box>
  );
}