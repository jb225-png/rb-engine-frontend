import { apiClient } from './client';
import { Product, ProductDetail, PaginatedResponse, ProductsQueryParams } from '../types/api';

export const productsApi = {
  // Get paginated list of products
  getProducts: async (params: ProductsQueryParams = {}): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/products', { params });
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

  // Create new product
  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post('/products', data);
    return response.data.data;
  },
};