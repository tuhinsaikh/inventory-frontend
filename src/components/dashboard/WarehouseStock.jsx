import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Grid
} from '@mui/material';
import { Warehouse, Inventory, Warning } from '@mui/icons-material';

// Sample warehouse data
const warehouses = [
  { id: 1, name: 'Main Warehouse', location: 'Kolkata', capacity: 1000, currentStock: 750, lowStockItems: 5 },
  { id: 2, name: 'Delhi Branch', location: 'Delhi', capacity: 500, currentStock: 320, lowStockItems: 12 },
  { id: 3, name: 'Mumbai Storage', location: 'Mumbai', capacity: 800, currentStock: 200, lowStockItems: 8 },
  { id: 4, name: 'Chennai Outlet', location: 'Chennai', capacity: 300, currentStock: 290, lowStockItems: 2 },
];

export const WarehouseStock = () => {
  const getUtilizationPercentage = (current, capacity) => (current / capacity) * 100;
  const getUtilizationColor = (percentage) => {
    if (percentage > 90) return 'error';
    if (percentage > 75) return 'warning';
    return 'success';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Warehouse Stock Overview"
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <Grid container spacing={3}>
          {warehouses.map((warehouse) => {
            const utilization = getUtilizationPercentage(warehouse.currentStock, warehouse.capacity);
            return (
              <Grid item xs={12} sm={6} key={warehouse.id}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Warehouse sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      {warehouse.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {warehouse.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Inventory fontSize="small" color="action" />
                      <Typography variant="body2">
                        {warehouse.currentStock} / {warehouse.capacity} units
                      </Typography>
                    </Box>
                    
                    {warehouse.lowStockItems > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Warning fontSize="small" color="warning" />
                        <Typography variant="body2" color="warning.main">
                          {warehouse.lowStockItems} low stock
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={utilization} 
                      sx={{ 
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getUtilizationColor(utilization) === 'error' ? '#f44336' :
                                         getUtilizationColor(utilization) === 'warning' ? '#ff9800' : '#4caf50'
                        }
                      }}
                    />
                    <Typography variant="body2" fontWeight="medium">
                      {utilization.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WarehouseStock;