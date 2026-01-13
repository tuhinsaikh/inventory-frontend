import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function RoleBasedRoute({ allowedRoles }) {
  const { user, hasPermission } = useAuth();

  // Check if user has any of the allowed roles
  const hasAccess = allowedRoles.some(role => hasPermission(role));

  if (!hasAccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          p: 3,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have permission to access this page. Required roles:{' '}
          {allowedRoles.join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Your current role: {user?.role}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.history.back()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return <Outlet />;
}