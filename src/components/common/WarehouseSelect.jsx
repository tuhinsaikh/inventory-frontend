import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useWarehouses } from '../../hooks/useWarehouses';

export default function WarehouseSelect({
  value,
  onChange,
  label = "Warehouse",
  error,
  helperText,
  required = false,
  disabled = false,
  showActiveOnly = true,
}) {
  const { warehouses, isLoading } = useWarehouses();

  // Filter warehouses if needed
  const filteredWarehouses = showActiveOnly 
    ? warehouses.filter(w => w.isActive === true)
    : warehouses;

  return (
    <FormControl fullWidth error={error} disabled={disabled || isLoading} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        label={label}
        onChange={onChange}
      >
        <MenuItem value="">
          <em>Select Warehouse</em>
        </MenuItem>
        {filteredWarehouses.map((warehouse) => (
          <MenuItem key={warehouse.warehouseId} value={warehouse.warehouseId}>
            {warehouse.warehouseName} - {warehouse.location}
          </MenuItem>
        ))}
      </Select>
      {(error && helperText) && <FormHelperText>{helperText}</FormHelperText>}
      {isLoading && <FormHelperText>Loading warehouses...</FormHelperText>}
    </FormControl>
  );
}