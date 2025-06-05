import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../styles/theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay 
          error={this.state.error} 
          onReset={() => this.setState({ hasError: false, error: null })} 
        />
      );
    }

    return this.props.children;
  }
}

function ErrorDisplay({ error, onReset }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: colors.primary[400],
        padding: 3,
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        {error?.message || 'An unexpected error occurred'}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={onReset}
      >
        Try Again
      </Button>
    </Box>
  );
}

export default ErrorBoundary;
