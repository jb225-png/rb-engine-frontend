import { apiClient } from './client';
import { GenerationJob, CreateGenerationJobRequest, PaginatedResponse } from '../types/api';

export const generationApi = {
  // Create new generation job
  createGenerationJob: async (data: CreateGenerationJobRequest): Promise<GenerationJob> => {
    const response = await apiClient.post('/generate-product', data);
    return response.data.data;
  },

  // Get generation jobs list
  getGenerationJobs: async (params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<GenerationJob>> => {
    const response = await apiClient.get('/generation-jobs', { params });
    return response.data;
  },

  // Get generation job by ID
  getGenerationJob: async (id: string): Promise<GenerationJob> => {
    const response = await apiClient.get(`/generation-jobs/${id}`);
    return response.data.data;
  },
};