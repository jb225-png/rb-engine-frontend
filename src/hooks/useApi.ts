import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { apiClient } from '../api/client';

// Generic hook for GET requests using React Query
export function useApiQuery<TData = any>(
  key: string[],
  url: string,
  options?: Omit<UseQueryOptions<TData, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData, AxiosError>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get<TData>(url);
      return response.data;
    },
    ...options,
  });
}

// Generic hook for POST/PUT/DELETE requests using React Query
export function useApiMutation<TData = any, TVariables = any>(
  url: string,
  method: 'post' | 'put' | 'delete' = 'post',
  options?: UseMutationOptions<TData, AxiosError, TVariables>
) {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await apiClient[method]<TData>(url, data);
      return response.data;
    },
    ...options,
  });
}
