import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ size = 40, fullScreen = false }) => {
  const spinner = <CircularProgress size={size} />;
  
  if (fullScreen) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        {spinner}
      </Box>
    );
  }
  
  return (
    <Box display="flex" justifyContent="center" p={3}>
      {spinner}
    </Box>
  );
};

export default LoadingSpinner;