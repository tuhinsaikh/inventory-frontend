import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery, useMutation } from 'react-query';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useNotification } from '../../context/NotificationContext';

const schema = yup.object({
  sku: yup.string().required('SKU is required').max(50, 'SKU too long'),
  barcode: yup.string().max(100, 'Barcode too long'),
  productName: yup.string().required('Product name is required').max(200, 'Name too long'),
  description: yup.string(),
  categoryId: yup.number().nullable(),
  unitOfMeasure: yup.string().default('PCS'),
  costPrice: yup
    .number()
    .required('Cost price is required')
    .positive('Cost price must be positive'),
  sellingPrice: yup
    .number()
    .required('Selling price is required')
    .positive('Selling price must be positive')
    .test(
      'greater-than-cost',
      'Selling price must be greater than cost price',
      function (value) {
        return value > this.parent.costPrice;
      }
    ),
  minStockLevel: yup.number().integer().positive().default(10),
  maxStockLevel: yup.number().integer().positive().default(1000),
  reorderPoint: yup.number().integer().positive().default(20),
  reorderQuantity: yup.number().integer().positive().default(50),
  imageUrl: yup.string().url('Invalid URL'),
});

export default function ProductForm({ productId, onSuccess, onCancel }) {
  const { showNotification } = useNotification();
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch product data if editing
  const { data: product, isLoading } = useQuery(
    ['product', productId],
    () => productService.getProductById(productId),
    {
      enabled: !!productId,
      onSuccess: (data) => {
        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
        }
      },
    }
  );

  // Fetch categories
  const { data: categories } = useQuery(
    'categories',
    categoryService.getAllCategories
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      unitOfMeasure: 'PCS',
      minStockLevel: 10,
      maxStockLevel: 1000,
      reorderPoint: 20,
      reorderQuantity: 50,
    },
  });

  // Reset form with product data
  useEffect(() => {
    if (product) {
      reset({
        ...product,
        categoryId: product.category?.categoryId || null,
      });
    }
  }, [product, reset]);

  const mutation = useMutation(
    (data) =>
      productId
        ? productService.updateProduct(productId, data)
        : productService.createProduct(data),
    {
      onSuccess: () => {
        showNotification(
          productId ? 'Product updated successfully' : 'Product created successfully',
          'success'
        );
        onSuccess();
      },
      onError: (error) => {
        showNotification(
          error.response?.data?.message || 'Operation failed',
          'error'
        );
      },
    }
  );

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      showNotification('Please upload an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('Image size should be less than 5MB', 'error');
      return;
    }

    try {
      setUploadingImage(true);
      const response = await productService.uploadProductImage(file);
      const imageUrl = response.data.url;
      setValue('imageUrl', imageUrl);
      setImagePreview(URL.createObjectURL(file));
      showNotification('Image uploaded successfully', 'success');
    } catch (error) {
      showNotification('Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setValue('imageUrl', '');
    setImagePreview('');
  };

  if (isLoading && productId) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Left Column - Basic Info */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="SKU *"
                        fullWidth
                        error={!!errors.sku}
                        helperText={errors.sku?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="barcode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Barcode"
                        fullWidth
                        error={!!errors.barcode}
                        helperText={errors.barcode?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="productName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Product Name *"
                        fullWidth
                        error={!!errors.productName}
                        helperText={errors.productName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        multiline
                        rows={3}
                        fullWidth
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pricing
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="costPrice"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Cost Price *"
                        fullWidth
                        InputProps={{ startAdornment: '$' }}
                        error={!!errors.costPrice}
                        helperText={errors.costPrice?.message}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="sellingPrice"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Selling Price *"
                        fullWidth
                        InputProps={{ startAdornment: '$' }}
                        error={!!errors.sellingPrice}
                        helperText={errors.sellingPrice?.message}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Category & Image */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category & Units
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.categoryId}>
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category">
                          <MenuItem value="">
                            <em>No Category</em>
                          </MenuItem>
                          {categories?.map((category) => (
                            <MenuItem
                              key={category.categoryId}
                              value={category.categoryId}
                            >
                              {category.categoryName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="unitOfMeasure"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Unit of Measure</InputLabel>
                        <Select {...field} label="Unit of Measure">
                          <MenuItem value="PCS">Pieces</MenuItem>
                          <MenuItem value="KG">Kilograms</MenuItem>
                          <MenuItem value="L">Liters</MenuItem>
                          <MenuItem value="M">Meters</MenuItem>
                          <MenuItem value="BOX">Box</MenuItem>
                          <MenuItem value="PAIR">Pair</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Image
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={imagePreview}
                  sx={{ width: 120, height: 120, mb: 2 }}
                  variant="rounded"
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    disabled={uploadingImage}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                  {imagePreview && (
                    <IconButton color="error" onClick={handleRemoveImage}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Image URL"
                      fullWidth
                      sx={{ mt: 2 }}
                      size="small"
                      error={!!errors.imageUrl}
                      helperText={errors.imageUrl?.message}
                    />
                  )}
                />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="minStockLevel"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Min Stock"
                        fullWidth
                        error={!!errors.minStockLevel}
                        helperText={errors.minStockLevel?.message}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="maxStockLevel"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Max Stock"
                        fullWidth
                        error={!!errors.maxStockLevel}
                        helperText={errors.maxStockLevel?.message}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="reorderPoint"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Reorder Point"
                        fullWidth
                        error={!!errors.reorderPoint}
                        helperText={errors.reorderPoint?.message}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="reorderQuantity"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Reorder Quantity"
                        fullWidth
                        error={!!errors.reorderQuantity}
                        helperText={errors.reorderQuantity?.message}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={mutation.isLoading}>
          {mutation.isLoading
            ? 'Saving...'
            : productId
            ? 'Update Product'
            : 'Create Product'}
        </Button>
      </Box>
    </Box>
  );
}