import { useQuery } from '@tanstack/react-query';
import { uploadTasksApi } from '../api/uploadTasks';
import { UploadTasksQueryParams } from '../types/api';

export const useUploadTasksQuery = (params: UploadTasksQueryParams = {}) => {
  return useQuery({
    queryKey: ['upload-tasks', params],
    queryFn: () => uploadTasksApi.getUploadTasks(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUploadTaskQuery = (id: string) => {
  return useQuery({
    queryKey: ['upload-tasks', id],
    queryFn: () => uploadTasksApi.getUploadTask(id),
    enabled: !!id,
  });
};