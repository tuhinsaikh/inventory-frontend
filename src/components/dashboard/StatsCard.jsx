import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  SvgIcon 
} from '@mui/material';
import {
  ShoppingCart, // Products
  Warning, // Low stock
  LocalShipping, // Purchase orders
  Store, // Sales orders
  AttachMoney // Today's sales
} from '@mui/icons-material';

const iconMap = {
  products: ShoppingCart,
  lowStock: Warning,
  purchaseOrders: LocalShipping,
  salesOrders: Store,
  todaySales: AttachMoney
};

const colorMap = {
  products: '#1976d2', // Blue
  lowStock: '#ed6c02', // Orange/Warning
  purchaseOrders: '#2e7d32', // Green
  salesOrders: '#9c27b0', // Purple
  todaySales: '#d32f2f' // Red
};

export const StatsCard = ({ title, value, subtitle, type, trend }) => {
  const IconComponent = iconMap[type] || ShoppingCart;
  const iconColor = colorMap[type] || '#1976d2';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" fontWeight="medium">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: trend.value >= 0 ? 'success.main' : 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  mt: 0.5
                }}
              >
                {trend.value >= 0 ? '↗' : '↘'} {Math.abs(trend.value)}% {trend.label}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${iconColor}15`, // 15 = ~10% opacity
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SvgIcon
              component={IconComponent}
              sx={{ color: iconColor, fontSize: 28 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;