import { apiClient } from './client';
import { DashboardStats, Product, GenerationJob } from '../types/api';

export const dashboardApi = {
  // Get dashboard stats
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data.data;
  },

  // Get recent products
  getRecentProducts: async (limit: number = 5): Promise<Product[]> => {
    const response = await apiClient.get('/products', { 
      params: { limit, offset: 0 } 
    });
    return response.data.data;
  },

  // Get recent generation jobs
  getRecentJobs: async (limit: number = 5): Promise<GenerationJob[]> => {
    const response = await apiClient.get('/v1/generation-jobs', { 
      params: { limit, offset: 0 } 
    });
    return response.data.data;
  },
};