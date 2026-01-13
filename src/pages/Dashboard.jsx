import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  Avatar,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  ShoppingCart as CartIcon,
  People as PeopleIcon,
  LocalShipping as ShippingIcon,
  TrendingUp,
  Warning,
  Refresh,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { dashboardService } from '../services/dashboardService';
import StatsCard from '../components/dashboard/StatsCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { useNotification } from '../context/NotificationContext';

export default function Dashboard() {
  const { showNotification } = useNotification();
  const [timeRange, setTimeRange] = useState('week');

  const { data: dashboardData, isLoading, error, refetch } = useQuery(
    ['dashboard', timeRange],
    () => dashboardService.getDashboardStats(timeRange),
    {
      refetchInterval: 30000, // Auto-refresh every 30 seconds
    }
  );

  useEffect(() => {
    if (error) {
      showNotification('Failed to load dashboard data', 'error');
    }
  }, [error, showNotification]);

  const stats = [
    {
      title: 'Total Products',
      value: dashboardData?.totalProducts || 0,
      icon: <InventoryIcon />,
      color: 'primary',
      change: '+12%',
    },
    {
      title: 'Pending Orders',
      value: dashboardData?.pendingOrders || 0,
      icon: <CartIcon />,
      color: 'warning',
      change: '+5%',
    },
    {
      title: 'Total Customers',
      value: dashboardData?.totalCustomers || 0,
      icon: <PeopleIcon />,
      color: 'success',
      change: '+8%',
    },
    {
      title: 'Today\'s Sales',
      value: `$${dashboardData?.todaysSales?.toLocaleString() || 0}`,
      icon: <TrendingUp />,
      color: 'info',
      change: '+15%',
    },
  ];

  const lowStockItems = dashboardData?.lowStockItems || [];

  return (
    <>
      <Helmet>
        <title>Dashboard - Inventory Management</title>
      </Helmet>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => refetch()}
              sx={{ mr: 2 }}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {isLoading ? (
          <LinearProgress />
        ) : (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} mb={4}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <StatsCard {...stat} />
                </Grid>
              ))}
            </Grid>

            {/* Main Content */}
            <Grid container spacing={3}>
              {/* Sales Chart */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Sales Overview</Typography>
                    <Box>
                      {['day', 'week', 'month', 'year'].map((range) => (
                        <Chip
                          key={range}
                          label={range}
                          onClick={() => setTimeRange(range)}
                          color={timeRange === range ? 'primary' : 'default'}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <SalesChart data={dashboardData?.salesData || []} />
                </Paper>
              </Grid>

              {/* Low Stock Alert */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Low Stock Alert
                    <Warning color="warning" sx={{ ml: 1 }} />
                  </Typography>
                  <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {lowStockItems.length > 0 ? (
                      lowStockItems.map((item) => (
                        <Card key={item.id} sx={{ mb: 1 }}>
                          <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {item.productName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  SKU: {item.sku}
                                </Typography>
                              </Box>
                              <Chip
                                label={`${item.quantity} left`}
                                color="warning"
                                size="small"
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                        No low stock items
                      </Typography>
                    )}
                  </Box>
                  {lowStockItems.length > 0 && (
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      href="/inventory"
                    >
                      View All Inventory
                    </Button>
                  )}
                </Paper>
              </Grid>

              {/* Recent Transactions */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Transactions
                  </Typography>
                  <RecentTransactions transactions={dashboardData?.recentTransactions || []} />
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </>
  );
}