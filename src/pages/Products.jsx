import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Inventory as ProductIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import ProductForm from '../components/forms/ProductForm';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();
  const { hasPermission } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  const isEditMode = location.pathname.includes('/edit');
  const isCreateMode = location.pathname.includes('/new');

  // Fetch products
  const { data: products, isLoading } = useQuery(
    ['products', searchTerm, categoryFilter, statusFilter],
    () => productService.getAllProducts({
      search: searchTerm,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      status: statusFilter,
    })
  );

  // Fetch categories for filter
  const { data: categories } = useQuery(
    'categories',
    categoryService.getAllCategories
  );

  // Delete mutation
  const deleteMutation = useMutation(
    (id) => productService.deleteProduct(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        showNotification('Product deleted successfully', 'success');
        setOpenDeleteDialog(false);
      },
      onError: (error) => {
        showNotification(
          error.response?.data?.message || 'Failed to delete product',
          'error'
        );
      },
    }
  );

  // Deactivate mutation
  const deactivateMutation = useMutation(
    (id) => productService.deactivateProduct(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        showNotification('Product deactivated successfully', 'success');
      },
      onError: (error) => {
        showNotification(
          error.response?.data?.message || 'Failed to deactivate product',
          'error'
        );
      },
    }
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuOpen = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProduct(null);
  };

  const handleEdit = () => {
    navigate(`/products/${selectedProduct.id}/edit`);
    handleMenuClose();
  };

  const handleView = () => {
    navigate(`/products/${selectedProduct.id}`);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleDeactivate = () => {
    deactivateMutation.mutate(selectedProduct.id);
    handleMenuClose();
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedProduct.id);
  };

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.row.imageUrl}
          alt={params.row.productName}
          sx={{ width: 40, height: 40 }}
        >
          <ProductIcon />
        </Avatar>
      ),
    },
    {
      field: 'sku',
      headerName: 'SKU',
      width: 120,
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 200,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      valueGetter: (params) => params.row.category?.categoryName || 'Uncategorized',
    },
    {
      field: 'sellingPrice',
      headerName: 'Price',
      width: 100,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'quantity',
      headerName: 'Stock',
      width: 120,
      renderCell: (params) => {
        const quantity = params.row.inventory?.quantityAvailable || 0;
        const reorderPoint = params.row.reorderPoint || 0;
        
        let color = 'success';
        if (quantity <= 0) color = 'error';
        else if (quantity <= reorderPoint) color = 'warning';
        
        return (
          <Chip
            label={quantity}
            color={color}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.isActive ? 'Active' : 'Inactive'}
          color={params.row.isActive ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        const canEdit = hasPermission('STAFF');
        const canDelete = hasPermission('MANAGER');
        
        return (
          <Box>
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, params.row)}
            >
              <MoreIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl) && selectedProduct?.id === params.row.id}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleView}>
                <ViewIcon fontSize="small" sx={{ mr: 1 }} />
                View Details
              </MenuItem>
              {canEdit && (
                <MenuItem onClick={handleEdit}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} />
                  Edit
                </MenuItem>
              )}
              {canDelete && (
                <MenuItem onClick={handleDeactivate}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  {selectedProduct?.isActive ? 'Deactivate' : 'Activate'}
                </MenuItem>
              )}
              {canDelete && (
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              )}
            </Menu>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Products - Inventory Management</title>
      </Helmet>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Products
          </Typography>
          {hasPermission('STAFF') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/products/new')}
            >
              Add Product
            </Button>
          )}
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  {categories?.map((category) => (
                    <MenuItem key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Products Grid */}
        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={products || []}
            columns={columns}
            loading={isLoading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection={false}
            disableSelectionOnClick
            onRowClick={(params) => navigate(`/products/${params.id}`)}
            sx={{
              '& .MuiDataGrid-cell:focus': { outline: 'none' },
              '& .MuiDataGrid-row:hover': { cursor: 'pointer' },
            }}
          />
        </Paper>

        {/* Product Form Dialog */}
        {(isCreateMode || isEditMode) && (
          <Dialog
            open={true}
            onClose={() => navigate('/products')}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              {isCreateMode ? 'Add New Product' : 'Edit Product'}
            </DialogTitle>
            <DialogContent>
              <ProductForm
                productId={isEditMode ? location.pathname.split('/').pop() : null}
                onSuccess={() => {
                  navigate('/products');
                  showNotification(
                    isCreateMode ? 'Product created successfully' : 'Product updated successfully',
                    'success'
                  );
                }}
                onCancel={() => navigate('/products')}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={openDeleteDialog}
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setOpenDeleteDialog(false)}
        />
      </Box>
    </>
  );
}