import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { inventoryService } from '../services/inventoryService';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');
  const [openAdjustDialog, setOpenAdjustDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch inventory data
  const { data: inventory, isLoading } = useQuery(
    ['inventory', searchTerm, selectedWarehouse],
    () => inventoryService.getAllInventory(),
    {
      refetchOnMount: true,
    }
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAdjustClick = (item) => {
    setSelectedItem(item);
    setOpenAdjustDialog(true);
  };

  const handleAdjustClose = () => {
    setOpenAdjustDialog(false);
    setSelectedItem(null);
  };

  // Mock warehouses (you should fetch these from your API)
  const warehouses = [
    { id: 1, name: 'Main Warehouse' },
    { id: 2, name: 'Store Front' },
    { id: 3, name: 'Online Storage' },
  ];

  return (
    <>
      <Helmet>
        <title>Inventory Management - Retail Shop</title>
      </Helmet>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            <InventoryIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Inventory Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {/* Navigate to add inventory or bulk update */}}
          >
            Bulk Update
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Warehouse</InputLabel>
              <Select
                value={selectedWarehouse}
                label="Warehouse"
                onChange={(e) => setSelectedWarehouse(e.target.value)}
              >
                <MenuItem value="all">All Warehouses</MenuItem>
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setSelectedWarehouse('all');
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </Paper>

        {/* Inventory Table */}
        <Paper sx={{ width: '100%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Warehouse</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : inventory && inventory.length > 0 ? (
                  inventory.map((item) => (
                    <TableRow key={`${item.productId}-${item.warehouseId}`}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.warehouseName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.quantity <= 0 ? 'Out of Stock' : item.quantity <= 10 ? 'Low Stock' : 'In Stock'}
                          color={item.quantity <= 0 ? 'error' : item.quantity <= 10 ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleAdjustClick(item)}
                          title="Adjust Stock"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No inventory data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Adjust Stock Dialog */}
        <Dialog open={openAdjustDialog} onClose={handleAdjustClose}>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Product: {selectedItem.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Warehouse: {selectedItem.warehouseName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Stock: {selectedItem.quantity}
                </Typography>
                {/* Add adjustment form here */}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAdjustClose}>Cancel</Button>
            <Button variant="contained" onClick={handleAdjustClose}>
              Save Adjustment
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}