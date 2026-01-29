import { apiClient } from './client';
import { GenerationJob, GenerateTemplateRequest, GenerateTemplateResponse, PaginatedResponse } from '../types/api';

export const generationApi = {
  // Generate ELA template content
  generateTemplate: async (data: GenerateTemplateRequest): Promise<GenerateTemplateResponse> => {
    console.log('Sending template generation request:', data);
    const response = await apiClient.post('/generate-template', data);
    console.log('Template generation response:', response.data);
    return response.data;
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