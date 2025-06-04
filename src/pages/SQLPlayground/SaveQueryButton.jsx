import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';

export default function SaveQueryButton() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [queryName, setQueryName] = useState('');

  const handleSave = () => {
    // Implement your save logic here
    console.log('Saving query:', queryName);
    setOpen(false);
    setQueryName('');
  };

  return (
    <>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: colors.blueAccent[500],
          '&:hover': {
            backgroundColor: colors.blueAccent[600]
          }
        }}
      >
        Save Query
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ backgroundColor: colors.primary[500], color: colors.grey[100] }}>
          Save Query
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400], pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Query Name"
            fullWidth
            variant="outlined"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            sx={{
              '& .MuiInputLabel-root': {
                color: colors.grey[300],
              },
              '& .MuiOutlinedInput-root': {
                color: colors.grey[100],
                '& fieldset': {
                  borderColor: colors.grey[700],
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[500] }}>
          <Button 
            onClick={() => setOpen(false)}
            sx={{ color: colors.grey[100] }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            sx={{ color: colors.blueAccent[400] }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}