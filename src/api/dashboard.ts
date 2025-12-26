import { apiClient } from './client';
import { DashboardMetrics, Product, GenerationJob, PaginatedResponse } from '../types/api';

export const dashboardApi = {
  // Get dashboard metrics
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data.data;
  },

  // Get recent products
  getRecentProducts: async (limit: number = 5): Promise<Product[]> => {
    const response = await apiClient.get('/products', { 
      params: { limit, page: 1 } 
    });
    return response.data.data;
  },

  // Get recent generation jobs
  getRecentJobs: async (limit: number = 5): Promise<GenerationJob[]> => {
    const response = await apiClient.get('/generation-jobs', { 
      params: { limit, page: 1 } 
    });
    return response.data.data;
  },
};