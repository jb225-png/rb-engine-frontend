import { apiClient } from './client';
import { Product, ProductDetail, PaginatedResponse, ProductsQueryParams } from '../types/api';

export const productsApi = {
  // Get paginated list of products
  getProducts: async (params: ProductsQueryParams = {}): Promise<PaginatedResponse<Product>> => {
    const { page, limit, ...filters } = params;
    const offset = page ? (page - 1) * (limit || 50) : 0;
    const response = await apiClient.get('/products', { 
      params: { ...filters, limit, offset } 
    });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<ProductDetail> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  },

  // Update product status
  updateProductStatus: async (id: string, status: Product['status']): Promise<Product> => {
    const response = await apiClient.patch(`/products/${id}/status`, { status });
    return response.data.data;
  },
};