import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Warehouse as InventoryIcon,
  ShoppingCart as PurchaseIcon,
  PointOfSale as SalesIcon,
  Category as CategoryIcon,
  Person as UserIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  LocalShipping as SupplierIcon,
  Group as CustomerIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: ['ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
  },
  {
    title: 'Products',
    icon: <ProductsIcon />,
    path: '/products',
    roles: ['ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
  },
  {
    title: 'Inventory',
    icon: <InventoryIcon />,
    path: '/inventory',
    roles: ['ADMIN', 'MANAGER', 'STAFF', 'VIEWER'],
  },
  {
    title: 'Purchase Orders',
    icon: <PurchaseIcon />,
    path: '/purchase-orders',
    roles: ['ADMIN', 'MANAGER', 'STAFF'],
  },
  {
    title: 'Sales Orders',
    icon: <SalesIcon />,
    path: '/sales-orders',
    roles: ['ADMIN', 'MANAGER', 'STAFF'],
  },
  { type: 'divider' },
  {
    title: 'Categories',
    icon: <CategoryIcon />,
    path: '/categories',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    title: 'Suppliers',
    icon: <SupplierIcon />,
    path: '/suppliers',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    title: 'Customers',
    icon: <CustomerIcon />,
    path: '/customers',
    roles: ['ADMIN', 'MANAGER'],
  },
  { type: 'divider' },
  {
    title: 'Users',
    icon: <UserIcon />,
    path: '/users',
    roles: ['ADMIN'],
  },
  {
    title: 'Reports',
    icon: <ReportIcon />,
    path: '/reports',
    roles: ['ADMIN', 'MANAGER'],
  },
  {
    title: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    roles: ['ADMIN', 'MANAGER', 'STAFF'],
  },
];

const Sidebar = ({ mobileOpen, onDrawerToggle, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const drawer = (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          RetailShop
        </Typography>
        <Chip label={userRole || 'Guest'} color="primary" size="small" />
      </Box>
      <Divider />
      <List>
        {menuItems.map((item, index) => {
          if (item.type === 'divider') {
            return <Divider key={`divider-${index}`} sx={{ my: 1 }} />;
          }

          if (!item.roles.includes(userRole)) {
            return null;
          }

          const isActive = location.pathname === item.path || 
            location.pathname.startsWith(item.path + '/');

          return (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;