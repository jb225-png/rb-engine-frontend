import { apiClient } from './client';
import { GenerationJob, CreateGenerationJobRequest, PaginatedResponse } from '../types/api';

export const generationApi = {
  // Create new generation job
  createGenerationJob: async (data: CreateGenerationJobRequest): Promise<GenerationJob> => {
    console.log('Sending generation request:', data);
    const response = await apiClient.post('/generate-product', data);
    console.log('Generation response:', response.data);
    
    // Handle the response format from the backend API
    // According to the API docs, the response should have:
    // { success: true, message: string, data: { job_id, product_ids, message } }
    if (response.data.success && response.data.data) {
      // Create a GenerationJob object from the response
      return {
        id: response.data.data.job_id.toString(),
        standard_id: data.standard_id || 1,
        status: 'PENDING', // New jobs start as PENDING
        total_products: response.data.data.product_ids?.length || 1,
        completed_products: 0,
        failed_products: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    
    // Fallback for different response formats
    return response.data.data || response.data;
  },

  // Get generation jobs list
  getGenerationJobs: async (params: { limit?: number; offset?: number } = {}): Promise<PaginatedResponse<GenerationJob>> => {
    const response = await apiClient.get('/v1/generation-jobs', { params });
    return response.data;
  },

  // Get generation job by ID
  getGenerationJob: async (id: string): Promise<GenerationJob> => {
    const response = await apiClient.get(`/v1/generation-jobs/${id}`);
    return response.data.data || response.data;
  },
};