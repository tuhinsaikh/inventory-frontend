import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton
} from '@mui/material';
import { ArrowForward, Receipt } from '@mui/icons-material';

// Sample transaction data
const transactions = [
  { id: 1, type: 'Sale', amount: 120.50, customer: 'John Doe', date: '2026-01-12', status: 'Completed' },
  { id: 2, type: 'Purchase', amount: 450.00, supplier: 'Tech Supplies', date: '2026-01-11', status: 'Pending' },
  { id: 3, type: 'Sale', amount: 89.99, customer: 'Jane Smith', date: '2026-01-10', status: 'Completed' },
  { id: 4, type: 'Stock Adjustment', amount: 0, description: 'Cycle count', date: '2026-01-09', status: 'Approved' },
  { id: 5, type: 'Sale', amount: 250.75, customer: 'Bob Wilson', date: '2026-01-08', status: 'Completed' },
];

export const RecentTransactions = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Approved': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Transactions"
        titleTypographyProps={{ variant: 'h6' }}
        action={
          <IconButton aria-label="view all">
            <ArrowForward />
          </IconButton>
        }
      />
      <CardContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Party</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Receipt fontSize="small" />
                      {transaction.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      ${transaction.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {transaction.customer || transaction.supplier || transaction.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status} 
                      size="small" 
                      color={getStatusColor(transaction.status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {transactions.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No recent transactions
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;