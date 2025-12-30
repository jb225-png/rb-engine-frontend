import { apiClient } from './client';
import { GenerationJob, CreateGenerationJobRequest, PaginatedResponse } from '../types/api';

export const generationApi = {
  // Create new generation job
  createGenerationJob: async (data: CreateGenerationJobRequest): Promise<GenerationJob> => {
    console.log('Sending generation request:', data);
    const response = await apiClient.post('/generate-product', data);
    console.log('Generation response:', response.data);
    // Handle both response.data.data and response.data formats
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
    return response.data.data;
  },
};