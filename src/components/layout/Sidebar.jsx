import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar,
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ProductsIcon,
  LocalShipping as OrdersIcon,
  People as PeopleIcon,
  BarChart as ReportsIcon,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  Store as WarehouseIcon,
  Assignment as PurchaseIcon,
  Receipt as SalesIcon,
  Person as PersonIcon,
  Group as UsersIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ open = true, onClose }) => {  // DEFAULT TO TRUE
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Debug logs
  useEffect(() => {
    console.log('=== SIDEBAR VISIBILITY DEBUG ===');
    console.log('Sidebar open prop:', open);
    console.log('Sidebar is actually open?', open === true);
    console.log('User object:', user);
    console.log('Number of nav items will be calculated...');
  }, [user, open]);

  const [expandedMenus, setExpandedMenus] = useState({
    inventory: false,
    orders: false,
  });

  const handleMenuClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Navigation items based on user role
  const getNavItems = () => {
    console.log('Generating nav items for user:', user?.username);
    
    const baseItems = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
        requiredPermission: 'dashboard'
      },
      {
        text: 'Products',
        icon: <ProductsIcon />,
        path: '/products',
        requiredPermission: 'products'
      },
    ];

    // Inventory submenu
    const inventoryItems = [
      {
        text: 'Stock Overview',
        icon: <InventoryIcon />,
        path: '/inventory',
        requiredPermission: 'inventory'
      },
      {
        text: 'Warehouses',
        icon: <WarehouseIcon />,
        path: '/warehouses',
        requiredPermission: 'inventory'
      },
      {
        text: 'Low Stock Alerts',
        icon: <InventoryIcon />,
        path: '/inventory/alerts',
        requiredPermission: 'inventory'
      },
    ];

    // Orders submenu
    const orderItems = [
      {
        text: 'Purchase Orders',
        icon: <PurchaseIcon />,
        path: '/orders/purchase',
        requiredPermission: 'orders'
      },
      {
        text: 'Sales Orders',
        icon: <SalesIcon />,
        path: '/orders/sales',
        requiredPermission: 'orders'
      },
    ];

    const additionalItems = [
      {
        text: 'Inventory',
        icon: <InventoryIcon />,
        path: null,
        children: inventoryItems,
        requiredPermission: 'inventory'
      },
      {
        text: 'Orders',
        icon: <OrdersIcon />,
        path: null,
        children: orderItems,
        requiredPermission: 'orders'
      },
      {
        text: 'Suppliers',
        icon: <PeopleIcon />,
        path: '/suppliers',
        requiredPermission: 'suppliers'
      },
      {
        text: 'Customers',
        icon: <PersonIcon />,
        path: '/customers',
        requiredPermission: 'customers'
      },
      {
        text: 'Reports',
        icon: <ReportsIcon />,
        path: '/reports',
        requiredPermission: 'reports'
      },
    ];

    // Admin only items
    const adminItems = [
      {
        text: 'Users',
        icon: <UsersIcon />,
        path: '/users',
        requiredPermission: 'users'
      },
      {
        text: 'Settings',
        icon: <SettingsIcon />,
        path: '/settings',
        requiredPermission: 'settings'
      },
    ];

    // Combine items based on user permissions
    let items = [...baseItems];
    
    // Check if user has permission for each item
    if (user?.permissions?.includes('inventory')) {
      items.push(additionalItems[0]);
    }
    if (user?.permissions?.includes('orders')) {
      items.push(additionalItems[1]);
    }
    if (user?.permissions?.includes('suppliers')) {
      items.push(additionalItems[2]);
    }
    if (user?.permissions?.includes('customers')) {
      items.push(additionalItems[3]);
    }
    if (user?.permissions?.includes('reports')) {
      items.push(additionalItems[4]);
    }
    
    // Admin items
    if (user?.role === 'ADMIN') {
      items = [...items, ...adminItems];
    }

    console.log('Generated nav items:', items.length, 'items');
    return items;
  };

  const navItems = getNavItems();

  const isActive = (path) => {
    return location.pathname === path || 
           (path && location.pathname.startsWith(path));
  };

  const renderNavItem = (item, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.text?.toLowerCase()];
    const isItemActive = isActive(item.path);

    return (
      <React.Fragment key={item.text}>
        <ListItem
          button
          onClick={() => {
            if (hasChildren) {
              toggleMenu(item.text?.toLowerCase());
            } else if (item.path) {
              handleMenuClick(item.path);
            }
          }}
          sx={{
            pl: depth * 2 + 2,
            bgcolor: isItemActive ? 'primary.light' : 'transparent',
            color: isItemActive ? 'primary.contrastText' : 'text.primary',
            '&:hover': {
              bgcolor: isItemActive ? 'primary.main' : 'action.hover',
            },
            mb: 0.5,
          }}
        >
          <ListItemIcon sx={{ 
            color: isItemActive ? 'primary.contrastText' : 'action.active',
            minWidth: 40 
          }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.text} 
            primaryTypographyProps={{
              fontWeight: isItemActive ? 'bold' : 'normal'
            }}
          />
          {hasChildren && (
            isExpanded ? <ExpandLess /> : <ExpandMore />
          )}
        </ListItem>
        
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  // Force render even if open is undefined/false for debugging
  console.log('Rendering Sidebar. Open prop value:', open);
  
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={true} // FORCE OPEN for testing
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '3px solid #f00 !important', // Bright red border
          backgroundColor: '#ffffff !important',
          zIndex: 9999,
          position: 'fixed',
          height: '100vh',
          top: 0,
          left: 0,
          boxShadow: '5px 0 15px rgba(0,0,0,0.3)',
        },
      }}
    >
      {/* User Profile Section - with bright colors */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        borderBottom: '3px solid #00f !important',
        backgroundColor: '#e3f2fd !important',
      }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'red !important',
            mr: 2,
            border: '3px solid green !important',
          }}
        >
          {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'G'}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold" color="error">
            {user ? `${user.firstName} ${user.lastName}`.trim() || user.username : 'Guest'}
          </Typography>
          <Typography variant="caption" color="primary">
            {user?.role ? user.role.charAt(0) + user.role.slice(1).toLowerCase() : 'No Role'}
          </Typography>
        </Box>
        {onClose && (
          <Tooltip title="Collapse sidebar">
            <IconButton onClick={onClose} size="small">
              <ChevronLeft />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Navigation Menu */}
      {navItems.length > 0 ? (
        <List sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          py: 1, 
          border: '2px solid #0f0 !important',
          backgroundColor: '#f9f9f9',
        }}>
          {navItems.map(item => renderNavItem(item))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center', border: '2px solid orange' }}>
          <Typography color="error" fontWeight="bold">
            No navigation items available
          </Typography>
        </Box>
      )}

      {/* Logout Section */}
      <Divider sx={{ borderColor: 'purple !important', borderWidth: '2px !important' }} />
      {/* <List sx={{ backgroundColor: '#fff3e0' }}>
        <ListItem 
          button 
          onClick={logout}
          sx={{
            '&:hover': {
              bgcolor: 'error.light',
            },
            border: '2px solid #ff9800',
          }}
        >
          <ListItemIcon>
            <ChevronRight />
          </ListItemIcon>
          <ListItemText 
            primary="LOGOUT" 
            primaryTypographyProps={{ fontWeight: 'bold', color: 'error.main' }}
          />
        </ListItem>
      </List> */}
      
      {/* Debug info */}
      <Box sx={{ 
        p: 1, 
        backgroundColor: '#000', 
        color: '#0f0',
        fontSize: '10px',
        fontFamily: 'monospace'
      }}>
        <div>Sidebar: VISIBLE</div>
        <div>User: {user?.username || 'None'}</div>
        <div>Items: {navItems.length}</div>
        <div>Open prop: {String(open)}</div>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
