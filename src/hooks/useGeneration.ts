import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generationApi } from '../api/generation';
import { CreateGenerationJobRequest } from '../types/api';

// Query keys
export const generationKeys = {
  all: ['generation-jobs'] as const,
  lists: () => [...generationKeys.all, 'list'] as const,
  list: (params: { limit?: number; offset?: number }) => [...generationKeys.lists(), params] as const,
  details: () => [...generationKeys.all, 'detail'] as const,
  detail: (id: string) => [...generationKeys.details(), id] as const,
};

// Get generation jobs list
export const useGenerationJobsQuery = (params: { limit?: number; offset?: number } = {}) => {
  return useQuery({
    queryKey: generationKeys.list(params),
    queryFn: () => generationApi.getGenerationJobs(params),
    placeholderData: (previousData) => previousData,
    retry: false, // Don't retry API calls during development
  });
};

// Get single generation job
export const useGenerationJobQuery = (id: string) => {
  return useQuery({
    queryKey: generationKeys.detail(id),
    queryFn: () => generationApi.getGenerationJob(id),
    enabled: !!id,
    retry: false,
  });
};

// Create generation job mutation
export const useCreateGenerationJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGenerationJobRequest) => 
      generationApi.createGenerationJob(data),
    onSuccess: () => {
      // Invalidate generation jobs list
      queryClient.invalidateQueries({ queryKey: generationKeys.lists() });
      // Invalidate products list to show any new products
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};