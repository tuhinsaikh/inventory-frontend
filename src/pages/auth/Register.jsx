import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  MenuItem,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { PersonAdd as RegisterIcon } from '@mui/icons-material';
import { useNotification } from '../../context/NotificationContext';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required(),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  role: yup.string().required('Role is required'),
});

const roles = ['STAFF', 'VIEWER', 'MANAGER', 'ADMIN'];

export default function Register() {
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await register(data);
      
      // Show success message
      showNotification('Registration successful! Please login with your credentials.', 'success');
      
      // Reset form
      reset();
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      // Error is already handled in AuthContext
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Card sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <RegisterIcon sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join RetailShop Inventory System
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              {...registerField('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...registerField('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="First Name"
              margin="normal"
              {...registerField('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
            <TextField
              fullWidth
              label="Last Name"
              margin="normal"
              {...registerField('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              fullWidth
              select
              label="Role"
              margin="normal"
              {...registerField('role')}
              error={!!errors.role}
              helperText={errors.role?.message}
              defaultValue="STAFF"
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...registerField('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, py: 1.5 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Creating...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

// import React from 'react';
// import {
//   Box,
//   Card,
//   CardContent,
//   TextField,
//   Button,
//   Typography,
//   Container,
//   CircularProgress,
//   MenuItem,
//   Alert,
// } from '@mui/material';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import { useAuth } from '../../context/AuthContext';
// import { Link } from 'react-router-dom';
// import { PersonAdd as RegisterIcon } from '@mui/icons-material';

// const schema = yup.object({
//   username: yup.string().required('Username is required'),
//   email: yup.string().email('Invalid email').required('Email is required'),
//   password: yup.string().min(6, 'Password must be at least 6 characters').required(),
//   firstName: yup.string().required('First name is required'),
//   lastName: yup.string().required('Last name is required'),
//   role: yup.string().required('Role is required'),
// });

// const roles = ['STAFF', 'VIEWER', 'MANAGER', 'ADMIN'];

// export default function Register() {
//   const { register } = useAuth();
//   const {
//     register: registerField,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data) => {
//     await register(data);
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
//       <Card sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
//         <CardContent>
//           <Box sx={{ textAlign: 'center', mb: 4 }}>
//             <RegisterIcon sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }} />
//             <Typography variant="h4" gutterBottom>
//               Create Account
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Join RetailShop Inventory System
//             </Typography>
//           </Box>

//           <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
//             <TextField
//               fullWidth
//               label="Username"
//               margin="normal"
//               {...registerField('username')}
//               error={!!errors.username}
//               helperText={errors.username?.message}
//             />
//             <TextField
//               fullWidth
//               label="Email"
//               type="email"
//               margin="normal"
//               {...registerField('email')}
//               error={!!errors.email}
//               helperText={errors.email?.message}
//             />
//             <TextField
//               fullWidth
//               label="First Name"
//               margin="normal"
//               {...registerField('firstName')}
//               error={!!errors.firstName}
//               helperText={errors.firstName?.message}
//             />
//             <TextField
//               fullWidth
//               label="Last Name"
//               margin="normal"
//               {...registerField('lastName')}
//               error={!!errors.lastName}
//               helperText={errors.lastName?.message}
//             />
//             <TextField
//               fullWidth
//               select
//               label="Role"
//               margin="normal"
//               {...registerField('role')}
//               error={!!errors.role}
//               helperText={errors.role?.message}
//             >
//               {roles.map((role) => (
//                 <MenuItem key={role} value={role}>
//                   {role}
//                 </MenuItem>
//               ))}
//             </TextField>
//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               margin="normal"
//               {...registerField('password')}
//               error={!!errors.password}
//               helperText={errors.password?.message}
//             />
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               size="large"
//               sx={{ mt: 3, py: 1.5 }}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <CircularProgress size={20} sx={{ mr: 1 }} />
//                   Creating...
//                 </>
//               ) : (
//                 'Create Account'
//               )}
//             </Button>
//             <Box sx={{ mt: 2, textAlign: 'center' }}>
//               <Typography variant="body2">
//                 Already have an account?{' '}
//                 <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
//                   Sign in here
//                 </Link>
//               </Typography>
//             </Box>
//           </Box>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// }
