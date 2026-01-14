import { useQuery } from 'react-query';
import { warehouseService } from '../services/warehouseService';

export function useWarehouses() {
  const { data, isLoading, error, refetch } = useQuery(
    'warehouses',
    () => warehouseService.getAllWarehouses()
      .then(response => response.data?.data || []),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  return {
    warehouses: data || [],
    isLoading,
    error,
    refetch,
  };
}