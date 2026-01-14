import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import Layout from './components/layout/Layout';

// Lazy load pages for better performance
const Login = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Products = React.lazy(() => import('./pages/Products'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const PurchaseOrders = React.lazy(() => import('./pages/PurchaseOrders'));
const SalesOrders = React.lazy(() => import('./pages/SalesOrders'));
const Categories = React.lazy(() => import('./pages/Categories'));
const Suppliers = React.lazy(() => import('./pages/Suppliers'));
const Customers = React.lazy(() => import('./pages/Customers'));
const Users = React.lazy(() => import('./pages/Users'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Settings = React.lazy(() => import('./pages/Settings'));
// Add this import with the other lazy imports:
const Warehouses = React.lazy(() => import('./components/common/WarehouseSelect'));

const LoadingFallback = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Products Module */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<Products />} />
                <Route path="/products/:id" element={<Products />} />
                <Route path="/products/edit/:id" element={<Products />} />
                
                {/* Inventory Module */}
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/transfer" element={<Inventory />} />
                <Route path="/inventory/adjust" element={<Inventory />} />
                
                {/* Orders Module */}
                <Route path="/purchase-orders" element={<PurchaseOrders />} />
                <Route path="/purchase-orders/new" element={<PurchaseOrders />} />
                <Route path="/purchase-orders/:id" element={<PurchaseOrders />} />
                
                <Route path="/sales-orders" element={<SalesOrders />} />
                <Route path="/sales-orders/new" element={<SalesOrders />} />
                <Route path="/sales-orders/:id" element={<SalesOrders />} />
                
                {/* Master Data - Role Based Access */}
                <Route element={<RoleBasedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/customers" element={<Customers />} />
                </Route>
                
                {/* User Management - Admin Only */}
                <Route element={<RoleBasedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/new" element={<Users />} />
                  <Route path="/users/:id" element={<Users />} />
                  <Route path="/users/:id/edit" element={<Users />} />
                </Route>
                
                {/* Reports - Manager and Admin */}
                <Route element={<RoleBasedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
                  <Route path="/reports" element={<Reports />} />
                </Route>
                  {/* Warehouse Management - Admin Only */}
                  <Route path="/warehouses" element={<Warehouses />} />
                  <Route path="/warehouses/new" element={<Warehouses />} />
                  <Route path="/warehouses/:id" element={<Warehouses />} />
                  <Route path="/warehouses/edit/:id" element={<Warehouses />} />
                
                {/* Settings */}
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;