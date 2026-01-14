import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography 
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Sample data - replace with actual API data
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
];

export const SalesChart = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader 
        title="Sales Trend" 
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#1976d2" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Monthly sales performance trend
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SalesChart;