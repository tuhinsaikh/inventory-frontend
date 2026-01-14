import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouteLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Register from '../auth/Register';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      showSuccess('Login successful!');
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      showError(errorMessage);
      setFormError('password', { type: 'manual', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    const demoCredentials = {
      admin: { username: 'admin', password: 'admin123' },
      manager: { username: 'manager', password: 'manager123' },
      staff: { username: 'staff', password: 'staff123' },
      viewer: { username: 'viewer', password: 'viewer123' },
    };
    
    const credentials = demoCredentials[role];
    setLoading(true);
    
    try {
      await login(credentials);
      showSuccess(`Logged in as ${role}`);
    } catch (err) {
      showError(`Demo login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Inventory Management</title>
      </Helmet>

      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 2,
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                Retail Inventory Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Username or Email"
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {/* <Link component={Register} to="/register" variant="body2">
                  Don't have an account? Sign up
                </Link> */}
                <Link component={RouteLink} to="/register" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Box>

              <Divider sx={{ my: 3 }}>OR</Divider>

              <Typography variant="body2" color="text.secondary" gutterBottom textAlign="center">
                Demo Accounts
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {['admin', 'manager', 'staff', 'viewer'].map((role) => (
                  <Button
                    key={role}
                    variant="outlined"
                    size="small"
                    onClick={() => handleDemoLogin(role)}
                    sx={{ textTransform: 'capitalize' }}
                    disabled={loading}
                  >
                    {role}
                  </Button>
                ))}
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </>
  );
}