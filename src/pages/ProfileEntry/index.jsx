import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../styles/theme';
import { Box, Button, TextField, Typography } from '@mui/material';
import AvatarUpload from './AvatarUpload';
import ProgressSteps from './ProgressSteps';

export default function ProfileEntry() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    avatar: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
  };

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: colors.primary[400],
      p: 4
    }}>
      <Box sx={{
        maxWidth: '600px',
        mx: 'auto',
        backgroundColor: colors.primary[500],
        borderRadius: 2,
        p: 4
      }}>
        <Typography variant="h4" sx={{ 
          mb: 4,
          color: colors.grey[100],
          textAlign: 'center'
        }}>
          Complete Your Profile
        </Typography>

        <ProgressSteps current={step} />
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Box>
              <AvatarUpload />
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 3 }}
                InputProps={{
                  style: { color: colors.grey[100] }
                }}
              />
            </Box>
          )}
          
          {step === 2 && (
            <TextField
              fullWidth
              label="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              sx={{ mb: 3 }}
              InputProps={{
                style: { color: colors.grey[100] }
              }}
            />
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            {step > 1 && (
              <Button
                onClick={() => setStep(step - 1)}
                variant="outlined"
                sx={{
                  color: colors.grey[100],
                  borderColor: colors.grey[700]
                }}
              >
                Back
              </Button>
            )}
            <Button
              variant="contained"
              type={step === 2 ? 'submit' : 'button'}
              onClick={() => step < 2 && setStep(step + 1)}
              sx={{
                ml: 'auto',
                backgroundColor: colors.clickhouseBlue[500],
                '&:hover': { backgroundColor: colors.clickhouseBlue[600] }
              }}
            >
              {step === 2 ? 'Complete Setup' : 'Next'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}