import { apiClient } from './client';
import { UploadTask, PaginatedResponse, UploadTasksQueryParams } from '../types/api';

export const uploadTasksApi = {
  // Get paginated list of upload tasks
  getUploadTasks: async (params: UploadTasksQueryParams = {}): Promise<PaginatedResponse<UploadTask>> => {
    const { page, limit, ...filters } = params;
    const offset = page ? (page - 1) * (limit || 50) : 0;
    const response = await apiClient.get('/v1/upload-tasks', { 
      params: { ...filters, limit, offset } 
    });
    return response.data;
  },

  // Get single upload task by ID
  getUploadTask: async (id: string): Promise<UploadTask> => {
    const response = await apiClient.get(`/v1/upload-tasks/${id}`);
    return response.data.data;
  },
};