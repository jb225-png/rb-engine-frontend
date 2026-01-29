import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { ProductsQueryParams, Product } from '../types/api';

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductsQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Get products list with pagination and filtering
export const useProductsQuery = (params: ProductsQueryParams = {}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.getProducts(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading new page
    retry: false,
    enabled: options?.enabled,
  });
};

// Get single product details
export const useProductQuery = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id, // Only run query if ID exists
    retry: false,
  });
};

// Update product status mutation
export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Product['status'] }) =>
      productsApi.updateProductStatus(id, status),
    onSuccess: (updatedProduct) => {
      // Update the product detail cache
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct
      );
      
      // Invalidate products list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Download product mutation
export const useDownloadProduct = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await productsApi.downloadProduct(id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `product-${id}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    },
  });
};