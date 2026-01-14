import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function to get permissions by role
  const getPermissionsByRole = useCallback((role) => {
    const permissions = {
      ADMIN: ['dashboard', 'products', 'inventory', 'orders', 'suppliers', 'customers', 'reports', 'users', 'settings'],
      MANAGER: ['dashboard', 'products', 'inventory', 'orders', 'suppliers', 'customers', 'reports'],
      STAFF: ['dashboard', 'products', 'inventory', 'orders'],
      VIEWER: ['dashboard', 'products', 'inventory']
    };
    return permissions[role] || permissions.VIEWER;
  }, []);

  // Function to extract and format user data from token
  const extractUserFromToken = useCallback((decodedToken, responseData = null) => {
    if (!decodedToken) return null;
    
    console.log('Extracting user from token:', decodedToken);
    
    // Extract username from token
    const username = decodedToken.sub || decodedToken.username || 'Guest';
    
    // Extract role - default to ADMIN for testing
    // In production, this should come from your backend response
    let role = 'ADMIN'; // Hardcoded for testing
    
    // If we have response data, try to get role from there
    if (responseData?.role) {
      role = responseData.role;
    } else if (responseData?.data?.role) {
      role = responseData.data.role;
    }
    
    // Create properly formatted user object
    const formattedUser = {
      id: decodedToken.sub || username,
      username: username,
      email: decodedToken.email || `${username}@example.com`,
      firstName: username.charAt(0).toUpperCase() + username.slice(1), // Capitalize first letter
      lastName: '',
      role: role.toUpperCase(),
      permissions: getPermissionsByRole(role.toUpperCase()),
      // Keep original token data for reference
      tokenData: decodedToken
    };
    
    console.log('Formatted user:', formattedUser);
    return formattedUser;
  }, [getPermissionsByRole]);

  const decodeToken = useCallback((tokenString) => {
    if (!tokenString) return null;
  
    try {
      const parts = tokenString.split('.');
      console.log(`Token parts: ${parts.length}`, parts);
      
      // STRATEGY 1: Find and parse any JSON object in the token
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.startsWith('{') && part.endsWith('}')) {
          try {
            const parsed = JSON.parse(part);
            // Check if it looks like JWT payload (has sub, iat, exp)
            if (parsed.sub && parsed.iat && parsed.exp) {
              console.log(`Found payload in part ${i}:`, parsed);
              return parsed;
            }
          } catch (e) {
            // Not valid JSON, continue
          }
        }
      }
      
      // STRATEGY 2: Try to decode base64 parts
      for (let i = 0; i < parts.length; i++) {
        try {
          const part = parts[i];
          // Skip if it's clearly not base64 (contains { or })
          if (part.includes('{') || part.includes('}')) continue;
          
          const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
          const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
          const decoded = atob(paddedBase64);
          
          // Try to parse as JSON
          const parsed = JSON.parse(decoded);
          if (parsed.sub && parsed.iat && parsed.exp) {
            console.log(`Found base64 payload in part ${i}:`, parsed);
            return parsed;
          }
        } catch (e) {
          // Not base64 or not JSON, continue
        }
      }
      
      console.error('Could not decode token in any format');
      return null;
      
    } catch (error) {
      console.error('Manual decode failed:', error.message);
      return null;
    }
  }, []);
  
  useEffect(() => {
    if (token) {
      console.log('Initial token from localStorage:', token ? 'exists' : 'null');
      const decoded = decodeToken(token);
      if (decoded) {
        // Use extractUserFromToken to format the user properly
        const formattedUser = extractUserFromToken(decoded);
        if (formattedUser) {
          setUser(formattedUser);
          localStorage.setItem('user', JSON.stringify(formattedUser));
          authService.setAuthToken(token);
          console.log('User set from token (formatted):', formattedUser);
        } else {
          console.log('Failed to format user from token');
          logout();
        }
      } else {
        console.log('Invalid token in localStorage, clearing...');
        logout();
      }
    }
    setLoading(false);
  }, [token, decodeToken, extractUserFromToken]);

  const login = async (credentials) => {
    console.log('Login attempt with credentials:', { ...credentials, password: '***' });
    
    try {
      const response = await authService.login(credentials);
      console.log('Login response:', response);
      console.log('Response data:', response.data);
      
      // Debug: Log the entire response structure
      console.log('Response keys:', Object.keys(response));
      console.log('Response.data keys:', response.data ? Object.keys(response.data) : 'no data');
      
      // Try to extract token from different possible locations
      let token;
      
      if (response.data) {
        // Check multiple possible token locations
        if (response.data.token) {
          token = response.data.token;
          console.log('Token found at: response.data.token');
        } else if (response.data.access_token) {
          token = response.data.access_token;
          console.log('Token found at: response.data.access_token');
        } else if (response.data.accessToken) {
          token = response.data.accessToken;
          console.log('Token found at: response.data.accessToken');
        } else if (response.data.jwt) {
          token = response.data.jwt;
          console.log('Token found at: response.data.jwt');
        } else if (typeof response.data === 'string') {
          token = response.data;
          console.log('Token is the entire response.data as string');
        } else if (response.data.data && response.data.data.token) {
          token = response.data.data.token;
          console.log('Token found at: response.data.data.token');
        } else {
          // No token found, log what we have
          console.log('No token found. Response.data:', JSON.stringify(response.data, null, 2));
          throw new Error('No authentication token found in response');
        }
      }
      
      console.log('Extracted token:', token ? `${token.substring(0, 50)}...` : 'null');
      console.log('Token length:', token?.length);
      console.log('Token starts with:', token?.substring(0, 20));
      
      if (!token || typeof token !== 'string') {
        console.error('Invalid token received:', token);
        throw new Error('Invalid authentication token received');
      }
      
      // Decode and validate token
      const decoded = decodeToken(token);
      if (!decoded) {
        console.error('Failed to decode token. Token value:', token);
        throw new Error('Failed to decode authentication token');
      }
      
      console.log('Token decoded successfully. Payload:', decoded);
      
      // Store token
      localStorage.setItem('token', token);
      setToken(token);
      
      // Create properly formatted user object using extractUserFromToken
      const formattedUser = extractUserFromToken(decoded, response.data);
      if (!formattedUser) {
        console.error('Failed to create user object from decoded token');
        throw new Error('Failed to create user session');
      }
      
      // Store formatted user
      setUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      console.log('User set (formatted):', formattedUser);
      
      navigate('/dashboard');
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error stack:', error.stack);
      
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        throw new Error(error.response.data?.message || `Login failed (${error.response.status})`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('Network error. Please check your connection and ensure backend is running.');
      } else {
        throw error;
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Registration failed');
      } else if (error.request) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw error;
      }
    }
  };


// const register = async (userData) => {
//   try {
//     const response = await authService.register(userData);
    
//     // Show success notification
//     showNotification('Registration successful! Please login with your credentials.', 'success');
    
//     // Navigate to login page after a short delay
//     setTimeout(() => {
//       navigate('/login');
//     }, 1500);
    
//     return response;
//   } catch (error) {
//     showNotification(
//       error.response?.data?.message || 'Registration failed',
//       'error'
//     );
//     throw error;
//   }
// };

  const logout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    authService.clearAuthToken();
    navigate('/login');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(user?.id, userData);
      setUser({ ...user, ...userData });
      localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    
    // Extract role from user object
    const userRole = user.role || user.authorities?.[0]?.authority?.replace('ROLE_', '') || 'VIEWER';
    
    console.log('Checking permission. User role:', userRole, 'Required role:', requiredRole);
    
    const roleHierarchy = {
      VIEWER: ['VIEWER'],
      STAFF: ['VIEWER', 'STAFF'],
      MANAGER: ['VIEWER', 'STAFF', 'MANAGER'],
      ADMIN: ['VIEWER', 'STAFF', 'MANAGER', 'ADMIN']
    };

    const hasPerm = roleHierarchy[userRole]?.includes(requiredRole) || false;
    console.log('Permission granted:', hasPerm);
    
    return hasPerm;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    hasPermission,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
