import { apiClient } from './client';
import { UploadTask, PaginatedResponse, UploadTasksQueryParams } from '../types/api';

export const uploadTasksApi = {
  // Get paginated list of upload tasks
  getUploadTasks: async (params: UploadTasksQueryParams = {}): Promise<PaginatedResponse<UploadTask>> => {
    const response = await apiClient.get('/upload-tasks', { params });
    return response.data;
  },

  // Get single upload task by ID
  getUploadTask: async (id: string): Promise<UploadTask> => {
    const response = await apiClient.get(`/upload-tasks/${id}`);
    return response.data.data;
  },
};