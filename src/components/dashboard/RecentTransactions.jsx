import { Paper, Typography } from '@mui/material';

export const RecentTransactions = () => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      <Typography variant="body2" color="text.secondary">
        (Component placeholder - full functionality requires the complete project files)
      </Typography>
    </Paper>
  );
};

export default RecentTransactions;